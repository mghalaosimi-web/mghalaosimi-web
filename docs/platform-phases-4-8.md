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

### Verified on 2026-11-03

- Current feature branch: `feat/mghal-complete-platform-2026-11-01`.
- Current verified source commit before this documentation update: `28a86d0388f2ad164dc59d67944efd32ac384299`.
- Both connected Vercel projects (`mghalaosimi-web` and `mghal`) have a `READY` Preview deployment for that exact commit. The deployments remain Preview and are not assigned to the public production domains.
- GitHub Backend CI for that commit completed successfully: strict TypeScript, ESLint, Vitest, Wrangler dry-run and production Worker syntax checks.
- The full static quality suite was previously reported passing: 94 HTML documents, 42 public SEO pages/sitemap URLs, 10 projects with 20 bilingual detail routes, 21 credentials per language, plus PWA, accessibility, design and admin checks. The latest Vercel Preview builds also completed successfully.
- Existing Cloudflare Worker `mghal-api` and D1 database `mghal-db` were updated on 2026-11-02; migration `0002_admin_permissions` and `0003_project_localization` are reported as applied. The existing D1 binding was retained.
- The owner account has not yet been bootstrapped. The first owner must complete the one-time bootstrap through `/admin/` using the privately stored bootstrap token; no token or default password is embedded in the repository.
- Cloudflare R2 remains unavailable for this account (error 10042). Media UI/API is implemented but uploads remain disabled until the account owner enables R2 and configures the binding.
- The two schedule-system records remain separate. Their repository evidence and the M.GH.AL project registry contain an unresolved institutional-attribution conflict for one record; this is documented rather than silently inventing a resolution.

### Release boundary

- PR #8 remains open and unmerged; `main` is unchanged.
- The public Vercel production domains have not been promoted to this release.
- Render remains unchanged.
- No production D1 data correction beyond the already reported migrations is authorized by this verification note.
- Final public release requires explicit approval to merge PR #8 and promote the tested release. Owner bootstrap and R2 enablement are separate account-owner actions.

### Reverification commands

From the repository root:

```bash
npm ci
npm run quality
cd mghal-backend
npm ci
npm run check
```
