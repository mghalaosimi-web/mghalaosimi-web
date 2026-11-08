# M.GH.AL Node.js API runtime

This is the standalone Node.js runtime for the existing M.GH.AL API contract. It reuses the reviewed API handler in `../worker.production.js` through a small D1-compatible PostgreSQL adapter, so the public/admin route contract is preserved while the runtime and database move to Node.js + PostgreSQL.

## Runtime

- Node.js 22+
- PostgreSQL 17 (Neon)
- Native Node HTTP server; no Express dependency
- `pg` connection pool
- Existing API handler reused as a compatibility bridge

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
npm install
npm test
npm start
```

The existing `GET /health` API contract remains available. The Node runtime also exposes `GET /live` for process liveness and `GET /ready` for a PostgreSQL `SELECT 1` readiness probe (503 when the database is unavailable). All existing `/api/public/*` and `/api/admin/*` routes are still dispatched through the same API handler.

## Compatibility and rollout

The adapter translates positional `?` placeholders and SQLite `COLLATE NOCASE` email lookups. D1 `batch()` operations execute inside a PostgreSQL transaction. The API code still requires full integration testing against PostgreSQL before production cutover, especially media BLOB handling, owner bootstrap, Google OAuth, admin CRUD, and all multi-statement operations.

This service must initially be deployed as an isolated preview. Keep the Cloudflare Worker and D1 production API active until parity tests pass and the frontend proxy is deliberately switched.
