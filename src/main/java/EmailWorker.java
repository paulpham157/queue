import redis.clients.jedis.Jedis;
import redis.clients.jedis.StreamEntryID;
import redis.clients.jedis.exceptions.JedisDataException;
import redis.clients.jedis.params.XReadGroupParams;
import redis.clients.jedis.resps.StreamEntry;

import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.List;
import java.util.Map;
import java.util.Properties;

public class EmailWorker {
    private final Jedis jedis = new Jedis("localhost", 6379);
    private static final String STREAM = "leads";
    private static final String GROUP = "email_svc";
    private static final String CONSUMER = "email-worker-1";

    public static void main(String[] args) {
        new EmailWorker().run();
    }

    public void run() {
        ensureGroup();
        XReadGroupParams params = XReadGroupParams.xReadGroupParams()
            .block(5000)
            .count(10);

        Map<String, StreamEntryID> streams = Map.of(STREAM, new StreamEntryID(">"));

        System.out.println("EmailWorker started. Waiting for leads...");
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
                        sendWelcomeEmail(data.get("name"), data.get("email"));
                        jedis.xack(STREAM, GROUP, entry.getID());
                        System.out.println("Email sent to " + data.get("email"));
                    } catch (Exception e) {
                        System.err.println("Failed to send email for " + data.get("id") + ": " + e.getMessage());
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

    private void sendWelcomeEmail(String name, String email) throws Exception {
        Properties p = new Properties();
        p.put("mail.smtp.host", "localhost");
        p.put("mail.smtp.port", "1025");
        p.put("mail.smtp.auth", "false");
        p.put("mail.smtp.starttls.enable", "false");

        Session session = Session.getInstance(p, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("", "");
            }
        });

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress("hello@acme.com"));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
        msg.setSubject("Welcome to Acme!");
        msg.setText("Hi " + name + ",\n\nThanks for signing up. We'll be in touch shortly.\n\n— Acme");
        Transport.send(msg);
    }
}