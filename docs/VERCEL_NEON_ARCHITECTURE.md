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


---

## Current verified status — 2026-11-21

This status delta supersedes the older environment and cutover statements above where they conflict. It records read-only evidence gathered on 2026-11-21; it does not authorize a Production release or infrastructure deletion.

### Vercel Production

- The official Production deployment is READY on commit `78413e935f4e7615ded3180d69524dd704e40eae`.
- The encrypted `DATABASE_URL` variable is present in the Vercel Production target. Its value was not decrypted or disclosed.
- `MGHAL_API_BASE` is present only in Development, not Production. The Production Vercel runtime therefore has no configured Render API-base dependency.
- Live `GET /api/health` and `GET /api/ready` both returned HTTP 200 with Neon connected.
- Public projects, certificates, skills and education endpoints returned HTTP 200. The unauthenticated admin dashboard returned HTTP 401. Owner bootstrap status reports an existing owner and a closed bootstrap path.
- Google OAuth configuration currently reports `enabled: false`; Google sign-in is not claimed as active or tested.
- Vercel runtime monitoring reported 38 SSL connection-option warnings in the preceding 24-hour window. PR #58 normalizes the PostgreSQL URL by removing legacy `sslmode` query flags and explicitly retains certificate verification. That fix is Preview/PR-only until merged and deployed.

### Neon Production and Preview

- Production remains on migration-ledger entries `0001`–`0005`. The Google identity tables/indexes from migration 0006 already exist in the Production schema, but its ledger entry is absent.
- The rate-limit expiry index from migration 0007 is absent in Production. The isolated Preview branch has ledger entries through `0007` and the index is present.
- At the read-only inspection snapshot, Production had 892 rate-limit keys: 876 older than ten minutes and 16 within the active window. No Production cleanup or migration was executed.
- The Production role `mghal_app_runtime` exists and has SELECT/INSERT/UPDATE/DELETE grants across 28 public tables. The isolated Preview branch currently has only `mghal_owner`, not the restricted runtime role; this is a Preview least-privilege follow-up.
- Migrations 0006 and 0007 are additive/idempotent in the reviewed SQL. Their application to Production remains an explicit approval gate.

### Remaining legacy infrastructure

- Cloudflare D1 database inventory is empty. However, the old `mghal-api` Worker still exists, has a D1 binding whose referenced database returns 404, and has its `workers.dev` subdomain enabled. It has no custom Worker domain. Do not recreate D1; retire the stale Worker only after confirming no external consumers and obtaining authorization.
- Render still has 15 services linked to this repository. All are unsuspended and configured for auto-deploy. No M.GH.AL Render PostgreSQL database was found. Production no longer has `MGHAL_API_BASE`, but these public legacy/preview services have not been suspended or deleted.
- Render retirement and Cloudflare Worker retirement remain separate, authorized cleanup tasks; neither was performed during this audit.

### Pull-request and SEO state

- PRs #58, #59, #60 and #61 are open, mergeable, and have clean mergeability state. Their GitHub CI checks passed and their Vercel Preview deployments reached READY. None has been merged; Production remains unchanged.
- PR #59's live production smoke verification checked 65 legacy redirect variants, 68 sitemap URLs (68 unique), 204 hreflang links, 25 image locations, and 68/68 public routes, plus security headers, admin denial, CORS and Neon readiness.
- Google Search Console processed the official sitemap without errors or warnings (68 web URLs and 25 image locations). Both `/photos` and `/en/photos` are currently `Discovered - currently not indexed`; `/photos/` is unknown to Google. The homepage currently exposes no internal link to the gallery, so adding a visible internal link is a recommended SEO follow-up.
- The public skills API returns 21 technologies, while both Arabic and English skills pages render a different 17-item list. The two localized pages match each other, but the API and rendered list are separate content inventories that should be reconciled.

**Disposition:** Vercel-to-Neon Production connectivity is verified. Phase 1 remains open for PR integration, controlled Production migration/release, gallery internal-link/indexing follow-up, content-source reconciliation, and authorized retirement of the stale Cloudflare Worker and Render services.