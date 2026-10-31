# Verified live D1 schema — 2026-11-01
Tables: _mghal_migrations, admin_users, roles, permissions, admin_user_roles, role_permissions, admin_sessions, identity_profiles, education, skills, technologies, projects, project_technologies, certificates, achievements, article_categories, articles, media, followers, follower_tokens, comments, reactions, analytics_events, audit_logs, site_settings.

Custom indexes: idx_projects_published_sort, idx_certificates_published_sort, idx_articles_status_publish, idx_followers_status_created, idx_follower_tokens_lookup, idx_sessions_user_expiry, idx_analytics_created, idx_analytics_target, idx_audit_created. Exact column constraints remain in live sqlite_master; this API uses verified column names only. No schema mutation introduced.
