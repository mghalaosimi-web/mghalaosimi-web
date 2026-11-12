# Historical application migration lineage

This directory retains the original migration identifiers for traceability and for understanding the evolution of the application schema.

**These files are not a deployment mechanism and do not connect to, recreate, or require Cloudflare D1.** The old migration name `0004_d1_media_storage.sql` is historical metadata only. The live application runs against Neon PostgreSQL.

Current PostgreSQL production migration artifacts are in `mghal-backend/postgres/`:

- `0001_initial.sql` — PostgreSQL baseline for isolated schema setup; do not replay against the populated production database.
- `0006_google_follower_identity.sql` — additive, idempotent PostgreSQL migration that reconciles the already-existing Google follower identity tables and migration ledger.

Before any production migration:
1. Inspect the exact Neon schema and current migration ledger.
2. Apply and verify the migration on a temporary Neon branch.
3. Confirm that no existing rows are changed or deleted.
4. Apply only the reviewed additive migration to Production.
5. Verify schema, indexes, constraints, and ledger afterward.

Never provision an owner password through SQL. Existing owner bootstrap and session security remain in the API contract. No D1 or SQLite database is a production fallback.
