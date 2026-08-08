# AGENTS.md — Guide for readers

## What this repo is

A collection of self-contained demos comparing message-queue setups for the
same scenario: a landing page form submission fanned out to email service,
CRM, and analytics warehouse.

Each `queue-N/` directory is a complete, independent Maven project. Pick one
to study — you do not need to read the others.

## Layout

```
.
├── README.md         high-level index of all examples
├── AGENTS.md         this file
├── queue-1/          Redis Streams fanout (Spring Boot + Jedis)
└── queue-N/          future: RabbitMQ, Kafka, SQS, NATS, ...
```

## How to explore

1. Read `README.md` for the table of contents.
2. Pick a queue dir and read its `README.md` first.
3. Look at `pom.xml` to see the dependency stack.
4. Read `docker-compose.yml` to see what services run.
5. Trace one request: API entry point → publish → consumer → side effect.

## Conventions across all queues

- **Java 11** with Spring Boot 2.7.18 (last 2.x line that supports Java 11).
- **JDK 11** is the only JDK in use. Pre-Java-11 features avoided.
- **Stack-agnostic problem**: same scenario, different queue tech. The
  scenario is the constant; the queue is the variable.
- **One platform layer per worker**: each consumer writes to at most one
  external system (SMTP, HTTP, JDBC). No batching, no buffering.
- **Each directory is self-contained.** Do not look for shared code between
  `queue-1/` and `queue-2/`.

## Where to ask questions

The repo has no forum / issue tracker configured. Read the code; the comments
intentionally document only the non-obvious bits.
