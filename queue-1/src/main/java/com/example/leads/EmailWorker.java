package com.example.leads;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.StreamEntryID;
import redis.clients.jedis.exceptions.JedisDataException;
import redis.clients.jedis.params.XReadGroupParams;
import redis.clients.jedis.resps.StreamEntry;

import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.concurrent.atomic.AtomicBoolean;

@Component
public class EmailWorker {
    private static final Logger log = LoggerFactory.getLogger(EmailWorker.class);

    private final AppProperties props;
    private final JedisPool pool;
    private final AtomicBoolean running = new AtomicBoolean(true);
    private static final String GROUP = "email_svc";

    public EmailWorker(AppProperties props, JedisPool pool) {
        this.props = props;
        this.pool = pool;
    }

    @PostConstruct
    public void start() {
        Thread t = new Thread(this::run, "email-worker");
        t.setDaemon(true);
        t.start();
    }

    @PreDestroy
    public void stop() { running.set(false); }

    public void run() {
        try (Jedis jedis = pool.getResource()) {
            ensureGroup(jedis);
            XReadGroupParams params = XReadGroupParams.xReadGroupParams().block(5000).count(10);
            Map<String, StreamEntryID> streams = Map.of(props.getStream().getName(), StreamEntryID.UNRECEIVED_ENTRY);

            log.info("EmailWorker started. Waiting for leads...");
            while (running.get()) {
                List<Map.Entry<String, List<StreamEntry>>> result;
                try {
                    result = jedis.xreadGroup(GROUP, "email-worker-1", params, streams);
                } catch (Exception e) {
                    log.error("EmailWorker xreadGroup failed; backing off", e);
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
                            sendWelcomeEmail(data.get("name"), data.get("email"));
                            jedis.xack(props.getStream().getName(), GROUP, entry.getID());
                            log.info("Email sent to {}", data.get("email"));
                        } catch (Exception e) {
                            log.error("Failed to send email for {}", data.get("id"), e);
                        }
                    }
                }
            }
            log.info("EmailWorker stopped.");
        } catch (Exception e) {
            log.error("EmailWorker fatal — pool resource could not be acquired", e);
        }
    }

    private void ensureGroup(Jedis jedis) {
        try {
            jedis.xgroupCreate(props.getStream().getName(), GROUP, new StreamEntryID("0-0"), true);
        } catch (JedisDataException e) {
            // group exists
        }
    }

    private void sendWelcomeEmail(String name, String email) throws Exception {
        Properties p = new Properties();
        p.put("mail.smtp.host", props.getSmtp().getHost());
        p.put("mail.smtp.port", String.valueOf(props.getSmtp().getPort()));
        p.put("mail.smtp.auth", "false");
        p.put("mail.smtp.starttls.enable", "false");

        Session session = Session.getInstance(p, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication("", "");
            }
        });

        MimeMessage msg = new MimeMessage(session);
        msg.setFrom(new InternetAddress(props.getSmtp().getFrom()));
        msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
        msg.setSubject("Welcome to Acme!");
        msg.setText("Hi " + name + ",\n\nThanks for signing up. We'll be in touch shortly.\n\n— Acme");
        Transport.send(msg);
    }

    private static void sleepQuiet(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ie) { Thread.currentThread().interrupt(); }
    }
}