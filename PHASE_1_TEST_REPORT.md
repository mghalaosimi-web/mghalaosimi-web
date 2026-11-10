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
