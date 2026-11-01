# D1 migrations

`0001_core_platform` is already applied to live D1 (verified 2026-10-31). Do not replay it.

`0002_admin_permissions.sql` adds three granular RBAC permissions and assigns them to the existing owner/editor/analyst roles. It is additive and idempotent. Apply only when promoting the new Worker release, then verify role mappings with a read-only query.

Do not provision an owner password in SQL. The first owner is created through the one-time bootstrap API after the release is deployed. The bootstrap secret is stored only as a SHA-256 hash in `site_settings` and is consumed on successful setup.

R2 media uploads require account-level R2 activation and an existing bucket bound as `MEDIA_BUCKET`. The Cloudflare API currently reports R2 is not enabled for this account; no bucket or paid resource has been created. Until enabled, the API returns `503 MEDIA_STORAGE_NOT_CONFIGURED` and existing media URLs remain unaffected.
