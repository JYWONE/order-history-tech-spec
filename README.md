# Order History Tech Spec

MVP API and demo console for a read-optimized order history lookup system.

The root route (`/`) serves a presentation console that demonstrates the lookup contract, smoke checks the live API, and falls back to sample rows when the database has not been seeded. API routes remain under `/health` and `/v1/orders`.

## Local setup

```bash
npm ci
docker compose up -d
npm run migrate
npm run seed
npm run dev
```

Open `http://localhost:3000` for the demo console.

## Validation

```bash
npm test
npm run build
npm run test:integration
```

Integration tests require local Postgres from `docker compose up -d` and applied migrations.

## Render

Use Node runtime settings:

```text
Build Command: npm ci && npm run build
Start Command: npm start
Health Check Path: /health
```

Environment variables:

```text
DATABASE_URL=<Render internal Postgres URL>
NODE_VERSION=22.21.1
PGPOOL_MAX=10
QUERY_WINDOW_MAX_DAYS=93
LATEST_LOOKBACK_DAYS=90
```

For local migration or seeding against Render Postgres, use the external URL with TLS:

```bash
DATABASE_URL='<external-url>?sslmode=require' npm run migrate
DATABASE_URL='<external-url>?sslmode=require' npm run seed
```

## Repo structure

- `MVP_TECH_SPEC.md`: current product and storage contract.
- `src/server.ts`: Fastify app, health route, demo route, and order routes.
- `src/demo.ts`: self-contained presentation console.
- `migrations/`: partitioned Postgres schema and indexes.
- `scripts/seed.ts`: deterministic demo data for local or Render smoke tests.
- `tests/`: unit and integration coverage for auth, query normalization, pagination, partition routing, and scoping.
