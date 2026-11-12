# Preview API isolation — 2026-11-07

## Verified before the change

- The Next.js API route hard-coded `https://mghal-api.m-gh-alaosimi.workers.dev` for every hostname.
- A read-only GET to `https://mghal-next-preview.onrender.com/api/health` returned `{"status":"ok","database":"connected"}`.
- A read-only GET to `/api/public/followers/count` returned `{"count":3}`.
- The repository's Worker configuration identifies the upstream as `mghal-api` backed by the `mghal-db` D1 binding. Until a separate preview Worker/database is verified, preview requests must be treated as production-backed.
- No POST, PATCH, DELETE, OAuth callback, bootstrap, migration, or other state-changing request was sent during this inspection.

## Change

- Only exact approved production website hostnames may use the existing production Worker default.
- Any other hostname, including Render/Vercel preview hosts and localhost, returns `503 PREVIEW_API_NOT_CONFIGURED` unless `MGHAL_PREVIEW_API_BASE` points to a separate HTTPS Worker origin.
- A preview configuration that points back to the known production Worker hostname is rejected.
- `MGHAL_API_BASE` is not used to configure previews.
- The Next.js proxy forwards `X-Visitor-Token` for reaction-state reads; the token is no longer placed in the new client's query string.
- Browser session storage access in the admin client is guarded so restricted storage does not crash the login UI.

## Operational boundary

No Render environment variable, Cloudflare secret, OAuth credential, D1 schema, database row, DNS record, or production deployment was changed. The preview will intentionally show API-unavailable states until a separate preview Worker and separate D1 database are configured. This run does not claim live Like/Follow or admin writes are working on the Render preview.
