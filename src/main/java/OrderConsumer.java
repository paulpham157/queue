import redis.clients.jedis.Jedis;
import redis.clients.jedis.StreamEntryID;
import redis.clients.jedis.exceptions.JedisDataException;
import redis.clients.jedis.params.XReadGroupParams;
import redis.clients.jedis.resps.StreamEntry;
import java.util.List;
import java.util.Map;

public class OrderConsumer {
    private final Jedis jedis = new Jedis("localhost", 6379);

    public void sendEmail(String email) {
        System.out.println("Sending email to " + email);
    }

    public void consume() {
        try {
            jedis.xgroupCreate("orders", "email_workers",
                new StreamEntryID("0-0"), true);
        } catch (JedisDataException e) {
            // group da ton tai
        }

        XReadGroupParams params = XReadGroupParams.xReadGroupParams()
            .block(5000)
            .count(1);

        Map<String, StreamEntryID> streams = Map.of(
            "orders", new StreamEntryID(">")
        );

        while (true) {
            List<Map.Entry<String, List<StreamEntry>>> result =
                jedis.xreadGroup("email_workers", "worker-1",
                    params, streams);

            if (result == null) continue;

            for (var streamEntry : result) {
                for (StreamEntry entry : streamEntry.getValue()) {
                    Map<String, String> data = entry.getFields();
                    if ("order.created".equals(data.get("event"))) {
                        sendEmail(data.get("customer_email"));
                        jedis.xack("orders", "email_workers",
                            entry.getID());
                    }
                }
            }
        }
    }

    public static void main(String[] args) {
        new OrderConsumer().consume();
    }
}