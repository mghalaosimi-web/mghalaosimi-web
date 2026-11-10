# M.GH.AL — Phase 1 Recovery Report

**Inspection date:** 2026-11-10 (Asia/Aden)  
**Repository:** https://github.com/mghalaosimi-web/mghalaosimi-web  
**Recovery branch:** recovery/phase1-history-architecture-2026-11-10  
**Recovery base:** feat/node-postgres-backend-2026-11-08 at 7de53f6becabee1dfaab4fa328d3cb9131ecebcf  
**Scope:** M.GH.AL only. No unrelated repository was accessed.

## 1. Executive summary

Phase 1 established the currently deployed source revision, reconstructed the relevant Git/PR lineage, inspected the available Vercel/Cloudflare/Neon configuration, and created seven evidence-based reports on an isolated recovery branch.

The central finding is that the GitHub default branch and the currently deployed Vercel production alias do not point to the same revision. GitHub main is at fdfea351455227f44e7f92e82166bfa7bdc5e1fe. The official Vercel hostname mghalaosimi-web.vercel.app is aliased to a READY deployment built from feat/node-postgres-backend-2026-11-08 at 7de53f6becabee1dfaab4fa328d3cb9131ecebcf. This branch is therefore the verified operational recovery anchor for Phase 1 documentation, not proof that it is safe to merge into main.

The application source shows a Next.js API proxy to a Render Node API. The production Vercel environment contains MGHAL_API_BASE and its configured host is mghal-node-api-preview.onrender.com. The Node API source creates a PostgreSQL pool from DATABASE_URL and adapts the existing worker handler through PgD1Database. The deployed Cloudflare Worker is also a proxy to NODE_API_ORIGIN; its settings still contain a D1 binding named DB, but the downloaded active Worker source does not contain D1 access or business-route handling. The D1 database remains populated and must not be deleted.

Neon has a live PostgreSQL 17.11 database with 28 application tables. Its current aggregate counts differ materially from the D1 copy. This supports Neon as the current application-data candidate, but the Render service configuration and its actual DATABASE_URL target were not independently inspected because Render requires owner confirmation of the workspace. Consequently, the exact production database connection is PARTIALLY VERIFIED, not fully closed.

No Prisma schema, Prisma runtime dependency, Render YAML, or Vercel JSON configuration is present on the inspected Node branch. The actual backend implementation uses pg and a PostgreSQL compatibility adapter; Prisma is NOT IMPLEMENTED in this repository state.

## 2. Status legend

- **VERIFIED:** directly confirmed from repository metadata, source, deployment metadata, provider configuration, or read-only database queries.
- **IMPLEMENTED:** created in this recovery branch and confirmed by GitHub.
- **PARTIALLY IMPLEMENTED:** source or configuration exists, but runtime or end-to-end proof is incomplete.
- **NOT IMPLEMENTED:** no implementation was found in the scoped repository.
- **BLOCKED:** requires owner confirmation or provider access that is not currently authorized.
- **UNVERIFIED:** evidence is insufficient to make a reliable claim.

## 3. Verified repository and deployment state

| Item | Status | Evidence |
|---|---|---|
| Official repository | VERIFIED | mghalaosimi-web/mghalaosimi-web |
| GitHub default branch | VERIFIED | main at fdfea351455227f44e7f92e82166bfa7bdc5e1fe |
| Branch inventory | VERIFIED | Baseline snapshot returned 36 pre-recovery branches; the recovery branch was then created and verified (37 total at handoff) |
| PR inventory | VERIFIED | Baseline snapshot returned 30 pre-recovery PRs; recovery PR #31 was then opened and verified (31 total at handoff) |
| Standalone issues | VERIFIED | No non-PR issues returned by the repository issues endpoint |
| Tags and releases | VERIFIED | No matching tag refs and no GitHub releases returned |
| Current operational Vercel revision | VERIFIED | Deployment dpl_4yAphXBXu4wHVqvzvpBpSp6AkSZJ, READY, target production, branch feat/node-postgres-backend-2026-11-08, SHA 7de53f6... |
| Official Vercel hostname | VERIFIED | mghalaosimi-web.vercel.app is an alias of that deployment and is a verified production domain |
| Vercel production API variable | VERIFIED | MGHAL_API_BASE is present for the production target; its configured host is mghal-node-api-preview.onrender.com |
| Render Node service identity and settings | BLOCKED | Workspace confirmation is required before reading Render services or environment metadata |
| Exact Render DATABASE_URL target | BLOCKED | No database connection string was read or exposed; service configuration awaits workspace confirmation |

## 4. PR #25, #29 and #30

### PR #25 — Node.js + Neon backend foundation

**Status:** OPEN, Draft; 209 commits; 79 changed files; 5,293 additions and 1,121 deletions.  
**Head:** feat/node-postgres-backend-2026-11-08 at 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.  
**Base:** fix/social-admin-mobile-ux-2026-11-07 at 39d48c688bb475225da42995d78cad177a60102b.

The PR's actual base is not main. The current head is 209 commits ahead and 0 behind that recorded base. Compared with main, the Node branch is 355 commits ahead and 45 behind, with a common ancestor at d7378bffeb55ca957829995fb4fee8355181d792 and 280 changed files. Do not merge this PR directly into main.

The PR introduces a Node HTTP API, PostgreSQL-backed D1 compatibility adapter, PostgreSQL schema and snapshot, Next.js routing/UI parity work, and SQL compatibility tests. Current-head GitHub Actions for SHA 7de53f6 report success for Backend CI, Node API CI and Next.js quality. Vercel status contexts for the same SHA report success. These checks do not substitute for a live Render configuration review or browser-based acceptance.

### PR #29 — Profile photos and image SEO

**Status:** OPEN, not Draft; 8 commits; 19 changed files; 232 additions and 8 deletions.  
**Head:** feat/profile-photo-seo-2026-11-09 at 39d9b5981a1ffdf52d3f256d39eb170da256d92f.  
**Recorded base:** feat/node-postgres-backend-2026-11-08 at 648d236c689c72d8f11c0c8059da4b85d4bac75f.

Current comparison against the deployed Node branch shows 8 commits ahead and 1 behind, so the branch must be re-evaluated against the current production anchor before integration. Its changes add a 12-image public gallery, /photos, image metadata and image sitemap entries. Its Next.js quality workflow and the Vercel status contexts on the PR head report success. The branch is not present in the current production deployment. Public release of images containing another person remains subject to explicit publication consent.

### PR #30 — Hydration and engagement fixes

**Status:** CLOSED and MERGED on 2026-11-09T23:30:07Z into feat/node-postgres-backend-2026-11-08, not into main.  
**Head:** fix/mghal-hydration-engagement-2026-11-09 at cadfebf1f14b401307eba2e74dcffb90b2f33de2.  
**Merge/result revision:** 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.

The seven changed files include SiteExperience.tsx, global styles/layout, engagement script, a hydration test and release-gate documentation. The merged result is the same SHA currently deployed to the official Vercel production alias. GitHub Next.js quality and Vercel status contexts for the PR head reported success. Real-device and full browser interaction QA remain unverified.

## 5. Current architecture and data source

The source-level request flow is:

Visitor → Vercel Next.js → app/api/[...path]/route.ts → MGHAL_API_BASE → Render Node API → shared worker.production.js handler → PgD1Database adapter → pg connection pool → Neon PostgreSQL.

The configured production API host has the word preview in its hostname. This is a configuration/operational warning that requires Render-side confirmation; it was not changed.

Cloudflare Worker mghal-api currently acts as a thin proxy to NODE_API_ORIGIN. Its live settings still include the D1 binding DB. The active Worker source inspection found the upstream-origin forwarding path and did not find env.DB access or business-route implementation. The D1 binding is therefore retained configuration, not evidence that the current Worker code uses D1 for application reads and writes.

Neon project mghal-portfolio-db (project ID billowing-snow-49569906), database mghal_portfolio, main branch br-morning-cherry-b9l25msz, is PostgreSQL 17.11 and has 28 public application tables. The Node runtime source requires DATABASE_URL and uses pg; this repository does not implement Prisma.

## 6. Database evidence and drift

Read-only counts on the Neon main branch at inspection time:

| Table | Neon |
|---|---:|
| projects | 10 |
| certificates | 21 |
| followers | 317 |
| reactions | 14 |
| analytics_events | 775 |
| skills | 21 |
| education | 1 |
| identity_profiles | 2 |
| admin_users | 1 |
| media | 0 |
| roles | 3 |
| permissions | 10 |
| role_permissions | 20 |

Read-only counts on Cloudflare D1 mghal-db:

| Table | D1 |
|---|---:|
| projects | 10 |
| certificates | 21 |
| followers | 157 |
| reactions | 9 |
| analytics_events | 405 |
| skills | 21 |
| admin_users | 0 |
| media | 0 |
| roles | 3 |

Both databases report the same five migration IDs through 0005_technology_visibility. Their schema and row content are not at parity: Neon has follower identity/session and OAuth transaction tables that are absent from the inspected D1 schema, and key row counts differ. This is not proof of row-level parity or a tested backup.

A Neon child branch named mghal-release-e2e-2026-11-10 exists and is READY. Its counts are an older snapshot (10 projects, 21 certificates, 256 followers, 13 reactions, 654 analytics events, 0 admin users). Its existence does not prove backup restoration or a production recovery procedure.

**Decision:** treat Neon as the current production data-source candidate based on the production Vercel API route, Node API source and Neon-backed application code. Mark the exact live Render DATABASE_URL mapping as BLOCKED until the Render workspace is confirmed. Treat D1 as preserved legacy/snapshot infrastructure with unverified backup value. Do not delete, truncate, migrate or overwrite either database.

## 7. Changes implemented in this phase

**IMPLEMENTED:** created these seven reports on the dedicated branch, then opened [Draft PR #31](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/31) for review. At handoff the repository contains the 37 baseline branches plus the recovery branch (37 total) and 31 PRs total.

The PR #31 head is `09b1c546ca0c11168cc36fbd5ecb61e8fbdbbc46`; its base is the operational Vercel commit `7de53f6becabee1dfaab4fa328d3cb9131ecebcf`. The PR has one documentation-only commit and seven changed files. Its Vercel status contexts were still PENDING at the last check; no matching preview deployment was confirmed in the latest deployment-list query. Do not claim preview readiness.
- RECOVERY_REPORT.md
- ARCHITECTURE_AUDIT.md
- BRANCH_AND_PR_INVENTORY.md
- DATABASE_ARCHITECTURE.md
- PROJECT_RECOVERY_PLAN.md
- PHASE_1_TEST_REPORT.md
- PHASE_1_BLOCKERS.md

No application source, production runtime configuration, domain, DNS record, secret, environment value or database row was changed. No production merge or manual production deployment was initiated. Automatic preview checks were left to the PR integration and are not production promotions.

## 8. Test and validation summary

**VERIFIED existing CI on the current operational commit 7de53f6:**
- Backend CI run 42720962712 — completed, success.
- Node API CI run 42720962914 — completed, success.
- Next.js quality run 42720962997 — completed, success.
- Vercel contexts for mghalaosimi-web, mghal and mghal-next-validation — success.

PR #29 head 39d9b598: Next.js quality run 42686390823 succeeded; three Vercel contexts succeeded. PR #30 head cadfebf1: Next.js quality run 42713433428 succeeded; Vercel contexts succeeded.

Read-only Neon and D1 SELECT queries completed. D1 response metadata confirmed zero rows written and changed_db=false. No local dependency installation or new application tests were run as part of this documentation-only recovery commit. Browser, authenticated CRUD, media and mobile device QA are not claimed.

## 9. Outstanding blockers

1. Render workspace approval is required to inspect service IDs, deploy revisions, health-check settings, environment variable names/targets and runtime logs. The only workspace returned was My Workspace.
2. The exact DATABASE_URL project/branch on the Render Node API service is not verified.
3. D1 and Neon counts differ; backup and rollback integrity are not proven.
4. Main and the current Vercel production revision are divergent; no merge-to-main plan has been executed.
5. PR #29 requires a current-base re-evaluation and explicit approval for public images featuring another person.
6. Real browser/device QA of Arabic RTL, English LTR, hydration, social interactions, authentication, RBAC and admin CRUD remains outstanding.

See PHASE_1_BLOCKERS.md for the full blocker register.

## 10. Phase 1 decision

**PARTIALLY IMPLEMENTED / REVIEW REQUIRED.** Repository history, deployment anchor, active code flow, provider metadata and read-only database snapshots were inventoried. Seven reports are committed to an isolated recovery branch. Render-side runtime verification and full release acceptance are blocked. Phase 2 has NOT been started.

Owner review is required before any merge, release, deployment, data movement, secret change or additional implementation phase.
