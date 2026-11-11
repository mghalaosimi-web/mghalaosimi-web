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
