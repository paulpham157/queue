package com.example.leads;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private Redis redis = new Redis();
    private Stream stream = new Stream();
    private Smtp smtp = new Smtp();
    private Crm crm = new Crm();
    private Db db = new Db();

    public Redis getRedis() { return redis; }
    public void setRedis(Redis redis) { this.redis = redis; }
    public Stream getStream() { return stream; }
    public void setStream(Stream stream) { this.stream = stream; }
    public Smtp getSmtp() { return smtp; }
    public void setSmtp(Smtp smtp) { this.smtp = smtp; }
    public Crm getCrm() { return crm; }
    public void setCrm(Crm crm) { this.crm = crm; }
    public Db getDb() { return db; }
    public void setDb(Db db) { this.db = db; }

    public static class Redis {
        private String host = "localhost";
        private int port = 6379;
        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
    }

    public static class Stream {
        private String name = "leads";
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
    }

    public static class Smtp {
        private String host = "localhost";
        private int port = 1025;
        private String from = "hello@acme.com";
        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
    }

    public static class Crm {
        private String url = "http://localhost:3000/leads";
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
    }

    public static class Db {
        private String url = "jdbc:postgresql://localhost:5432/analytics";
        private String user = "analytics";
        private String pass = "analytics";
        public String getUrl() { return url; }
        public void setUrl(String url) { this.url = url; }
        public String getUser() { return user; }
        public void setUser(String user) { this.user = user; }
        public String getPass() { return pass; }
        public void setPass(String pass) { this.pass = pass; }
    }
}