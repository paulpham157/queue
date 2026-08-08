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

public class AnalyticsWorker {
    private final Jedis jedis = new Jedis("localhost", 6379);

    private static final String STREAM = "leads";
    private static final String GROUP = "analytics_svc";
    private static final String CONSUMER = "analytics-worker-1";
    private static final String DB_URL =
        "jdbc:postgresql://localhost:5432/analytics";
    private static final String DB_USER = "analytics";
    private static final String DB_PASS = "analytics";

    public static void main(String[] args) {
        new AnalyticsWorker().run();
    }

    public void run() {
        ensureGroup();
        XReadGroupParams params = XReadGroupParams.xReadGroupParams()
            .block(5000)
            .count(10);

        Map<String, StreamEntryID> streams = Map.of(STREAM, new StreamEntryID(">"));

        System.out.println("AnalyticsWorker started. Waiting for leads...");
        while (true) {
            List<Map.Entry<String, List<StreamEntry>>> result =
                jedis.xreadGroup(GROUP, CONSUMER, params, streams);

            if (result == null) continue;

            for (var streamEntry : result) {
                for (StreamEntry entry : streamEntry.getValue()) {
                    Map<String, String> data = entry.getFields();
                    if (!"lead.created".equals(data.get("event"))) {
                        jedis.xack(STREAM, GROUP, entry.getID());
                        continue;
                    }
                    try {
                        insertLead(data);
                        jedis.xack(STREAM, GROUP, entry.getID());
                        System.out.println("Lead inserted to warehouse: " + data.get("id"));
                    } catch (Exception e) {
                        System.err.println("DB insert failed for " + data.get("id") + ": " + e.getMessage());
                    }
                }
            }
        }
    }

    private void ensureGroup() {
        try {
            jedis.xgroupCreate(STREAM, GROUP, new StreamEntryID("0-0"), true);
        } catch (JedisDataException e) {
            // group exists
        }
    }

    private void insertLead(Map<String, String> data) throws Exception {
        String sql = "INSERT INTO leads (id, name, email, company, source, message, ingested_at) "
                   + "VALUES (?, ?, ?, ?, ?, ?, NOW()) "
                   + "ON CONFLICT (id) DO NOTHING";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
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