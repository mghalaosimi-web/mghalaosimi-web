# M.GH.AL Backend API

## Production architecture

- Hosting and API execution: **Vercel only**.
- Application database: **Neon PostgreSQL only**.
- Vercel Next.js Route Handler: `app/api/[...path]/route.ts`.
- Shared API contract: `mghal-backend/api-handler.mjs`.
- PostgreSQL query adapter: `mghal-backend/node/postgres-adapter.mjs`.
- Production API and frontend share the same Vercel project and origin.
- API requests are dispatched in-process; the application runtime does not use an external API proxy.

The API handler is a standard Web Request/Response module. It does not require a Cloudflare Worker runtime, a Worker binding, a separate Node HTTP service, or a second database.

## Verified Production database status — 2026-11-13

The production database is Neon PostgreSQL:

- Project: `mghal-portfolio-db` (`billowing-snow-49569906`)
- Branch: `main` (`br-morning-cherry-b9l25msz`)
- Database: `mghal_portfolio`

Vercel Production has an encrypted, Production-only `DATABASE_URL`. The official Production `GET /api/ready` endpoint returned HTTP 200 with `status: ready` and `database: connected`; this endpoint executes PostgreSQL `SELECT 1 AS ok` through the Vercel-native pool. Public API read routes were also checked successfully. The connection string was not read or disclosed.

The legacy `MGHAL_API_BASE` environment variable may remain in the Vercel project as stale configuration, but the current default-branch application runtime does not read it. Do not remove it until the currently deployed source and the required authenticated/write-path checks have been verified on the intended release.

## Runtime configuration

Required in Vercel Production:

- `DATABASE_URL` — encrypted Neon pooled connection string.
- `PUBLIC_SITE_URL` — `https://mghalaosimi-web.vercel.app`.
- `ALLOWED_ORIGINS` — `https://mghalaosimi-web.vercel.app`.

Optional server-only settings:

- `RATE_LIMIT_PER_MINUTE`
- `OWNER_BOOTSTRAP_TOKEN` — needed only for a not-yet-bootstrapped owner; never expose it.
- `GOOGLE_AUTH_ENABLED`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_REDIRECT_URI`

Preview deployments must use a dedicated isolated database branch and must never inherit Production credentials. Without a preview database, API routes fail closed with HTTP 503.

## Health endpoints

- `GET /api/health` — shared API handler and database check.
- `GET /api/ready` — PostgreSQL `SELECT 1` readiness probe.

## Local Node adapter

`mghal-backend/node/server.mjs` remains only as a local compatibility/test harness. It is not a production service and must not be deployed as a separate API host.

## Remaining release verification

A successful readiness probe proves database connectivity, not every business operation. Before retiring Render or declaring Phase 1 complete, verify authenticated admin access, RBAC-protected reads, controlled write-path behavior, media handling, and browser/mobile interactions on the deployed Vercel release. Do not use disposable test records in Production.
