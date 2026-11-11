# M.GH.AL — Project Recovery Plan

**Phase:** 1 of 5  
**Status:** Current-state recovery report committed; Phase 2 not started.

## 1. Recovery anchor

- Operational Vercel deployment SHA: 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.
- Operational branch: feat/node-postgres-backend-2026-11-08.
- GitHub default branch main: fdfea351455227f44e7f92e82166bfa7bdc5e1fe.
- Official Vercel alias mghalaosimi-web.vercel.app is attached to the operational Node branch deployment.
- Recovery branch: recovery/phase1-history-architecture-2026-11-10, created from the operational SHA.

The recovery branch is a documentation-only review line. It is not a production release branch and must not be merged automatically.

## 2. Phase 1 completed activities

- Read repository metadata, all 36 current branch refs, all 30 pull requests, commit history for main and the operational Node branch, tags and releases.
- Recalculated current branch divergence rather than relying on old PR body counts.
- Examined PR #25, PR #29 and PR #30 ancestry, changed files, status and CI records.
- Verified the primary Vercel production alias and its deployed Git SHA.
- Inspected Vercel production API variable metadata without exposing its value; only the upstream hostname was retained in the reports.
- Inspected the current deployed Cloudflare Worker configuration/source and D1 database metadata.
- Inspected Neon project/branch/table metadata and performed SELECT-only aggregate counts on Neon and D1.
- Created seven reports on an isolated recovery branch.
- No production code, runtime configuration, secret, database row, domain, DNS record or default branch was modified.

## 3. Integration strategy

Do not merge the Node/Neon feature branch wholesale into main. It is 355 commits ahead and 45 behind main across 280 changed files. It is, however, the branch currently represented by the Vercel production alias. Use it as the operational anchor for reviewing the current release line until a separate mainline reconciliation is approved.

Preserve:
- PR #25 as the Node/Neon foundation and operational code line.
- PR #30 as already merged work; do not cherry-pick its hydration/engagement fixes again.
- PR #29 as a separate unmerged image/SEO contribution; rebase/recompare it against the current 7de53f6 operational anchor before any merge.
- PR #26 as a previous Phase 1 audit. It remains separate and is not overwritten by this recovery.
- All existing branches, tags/releases state, historical files and deployment resources.

The new recovery PR must remain Draft until the owner reviews the evidence and Render runtime verification is complete.

## 4. Required future gates — not started in Phase 1

### Gate A — Render runtime verification

After owner confirms the Render workspace:
- Identify exact frontend and Node API service IDs.
- Check service type, repository, branch, latest deployment commit and service health state.
- Confirm the service backing mghal-node-api-preview.onrender.com is the intended production API upstream.
- Confirm health-check configuration for /live and /ready.
- Verify DATABASE_URL points to the reviewed Neon project/branch/database without revealing the URL or secret.
- Inspect only environment variable names and targets where possible; never print secret values.
- Confirm current deployment and rollback deployment IDs.

### Gate B — database control and recovery

- Establish Neon as the documented production source of truth only after Gate A.
- Document the D1 snapshot/legacy retention policy.
- Measure row-level parity with stable identifiers and checksums in an isolated copy.
- Verify backup and restore, including media storage.
- No production mutation until a separate owner approval.

### Gate C — branch and PR reconciliation

- Resolve Node branch vs main divergence using a deliberate integration/release plan.
- Identify which later main commits are required by the live application and whether equivalent changes exist in the Node branch.
- Recompare all contributing PRs against the exact production anchor.
- Review required checks and conflicts on the final release commit.
- Never force-push or rewrite shared history.

### Gate D — runtime and feature acceptance

On an isolated/test environment:
- Authentication, first-owner bootstrap, login, logout and session expiry.
- Authorization/RBAC for every admin resource and every mutation method.
- CRUD, moderation and audit-log integrity.
- Follow, unfollow, page likes, project reactions and comments.
- Visitor consent, privacy, DNT and retention behavior.
- Media upload, download and external object-storage parity.
- AI service access, bounded permissions, quotas, failure handling and key isolation.
- Arabic RTL and English LTR.
- Hydration, refresh, navigation, keyboard, mobile touch and browser back/forward.
- API readiness, failure behavior, performance and load.

### Gate E — image release review

- Confirm owner publication approval for every photo that will be publicly exposed.
- Confirm consent for images containing another person.
- Verify photo metadata and alt text without inventing claims.
- Keep PR #29 separate until this approval and base reconciliation are complete.

## 5. Phase boundary

This document defines a future sequence only. It does not start Phase 2, change a service, modify production data, create an owner, rotate a secret, merge a PR, deploy a release or change DNS. Wait for explicit owner review and authorization.


## Final verification addendum — reconciliation and next safe sequence

Current Git compare: main vs Node branch = 355 ahead / 45 behind; recovery vs Node branch = 2 ahead / 0 behind. PR #25 remains OPEN/Draft as the Node/PostgreSQL foundation. PR #30 is already merged and must not be cherry-picked again. PR #29 is a separate photo/SEO contribution, 8 ahead / 1 behind Node, and must remain separate pending image-consent and locale completion. PR #31 is documentation-only and remains OPEN/Draft.

Preserve the Node branch as a temporary operational review anchor. Do not merge it wholesale into main or rewrite shared history. Inventory the 45 main-only commits, group by feature, and selectively integrate only after feature-level comparison and conflict-reviewed CI. Do not duplicate PR #30. Re-review PR #29 on a fresh comparison base after image rights and English gallery requirements are resolved.

Phase 2 remains blocked by Render workspace confirmation, actual DATABASE_URL verification, a valid isolated backup/restore drill, and owner review. No merge, deploy, DNS change, production secret change, or production data mutation is authorized.


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


## PR #31 check-state correction — final documentation commit

The previously reported successful PR #31 run #548 and three successful Vercel contexts applied to the earlier head 1d60838d537f3181bded9d148ca0b066881ec583. Subsequent evidence additions advanced the recovery branch to 8 commits / 8 files. At the latest poll, the then-current head dc59b7abc2d4fea6ca7563b8be07f6f6a0b0a6ad had all three Vercel contexts PENDING and no GitHub Actions workflow run returned. Therefore do not carry forward the earlier PASS as the status of the newest documentation commit. The final report update itself creates another documentation-only commit; its checks must be polled after this write. No browser or runtime test was performed.
