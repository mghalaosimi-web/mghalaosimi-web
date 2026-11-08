# M.GH.AL Node.js API runtime

This is the canonical API runtime for M.GH.AL. It reuses the reviewed API contract in `../worker.production.js` through a small D1-compatible PostgreSQL adapter, with **Neon PostgreSQL as the only application database**.

## Runtime

- Node.js 22+
- Neon PostgreSQL
- Native Node HTTP server; no Express dependency
- `pg` connection pool
- Shared API handler with PostgreSQL compatibility adapter

## Environment

Required:

- `DATABASE_URL`: Neon pooled PostgreSQL connection string; configure only as a protected hosting secret.

Optional:

- `PORT` (default 3001)
- `PG_POOL_MAX` (default 5)
- `PGSSLMODE=disable` only for local development; production uses TLS verification.
- `ALLOWED_ORIGINS`
- `RATE_LIMIT_PER_MINUTE` (positive integer; defaults to 120 when omitted or invalid)
- `OWNER_BOOTSTRAP_TOKEN`
- `GOOGLE_AUTH_ENABLED`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`
- `PUBLIC_SITE_URL`
- `MAX_BODY_BYTES` (default 2,500,000)

Never commit `DATABASE_URL`, OAuth secrets, or owner bootstrap tokens.

## Local commands

```bash
npm ci
npm test
npm start
```

The existing `GET /health` API contract remains available. The Node runtime also exposes `GET /live` for process liveness and `GET /ready` for a PostgreSQL `SELECT 1` readiness probe (503 when the database is unavailable). All existing `/api/public/*` and `/api/admin/*` routes are dispatched through the same API handler.

## Production routing and data ownership

- The official Vercel site routes API requests to this Render Node service.
- The legacy Cloudflare Worker URL is a thin proxy to this same Node service; it does not access D1.
- Neon PostgreSQL is the only database used by application reads and writes.
- Cloudflare D1 is retained separately as a temporary backup. Do not attach it to the production proxy or delete it without a separate backup-retention review and explicit approval.

The compatibility adapter translates positional `?` placeholders and SQLite `COLLATE NOCASE` email lookups. D1-style `batch()` operations execute inside a PostgreSQL transaction. The API implementation is covered by compatibility tests for PostgreSQL ordering, aggregation, timestamp grouping, and SQL translation.

Media BLOB handling, owner bootstrap, Google OAuth, admin CRUD, and browser workflows still require end-to-end checks against the deployed service before the project can be called fully verified.
