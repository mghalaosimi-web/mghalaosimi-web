# M.GH.AL PostgreSQL runtime tests and local harness

Production API requests run inside the Next.js Node.js Route Handler on Vercel. The application database is the confirmed Neon PostgreSQL database.

## Components

- `../api-handler.mjs` — shared API request/response contract.
- `postgres-adapter.mjs` — PostgreSQL prepared-query adapter.
- `server.mjs` — optional local HTTP harness for development only; not a production service.
- `health.mjs` — PostgreSQL readiness probe.

## Environment

The local harness requires `DATABASE_URL`. The intended Vercel Production runtime also requires an encrypted Neon pooled connection string, but the Vercel environment audit on 2026-11-12 found no Production `DATABASE_URL`. Production database connectivity is therefore not yet verified. Never commit database URLs, OAuth secrets, or owner bootstrap tokens.

Optional local settings include `PORT`, `PG_POOL_MAX`, `ALLOWED_ORIGINS`, `RATE_LIMIT_PER_MINUTE`, `OWNER_BOOTSTRAP_TOKEN`, `GOOGLE_AUTH_ENABLED`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI`, and `PUBLIC_SITE_URL`.

## Local commands

```bash
npm ci
npm test
npm run check
```

The production Vercel routes expose `GET /api/health` and `GET /api/ready`. The local harness also exposes `GET /live`.

Preview deployments do not inherit production database credentials. A preview without a dedicated database receives a safe 503 response for API calls.
