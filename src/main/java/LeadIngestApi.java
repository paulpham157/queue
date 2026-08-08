import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.XAddParams;

import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class LeadIngestApi {
    private final Jedis jedis = new Jedis("localhost", 6379);
    private static final String STREAM = "leads";

    public static void main(String[] args) throws Exception {
        LeadIngestApi api = new LeadIngestApi();
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        server.createContext("/leads", api.new LeadsHandler());
        server.createContext("/", api.new StaticHandler());
        server.setExecutor(null);
        server.start();
        System.out.println("LeadIngestApi listening on http://localhost:8080");
        System.out.println("Open http://localhost:8080/ for landing page");
    }

    class LeadsHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws java.io.IOException {
            try {
                if (!"POST".equalsIgnoreCase(ex.getRequestMethod())) {
                    sendJson(ex, 405, "{\"error\":\"method_not_allowed\"}");
                    return;
                }

                String body = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Map<String, String> form = parseForm(body);

                String email = form.get("email");
                if (email == null || email.isBlank()) {
                    sendJson(ex, 400, "{\"error\":\"email_required\"}");
                    return;
                }

                Lead lead = new Lead(
                    UUID.randomUUID().toString(),
                    form.getOrDefault("name", ""),
                    email,
                    form.getOrDefault("company", ""),
                    form.getOrDefault("message", ""),
                    form.getOrDefault("source", "landing")
                );

                Map<String, String> entry = new HashMap<>();
                entry.put("event", "lead.created");
                entry.put("id", lead.id);
                entry.put("name", lead.name);
                entry.put("email", lead.email);
                entry.put("company", lead.company);
                entry.put("message", lead.message);
                entry.put("source", lead.source);

                jedis.xadd(STREAM, entry, XAddParams.xAddParams());

                String resp = "{\"id\":\"" + lead.id + "\",\"status\":\"queued\"}";
                sendJson(ex, 202, resp);
                System.out.println("Lead queued: " + lead.id + " (" + lead.email + ")");
            } catch (Exception e) {
                e.printStackTrace();
                sendJson(ex, 500, "{\"error\":\"internal\"}");
            }
        }
    }

    class StaticHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange ex) throws java.io.IOException {
            if (!"/".equals(ex.getRequestURI().getPath())) {
                sendJson(ex, 404, "{\"error\":\"not_found\"}");
                return;
            }
            byte[] html = Files.readAllBytes(Path.of("src/main/resources/landing.html"));
            ex.getResponseHeaders().add("Content-Type", "text/html; charset=utf-8");
            ex.sendResponseHeaders(200, html.length);
            ex.getResponseBody().write(html);
            ex.close();
        }
    }

    private static Map<String, String> parseForm(String body) {
        Map<String, String> out = new HashMap<>();
        if (body == null || body.isEmpty()) return out;
        for (String pair : body.split("&")) {
            int eq = pair.indexOf('=');
            if (eq < 0) continue;
            String k = URLDecoder.decode(pair.substring(0, eq), StandardCharsets.UTF_8);
            String v = URLDecoder.decode(pair.substring(eq + 1), StandardCharsets.UTF_8);
            out.put(k, v);
        }
        return out;
    }

    private static void sendJson(HttpExchange ex, int code, String body) throws java.io.IOException {
        byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
        ex.getResponseHeaders().add("Content-Type", "application/json");
        ex.sendResponseHeaders(code, bytes.length);
        ex.getResponseBody().write(bytes);
        ex.close();
    }
}