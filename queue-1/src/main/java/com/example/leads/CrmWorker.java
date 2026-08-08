package com.example.leads;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.StreamEntryID;
import redis.clients.jedis.exceptions.JedisDataException;
import redis.clients.jedis.params.XReadGroupParams;
import redis.clients.jedis.resps.StreamEntry;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class CrmWorker {
    private static final Logger log = LoggerFactory.getLogger(CrmWorker.class);

    private final AppProperties props;
    private final JedisPool pool;
    private final HttpClient http = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(5)).build();
    private final AtomicBoolean running = new AtomicBoolean(true);
    private static final String GROUP = "crm_svc";

    public CrmWorker(AppProperties props, JedisPool pool) {
        this.props = props;
        this.pool = pool;
    }

    @PostConstruct
    public void start() {
        Thread t = new Thread(this::run, "crm-worker");
        t.setDaemon(true);
        t.start();
    }

    @PreDestroy
    public void stop() { running.set(false); }

    public void run() {
        try (Jedis jedis = pool.getResource()) {
            ensureGroup(jedis);
            XReadGroupParams params = XReadGroupParams.xReadGroupParams().block(5000).count(10);
            Map<String, StreamEntryID> streams = Map.of(props.getStream().getName(), new StreamEntryID(">"));

            log.info("CrmWorker started. Waiting for leads...");
            while (running.get()) {
                List<Map.Entry<String, List<StreamEntry>>> result;
                try {
                    result = jedis.xreadGroup(GROUP, "crm-worker-1", params, streams);
                } catch (Exception e) {
                    log.error("CrmWorker xreadGroup failed; backing off", e);
                    sleepQuiet(1000);
                    continue;
                }
                if (result == null) continue;
                for (var streamEntry : result) {
                    for (StreamEntry entry : streamEntry.getValue()) {
                        Map<String, String> data = entry.getFields();
                        if (!"lead.created".equals(data.get("event"))) {
                            jedis.xack(props.getStream().getName(), GROUP, entry.getID());
                            continue;
                        }
                        try {
                            addLeadToCrm(data);
                            jedis.xack(props.getStream().getName(), GROUP, entry.getID());
                            log.info("Lead added to CRM: {}", data.get("id"));
                        } catch (Exception e) {
                            log.error("CRM push failed for {}", data.get("id"), e);
                        }
                    }
                }
            }
            log.info("CrmWorker stopped.");
        } catch (Exception e) {
            log.error("CrmWorker fatal — pool resource could not be acquired", e);
        }
    }

    private void ensureGroup(Jedis jedis) {
        try {
            jedis.xgroupCreate(props.getStream().getName(), GROUP, new StreamEntryID("0-0"), true);
        } catch (JedisDataException e) {
            // group exists
        }
    }

    private void addLeadToCrm(Map<String, String> data) throws Exception {
        String body = "{"
            + "\"id\":\"" + esc(data.get("id")) + "\","
            + "\"name\":\"" + esc(data.get("name")) + "\","
            + "\"email\":\"" + esc(data.get("email")) + "\","
            + "\"company\":\"" + esc(data.get("company")) + "\","
            + "\"source\":\"" + esc(data.get("source")) + "\""
            + "}";

        HttpRequest req = HttpRequest.newBuilder(URI.create(props.getCrm().getUrl()))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(body))
            .build();

        HttpResponse<String> resp = http.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() >= 300) {
            throw new RuntimeException("CRM HTTP " + resp.statusCode() + ": " + resp.body());
        }
    }

    private static String esc(String s) {
        return s == null ? "" : s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private static void sleepQuiet(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
    }
}