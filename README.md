# Redis Streams Landing Page

Spring Boot service that captures landing-page form submissions and fans them out
to three independent consumers via Redis Streams.

## Architecture

```
Browser → LeadController ── xadd ──> Redis Stream "leads"
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
        EmailWorker            CrmWorker            AnalyticsWorker
        (SMTP)                 (HTTP POST)          (JDBC)
        MailHog                json-server          Postgres
        group: email_svc       group: crm_svc       group: analytics_svc
```

Each consumer group reads every message independently — failure in one does not
block the others.

## Quick start

```bash
cp .env.example .env
docker compose up --build
# open http://localhost:8080
```

Submit the form, then verify:
- App logs (in `docker compose logs -f app`)
- MailHog UI: http://localhost:8025
- CRM mock: http://localhost:3000/leads
- Postgres: `docker exec -it postgres-analytics psql -U analytics -d analytics -c "select * from leads;"`

## Run locally without the app container

```bash
docker compose up -d redis mailhog mock-crm postgres
REDIS_HOST=localhost SMTP_HOST=localhost \
  CRM_URL=http://localhost:3000/leads \
  mvn spring-boot:run
```

## Layout

```
src/main/java/com/example/leads/
├── Application.java         Spring Boot entry point
├── AppProperties.java       @ConfigurationProperties("app")
├── LeadController.java      POST /leads → xadd
├── Lead.java                POJO
├── EmailWorker.java         @Component, group email_svc, SMTP
├── CrmWorker.java           @Component, group crm_svc, HTTP
└── AnalyticsWorker.java     @Component, group analytics_svc, JDBC
src/main/resources/
├── application.yml          config with ${ENV:default} overrides
└── landing.html             form served at /
```

## Configuration

`application.yml` reads env vars first, falls back to defaults. `.env` is loaded
via Docker Compose `env_file:`. See `.env.example` for production-ready examples
(Resend, HubSpot, Redshift).

## Production checklist

- [ ] Retry policy (Spring Retry / Resilience4j)
- [ ] Dead-letter queue (`xpending` → new group `dead_letters`)
- [ ] Auth + rate limit on `/leads`
- [ ] TLS + connection pooling for SMTP / HTTP / JDBC
- [ ] Metrics: lag, throughput via Micrometer + Prometheus
- [ ] Schema migrations (Flyway / Liquibase)
- [ ] Scale horizontally: each worker as its own deployable, multiple replicas per group
- [ ] Graceful shutdown (already wired via `@PreDestroy`)