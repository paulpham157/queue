package com.example.leads;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Configuration
public class JedisConfig {

    @Bean(destroyMethod = "close")
    public JedisPool jedisPool(AppProperties props) {
        AppProperties.Redis r = props.getRedis();
        JedisPoolConfig cfg = new JedisPoolConfig();
        cfg.setMaxTotal(r.getPool().getMaxTotal());
        cfg.setMaxIdle(r.getPool().getMaxIdle());
        cfg.setMinIdle(r.getPool().getMinIdle());
        return new JedisPool(cfg, r.getHost(), r.getPort(), r.getPool().getTimeoutMs());
    }
}
