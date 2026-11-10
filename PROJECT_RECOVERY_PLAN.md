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
