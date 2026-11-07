# M.GH.AL PostgreSQL migration target

## Provisioned target

- Provider: Neon Serverless Postgres (Free plan; no credit card required by Neon).
- Project: `mghal-portfolio-db`
- Project ID: `billowing-snow-49569906`
- Region: `aws-eu-central-1` (Frankfurt)
- PostgreSQL: 17
- Database: `mghal_portfolio`
- Branch: `main`

Do not put a connection string, password, OAuth secret, or bootstrap token in this repository. Configure the pooled Neon connection string as the deployment secret `DATABASE_URL`; keep an unpooled URL only for migrations if the deployment workflow requires it.

## Migration snapshot

A read-only snapshot of the live Cloudflare D1 database was copied to this Neon database on 2026-11-08. The following source counts were reconciled against the target:

| Table | Rows |
| --- | ---: |
| projects | 10 |
| certificates | 21 |
| education | 1 |
| identity_profiles | 2 |
| skills | 21 |
| followers | 151 |
| reactions | 9 |
| analytics_events | 380 |
| roles | 3 |
| permissions | 10 |
| role_permissions | 20 |
| site_settings (excluding transient `rl:*` keys) | 2 |

The source had no admin users/sessions, articles, comments, media records, achievements, technologies, or project-technology links at snapshot time. The one-time owner bootstrap hash was retained in `site_settings`; the raw bootstrap token is not stored in the database or repository. Transient rate-limit counters were intentionally not copied.

The production D1 database remains unchanged and active. This is a data-copy checkpoint, **not a production cutover**.

## Schema

Apply `0001_initial.sql` to a clean PostgreSQL database. It is idempotent and creates the complete baseline schema, including the Google follower-identity tables needed by the current API contract. The source D1 database did not yet have the Google identity migration applied, so those new tables are empty in PostgreSQL.

Timestamps remain ISO-8601 text for this first compatibility migration. Boolean-like flags remain constrained `SMALLINT` values (0/1) to avoid changing the existing API contract during the data move. A later, separately reviewed migration may normalize them to native PostgreSQL types.

## Runtime and cutover sequence

1. Implement the Node.js API/repository/service layer against this schema.
2. Configure `DATABASE_URL` only in the hosting provider's encrypted environment settings.
3. Run schema, API contract, auth/RBAC, and data-parity tests against this isolated Neon database.
4. Run a final incremental data sync and reconcile counts immediately before cutover.
5. Deploy the Node.js API in preview and test it without sending production writes to Neon.
6. Switch the frontend API origin only after all route contracts pass.
7. Keep Cloudflare Worker + D1 available as rollback until the new API is verified in production.

Never delete, reset, or migrate the live D1 database destructively as part of this work.
