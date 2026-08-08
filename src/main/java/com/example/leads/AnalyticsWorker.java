package com.example.leads;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
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
    private final AppProperties props;
    private final Jedis jedis;
    private final AtomicBoolean running = new AtomicBoolean(true);
    private static final String GROUP = "analytics_svc";

    public AnalyticsWorker(AppProperties props) {
        this.props = props;
        this.jedis = new Jedis(props.getRedis().getHost(), props.getRedis().getPort());
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
        ensureGroup();
        XReadGroupParams params = XReadGroupParams.xReadGroupParams().block(5000).count(10);
        Map<String, StreamEntryID> streams = Map.of(props.getStream().getName(), new StreamEntryID(">"));

        System.out.println("AnalyticsWorker started. Waiting for leads...");
        while (running.get()) {
            List<Map.Entry<String, List<StreamEntry>>> result =
                jedis.xreadGroup(GROUP, "analytics-worker-1", params, streams);
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
                        System.out.println("Lead inserted to warehouse: " + data.get("id"));
                    } catch (Exception e) {
                        System.err.println("DB insert failed for " + data.get("id") + ": " + e.getMessage());
                    }
                }
            }
        }
        System.out.println("AnalyticsWorker stopped.");
    }

    private void ensureGroup() {
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
}