# Landing Page Lead Pipeline — Redis Streams + Java

## Kiến trúc

```
   Landing form (HTML)
         │ POST /leads
         ▼
   LeadIngestApi (Java, port 8080)
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
(smtp:1025) (http :3000)       (postgres :5432)
MailHog      json-server        Postgres
```

3 worker chạy độc lập, mỗi worker có consumer group riêng. Một message được
gửi cho cả 3 worker (fanout). Mỗi worker xử lý lỗi độc lập — CRM chết không
ảnh hưởng email.

## Yêu cầu

- Java 17+
- Maven 3.9+
- Docker + Docker Compose

## Chạy

### 1. Khởi động infrastructure

```bash
docker compose up -d
```

Services:
- Redis: `localhost:6379`
- MailHog SMTP: `localhost:1025`, Web UI: `http://localhost:8025`
- Mock CRM (json-server): `http://localhost:3000/leads`
- Postgres: `localhost:5432` (user/pass: `analytics/analytics`, db: `analytics`)

### 2. Compile

```bash
mvn clean compile
```

### 3. Chạy 4 process (mỗi cái một terminal)

```bash
mvn exec:java -Dexec.mainClass="LeadIngestApi"
mvn exec:java -Dexec.mainClass="EmailWorker"
mvn exec:java -Dexec.mainClass="CrmWorker"
mvn exec:java -Dexec.mainClass="AnalyticsWorker"
```

### 4. Test

Mở `http://localhost:8080/` điền form → check:

- Terminal EmailWorker: in "Email sent to ..."
- `http://localhost:8025` (MailHog): thấy email welcome
- `http://localhost:3000/leads` (json-server): thấy lead mới
- Postgres: `psql -h localhost -U analytics -d analytics -c "SELECT * FROM leads;"`

## Production checklist

- [ ] Retry policy khi gọi external fail (Resilience4j)
- [ ] Dead-letter queue cho poison message (xgroup `dead_letters`)
- [ ] Auth + rate limit cho `/leads`
- [ ] TLS + connection pool cho SMTP/HTTP/Postgres
- [ ] Monitoring (lag, throughput) qua Micrometer + Prometheus