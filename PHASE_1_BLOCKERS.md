# M.GH.AL — Phase 1 Blockers and Unverified Items

**Inspection date:** 2026-11-10  
**Rule:** Blockers are recorded, not hidden or treated as completed.

## 1. BLOCKED — Render workspace confirmation

Render list_workspaces returned a single workspace named My Workspace. The Render connector requires explicit workspace selection before it can list services. Confirmation was requested from the project owner.

Until confirmed, the following are BLOCKED:
- Render service inventory and service IDs.
- Which service currently owns mghal-node-api-preview.onrender.com.
- Which service owns mghal-final-web.onrender.com.
- Repository/branch/commit on each service.
- Latest deployment IDs and deployment status.
- Render health-check path and health-check results.
- Environment variable names/targets and actual DATABASE_URL target.
- Render logs and current API runtime readiness.

No Render service or environment was modified.

## 2. PARTIALLY VERIFIED — Production API/database route

Verified:
- The official Vercel production alias uses deployment SHA 7de53f6 on feat/node-postgres-backend-2026-11-08.
- Vercel production target includes MGHAL_API_BASE.
- That variable's configured host is mghal-node-api-preview.onrender.com.
- Node API source requires DATABASE_URL and uses pg Pool plus PgD1Database.
- The current Cloudflare Worker forwards to NODE_API_ORIGIN.
- Neon mghal_portfolio contains production-shaped application data.

Blocked:
- Render runtime configuration has not been inspected, so the live DATABASE_URL mapping is not proven to point to the Neon project/branch/database inspected in this audit.
- Actual health and readiness endpoints were not independently confirmed through Render provider tools in this phase.

The hostname contains "preview" even though MGHAL_API_BASE is a Vercel production-target variable. Verify service ownership and intent before changing it.

## 3. VERIFIED — D1/Neon data drift

Aggregate counts differ:
- followers: Neon 317, D1 157.
- reactions: Neon 14, D1 9.
- analytics_events: Neon 775, D1 405.
- admin_users: Neon 1, D1 0.
- projects, certificates and skills match in the sampled counts.

Neon additionally contains follower identity/session and OAuth transaction tables absent from the inspected D1 table listing. Migration ledgers match through 0005, but data and schema parity do not.

No backup restore or row-level reconciliation was run. Neither database should be deleted, truncated or reset.

## 4. UNVERIFIED — Backup/restore

The Neon child branch mghal-release-e2e-2026-11-10 exists, but it is an older snapshot and not proof of an automated backup or a successful restore. D1 is populated but its counts differ from Neon. No backup schedule, retention policy, export checksum or restore drill was confirmed.

## 5. VERIFIED — Branch divergence and merge safety

- main: fdfea351455227f44e7f92e82166bfa7bdc5e1fe.
- Current Vercel operational revision: 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.
- Node branch vs main: 355 ahead, 45 behind, 280 changed files.
- PR #25 remains OPEN/Draft, with base fix/social-admin-mobile-ux-2026-11-07.
- The current Vercel production alias is not attached to main.

Do not merge PR #25 wholesale into main or rewrite history. Use the current operational branch as recovery anchor pending deliberate mainline reconciliation.

## 6. BLOCKED — Public image publication approval

PR #29 contains 12 images and a public /photos page. The PR description notes an image featuring another person. That image and any other third-party likeness must not be made public without the required consent/owner approval. The PR remains open and unmerged.

## 7. NOT VERIFIED — Browser/device feature acceptance

Still requires real test sessions:
- Arabic RTL and English LTR on desktop/mobile.
- Hydration and engagement after refresh and client navigation.
- Follow/unfollow, likes, reactions and comments.
- Admin owner bootstrap, authentication and complete RBAC.
- CRUD across all admin resources.
- Media upload/download.
- AI workflows and bounded permissions.
- Keyboard/focus/accessibility and reduced-motion behavior.
- Real-device swipe/navigation and browser edge gestures.
- Performance and load tests.

## 8. NOT IMPLEMENTED — Prisma

No Prisma schema or runtime dependency was found on the operational branch. The actual backend uses pg and the custom compatibility adapter. Do not state that Prisma is implemented or add it without an explicit architecture decision.

## 9. No production changes made

No production database write, destructive SQL, migration, secret read/rotation, DNS/canonical change, Git history rewrite, PR merge or manual production deployment was performed in Phase 1.
