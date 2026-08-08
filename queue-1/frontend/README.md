# Frontend — Angular 18 + Tailwind

Lead submission UI. Talks to the Spring Boot backend via dev-server proxy.

## Prereqs

- Node 22.22+ or 24.15+. Older 24.x fails Angular CLI's engine check — use
  Angular 18 (pinned in this project) or upgrade Node.

## Dev

The backend runs in Docker; only Redis / MailHog / mock-crm / Postgres are
needed for the Angular dev server:

```bash
docker compose up -d redis mailhog mock-crm postgres
cd frontend
npm install
npx ng serve
# http://localhost:4200
```

`src/proxy.conf.json` forwards `/leads` to `http://localhost:8080`, so the
form submits directly to the backend without CORS setup.

## Build

```bash
npx ng build
# output: frontend/dist/frontend/
```

Drop `dist/frontend/browser/` into the Spring Boot `src/main/resources/static/`
if you want a single-URL deployment.

## Stack

- Angular 18 standalone components (no NgModules)
- Tailwind v3 with one custom color (`accent` / `accent-hover`)
- Native `fetch` for the POST — no HttpClient module needed