import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.XAddParams;
import java.util.HashMap;
import java.util.Map;

public class OrderProducer {
    private final Jedis jedis = new Jedis("localhost", 6379);

    public String placeOrder(String orderId, String customerEmail) {
        Map<String, String> entry = new HashMap<>();
        entry.put("event", "order.created");
        entry.put("order_id", orderId);
        entry.put("customer_email", customerEmail);
        jedis.xadd("orders", entry, XAddParams.xAddParams());
        return "Order " + orderId + " queued";
    }

    public static void main(String[] args) {
        OrderProducer producer = new OrderProducer();
        System.out.println(producer.placeOrder("001", "khach@example.com"));
    }
}