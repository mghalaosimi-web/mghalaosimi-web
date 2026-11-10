# M.GH.AL — Database Architecture and Data Safety

**Inspection date:** 2026-11-10  
**Scope:** The M.GH.AL repository and the associated Neon/Cloudflare resources only.

## 1. Current architecture candidate

**PARTIALLY VERIFIED:** the Node API implementation uses a PostgreSQL connection pool and a compatibility adapter; Neon project mghal-portfolio-db is the database candidate indicated by the current production API routing and the repository's Node/Neon documentation.

The exact Render DATABASE_URL binding was not inspected. The Render workspace must be confirmed before the database connection target can be closed as VERIFIED.

## 2. Neon PostgreSQL

| Property | Verified value |
|---|---|
| Project name | mghal-portfolio-db |
| Project ID | billowing-snow-49569906 |
| PostgreSQL version | 17.11 |
| Region | aws-eu-central-1 |
| Database | mghal_portfolio |
| Schema | public |
| Default branch | main |
| Branch ID | br-morning-cherry-b9l25msz |
| Branch state | ready |
| Child snapshot branch | mghal-release-e2e-2026-11-10 |
| Child snapshot branch ID | br-damp-bonus-b9imwnqu |
| Connection-string exposure | None; no connection URL or password was read |

### Neon application tables observed

_mghal_migrations, achievements, admin_sessions, admin_user_roles, admin_users, analytics_events, article_categories, articles, audit_logs, certificates, comments, education, follower_identities, follower_identity_sessions, follower_tokens, followers, identity_profiles, media, oauth_transactions, permissions, project_technologies, projects, reactions, role_permissions, roles, site_settings, skills, technologies.

This is 28 application tables in the public schema.

### Read-only row counts on Neon main

| Table | Rows |
|---|---:|
| projects | 10 |
| certificates | 21 |
| education | 1 |
| identity_profiles | 2 |
| skills | 21 |
| followers | 317 |
| reactions | 14 |
| analytics_events | 775 |
| roles | 3 |
| permissions | 10 |
| role_permissions | 20 |
| admin_users | 1 |
| media | 0 |

These counts are aggregate snapshots and do not expose personal row values.

## 3. Cloudflare D1

| Property | Verified value |
|---|---|
| Database name | mghal-db |
| Database ID | 1e5682c3-6a68-4fe5-b2c5-01f9fbe1aabd |
| Cloudflare metadata version | production |
| Metadata table count | 25 |
| Metadata file size | 618,496 bytes |
| Region serving read-only query | APAC / SIN |
| Worker binding name | DB |
| Secret values | Not read |

The read-only sqlite_master listing includes the application tables plus the internal _cf_KV table. Application tables overlap substantially with Neon, but Neon additionally contains follower_identities, follower_identity_sessions and oauth_transactions in the inspected schema.

### Read-only row counts on D1

| Table | Rows |
|---|---:|
| projects | 10 |
| certificates | 21 |
| followers | 157 |
| reactions | 9 |
| analytics_events | 405 |
| skills | 21 |
| roles | 3 |
| admin_users | 0 |
| media | 0 |

The D1 and Neon counts are not equal. Counts for projects, certificates, and skills match in this sample, while followers, reactions, analytics events and admin_users do not. A matching count is not row-level parity.

## 4. Migration history comparison

Both databases returned the same five migration IDs and applied timestamps:

1. 0001_core_platform — 2026-10-31T21:46:33.154Z
2. 0002_admin_permissions — 2026-11-01T20:39:26.642Z
3. 0003_project_localization — 2026-11-01T21:07:58.299Z
4. 0004_d1_media_storage — 2026-11-04T22:43:33.573Z
5. 0005_technology_visibility — 2026-11-04T22:43:33.573Z

The migration ledger matching does not mean the schemas or data are identical. The PostgreSQL baseline is mghal-backend/postgres/0001_initial.sql and defines the _mghal_migrations ledger. The actual repository does not use Prisma's _prisma_migrations table for this application database.

## 5. Neon child branch snapshot

The child branch mghal-release-e2e-2026-11-10 is READY and descends from Neon main. Read-only counts on that branch:

| Table | Rows |
|---|---:|
| projects | 10 |
| certificates | 21 |
| followers | 256 |
| reactions | 13 |
| analytics_events | 654 |
| admin_users | 0 |

This is an older point-in-time snapshot compared with current Neon main. It may serve an isolated release-test purpose, but there is no evidence here of an automated backup schedule, backup retention policy, restore validation, or disaster-recovery drill. Do not label it a verified backup.

## 6. Application data flow

The Node server requires DATABASE_URL and creates a pg Pool. It passes a PgD1Database instance into the existing mghal-backend/worker.production.js request handler. The adapter translates selected SQLite/D1-style query conventions and runs batch operations through PostgreSQL transactions.

The current production Vercel environment has MGHAL_API_BASE configured to the Node API hostname. Therefore, the source-level and deployment-routing evidence points to Node/Neon as the current application data path. Render-side service settings are needed to prove the actual DATABASE_URL maps to project billowing-snow-49569906, branch br-morning-cherry-b9l25msz and database mghal_portfolio.

## 7. D1 and Worker role

Cloudflare Worker mghal-api is deployed with a DB binding, but its current deployed source is a forwarding proxy that reads NODE_API_ORIGIN and forwards HTTP requests. The inspected source did not access env.DB. D1 remains populated and must be preserved as a legacy/snapshot resource while the owner reviews retention and rollback requirements.

Do not delete the DB binding or database as part of recovery. Do not assume that the D1 copy is a complete backup; its aggregate counts are behind Neon.

## 8. Prisma status

**NOT IMPLEMENTED:** no prisma/schema.prisma was found on the operational branch; the root package.json does not include Prisma; the Node API package uses pg. The current migration format is the custom _mghal_migrations ledger plus SQL files.

Do not introduce Prisma as an architectural cleanup in Phase 1. First decide whether the current pg adapter should remain the only persistence abstraction. Adding Prisma without a migration and ownership plan would create competing data access and schema management paths.

## 9. Data safety and rollback plan

No write SQL, migration, export, restore, or database mutation was executed during this phase. Queries were SELECT-only. D1 query metadata reported rows_written=0, changes=0 and changed_db=false.

Before any later migration or cutover:
1. Confirm the Render service's actual DATABASE_URL target without printing the value.
2. Create a verified Neon backup/PITR point and an independently restorable export as appropriate.
3. Create a production-shaped isolated test branch.
4. Reconcile schemas, constraints, row counts, unique keys, foreign-key relationships and sensitive-data handling.
5. Verify media blobs/object storage separately; the sampled media table count is 0 on both databases, which does not prove external storage parity.
6. Run route-level auth, RBAC, CRUD, follower, reaction, comment and analytics tests against isolated data.
7. Exercise rollback against a tested prior deployment and a restorable database checkpoint.
8. Obtain explicit owner approval before any production write, migration, secret rotation, D1 removal, or connection switch.

## 10. Database decision

**Current source-of-truth candidate:** Neon PostgreSQL, pending Render DATABASE_URL confirmation.  
**Preserved legacy/snapshot system:** Cloudflare D1.  
**Backup status:** UNVERIFIED.  
**Data parity:** NOT VERIFIED; aggregate drift is observed.  
**Destructive changes:** prohibited without explicit owner approval.
