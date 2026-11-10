# M.GH.AL — Vercel + Neon production architecture

## Target

One repository, one Vercel project, one primary public domain, and one Neon production database.

- Repository: `mghalaosimi-web/mghalaosimi-web`
- Vercel project: `mghalaosimi-web`
- Primary domain: `https://mghalaosimi-web.vercel.app`
- Neon project: `billowing-snow-49569906`
- Neon branch: `br-morning-cherry-b9l25msz`
- Neon database: `mghal_portfolio`

## Request path

Browser → Vercel Next.js Route Handler → shared API handler → PostgreSQL adapter → Neon PostgreSQL.

No external API proxy or separate application host is required. The shared API handler preserves the existing endpoint contract, validation, authorization, sessions, RBAC, rate limiting, and response shapes.

## Connection management

The Vercel runtime uses the `pg` Pool, cached per warm function instance, with a maximum of two connections per instance, short idle timeout, bounded connection timeout, and TLS certificate verification. The production `DATABASE_URL` must be the Neon pooled connection string and must be stored as an encrypted Vercel Production variable.

## Environment isolation

Only Vercel Production receives the production `DATABASE_URL`. Preview and Development environments do not inherit production database credentials. Until an isolated preview database is configured, preview API routes fail closed.

## Security boundaries

- Production CORS origin: `https://mghalaosimi-web.vercel.app`.
- Preview CORS is restricted to the exact Vercel preview deployment URL.
- Client IP is derived from platform-forwarded headers and placed in an internal request header.
- Database and OAuth credentials are server-only.
- Health and readiness responses never expose connection details.
- No owner bootstrap token is generated or exposed by deployment automation.

## Release gate

Do not remove the old production API environment variable or decommission any former host until a Vercel Production deployment has passed readiness, public API, protected API, engagement, and database read/write checks.
