# M.GH.AL Backend API

## Production architecture

- Hosting and API execution: **Vercel only**.
- Application database: **Neon PostgreSQL only**.
- Vercel Next.js Route Handler: `app/api/[...path]/route.ts`.
- Shared API contract: `mghal-backend/api-handler.mjs`.
- PostgreSQL query adapter: `mghal-backend/node/postgres-adapter.mjs`.
- Production API and frontend share the same Vercel project and origin.
- Production API requests are dispatched in-process; no external API proxy is used.

The API handler is a standard Web Request/Response module. It does not require a Cloudflare Worker runtime, a Worker binding, a separate Node HTTP service, or a second database.

## Database

The intended production database is Neon project `billowing-snow-49569906`, branch `br-morning-cherry-b9l25msz`, database `mghal_portfolio`. **Deployment status (2026-11-12): Vercel Production does not currently have a `DATABASE_URL` variable.** Do not claim that the deployed Production API is connected to Neon until the encrypted variable is provisioned through an approved secure path and the deployed API passes database readiness checks.

The compatibility adapter exposes the existing prepared-query interface while executing SQL against PostgreSQL. It does not connect to D1 or SQLite.

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

Preview deployments do not receive the production database URL. Without a dedicated isolated database, API routes fail closed with HTTP 503.

## Health endpoints

- `GET /api/health` — shared API handler and database check.
- `GET /api/ready` — PostgreSQL `SELECT 1` readiness probe.

## Local Node adapter

`mghal-backend/node/server.mjs` remains only as a local compatibility/test harness. It is not a production service and must not be deployed as a separate API host.
