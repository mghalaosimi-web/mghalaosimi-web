# M.GH.AL — Phase 1 Test Report

**Inspection date:** 2026-11-10  
**Recovery branch scope:** Documentation and read-only verification.

## 1. Test summary

| Area | Status | Evidence |
|---|---|---|
| Repository/branch/PR metadata | VERIFIED | GitHub API; baseline 36 branches/30 PRs; handoff 37 branches/31 PRs including recovery branch and PR #31 |
| Commit history pagination | VERIFIED | main 132 commits; operational Node branch 442 commits |
| Vercel deployment | VERIFIED | Production-target deployment READY at SHA 7de53f6 |
| Vercel API environment metadata | VERIFIED | Production target has MGHAL_API_BASE; hostname retained only |
| Cloudflare Worker current source/settings | VERIFIED | mghal-api forwards to NODE_API_ORIGIN; DB binding retained |
| D1 row-count queries | VERIFIED, read-only | D1 query metadata rows_written=0, changes=0, changed_db=false |
| Neon row-count queries | VERIFIED, read-only | PostgreSQL SELECT-only queries |
| Render service metadata/health | BLOCKED | Awaiting workspace confirmation |
| Local dependency install/build | NOT RUN | No local clone or environment was used in this documentation-only phase |
| Browser/mobile E2E | NOT RUN | No browser/device session was executed in this phase |
| Live admin CRUD/auth/RBAC | NOT RUN | Requires isolated service/test credentials and authenticated QA |
| Database parity/backup restore | NOT VERIFIED | Aggregate drift observed; no restore test performed |

## 2. Existing CI on the current operational deployment commit

Commit: 7de53f6becabee1dfaab4fa328d3cb9131ecebcf  
Branch: feat/node-postgres-backend-2026-11-08

| Workflow | GitHub Actions run | Result |
|---|---:|---|
| M.GH.AL Backend CI | 42720962712 | SUCCESS |
| M.GH.AL Node API CI | 42720962914 | SUCCESS |
| M.GH.AL Next.js quality checks | 42720962997 | SUCCESS |

The combined commit status also returned SUCCESS for Vercel projects mghalaosimi-web, mghal and mghal-next-validation. This confirms the recorded deployment/check status for that commit, not a new test run initiated by this recovery branch.

## 3. PR-specific checks

### PR #25 — current head 7de53f6

- Backend CI: SUCCESS.
- Node API CI: SUCCESS.
- Next.js quality: SUCCESS.
- Vercel status contexts: SUCCESS.
- PR state remains OPEN/Draft; checks passing do not mean merge approval.

### PR #29 — head 39d9b5981a1ffdf52d3f256d39eb170da256d92f

- Next.js quality run 42686390823: SUCCESS.
- Vercel status contexts: SUCCESS.
- PR state remains OPEN/not merged.
- Image publication approval and current-base re-evaluation remain outstanding.

### PR #30 — head cadfebf1f14b401307eba2e74dcffb90b2f33de2

- Next.js quality run 42713433428: SUCCESS.
- Vercel status contexts: SUCCESS.
- PR is CLOSED/MERGED into the operational Node branch.
- Its merge/result SHA 7de53f6 is the current Vercel production-target deployment revision.

### PR #31 — recovery reports

- PR #31 is OPEN and Draft, with one commit and seven documentation files.
- Its base is the operational Node branch at 7de53f6; its head is 09b1c546ca0c11168cc36fbd5ecb61e8fbdbbc46.
- At the last status poll, all three Vercel status contexts were PENDING. The latest deployment-list query did not return a matching deployment for this head. GitHub Actions returned no workflow run for the recovery head at that poll. Do not treat these checks as passed; re-check the exact PR head before review/merge.
- No PR #31 production deployment or promotion was performed.

## 4. Database read-only checks

### Neon

Queries were SELECT-only. They confirmed PostgreSQL 17.11, database mghal_portfolio, public schema, 28 application tables, five migration ledger rows and aggregate row counts recorded in DATABASE_ARCHITECTURE.md.

### Cloudflare D1

Queries were SELECT-only. The D1 API reported:
- rows_written = 0
- changes = 0
- changed_db = false

D1 and Neon have matching five migration identifiers but different schema/table sets and different aggregate counts. No parity assertion was made.

### Neon child branch

The mghal-release-e2e-2026-11-10 branch is READY and has older row counts than Neon main. No restore, migration or write was attempted.

## 5. CI workflow coverage observed in source

The Node branch contains three workflows:
- .github/workflows/mghal-backend.yml — installs backend dependencies, audits production dependencies and runs backend check script.
- .github/workflows/mghal-node-api.yml — installs Node API dependencies, audits production dependencies, runs API check script and syntax-checks the worker handler.
- .github/workflows/mghal-next-quality.yml — installs root dependencies, runs credential/profile/design/PWA/API-proxy/security/structured-data/SEO/sitemap/project-page/navigation/search checks, lint, TypeScript typecheck and production build.

The workflow definitions were inspected. The run results reported above are from GitHub's current commit workflow metadata.

## 6. Not tested in Phase 1

The following are explicitly NOT VERIFIED:
- Physical Android/mobile browser gesture behavior.
- Full desktop browser smoke tests and console errors.
- Hydration behavior on every route and browser.
- Real public visitor follow/unfollow, likes, comments and retry/idempotency.
- Admin owner bootstrap, login/logout, session expiry and RBAC matrix.
- Every CRUD write path and audit log.
- Media upload/download and storage provider behavior.
- AI API integration, safety boundaries and rate limits.
- Render /health, /live and /ready from provider-side runtime.
- Production load, latency and failover.
- Database backup restoration, row-level parity and rollback.

## 7. Recovery commit checks

The recovery branch contains documentation files only. It does not add runtime code. The branch's Draft PR is the mechanism for running the Next.js pull-request CI against the reviewed documentation commit. No test should be marked passed until GitHub reports the actual result for that exact new head SHA.


## Final verification status matrix — 2026-11-11

| Check | Result | Evidence / limitation |
|---|---|---|
| PR #31 GitHub Actions | PASS | Run #548 SUCCESS on exact current head |
| PR #31 Vercel contexts | PASS | All three contexts SUCCESS |
| Vercel production deployment | PASS | Official alias READY on 7de53f6becabee1dfaab4fa328d3cb9131ecebcf |
| Vercel MGHAL_API_BASE | PASS | Production variable exists; host mghal-node-api-preview.onrender.com |
| Render service ownership/deploy/health | BLOCKED | Workspace confirmation required |
| Render DATABASE_URL target | BLOCKED | Service environment not inspected |
| Neon/D1 sampled counts and migrations | PASS | SELECT-only; material drift observed |
| D1 schema parity | FAIL | Three Neon application tables absent in D1 |
| Backup/restore drill | NOT RUN | No isolated restore test |
| PR #29 CI/Vercel contexts | PASS | Run #537 and all three contexts SUCCESS |
| PR #29 image consent | BLOCKED | No rights/consent evidence for all assets |
| English /en/photos | FAIL | No English gallery route in inspected implementation |
| Browser/device E2E | NOT RUN | No browser session executed |
| Full auth/RBAC/CRUD/AI | NOT RUN | No authenticated isolated E2E executed |
| Load/pressure/failover | NOT RUN | No load test executed |


## Final verification addendum — 2026-11-11

- PR #31 head 1d60838d537f3181bded9d148ca0b066881ec583: GitHub Actions run #548 SUCCESS; all three Vercel contexts SUCCESS. These checks do not constitute browser, load, CRUD, or restoration tests.
- Official Vercel alias mghalaosimi-web.vercel.app is READY on feat/node-postgres-backend-2026-11-08 at 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.
- Vercel production variable MGHAL_API_BASE exists and points to https://mghal-node-api-preview.onrender.com. Render service ownership, deployment commit, health/readiness, and DATABASE_URL mapping remain BLOCKED pending owner confirmation of My Workspace. No secret value was read.
- Git divergence: main vs Node branch 355 ahead / 45 behind; recovery vs Node branch 2 ahead / 0 behind. PR #25 OPEN/Draft; PR #29 OPEN/not merged; PR #30 CLOSED/MERGED; PR #31 OPEN/Draft.
- PR #29 head 39d9b5981a1ffdf52d3f256d39eb170da256d92f is 8 ahead / 1 behind Node. Its changed-file inventory contains 12 gallery image assets; photos page references 12 paths, canonical /photos, Open Graph and ImageGallery JSON-LD. Sitemap includes /photos and image entries. Page is Arabic RTL only; no English /en/photos or explicit locale alternate metadata was found. CI run #537 and all three Vercel contexts SUCCESS. Rights/consent evidence is unavailable; publication remains BLOCKED, especially the photo with another person.
- Read-only Neon counts: projects 10, certificates 21, followers 317, reactions 14, analytics_events 775, skills 21, roles 3, admin_users 1, media 0. D1 counts: projects 10, certificates 21, followers 157, reactions 9, analytics_events 405, skills 21, roles 3, admin_users 0, media 0. Both migration ledgers contain five rows. D1 lacks Neon tables follower_identities, follower_identity_sessions, oauth_transactions.
- Cloudflare D1 mghal-db remains populated. Inspected mghal-api Worker source forwards to the Node API hostname and does not access env.DB. D1 is a populated legacy/rollback resource, not a verified active application database or backup. No isolated restore test or verified restore procedure exists.
- Render runtime verification: BLOCKED. D1 restoration: NOT RUN / NOT VERIFIED. Image publication approval: BLOCKED. Browser/device E2E, full CRUD/auth/RBAC, AI E2E, load/pressure, failover and restoration tests: NOT RUN.

No production code, runtime configuration, secret, DNS, deployment, or production database rows were changed. Phase 2 remains unauthorized.
