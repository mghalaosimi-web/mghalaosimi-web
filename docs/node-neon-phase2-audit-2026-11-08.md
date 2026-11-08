# M.GH.AL Node / Neon preview audit — 2026-11-08

## Scope and production boundary

This review covers the isolated Node.js + PostgreSQL adapter preview only. The production D1 / Cloudflare Worker path remains unchanged. No production database, credentials, secrets, DNS, or Vercel production target was modified, and no migration or cutover was attempted.

## Verified in source and automated tests

- The Node HTTP server dispatches the existing worker-compatible API handler through the PostgreSQL-backed D1 adapter.
- The adapter has automated compatibility tests for placeholder translation, SQLite-oriented SQL rewrites, and transactional batch behavior.
- The worker handler has a database-backed GET /health check.
- The Node runtime now exposes GET /live (process liveness) and GET /ready (a PostgreSQL SELECT 1 AS ok readiness probe). The readiness helper is covered for success, failure, and unexpected probe results.
- Admin API routes use bearer-token authentication, with explicit setup/auth routes for bootstrap, login, and Google OAuth exchange. Resource authorization is checked through the worker's permission helper.
- Generic content CRUD is constrained by resource/table and field allowlists. The handler records audit events for supported create/update/delete operations.
- Public project, credential, skill, follow, reaction, and comment operations are implemented in the shared handler. The UI uses explicit pending/success/error feedback and does not fabricate counts or records.

## Gaps and residual risks

1. **Render health-check wiring:** the Node preview service currently has no platform healthCheckPath configured. The new /ready endpoint exists and is unit-tested, but Render is not yet configured to probe it.
2. **Live Neon integration coverage:** current Node tests exercise the SQL adapter and readiness helper with controlled test doubles. They do not execute every public/admin CRUD, auth, RBAC, or social-interaction route against a live Neon database.
3. **Validation consistency:** the generic CRUD layer uses field allowlists and endpoint-specific checks, but the Zod schemas in the backend source are not consistently wired into every generic resource mutation. Add per-resource request schemas and negative tests before exposing more write surfaces.
4. **Rate-limit granularity:** the shared handler applies a broad per-IP request budget (120 requests per minute). Authentication/bootstrap routes do not yet have a separately tuned brute-force policy, and the current counter storage/retention needs an explicit cleanup strategy.
5. **Proxy trust:** the Node adapter derives the client address from forwarded headers. Confirm Render's trusted-proxy behavior and prevent clients from choosing the effective IP before relying on per-IP rate limiting as a security boundary.
6. **Data migration and parity:** no D1-to-Neon migration, reconciliation, or production parity proof has been performed. Do not switch production traffic until row counts, uniqueness constraints, media storage, transactional behavior, and rollback have been tested against a production-shaped copy.
7. **Operational observability:** add structured request IDs, route-level latency/error metrics, and redacted database error logging before production promotion.

## Release decision

Keep the Node / Neon service as a preview. The /live and /ready additions improve observability but do not constitute proof of full API parity or production readiness. Production remains on the existing D1 / Worker stack until the gaps above are closed and a separately approved migration plan is executed.
