# M.GH.AL — Neon PostgreSQL production database

## Authoritative production target

- Provider: Neon PostgreSQL 17
- Project: `mghal-portfolio-db`
- Project ID: `billowing-snow-49569906`
- Branch: `main`
- Branch ID: `br-morning-cherry-b9l25msz`
- Database: `mghal_portfolio`
- Region: Frankfurt (`aws-eu-central-1`)

This Neon database is the production application database. Vercel Production has an encrypted, Production-only `DATABASE_URL`; on 2026-11-13 the official `/api/ready` route returned HTTP 200 with `database: connected`, and public API reads succeeded through the Vercel-native PostgreSQL pool. The connection string was not read or disclosed. Never store connection strings, role passwords, OAuth secrets, or bootstrap tokens in Git.

## Verified live schema checkpoint — 2026-11-11

Read-only inspection of the production branch confirmed:

- 28 public tables with primary keys.
- 19 foreign-key constraints; all 19 are validated.
- 17 unique constraints.
- One existing administrator account.
- 317 existing follower records.
- Media table is empty; no D1-backed media provider rows or blob objects exist in Neon.
- Google follower identity, visitor identity-session, and OAuth transaction tables exist with the expected primary keys, foreign keys, unique constraints, and supporting indexes.
- The Production migration ledger currently contains `0001_core_platform` through `0005_technology_visibility`; the Preview branch additionally records `0006_google_follower_identity`.
- Both Production and Preview contain the three Google identity tables and their expected structures. A read-only schema comparison on 2026-11-13 found no table/column/index/constraint delta attributable to migration 0006; the reported schema diff was limited to ACL/default-privilege entries.
- The live Production Google auth config endpoint currently reports `enabled: false`; OAuth start/callback flows were not exercised.

The migration `0006_google_follower_identity.sql` is an additive, idempotent PostgreSQL migration intended to reconcile the already-present schema and migration ledger. Do not apply it to Production automatically: it would write the ledger and may execute `CREATE ... IF NOT EXISTS` statements. Obtain explicit approval before any Production migration, even when the expected schema objects already exist.

## Migration policy

- `0001_initial.sql` is the PostgreSQL baseline schema for a clean isolated test database.
- `0006_google_follower_identity.sql` is the PostgreSQL-specific identity-linking migration.
- Historical migration IDs are retained for traceability. The legacy name `0004_d1_media_storage` is only a historical ledger identifier; it does not represent an active D1 resource, connection, storage provider, or runtime dependency.
- Never drop or truncate tables.
- Never replay the baseline schema against Production as a migration shortcut.
- Test additive migrations on a temporary branch before applying them to the production branch.

## Serverless connection management

Vercel uses the Neon pooled endpoint with `pg.Pool` cached per warm function instance, maximum two connections per instance, bounded connection and idle timeouts, and TLS certificate verification. Preview deployments receive a branch-specific isolated Neon connection string; they must never inherit Production `DATABASE_URL`.

## Data safety

The existing administrator, followers, engagement data, content, certificates, projects, and identity records must be preserved. Production smoke tests should use temporary isolated data or non-mutating health checks; do not create disposable test records in the live production database.
