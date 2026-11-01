# M.GH.AL platform completion — phases 4–8

## Phase 4 — Admin console

Static, noindex console at `/admin/` with responsive Navy/White/Gray/Champagne-Gold design. It includes owner bootstrap/login, dashboard, bilingual identity, project/certificate/article/skill/technology/education/achievement CRUD, follower status controls, comment moderation, analytics, media library and user-role management. Admin UI never embeds credentials; it stores a short-lived bearer token in sessionStorage and the API stores only hashed session tokens.

## Phase 5 — Security and RBAC

- One-time first-owner bootstrap only while `admin_users` is empty.
- Bootstrap secret is checked by SHA-256 and consumed on successful creation.
- Passwords use PBKDF2-SHA256 with 210,000 iterations and per-user random salts.
- Sessions are random 256-bit bearer tokens; only SHA-256 hashes are stored; default lifetime is eight hours.
- Role/permission checks gate content read/write/delete, user management, analytics, follower management and comment moderation.
- The last active owner cannot be disabled; owners cannot change their own status.
- CORS permits the official Vercel site, configured Render site, and only Vercel preview hosts matching the project's deployment suffix.
- Rate limiting, input allow-lists, audit records and safe response headers remain enabled.

## Phase 6 — Media storage

The upload/list/serve API and media UI are implemented for an optional R2 binding (`MEDIA_BUCKET`), with MIME allow-list and 8 MB upload limit. The Cloudflare account currently returns error 10042: R2 must first be enabled from the Cloudflare Dashboard. No bucket was created and no storage charge was initiated. The UI/API reports this as an explicit not-configured state until the account owner enables R2 and binds the bucket.

## Phase 7 — Verified content

The existing D1 content seed contains 10 projects, 21 certificates, 2 identity profiles, 1 education record and 21 skill records. The admin console can maintain these resources. Articles are managed as drafts/scheduled/published/archived; only published articles with a publication timestamp appear in the public API and bilingual knowledge feed. Existing QR/badge proof mappings are not guessed.

## Phase 8 — Preview and release verification

- `npm run quality` validates the static Vercel output, 88+ HTML files, 42 SEO URLs, 10 projects / 20 bilingual detail routes, 21 certificates per language, PWA, accessibility and admin feature contract.
- `cd mghal-backend && npm ci && npm run check` validates strict TypeScript, lint, unit tests, Wrangler dry-run of the Worker production entrypoint and syntax.
- Vercel preview is the target for integration verification. Do not promote aliases or deploy to Render until the user authorizes the final Render preview step.
- Production D1 migration `0002_admin_permissions.sql` must be applied together with the new Worker release; it is additive and idempotent. The first owner is provisioned only through the one-time bootstrap endpoint after the release is live.
