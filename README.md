# Queue Examples

Demos for different message-queue setups, all built around the same
landing-page scenario (form submission → fanout to email / CRM / analytics).

Each example lives in its own directory and is a self-contained Maven project
with its own Docker Compose setup.

## Examples

| # | Name | Stack | Description |
|---|------|-------|-------------|
| [1](./queue-1) | Redis Streams fanout | Spring Boot + Jedis | One producer, three consumer groups, fanout to email / CRM / analytics |

Each example is self-contained: own `pom.xml`, own `docker-compose.yml`, own
`README.md`. Run from inside its directory.

```
.
├── README.md           this file (index)
├── queue-1/            Redis Streams demo
└── ...
```
