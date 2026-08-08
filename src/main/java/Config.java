public class Config {
    public final String redisHost;
    public final int redisPort;
    public final int apiPort;
    public final String streamName;
    public final String smtpHost;
    public final int smtpPort;
    public final String smtpFrom;
    public final String crmUrl;
    public final String dbUrl;
    public final String dbUser;
    public final String dbPass;

    private Config(String redisHost, int redisPort, int apiPort, String streamName,
                   String smtpHost, int smtpPort, String smtpFrom,
                   String crmUrl, String dbUrl, String dbUser, String dbPass) {
        this.redisHost = redisHost;
        this.redisPort = redisPort;
        this.apiPort = apiPort;
        this.streamName = streamName;
        this.smtpHost = smtpHost;
        this.smtpPort = smtpPort;
        this.smtpFrom = smtpFrom;
        this.crmUrl = crmUrl;
        this.dbUrl = dbUrl;
        this.dbUser = dbUser;
        this.dbPass = dbPass;
    }

    public static Config load() {
        return new Config(
            env("REDIS_HOST", "localhost"),
            envInt("REDIS_PORT", 6379),
            envInt("API_PORT", 8080),
            env("STREAM_NAME", "leads"),
            env("SMTP_HOST", "localhost"),
            envInt("SMTP_PORT", 1025),
            env("SMTP_FROM", "hello@acme.com"),
            env("CRM_URL", "http://localhost:3000/leads"),
            env("DB_URL", "jdbc:postgresql://localhost:5432/analytics"),
            env("DB_USER", "analytics"),
            env("DB_PASS", "analytics")
        );
    }

    private static String env(String key, String fallback) {
        String v = System.getenv(key);
        return (v == null || v.isBlank()) ? fallback : v;
    }

    private static int envInt(String key, int fallback) {
        String v = System.getenv(key);
        if (v == null || v.isBlank()) return fallback;
        try { return Integer.parseInt(v); } catch (NumberFormatException e) { return fallback; }
    }
}
