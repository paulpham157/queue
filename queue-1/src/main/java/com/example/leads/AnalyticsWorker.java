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

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class AnalyticsWorker {
    private static final Logger log = LoggerFactory.getLogger(AnalyticsWorker.class);

    private final AppProperties props;
    private final JedisPool pool;
    private final AtomicBoolean running = new AtomicBoolean(true);
    private static final String GROUP = "analytics_svc";

    public AnalyticsWorker(AppProperties props, JedisPool pool) {
        this.props = props;
        this.pool = pool;
    }

    @PostConstruct
    public void start() {
        Thread t = new Thread(this::run, "analytics-worker");
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

            log.info("AnalyticsWorker started. Waiting for leads...");
            while (running.get()) {
                List<Map.Entry<String, List<StreamEntry>>> result;
                try {
                    result = jedis.xreadGroup(GROUP, "analytics-worker-1", params, streams);
                } catch (Exception e) {
                    log.error("AnalyticsWorker xreadGroup failed; backing off", e);
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
                            insertLead(data);
                            jedis.xack(props.getStream().getName(), GROUP, entry.getID());
                            log.info("Lead inserted to warehouse: {}", data.get("id"));
                        } catch (Exception e) {
                            log.error("DB insert failed for {}", data.get("id"), e);
                        }
                    }
                }
            }
            log.info("AnalyticsWorker stopped.");
        } catch (Exception e) {
            log.error("AnalyticsWorker fatal — pool resource could not be acquired", e);
        }
    }

    private void ensureGroup(Jedis jedis) {
        try {
            jedis.xgroupCreate(props.getStream().getName(), GROUP, new StreamEntryID("0-0"), true);
        } catch (JedisDataException e) {
            // group exists
        }
    }

    private void insertLead(Map<String, String> data) throws Exception {
        String sql = "INSERT INTO leads (id, name, email, company, source, message, ingested_at) "
                   + "VALUES (?, ?, ?, ?, ?, ?, NOW()) "
                   + "ON CONFLICT (id) DO NOTHING";

        try (Connection conn = DriverManager.getConnection(
                props.getDb().getUrl(), props.getDb().getUser(), props.getDb().getPass());
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setObject(1, data.getOrDefault("id", UUID.randomUUID().toString()));
            ps.setString(2, data.getOrDefault("name", ""));
            ps.setString(3, data.getOrDefault("email", ""));
            ps.setString(4, data.getOrDefault("company", ""));
            ps.setString(5, data.getOrDefault("source", ""));
            ps.setString(6, data.getOrDefault("message", ""));
            ps.executeUpdate();
        }
    }

    private static void sleepQuiet(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
    }
}