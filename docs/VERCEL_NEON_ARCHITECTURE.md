# M.GH.AL — Vercel + Neon production architecture

## Target

One repository, one Vercel project, one primary public domain, and one Neon production database.

- Repository: `mghalaosimi-web/mghalaosimi-web`
- Vercel project: `mghalaosimi-web`
- Primary domain: `https://mghalaosimi-web.vercel.app`
- Neon project: `billowing-snow-49569906`
- Neon branch: `br-morning-cherry-b9l25msz`
- Neon database: `mghal_portfolio`

## Verified deployment status — 2026-11-12

The architecture above describes the intended target, not a completed Production cutover. The current Vercel environment inventory shows `DATABASE_URL` only for the Preview target on branch `fix/vercel-native-neon-api`; no Production `DATABASE_URL` is present. Production still has the legacy `MGHAL_API_BASE` variable pointing to the Render API hostname. The Vercel-native API has not yet been verified on a READY deployment of the current PR #32 head. Do not mark the cutover complete or retire Render until the Production secret is securely configured and end-to-end Production readiness is proven.

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


---

## Current release update — 2026-11-13

The accumulated Phase 1 integration has been merged to GitHub `main` through PRs #17, #24, #25, #29 and #33. Current main SHA: `9e12f510554abe4d66f873d484a1d2bab3d9916f`.

The Production environment now has an encrypted Production-only `DATABASE_URL`. The legacy Production `MGHAL_API_BASE` still points to the Render Node API preview hostname. The Vercel-native application runtime reads `DATABASE_URL` directly and dispatches the API inside Vercel; it does not require the external `MGHAL_API_BASE` proxy. Keep the old variable until the new Production release is live and verified, then remove it.

**Production has not been cut over.** The latest Production deployment still serves commit `7de53f6becabee1dfaab4fa328d3cb9131ecebcf`. The latest READY Preview is commit `74949bfff0272b5d8ffca7d54111a88995bdcca2`, not current main. Live checks: homepage HTTP 200, `/api/health` HTTP 200 through the legacy upstream, and `/photos` HTTP 404. Vercel status checks for the new main commit are blocked by the build-rate limit and no deployment ID exists for it. Therefore no Production cutover or Render retirement may be claimed.

The Production `DATABASE_URL` value was not read or disclosed. No database migration, bootstrap, secret mutation, DNS change, domain detachment, or Render service deletion was performed. Cloudflare D1 remains deleted and must not be recreated.


---

## Production cutover verification — 2026-11-13 (authoritative update)

This section supersedes the earlier 2026-11-12 and 2026-11-13 statements above that described Production as still serving the legacy Render proxy.

### Verified deployment

- Vercel Production deployment: `dpl_8JvcKQp7uVzR6hkJpUbbm9QbFjqs`
- Deployment state: `READY`
- Git branch: `main`
- Deployed commit: `a283323dd63107e510e780f1f1d1265e4d1c719b`
- Official alias: `https://mghalaosimi-web.vercel.app`

The deployed source contains the Next.js catch-all API Route Handler and `lib/mghal-api-runtime.mjs`. The runtime creates a PostgreSQL pool from the server-side `DATABASE_URL`, wraps it with `PgPreparedDatabase`, and invokes the shared API handler in-process. GitHub code search for `MGHAL_API_BASE` on the default branch returned documentation-only matches; the application runtime does not read or proxy through that variable.

### Live Production evidence (read-only)

Checked against the official alias on 2026-11-13:

| Route | HTTP | Result |
|---|---:|---|
| `/api/ready` | 200 | `ready`, database `connected` |
| `/api/health` | 200 | `ok`, database `connected` |
| `/api/public/projects` | 200 | Public project records returned |
| `/api/public/followers/count` | 200 | Aggregate follower/guest counts returned |
| `/api/public/site-reactions` | 200 | Aggregate reaction state returned |
| `/api/admin/bootstrap/status` | 200 | `ownerExists: true`; no bootstrap write performed |

The `/api/ready` handler runs `SELECT 1 AS ok` through the Vercel-native PostgreSQL pool. Together with the live public API reads, this confirms that the Production API is executing inside Vercel and reaching the configured PostgreSQL database directly. No connection string or secret value was read or disclosed.

### Remaining infrastructure cleanup

- Production has an encrypted `DATABASE_URL` scoped to the Production target.
- The old plain `MGHAL_API_BASE` environment variable still exists and points to the Render preview hostname, but it is not referenced by the current application runtime. It is now a stale configuration item, not an active request dependency.
- The available Vercel integration in this session does not expose an environment-variable deletion action. Do not overwrite it with an empty value. Remove it later through Vercel Project Settings after an authorized operator confirms the exact variable.
- Render services have not been deleted or suspended. Retire them only after the remaining authenticated/admin and engagement workflows, rollback window, and any external consumers have been reviewed.
- No Production write test, Neon migration, bootstrap, credential rotation, or Render deletion was performed. `/api/admin/bootstrap/status` is read-only.

**Disposition:** Vercel-native Production API → Neon connectivity is verified. The overall Phase 1 remains open for authenticated/RBAC and write-path verification, safe stale-variable removal, Render retirement, and final browser/mobile/SEO checks.

### Neon migration-ledger reconciliation

A read-only Neon comparison on 2026-11-13 confirmed that both Production `main` and the isolated Preview branch contain `follower_identities`, `follower_identity_sessions`, and `oauth_transactions`. Production's `_mghal_migrations` ledger records 0001–0005; Preview additionally records `0006_google_follower_identity`. The schema diff between branches contained only ACL/default-privilege differences, not missing Google identity tables or columns. Production migration 0006 was **not** run. The migration is additive/idempotent and intended to reconcile the ledger, but any Production ledger/schema write still requires explicit approval.

The live `GET /api/public/auth/google/config` endpoint returns `enabled: false`. Google OAuth start/callback was not exercised, and OAuth credentials were not inspected or changed.
