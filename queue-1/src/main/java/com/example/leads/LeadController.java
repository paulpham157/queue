package com.example.leads;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.params.XAddParams;

import javax.validation.Valid;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class LeadController {

    private static final Logger log = LoggerFactory.getLogger(LeadController.class);

    // Approximate trim — caps the stream at ~10k entries. Keeps memory bounded.
    private static final long STREAM_MAX_LEN = 10_000;

    // Idempotency keys live in Redis for 24h. Long enough to cover client retries,
    // short enough that the SET key space doesn't grow unbounded.
    private static final Duration IDEMPOTENCY_TTL = Duration.ofHours(24);

    private final AppProperties props;
    private final JedisPool pool;

    public LeadController(AppProperties props, JedisPool pool) {
        this.props = props;
        this.pool = pool;
    }

    @PostMapping("/leads")
    public ResponseEntity<Map<String, String>> submit(
            @RequestHeader(value = "Idempotency-Key", required = false) String idempotencyKey,
            @Valid @RequestBody LeadRequest req) {

        String leadId = UUID.randomUUID().toString();
        String idemKey = idempotencyKey != null && !idempotencyKey.isBlank()
            ? "idem:lead:" + idempotencyKey
            : null;

        try (Jedis jedis = pool.getResource()) {
            // Idempotency: SET NX EX. If the key already exists, the caller is retrying
            // — return 409 so they know the original request was already processed.
            if (idemKey != null) {
                String set = jedis.set(idemKey, leadId,
                    redis.clients.jedis.params.SetParams.setParams().nx().ex(IDEMPOTENCY_TTL.toSeconds()));
                if (!"OK".equals(set)) {
                    String existingId = jedis.get(idemKey);
                    log.info("Duplicate lead submission rejected: key={} existingId={}", idempotencyKey, existingId);
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(Map.of("error", "duplicate_request", "id", existingId == null ? "" : existingId));
                }
            }

            Map<String, String> entry = new HashMap<>();
            entry.put("event", "lead.created");
            entry.put("id", leadId);
            entry.put("name", nullToEmpty(req.getName()));
            entry.put("email", req.getEmail());
            entry.put("company", nullToEmpty(req.getCompany()));
            entry.put("message", nullToEmpty(req.getMessage()));
            entry.put("source", req.getSource() == null || req.getSource().isBlank() ? "landing" : req.getSource());

            // Approximate MAXLEN — Redis trims in chunks (uses `~`), cheaper than exact trim.
            XAddParams params = XAddParams.xAddParams().maxLen(STREAM_MAX_LEN).approximateTrimming();
            jedis.xadd(props.getStream().getName(), entry, params);

            log.info("Lead queued: id={} email={}", leadId, req.getEmail());
            return ResponseEntity.ok(Map.of("id", leadId, "status", "queued"));

        } catch (Exception e) {
            log.error("Failed to enqueue lead: email={}", req.getEmail(), e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(Map.of("error", "queue_unavailable"));
        }
    }

    private static String nullToEmpty(String s) {
        return s == null ? "" : s;
    }
}
