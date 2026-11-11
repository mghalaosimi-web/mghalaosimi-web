# Verified live D1 schema — 2026-11-01

> **Historical snapshot only:** M.GH.AL's Cloudflare D1 database was deleted on 2026-11-11 by the owner's decision. The schema below records the former database and is retained for audit history only. Do not treat it as a live schema, recreate the database, or run these migrations. Current database target and status are documented in [`../../PHASE_1_LATEST_RECONCILIATION.md`](../../PHASE_1_LATEST_RECONCILIATION.md).

Tables: _mghal_migrations, admin_users, roles, permissions, admin_user_roles, role_permissions, admin_sessions, identity_profiles, education, skills, technologies, projects, project_technologies, certificates, achievements, article_categories, articles, media, followers, follower_tokens, comments, reactions, analytics_events, audit_logs, site_settings.

Custom indexes: idx_projects_published_sort, idx_certificates_published_sort, idx_articles_status_publish, idx_followers_status_created, idx_follower_tokens_lookup, idx_sessions_user_expiry, idx_analytics_created, idx_analytics_target, idx_audit_created. Exact column constraints remain in live sqlite_master; this API uses verified column names only. No schema mutation introduced.

Pending migration 0004_d1_media_storage.sql adds nullable media.blob_data BLOB for the no-additional-service media path. It is not applied to production by this change.
