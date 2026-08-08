package com.example.leads;

import org.springframework.web.bind.annotation.*;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.params.XAddParams;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
public class LeadController {

    private final AppProperties props;
    private final Jedis jedis;

    public LeadController(AppProperties props) {
        this.props = props;
        this.jedis = new Jedis(props.getRedis().getHost(), props.getRedis().getPort());
    }

    @PostMapping("/leads")
    public Map<String, String> submit(@RequestParam Map<String, String> form) {
        String email = form.get("email");
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("email_required");
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

        jedis.xadd(props.getStream().getName(), entry, XAddParams.xAddParams());

        System.out.println("Lead queued: " + lead.id + " (" + lead.email + ")");

        return Map.of("id", lead.id, "status", "queued");
    }
}