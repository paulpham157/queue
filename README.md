# Landing Page Lead Pipeline — Redis Streams + Spring Boot

## Kiến trúc

```
   Landing form (HTML, served by Spring Boot)
         │ POST /leads
         ▼
   LeadController
         │ xadd "leads" stream
         ▼
   ┌──────────────┐
   │ Redis Stream │
   │   "leads"    │
   └──────┬───────┘
          │  fanout — 3 consumer groups, mỗi group đọc mọi message
   ┌──────┼──────────────────────────┐
   ▼      ▼                          ▼
EmailWorker  CrmWorker          AnalyticsWorker
(SMTP)       (HTTP POST)        (JDBC)
   │             │                   │
   ▼             ▼                   ▼
MailHog      mock-crm            Postgres
(SMTP mock)  (json-server)       (warehouse)
```

3 worker chạy trong cùng Spring Boot process, mỗi worker có consumer group riêng.
Một message được gửi cho cả 3 worker (fanout). Mỗi worker xử lý lỗi độc lập —
CRM chết không ảnh hưởng email.

## Yêu cầu

- Java 17+
- Maven 3.9+
- Docker + Docker Compose

## Chạy

### 1. Tạo .env từ template

```bash
cp .env.example .env
```

### 2. Khởi động infrastructure + app

```bash
docker compose up --build
```

Services:
- `lead-app` (Spring Boot): `http://localhost:8080`
- `redis`: `localhost:6379`
- `mailhog` SMTP: `localhost:1025`, Web UI: `http://localhost:8025`
- `mock-crm` (json-server): `http://localhost:3000/leads`
- `postgres`: `localhost:5432` (user/pass: `analytics/analytics`, db: `analytics`)

### 3. Test

Mở `http://localhost:8080/` điền form → check:

- App logs: "Lead queued", "Email sent", "Lead added to CRM", "Lead inserted"
- `http://localhost:8025` (MailHog): thấy email welcome
- `http://localhost:3000/leads` (json-server): thấy lead mới
- Postgres: `docker exec -it postgres-analytics psql -U analytics -d analytics -c "SELECT * FROM leads;"`

## Chạy ngoài Docker (dev nhanh)

```bash
docker compose up -d redis mailhog mock-crm postgres
mvn spring-boot:run
```

Override env vars trỏ về `localhost`:
```bash
REDIS_HOST=localhost SMTP_HOST=localhost CRM_URL=http://localhost:3000/leads \
DB_URL=jdbc:postgresql://localhost:5432/analytics mvn spring-boot:run
```

## Config

`application.yml` đọc theo thứ tự ưu tiên:
1. Environment variables (set qua Docker `env_file:` hoặc shell)
2. Defaults trong file

Pattern: `${VAR_NAME:default}`. Đổi host SMTP hay CRM token chỉ cần sửa `.env`,
không đụng vào code.

## Cấu trúc file

```
.
├── docker-compose.yml          Redis, MailHog, json-server, Postgres, app
├── Dockerfile                  multi-stage Maven build → JRE runtime
├── pom.xml                     spring-boot-starter-parent 3.3.0
├── db-init.sql                 schema Postgres
├── crm-mock/                   json-server fixtures
├── .env.example                template config
└── src/main/
    ├── java/com/example/leads/
    │   ├── Application.java        @SpringBootApplication main
    │   ├── AppProperties.java      @ConfigurationProperties("app")
    │   ├── Lead.java
    │   ├── LeadController.java     REST endpoint
    │   ├── EmailWorker.java        @Component, group: email_svc
    │   ├── CrmWorker.java          @Component, group: crm_svc
    │   └── AnalyticsWorker.java    @Component, group: analytics_svc
    └── resources/
        ├── application.yml
        └── landing.html
```

## Production checklist

- [ ] Retry policy (Spring Retry hoặc Resilience4j)
- [ ] Dead-letter queue cho poison message (`xpending` → group `dead_letters`)
- [ ] Auth + rate limit cho `/leads`
- [ ] TLS + connection pool cho SMTP/HTTP/JDBC
- [ ] Monitoring (lag, throughput) qua Micrometer + Prometheus
- [ ] Schema migration (Flyway/Liquibase) thay SQL init
- [ ] Scale horizontal — chạy mỗi worker thành Spring Boot app riêng,
      multiple instances per consumer group
- [ ] Graceful shutdown đã có sẵn (`@PreDestroy` set `running=false`)