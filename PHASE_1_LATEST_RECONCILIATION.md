# M.GH.AL — Phase 1 Latest Reconciliation

**Inspection date:** 2026-11-12 (Asia/Aden)  
**Scope:** M.GH.AL only. This document supersedes earlier snapshots where provider state has since changed. Historical reports remain unchanged for auditability.

## 1. Current disposition

**Main Phase 1 remains BLOCKED.** This is a current-state reconciliation, not a release approval. No production deployment, PR merge, production migration, domain detachment, or Render service deletion was performed during this reconciliation.

## 2. GitHub source and PR state

- Repository: `mghalaosimi-web/mghalaosimi-web`.
- Current operational integration chain remains centered on PR #32, source branch `fix/vercel-native-neon-api`, head `ac21c3d0113d595ccb1dbec3dc381a8454b6d9f0`, targeting `feat/node-postgres-backend-2026-11-08`.
- PR #32 is OPEN and unmerged. The three previously recorded GitHub Actions workflows passed on that head; this does not prove production readiness.
- The latest returned Vercel READY deployments are on older SHAs, including `c6d6c5f41497fe496b2fa163e1254aa0bba3906d`; no deployment for PR #32 head `ac21c3d...` was found in the checked deployment page.
- GitHub `main` is an ancestor of the operational branch. Current comparison: operational branch is 377 commits ahead and 0 behind main. The operational line is therefore the appropriate review base for the current release work; do not wholesale merge it into main.
- PR #33 is a new Draft documentation-only cleanup based on PR #32 head. It corrects the public credential count and removes the obsolete Render technology badge. It is not merged.
- PR #31 remains Draft and documentation-only, but its recovery branch is now 16 commits ahead and 85 behind `fix/vercel-native-neon-api`; it is divergent and is not a safe integration path. It is explicitly marked superseded by PR #33 and must not be merged wholesale. Do not treat historical snapshots in its reports as current provider state.


### Branch inventory without an open PR — 2026-11-12

The GitHub repository currently has 40 branches and 20 open PRs. Nineteen non-main branches are not the head of an open PR; this does **not** mean they are disposable.

**Branches fully contained in the current operational history** (comparison against `fix/vercel-native-neon-api`: operational branch is ahead, branch is 0 commits ahead of operational):
- `backup/pre-credential-audit-2026-11-07`
- `design/arfat-inspired-ui-2026-11-07`
- `design/reference-details-followup-2026-11-07`

These are candidates for archival deletion after a final reachability/backup check. No branch-delete operation is available through the connected GitHub tools, so none was deleted.

**Branches that have diverged and must be preserved pending file-level review:**
- `backup/pre-static-credential-project-audit-2026-11-07`
- `chore/main-phase1-cleanup-2026-11-12` (static HTML snapshot; its Vercel Preview build failed due Next.js framework mismatch)
- `content/profile-photo-library-2026-11`
- `design/complete-reference-parity-2026-11-07`
- `design/extra-reference-styling-2026-11-07`
- `feat/mghal-phase2-experience-2026-11-08`
- `feat/phase2-ux-design-system-2026-11-08`
- `feat/platform-phases-1-3-2026-11-01`
- `feat/render-project-page-tracking-2026-11-01`
- `feat/verified-project-portfolio-2026-10-31`
- `feature/digital-identity-hub-v2-completion`
- `feature/digital-identity-hub-v2`
- `feature/portfolio-expansion`
- `fix/credentials-owner-audit-2026-11-07`
- `fix/mghal-hydration-engagement-2026-11-09`
- `fix/owner-bootstrap-proxy-2026-11-06`

These branches contain histories not wholly represented by the current operational branch. Deleting them now risks losing unique work. They require path-level diff classification and explicit preservation before cleanup.

A tree-level comparison was also completed for all 16 diverged branches against `fix/vercel-native-neon-api` (the trees were not truncated). This confirms that several contain branch-only files:
- `backup/pre-static-credential-project-audit-2026-11-07`: 2 branch-only files — `assets/brand-page-extras.css` and `assets/projects/mghal-website.svg`.
- `design/complete-reference-parity-2026-11-07` and `design/extra-reference-styling-2026-11-07`: each has the unique `assets/brand-page-extras.css`.
- `feat/mghal-phase2-experience-2026-11-08`: 6 branch-only files, including the former Worker/Wrangler backend and proxy policy/tests.
- `feat/phase2-ux-design-system-2026-11-08`: 9 branch-only files, including the former Worker/Wrangler backend, proxy tests, browser audit, and reading-progress component.
- `feat/platform-phases-1-3-2026-11-01`: 42 branch-only files, including project catalogs, accessibility/credential modules, and PWA assets.
- `feat/render-project-page-tracking-2026-11-01`: 44 branch-only files, including the same catalog/accessibility/PWA feature family.
- `feat/verified-project-portfolio-2026-10-31`: 19 branch-only files, including project catalog, PWA manifest, and portfolio audit.
- `fix/credentials-owner-audit-2026-11-07`: 4 branch-only files, including legacy Worker/Wrangler source and tests.
- `fix/mghal-hydration-engagement-2026-11-09`: 8 branch-only files, including legacy Worker/proxy implementations and tests.
- `fix/owner-bootstrap-proxy-2026-11-06`: 80 branch-only files, including a legacy static admin UI, Worker/proxy code, and older credential/media assets.

The other diverged branches have no branch-only paths relative to the current operational tree, but still modify shared files and remain unsuitable for blind deletion/merge. The legacy Worker/Wrangler files identified above exist only in historical divergent branches; they are not part of the current PR #32 operational tree. Preserve their history but do not reintroduce them into the current Vercel + Neon runtime.


### Vercel deployment hygiene — 2026-11-12

- A READY Preview deployment exists for the documentation branch at an earlier commit, but there is **no Vercel deployment record for PR #33's current head** `e10d18020b323cc4739c51e98d2891172a9b7d38` at the time of this check. GitHub CI is green; that is not the same as a Vercel build/deployment verification.
- An unrelated/orphan branch `chore/main-phase1-cleanup-2026-11-12` produced a failed Preview deployment (`dpl_4S5X6V6CNEFw9p5FcGmuoXiWMdn6`). Its build log shows Vercel invoking `next build` and failing because the branch contains a static HTML root without a Next.js `app` or `pages` directory and has no root `package.json`. This is a project/branch framework mismatch, not a failure in PR #32's Next.js application branch. Do not change the official project's framework settings to accommodate this orphan snapshot.
- The failed branch has no open PR found by the branch-name search. Preserve it until its historical content is classified; no branch deletion is performed.

### Open pull-request inventory — 2026-11-12

The repository currently has 20 open PRs. They are grouped below by their current role; open does not mean ready to merge.

| PR | Branch / purpose | Current handling |
|---|---|---|
| #33 | Documentation and Phase 1 source-of-truth cleanup, based on #32 head | Current documentation cleanup; Draft; CI under final-head verification |
| #32 | Vercel-native API + Neon runtime | Main operational integration candidate; open, unmerged; Production cutover not verified |
| #31 | Historical recovery / architecture reports | Draft, divergent (16 ahead / 85 behind operational base); superseded by #33; do not merge wholesale |
| #29 | Profile photo archive and image SEO | Open; publication consent and release checks remain separate gates |
| #26 | Phase 1 comparison / low-risk audit fixes | Draft; overlaps other integration work; preserve pending review |
| #25 | Node.js + Neon backend foundation | Draft; upstream dependency in the current API chain |
| #24 | UX, credentials, SEO and release hardening | Draft; upstream dependency in the current integration chain |
| #22 | Interior-page brand system | Draft; diverged from current integration line and overlaps #17/#32; only unique assets should be considered after review |
| #17 | Digital identity hub design integration | Draft; upstream base for #24/#25 chain |
| #16 / #15 / #14 | Google identity linking, social engagement, AI provider foundation | Draft nested feature branches; preserve until their work is reconciled against the current backend |
| #13 | Public identity and official links | Draft; overlaps later identity work; verify before closure |
| #12 / #11 / #10 / #9 / #8 | Earlier platform expansion, dual deploy, redesign and platform build | Historical integration chain; not safe to merge independently into the current release |
| #5 / #4 | Earlier quality audit and profile media / credential gallery | Old base; overlapping or superseded portions require file-level archival review |

No PR was merged or closed in this reconciliation. No branch was deleted. This is intentional: the current connector does not expose a safe branch-deletion operation, and several older PRs contain unique files or nested feature work that must be preserved until an explicit archival plan is approved.

## 3. Credential and public README correction

The verified public credential inventory is **18 total**:
- 11 Cisco Networking Academy credentials;
- 6 Edraak certificates;
- 1 JSNAD credential.

The operational README previously claimed 14 Cisco credentials and referred to three unnamed records. That unsupported count has been removed in PR #33. The operational README already used the official hostname `mghalaosimi-web.vercel.app`; the separate cleanup branch based on main also replaces the legacy hostname there.

## 4. Database state

### Neon

- Production project: `mghal-portfolio-db` (`billowing-snow-49569906`).
- Production branch: `main` (`br-morning-cherry-b9l25msz`), database `mghal_portfolio`.
- Preview branch: `mghal-vercel-preview-20261111` (`br-lively-sky-b93403rn`).
- The schema for `follower_identities`, `follower_identity_sessions`, and `oauth_transactions` was read-only compared and found identical between Production and Preview.
- Migration 0006's schema objects already exist in both branches, but the migration-ledger state differs. Migration 0006 has NOT been applied to Production; no production database write was made.
- A separate Neon project `mghal-digital-os` is outside this website's scope and must not be changed.

### Cloudflare D1

- The M.GH.AL D1 database `mghal-db` was deleted in the later cleanup and its database-list check returned an empty list.
- Earlier reports describing a populated D1 database are historical snapshots from 2026-11-10 and are superseded by this later verified state.
- Do not recreate D1 or attempt data restoration; the owner explicitly chose not to retain its data.

## 5. Vercel configuration and deployment blockers

Official Vercel project: `mghalaosimi-web` (project ID `prj_ZVjgkEPALtFwhTvdFJ5kseEz5e7s`).

Latest read-only environment inventory:
- `DATABASE_URL`: Preview only, scoped to branch `fix/vercel-native-neon-api`; encrypted value not disclosed.
- `MGHAL_API_BASE`: Production target, still points to `mghal-node-api-preview.onrender.com`.
- No Production `DATABASE_URL` was present in the returned project environment inventory.
- A previous attempt to create the Production `DATABASE_URL` was blocked by security checks. No environment change was made and no attempt was made to bypass that control.

Latest checked deployment page:
- READY Preview deployments exist for older commits.
- No READY deployment for PR #32 current head `ac21c3d...` was found in the checked page.
- No Production release on the current PR #32 head is verified.

Therefore the Vercel-native API is not yet proven to be operating in Production. Do not remove Render dependencies until the Vercel API is configured and tested end-to-end.

## 6. Render inventory and deletion limitation

The Render workspace `My Workspace` was directly enumerated. It contains 15 services associated with the M.GH.AL repository:

1. `mghal-final-web`
2. `mghal-final-site`
3. `mghal-final-preview`
4. `mghal-node-api-preview`
5. `mghal-next-preview`
6. `mghal-brand-preview`
7. `mghal-developer-live-static`
8. `mghal-developer-live-preview`
9. `mghal-portfolio-integration-preview`
10. `mghal-social-preview`
11. `mghal-release-current`
12. `mghal-release`
13. `mghal-official`
14. `mghal-static`
15. `m.gh.al`

The connected Render toolset exposed workspace/service/resource listing and non-destructive operations, but no service-deletion operation. Consequently, none of these services was deleted or suspended. This is an execution limitation, not a completed cleanup.

Explicitly excluded from this project cleanup:
- Debwan Live services and database/cache;
- `mghal-digital-os`;
- `almanar-schedule-system` and `manar-schedule-system`.

## 7. Legacy Vercel project/domain

The legacy Vercel project `mghal` still exists and `mghal.vercel.app` remains attached to it. No detachment or project deletion was performed because the connected toolset did not provide a verified safe deletion path and its resource usage must be checked before release. The official M.GH.AL hostname remains `mghalaosimi-web.vercel.app`.

## 8. Remaining Phase 1 closure gates

1. Provide a safe, supported path to set Production `DATABASE_URL` without exposing secrets or bypassing security controls.
2. Verify PR #32 head on a READY Vercel Preview with API health, database connectivity, authentication/OAuth, admin/RBAC, public content, and engagement flows.
3. Establish a production deployment on the verified commit before removing Render.
4. Remove the Production `MGHAL_API_BASE` Render reference only after the Vercel-native API is confirmed operational.
5. Complete Render service retirement through an authorized deletion-capable interface; do not touch excluded projects.
6. Reconcile open PRs and branches against the operational anchor. Preserve unique, unreviewed work; close/delete only after confirming it is superseded or safely archived.
7. Re-check canonical URLs, sitemap, robots, metadata, bilingual routes, accessibility, and mobile behavior on the final release commit.
8. Issue a final closure report with exact commit SHA, deployment ID, test evidence, and remaining exceptions.

## 9. Actions performed during this reconciliation

- Read-only refreshed GitHub PR, branch, deployment, and environment metadata.
- Created a documentation cleanup branch and Draft PR #33 for the operational release line.
- Corrected the operational README to show the verified 18-credential inventory, remove the unsupported three-record statement, and remove the obsolete Render badge.
- Corrected backend and architecture documentation to distinguish the intended Neon/Vercel target from the currently missing Production `DATABASE_URL` and remaining Render upstream setting.
- PR #33 now contains five documentation files and remains Draft; Backend CI and Node API CI passed on the prior documentation commit, while the latest architecture-doc-only commit has not yet received a new workflow run.
- No application runtime code, production database, secret, domain, DNS, production environment, or Render service was changed.


---

## Current release update — 2026-11-13 (supersedes conflicting deployment and PR statements above)

The owner authorized publication of the accumulated Phase 1 work. The following integration PRs have now been merged into `main` in dependency order:

- PR #17 — digital identity hub integration — merge commit `299b29cc99f3a49cae34fd3b3d453c5dc40cc6d9`.
- PR #24 — UX, credentials, SEO and release hardening — merge commit `85173abdae4ecd65a94dc1b0536ec3d2cc31d4ab`.
- PR #25 — Node.js + Neon backend and UI parity — merge commit `cac9c768f64bba5466615512edc5d40560df2b42`. This line includes the Vercel-native API integration from PR #32, which had previously been merged into the feature branch.
- PR #29 — 12-image profile archive and `/photos` SEO page — merge commit `6a72000af22bab1cd3552ce2cdbcbdee826419c1`.
- PR #33 — Phase 1 documentation/source-of-truth cleanup — merge commit `9e12f510554abe4d66f873d484a1d2bab3d9916f`.

Current `main` is `9e12f510554abe4d66f873d484a1d2bab3d9916f`. GitHub Actions Backend CI, Node API CI, and Next.js quality workflows passed on the corresponding integration heads before merge. The final `main` merge commit has Vercel status checks failing due to the account/project deployment build-rate limit; this is not a source-code CI failure.

### Current Vercel/Production facts (read-only check)

- Official Vercel project: `mghalaosimi-web`; official hostname: `https://mghalaosimi-web.vercel.app`.
- Production `DATABASE_URL` is now present as an encrypted Production-only environment variable. Its value was not read or exposed.
- Production `MGHAL_API_BASE` remains configured to the Render Node API preview hostname. Keep it until the Vercel-native Production deployment is READY and its API/database checks pass; remove it only after that cutover.
- The latest Production deployment still serves commit `7de53f6becabee1dfaab4fa328d3cb9131ecebcf`, not the new `main` commit.
- The latest READY Preview is an older commit `74949bfff0272b5d8ffca7d54111a88995bdcca2`; it is not a deployment of current `main`.
- Live checks against the official Production hostname: `/` returns HTTP 200; `/api/health` returns HTTP 200 with database connected through the currently configured legacy upstream; `/photos` returns HTTP 404. Therefore the newly merged photo archive and current application changes are **not yet live on Production**.
- Vercel's current Git status for `main` reports `build-rate-limit`. No deployment ID was created for the new main commit. Do not claim the production release is complete or retry deployment until the rate-limit window clears.

### Database and infrastructure boundary

- Neon Production `DATABASE_URL` exists, but this does not by itself prove the Vercel-native Production runtime has been deployed or exercised.
- The Vercel-native API code reads `process.env.DATABASE_URL` directly and does not use `MGHAL_API_BASE`; the legacy variable is retained only until the new Production deployment is confirmed.
- Cloudflare D1 remains deleted by the owner's explicit decision. Do not recreate it or attempt restoration.
- No Neon Production migration/ledger mutation, owner bootstrap, OAuth secret change, domain detachment, Render deletion, or Render suspension was performed during this release attempt.

### Remaining open integration work

The core release chain above is now in `main`. Older branches/PRs are not to be blindly merged: PR #31 is explicitly superseded by #33; PR #21/#22 contain older static-page styling snapshots; PR #26 contains legacy Worker-oriented backend files; PR #14/#15/#16 contain Worker/D1-era AI/social/auth implementations that require selective porting if still desired. Preserve their histories until each unique feature is classified. Main Phase 1 remains open until the official Production deployment, live route/API/database/auth checks, and final mobile/browser verification succeed.


---

## Production API cutover — verified 2026-11-13 (supersedes older deployment snapshots)

The earlier statements in this file saying that Production was still using the Render API proxy, that `DATABASE_URL` existed only in Preview, or that `/photos` returned 404 are historical and are superseded by this read-only verification.

### Deployment identity

- Production deployment ID: `dpl_8JvcKQp7uVzR6hkJpUbbm9QbFjqs`
- State: `READY`
- Branch: `main`
- SHA: `a283323dd63107e510e780f1f1d1265e4d1c719b`
- Official alias: `https://mghalaosimi-web.vercel.app`

### Live API checks

- `GET /api/ready` → HTTP 200, `{"status":"ready","database":"connected"}`.
- `GET /api/health` → HTTP 200, `{"status":"ok","database":"connected"}`.
- `GET /api/public/projects` → HTTP 200 with public project records.
- `GET /api/public/followers/count` → HTTP 200 with aggregate counts.
- `GET /api/public/site-reactions` → HTTP 200 with aggregate reaction state.
- `GET /api/admin/bootstrap/status` → HTTP 200, `ownerExists: true`; this was read-only.

The deployed Next.js API route invokes `lib/mghal-api-runtime.mjs`, which reads the encrypted Production `DATABASE_URL`, builds a PostgreSQL pool, and calls the shared API handler directly. The readiness route runs `SELECT 1 AS ok`. This is sufficient to verify the Vercel-native Production → PostgreSQL path; the health response is not being used as the sole proof.

### Environment and retirement boundary

- Production `DATABASE_URL`: present, encrypted, Production-only; value not read.
- Production `MGHAL_API_BASE`: still configured to the Render preview hostname, but GitHub default-branch code search found no application-runtime reference. It is stale configuration, not an active proxy dependency.
- No delete-environment-variable action is exposed by the connected Vercel integration. Do not blank or mutate the variable as a workaround; remove it through the Vercel dashboard when authorized.
- Render services remain intact. Do not delete or suspend them until protected admin/RBAC and engagement write workflows, rollback needs, and any external consumers are reviewed.
- No Production write request, migration, owner bootstrap, secret rotation, or infrastructure deletion was performed.

### Revised Phase 1 closure gates

1. Verify authenticated admin login, session handling, RBAC-protected reads, and approved content write paths without exposing credentials.
2. Verify visitor/follower/reaction/comment flows with controlled test identities and a cleanup plan; do not create production test data casually.
3. Remove the stale Production `MGHAL_API_BASE` variable through the Vercel dashboard; the connected integration has no deletion action.
4. Review Render service inventory and external consumers, then retire only the M.GH.AL services with an explicit rollback plan.
5. Complete final browser/mobile, bilingual, image-loading, canonical, sitemap, robots, and accessibility checks on the official Production alias.
6. Publish the final Phase 1 closure report with exact SHA, deployment ID, and evidence.

### Neon identity schema and OAuth status

- Production and Preview both contain `follower_identities`, `follower_identity_sessions`, and `oauth_transactions`.
- Production migration ledger: 0001–0005. Preview ledger: 0001–0006.
- Read-only Neon schema comparison found no identity table/column/index/constraint delta; the reported difference was limited to ACL/default-privilege entries.
- Production migration 0006 was not applied. It is intended to reconcile the existing schema and ledger; do not run it on Production without explicit approval.
- Live `GET /api/public/auth/google/config` returns `enabled: false`. Google OAuth start/callback, Google credential validity, and end-to-end account linking remain unverified.

### Production credential CMS reconciliation — 2026-11-13

A read-only Production query found that the public credentials page and the Neon admin CMS are not yet synchronized:

- Public page: 26 display records — 14 Cisco, 6 Edraak, 1 JSNAD, 5 EMC Shiraa.
- Neon `certificates` table: 21 rows — 11 published Cisco, 6 published Edraak, 1 published JSNAD, and 3 unpublished generic Cisco placeholders (“سجل اعتماد إضافي 12/13/14”).
- No EMC Shiraa records exist in the Neon certificates table.
- The three newest Cisco records shown publicly (Data Science Essentials With Python, Endpoint Security, IT Support Specialist Career Path) are not present by exact title in the CMS table.

No Production database writes were performed. This is a content reconciliation blocker for the admin CMS, not a failure of the public static credentials page. Do not create/update/delete production certificate rows until the three placeholder mappings and five EMC workshop records are reviewed and explicit approval for the content sync is received.

### Remaining open PR classification — refreshed 2026-11-13

This is a file-level classification against current `main`, not an instruction to merge old branches wholesale.

| PR | Branch content | Current disposition |
|---|---|---|
| #21 | 21 legacy static HTML/CSS files plus `assets/brand-page-extras.css` | Superseded by the later #22 design pass. It targets the old static-page tree and should not be merged into the current Next.js application. |
| #22 | 26 legacy static-page files, `assets/brand-page-extras.css`, and `assets/projects/mghal-website.svg` | Preserve the unique CSS/SVG assets for archival/reference. The CSS defines a dark cyan visual system (`#62d8ef`) and targets old static selectors, which conflicts with the approved light navy/blue/white/gold system and current App Router components. Do not port wholesale. |
| #26 | Project-page generator/integrity fixes, rate-limit configuration, CI wiring, one historical audit report, and Worker-specific changes | The safe current-runtime changes are already present on `main`: generator/tests use `public/`, the project-page test runs in build, and `RATE_LIMIT_PER_MINUTE` is wired through the Node adapter/API handler. Do not reintroduce its Worker-only changes. Keep the unique historical comparison report for reference; PR #26 itself is based on an obsolete feature branch. |
| #15 | Anonymous follower/reaction UI, visitor tracking, and Worker-era API changes | The active social assets are already present under `public/assets/`; the shared API handler contains the public follower/reaction/event routes, and live aggregate read endpoints returned HTTP 200. The old PR branch is not needed for these features. |
| #16 | Google follower linking UI, Worker-era migration and API changes | The current shared API handler and PostgreSQL migration artifact already contain the Google linking flow/schema. Production has the identity tables, but Google auth config is disabled (`enabled: false`) and OAuth credentials/flows are not verified. No old Worker migration should be merged or applied. |
| #14 | Isolated Cloudflare Workers AI provider adapter and tests | The provider class and tests exist in the repository, but code search found no application route/UI integration. It is not part of the current release. Keep isolated until the AI product/provider architecture is explicitly selected; it must not introduce a Worker/D1 runtime dependency. |

No PRs were merged or closed during this classification. Their branches and history remain available. The current Phase 1 release line remains PR #34, based directly on `main`.
