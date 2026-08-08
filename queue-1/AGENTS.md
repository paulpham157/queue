# AGENTS.md — Guide for queue-1

## What this example demonstrates

A landing page form POSTs a lead. The lead is published once to a Redis
Stream. Three independent consumer groups (email, CRM, analytics) each read
every message and write to its own downstream system — fanout, not
load-balancing.

## How to explore

1. **Read `README.md`** for the architecture diagram and quick start.
2. **Open `docker-compose.yml`** to see the five services (redis, mailhog,
   mock-crm, postgres, app).
3. **Open `src/main/resources/application.yml`** — all config is here, with
   `${ENV:default}` for env-var overrides.
4. **Trace the request**:
   - `LeadController.java` — `POST /leads` → `xadd` to stream
   - `EmailWorker.java` — consumes, sends SMTP via MailHog
   - `CrmWorker.java` — consumes, POSTs to json-server
   - `AnalyticsWorker.java` — consumes, INSERTs to Postgres
5. **Run it**: `docker compose up --build`, then submit the form at
   `http://localhost:8080`.

## Key Redis Streams concepts used here

- `xadd` — producer adds an entry to the stream.
- `xgroup create` — declare a consumer group. Each group is an independent
  reader. Multiple groups = fanout.
- `xreadgroup` with `>` — block until new messages arrive for this group.
- `xack` — mark a message processed. The PEL (pending entries list) tracks
  un-acked messages so a crashed consumer can resume.

Three groups (`email_svc`, `crm_svc`, `analytics_svc`) means each message is
delivered to all three. Remove a group and that downstream simply stops
receiving; the others are unaffected.

## Conventions in this directory

- **One Spring Boot app** hosts the REST controller plus all three workers as
  `@Component` beans. Each worker runs its consumer loop in a daemon thread
  started by `@PostConstruct`. `@PreDestroy` sets a `running` flag for
  graceful shutdown.
- **Each worker owns its `Jedis` instance.** Blocking `xreadgroup` holds the
  connection; sharing one across workers would serialize them.
- **Hardcoded SMTP host/port/CRM URL/DB creds** in `application.yml` defaults.
  Override via env vars (`.env` is loaded by Docker Compose).
- **Failures are logged, not retried.** The message stays in the consumer's
  PEL until restart. Production would add a retry policy + DLQ.

## Where the load-balancing variant would differ

If you wanted a single consumer group with three workers splitting the load
(say, three email-sending workers), change the `@Component` to be a group of
three `@PostConstruct` threads sharing the same `GROUP` name and unique
`CONSUMER` names. The rest of the code stays the same; only the group/consumer
strings change. That is the Redis Streams equivalent of a competing-consumers
pattern.
