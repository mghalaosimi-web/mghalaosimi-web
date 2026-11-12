# M.GH.AL — Neon PostgreSQL production database

## Authoritative production target

- Provider: Neon PostgreSQL 17
- Project: `mghal-portfolio-db`
- Project ID: `billowing-snow-49569906`
- Branch: `main`
- Branch ID: `br-morning-cherry-b9l25msz`
- Database: `mghal_portfolio`
- Region: Frankfurt (`aws-eu-central-1`)

The only production application database is this Neon database. The Vercel Production environment receives its pooled connection string through encrypted `DATABASE_URL`. Never store connection strings, role passwords, OAuth secrets, or bootstrap tokens in Git.

## Verified live schema checkpoint — 2026-11-11

Read-only inspection of the production branch confirmed:

- 28 public tables with primary keys.
- 19 foreign-key constraints; all 19 are validated.
- 17 unique constraints.
- One existing administrator account.
- 317 existing follower records.
- Media table is empty; no D1-backed media provider rows or blob objects exist in Neon.
- Google follower identity, visitor identity-session, and OAuth transaction tables exist with the expected primary keys, foreign keys, unique constraints, and supporting indexes.
- The migration ledger currently contains `0001_core_platform` through `0005_technology_visibility`. The Google identity tables existed before the corresponding PostgreSQL ledger entry was recorded.

The migration `0006_google_follower_identity.sql` is an additive, idempotent PostgreSQL migration. It was added to reconcile the existing schema and ledger; it must first be tested on a temporary Neon branch before being applied to Production.

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
