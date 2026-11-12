# M.GH.AL — Phase 1 Infrastructure & Conflict Reconciliation

**Audit date:** 2026-11-12  
**Scope:** M.GH.AL — Mohammed Ghaleb Alaosimi Professional Digital Identity Hub only  
**Repository:** https://github.com/mghalaosimi-web/mghalaosimi-web  
**Operational comparison head:** ac21c3d0113d595ccb1dbec3dc381a8454b6d9f0  
**Documentation branch at audit start:** chore/phase1-cleanup-operational-2026-11-12 @ de4aeacaa6f8837728c8f5fd23b81a2c64f746d4

## Executive decision

The intended target remains **Vercel + Neon only**, with one official hostname: **mghalaosimi-web.vercel.app**.

The migration is **not yet complete**:

1. Vercel Production is still serving the older external-API proxy implementation. Its current Production deployment is commit 7de53f6becabee1dfaab4fa328d3cb9131ecebcf, not PR #32 or PR #33.
2. The primary Vercel project's DATABASE_URL exists only in Preview, scoped to fix/vercel-native-neon-api. Production has no DATABASE_URL; MGHAL_API_BASE remains configured in Production.
3. The Vercel-native Neon runtime works on a Preview deployment that has the branch-scoped DATABASE_URL. Production has not been cut over to that runtime.
4. Cloudflare D1 is empty and the previously used D1 database ID returns 404, but the mghal-api Worker remains deployed with a stale D1 binding to that deleted ID.
5. Fifteen Render services are still connected to this exact GitHub repository. All are unsuspended and have auto-deploy enabled. No Render delete action is available through the connected tools.
6. The legacy Vercel project mghal and its mghal.vercel.app domain remain active. The separate mghal-next-validation project also retains its own verified domain.
7. The current code uses Node.js and pg with a PostgreSQL compatibility adapter. No Prisma package, Prisma directory, or schema.prisma exists in the operational tree.

No merge, PR closure, branch deletion, service suspension, domain removal, production environment change, or production migration was performed.

---

# Part I — Hosting and service responsibility

## 1. Vercel projects and domains

| Project | Project ID | Domain / role | Current evidence | Decision |
|---|---|---|---|---|
| mghalaosimi-web | prj_ZVjgkEPALtFwhTvdFJ5kseEz5e7s | mghalaosimi-web.vercel.app — official | Verified domain. Production deployment dpl_4yAphXBXu4wHVqvzvpBpSp6AkSZJ is READY on 7de53f6becabee1dfaab4fa328d3cb9131ecebcf, branch feat/node-postgres-backend-2026-11-08. | Keep as the sole official project and hostname. Production cutover still required. |
| mghal | prj_oEeBkfAE2ofIETtwyUOHGR867X9k | mghal.vercel.app — legacy | Verified domain. Latest Production deployment dpl_GKDMcyB6LqRUhdr3hbURhs5h7BfM is READY on 142542ead5d7c762c46739ba9e1f16eb6da3948a. The project also receives PR Preview deployments from the same repository. | Retire only after the official Production cutover and dependency checks. No domain/project deletion tool is available. |
| mghal-next-validation | prj_u8TTQCZM6u2tEobQAzzcCzwiJeGh | mghal-next-validation.vercel.app — validation project | Verified domain. PR #33 deployment dpl_3Fht5BQNXgjSuU7ARYmoKeceq2zF is READY on de4aeacaa6f8837728c8f5fd23b81a2c64f746d4, target Preview. | Temporary validation project; retire after final validation. No delete tool is available. |
| mghal-identity-hub | prj_Y6yUrkxdTppk5oIXHH7e8LohUtp8 | mghal-identity-hub.vercel.app | A READY Production deployment exists, but its deployment metadata has no Git repository identity. | Not proven to be the target repository. Do not modify without owner verification. |
| mghal-digital-os | prj_lfhMYH7egvk4u0g9auH8jD04P5PS | mghal-digital-os.vercel.app | Deployment metadata identifies the separate repository mghalaosimi-web/mghal-digital-os. | Separate project; explicitly out of scope. Do not modify. |

The official hostname is attached to the official project, but the latest Production deployment is still the older proxy release. The current PR #33 deployment on the official project is READY but has target=null, so it is a Preview and not Production.

### Vercel environment variable inventory

Values were not read or exposed. Only key names, target scopes, types, and branch scopes were inspected.

| Project | Key | Target | Type | Branch scope |
|---|---|---|---|---|
| mghalaosimi-web | DATABASE_URL | Preview only | Encrypted | fix/vercel-native-neon-api |
| mghalaosimi-web | MGHAL_API_BASE | Production | Plain | None |
| mghal | MGHAL_PREVIEW_API_BASE | Preview only | Encrypted | feat/node-postgres-backend-2026-11-08 |

**Blocker:** DATABASE_URL is absent from Production. The actual value of MGHAL_API_BASE was deliberately not read, so its precise upstream host is not asserted. The old production source code resolves an external upstream through MGHAL_API_BASE and defaults to the Cloudflare Worker hostname if that variable is absent.

### Production and Preview endpoint checks

| Target | Endpoint | Result | Interpretation |
|---|---|---|---|
| Official Production domain | GET /api/health | HTTP 200; database=connected | The legacy upstream path is responding. This does not prove a Vercel-native Neon connection. |
| Official Production domain | GET /api/ready | HTTP 404 NOT_FOUND | Production is still running the older proxy route contract; it is not running the new Vercel-native readiness route. |
| Native API Preview deployment dpl_ETPQHhxoEvxg6VKx718rpdGGhGmV, commit c6d6c5f41497fe496b2fa163e1254aa0bba3906d | GET /api/health | HTTP 200; database=connected | Preview's Node/Neon runtime connected successfully. This deployment is an earlier commit on the native API branch, not the current PR #32 head. |
| Same native API Preview | GET /api/ready | HTTP 200; status=ready; database=connected | Confirms direct runtime readiness on the Preview branch with its scoped DATABASE_URL. |
| Same native API Preview | GET /api/admin/bootstrap/status | HTTP 200; available=false; ownerExists=true; rotationRequired=false | Existing owner account is present; bootstrap is not open. |
| Same native API Preview | GET /api/public/projects | HTTP 200; total=10 | Ten project records are available through the Neon-backed API. |
| Same native API Preview | GET /api/public/certificates | HTTP 200; total=18 | Eighteen credential records are available through the Neon-backed API. |
| PR #33 Preview deployment, commit de4aeacaa6f8837728c8f5fd23b81a2c64f746d4 | GET /api/ready and /api/health | HTTP 503 DATABASE_NOT_CONFIGURED | Expected fail-closed behavior: DATABASE_URL is scoped only to fix/vercel-native-neon-api, not the documentation branch. This Preview must not inherit Production credentials. |

PR #32 GitHub Actions checks passed: Node API CI, Backend CI, and Next.js quality. Its primary Vercel project check was previously blocked by a deployment rate limit; the other connected project previews completed. PR #33's Backend CI and Node API CI passed, and its Vercel Preview builds completed successfully across the three repository-connected Vercel projects. PR #33 is documentation-only, so its successful build does not prove Production readiness.

## 2. Neon PostgreSQL

| Resource | Identifier | Current state |
|---|---|---|
| Project | mghal-portfolio-db / billowing-snow-49569906 | READY |
| Database | mghal_portfolio | Present on the production and Preview branches |
| Production branch | main / br-morning-cherry-b9l25msz | Primary, READY |
| Preview branch | mghal-vercel-preview-20261111 / br-lively-sky-b93403rn | READY |
| E2E branch | mghal-release-e2e-2026-11-10 / br-damp-bonus-b9imwnqu | READY |

A read-only schema comparison between the Preview branch and Production returned an empty diff.

The migration ledger differs:

- Production main: 0001_core_platform through 0005_technology_visibility.
- Preview: the same entries plus 0006_google_follower_identity.

The 0006 identity tables and indexes already exist in both schemas; the schema diff is empty. The missing Production item is the 0006 ledger entry. No Production migration or ledger write was executed. The additive migration must remain a separately authorized Production operation.

The historical ledger name 0004_d1_media_storage is retained for traceability. It is not evidence of a live D1 database or active D1 runtime.

## 3. Cloudflare Workers and D1

| Resource | Current evidence | Decision |
|---|---|---|
| D1 database list | Empty array | D1 is already removed from the account's current database list. |
| Previous D1 ID 1e5682c3-6a68-4fe5-b2c5-01f9fbe1aabd | Direct lookup returns 404 | The old database is absent. |
| Worker mghal-api | Still exists; modified 2026-11-08T21:42:15Z | Legacy Worker remains deployed; it has not been deleted. |
| Worker DB binding | Binding named DB still references the deleted D1 ID above | Stale binding. Any code path that invokes this binding may fail. |
| Worker subdomain | workers.dev subdomain enabled | Worker remains addressable through its workers.dev hostname. |
| Worker custom domains | Empty | No custom Worker domain is configured. |
| Cloudflare zones and Worker routes | Zero zones; no routes returned | No zone route currently maps the Worker. |
| Worker allowed origins | Includes the official hostname, mghal.vercel.app and legacy Render preview hosts | Old cross-platform origin configuration remains. |

The current PR #32 source tree no longer contains wrangler.toml, worker.proxy.js, or worker.production.js as deployable Worker entrypoints. The API handler was moved into the Node-compatible application path. The deployed Cloudflare Worker is therefore an orphaned legacy runtime relative to the current source branch.

**Decision:** Workers are not part of the target runtime. Retire the Worker only after Production has been cut over and the old upstream is proven unused. It was not deleted during this audit.

## 4. Render

Exactly fifteen Render services were matched to the target repository URL. Every listed service is unsuspended and has autoDeploy=yes.

| Service | Service ID | Type | Connected branch | Latest deployment |
|---|---|---|---|---|
| mghal-final-web | srv-dbnrob49v7es73dj3p4g | Web service | feat/node-postgres-backend-2026-11-08 | Live |
| mghal-final-site | srv-dbnro0lg1s2s73dgkfv0 | Web service | feat/node-postgres-backend-2026-11-08 | Build failed |
| mghal-final-preview | srv-dbnrncqjnfac73d6s8jg | Web service | feat/node-postgres-backend-2026-11-08 | Build failed |
| mghal-node-api-preview | srv-dbnrmve417fc73eihi80 | Web service | feat/node-postgres-backend-2026-11-08 | Live |
| mghal-next-preview | srv-dbn750ui0phs7387n4kg | Web service | feature/mghal-arfat-full-integration | Live |
| mghal-brand-preview | srv-dbn71m3ncjis73dv9oe0 | Static site | fix/mghal-official-light-brand-system-2026-11-07 | Live |
| mghal-developer-live-static | srv-dbn67fei0phs73858ro0 | Static site | design/arfat-inspired-ui-2026-11-07 | Live |
| mghal-developer-live-preview | srv-dbn6723bc2fs738lcjng | Web service | design/arfat-inspired-ui-2026-11-07 | Build failed |
| mghal-portfolio-integration-preview | srv-dbn5738n74is73elmfk0 | Web service | feature/mghal-arfat-full-integration | Live |
| mghal-social-preview | srv-dbn52lvf3r2c73ed6tng | Static site | feat/mghal-google-identity-linking-2026-11-07 | Live |
| mghal-release-current | srv-dblr12ou01pc739c9img | Static site | feat/mghal-credentials-projects-expansion-2026-11-05 | Live |
| mghal-release | srv-dblqms6gekts73c52cq0 | Static site | fix/mghal-dual-deploy-hardening-2026-11-05 | Live |
| mghal-official | srv-dbj00loae00c73crkvgg | Static site | main | Live |
| mghal-static | srv-dbigt8l9fdbs73dkb90g | Static site | fix/site-quality-audit-2026-10-31 | Live |
| m.gh.al | srv-dbigsj9srm7s73bmm0f0 | Web service | feat/profile-media-and-credentials | Build failed |

Summary: eleven latest deployments are Live and four are Build failed. All fifteen remain configured for automatic deployment.

The only Render Postgres and Key Value resources returned in the workspace are:

- debwan-live-db — dpg-dbp507g8v5cc73d70p2g-a
- debwan-live-cache — red-dbp509o8v5cc73d70v1g

These belong to Debwan Live, not M.GH.AL. They were not accessed for modification, stopped, or deleted.

No Render service/database/key-value deletion tool is exposed by the connected Render tools. No workspace deletion was attempted. The services were not stopped because Production still uses the legacy external API proxy and its actual upstream was intentionally not inspected.

## 5. Final target responsibility

| Component | Target responsibility | Current status |
|---|---|---|
| Vercel | Sole application hosting, Next.js frontend and Node.js API routes | Target approved; Production still on old proxy release |
| Neon | Sole PostgreSQL database | Project and data exist; Preview direct connection verified |
| Render | No permanent M.GH.AL runtime role | Fifteen services remain; removal blocked by lack of delete tool and cutover dependency uncertainty |
| Cloudflare Workers | No permanent M.GH.AL runtime role | One legacy Worker remains with stale D1 binding |
| Cloudflare D1 | No role | Database list empty; old ID returns 404 |
| Domain | mghalaosimi-web.vercel.app only | Official domain attached; mghal.vercel.app and validation domain remain |

---

# Part II — Branch, PR and change reconciliation

## 6. Repository inventory

- 40 remote branches.
- 33 Pull Requests: 21 open, 10 merged, 2 closed without merge.
- Seven remote branches have no current PR head.
- The GitHub connector exposes remote refs. Local machine-only branches could not be inspected through this connection.

### Branches without a PR head

| Branch | Head SHA | Finding |
|---|---|---|
| backup/pre-credential-audit-2026-11-07 | 4652cb95547fc6c528bf8e063e052bdc9c9bcdf6 | Backup ref; retain until final credential audit is signed off. |
| backup/pre-static-credential-project-audit-2026-11-07 | da37c189fe9ed2e1bae6e6b6f42913b149393bb6 | Historical static-site snapshot with separate content changes; retain. |
| chore/main-phase1-cleanup-2026-11-12 | 0d208bd90e289a17455fe22d4c9161c717e28f65 | One-commit README-only branch; documentation-only, likely redundant. |
| feat/phase2-ux-design-system-2026-11-08 | 255531f47a40c38ed949b20575df727f6980129f | Contains a separate ReadingProgress component; function is already implemented in current SiteExperience. |
| feat/verified-project-portfolio-2026-10-31 | 985a15e48ef4323792cef6ebd08060ae87586811 | Historical project catalogue branch; current public catalogue and generated pages preserve the main project records. |
| fix/owner-bootstrap-proxy-2026-11-06 | 9ddd0d2e9745b484d798aa3f693c4fbae900bade | Legacy Worker/proxy bootstrap branch; preserve for history, do not merge into Vercel-native runtime. |
| main | fdfea351455227f44e7f92e82166bfa7bdc5e1fe | Legacy static HTML root. It is 395 commits behind the operational Node/Next.js branch. Do not reset the operational branch to main. |

### Operational integration stack

The current branch structure is a stacked PR chain, not a flat set of independent changes:

1. PR #17 — feature/mghal-arfat-full-integration, based on main.
2. PR #24 — fix/social-admin-mobile-ux, based on PR #17's branch.
3. PR #25 — feat/node-postgres-backend, based on PR #24's branch.
4. PR #32 — fix/vercel-native-neon-api, based on PR #25's branch.
5. PR #33 — chore/phase1-cleanup-operational, based on PR #32's branch.

The operational branch is 18 commits ahead of PR #25's head. PR #33 is 22 commits ahead of PR #32's head and is documentation-only. Merge order must respect this stack if the owner later authorizes merging. No PR was merged in this audit.

PR #31 is a separate recovery-documentation branch based on PR #32. Its history diverges from PR #33: the comparison reports 107 commits on the PR #33 side and 16 commits on the PR #31 side relative to their common comparison base. Do not merge either branch wholesale into the other.

PR #26 and PR #29 are sibling branches based on older Node-backend snapshots. They require file-level reconciliation, not wholesale merging.

## 7. Pull Request disposition

| PR | Status | Change area | Reconciliation result |
|---|---|---|---|
| #1 | Merged | Portfolio and identity pages | Merged into main; main is in the operational ancestry. Retain the merged content. |
| #2 | Merged | Digital identity hub V2 | Merged into main; legacy static content is retained in the repository lineage. |
| #3 | Merged | V2.1 visual identity | Merged into main; retain as historical design work. |
| #4 | Open, not draft | Profile imagery and bilingual credential gallery | Legacy static-page changes. Preserve branch; compare individual assets before any recovery. |
| #5 | Open, draft | Site quality audit | Static-site baseline, not the current Next.js release branch. Preserve. |
| #6 | Merged into PR #5's branch | Backend API, visitor tracking and public identity | Its historical Worker implementation is superseded by the Node/Neon API path. Do not merge the old Worker runtime. |
| #7 | Closed without merge | Render project-page tracking | Render-specific implementation conflicts with the Vercel-only target. Tracking behavior has a newer API path. |
| #8 | Open, not draft | Complete platform phases 1–8 | Large static/Worker platform branch. Preserve; do not merge wholesale. |
| #9 | Open, draft | Bilingual visual redesign | Legacy static UI changes. Preserve for reference; do not overwrite current Next.js UI. |
| #10 | Open, draft | Bilingual homepage redesign | Legacy static UI changes; compare only specific content not already in Next.js. |
| #11 | Open, draft | Dual-platform deployment hardening | Render/static deployment assumptions conflict with the Vercel-only target. Do not merge. |
| #12 | Open, not draft | Credentials, projects and research expansion | Content may be useful. Current public project catalogue already contains ten detailed records and ten generated project pages; reconcile any extra facts individually. |
| #13 | Open, draft | Public identity and official links | Documentation/identity branch; verify against current canonical profile before reuse. |
| #14 | Open, draft | Cloudflare Workers AI provider | Worker-specific AI provider is absent from the current runtime and conflicts with the Vercel-only infrastructure target. Preserve for a later provider redesign. |
| #15 | Open, draft | Anonymous follow and reactions | Functional behavior exists in the current API handler and social-engagement client path. Do not merge the old Worker implementation. |
| #16 | Open, draft | Google identity linking | Google OAuth routes and identity schema exist in the Node/Neon path. Reconcile tests and behavior, not the old Worker runtime. |
| #17 | Open, draft | Full digital identity integration | This is the first branch in the current stacked integration chain. Its content is in the current ancestry. |
| #18 | Merged | Reference-inspired UI rebuild | Merged into main; retained in the current ancestry. |
| #19 | Merged | Arabic/English design parity | Merged into main; retained in the current ancestry. |
| #20 | Merged | Interior page styling | Merged into main; retained in the current ancestry. |
| #21 | Open, draft | Additional reference styling | Static HTML styling branch; do not overwrite current Next.js styles. |
| #22 | Open, draft | Official light brand system | Static HTML styling branch; compare visual tokens only if needed. |
| #23 | Merged into PR #17's branch | Verified credential ownership | Current operational lineage includes this integration; current API returns 18 credential records. |
| #24 | Open, draft | Hub UX, credentials, SEO and release hardening | Second branch in the current stacked integration chain. |
| #25 | Open, draft | Node.js + Neon backend foundation | Current base for PR #32. Uses pg and a PostgreSQL compatibility adapter, not Prisma. |
| #26 | Open, draft | Phase-one comparison and low-risk fixes | Several low-risk changes are already present in the current tree: publicRoot project-page paths, project-page tests, and RATE_LIMIT_PER_MINUTE in the Node server. Worker-specific changes are superseded. Retain the audit report; no wholesale merge required. |
| #27 | Closed without merge | PWA, reading progress and theme | The current SiteExperience already registers the service worker and calculates reading progress; public/sw.js is present. The PR branch's layout contains duplicate imports/metadata entries, so do not merge it as-is. |
| #28 | Merged | Profile photo library | Merged into main. Current public image assets exist, but the complete PR #29 gallery is not in the current Next.js branch. |
| #29 | Open, not draft | Photo archive and image SEO | Unique, not integrated. See the owner-consent gate below. |
| #30 | Merged into PR #25's branch | Hydration conflict fix | Integrated. Current SiteExperience and test-engagement-hydration files match the merged hydration branch. |
| #31 | Open, draft | Historical recovery and architecture reconstruction | Documentation branch diverges from PR #33 and overlaps current reconciliation documents. Reconcile useful facts only; do not merge wholesale. |
| #32 | Open, not draft | Vercel-native API runtime with Neon | Critical code migration. GitHub Actions passed, but it is not Production. Preview direct Neon readiness was verified on an earlier deployment of this branch. |
| #33 | Open, draft | Phase-one cleanup and reconciliation documentation | Documentation-only child of PR #32. GitHub Backend CI and Node API CI passed; Vercel Preview builds are READY. Preview API returns DATABASE_NOT_CONFIGURED because this branch intentionally has no DATABASE_URL scope. |

## 8. File-level conflict and preservation findings

### A. API routing and runtime

- The older production route app/api/[...path]/route.ts imports lib/api-proxy-policy.mjs and proxies to an external upstream.
- lib/api-proxy-policy.mjs defaults to https://mghal-api.m-gh-alaosimi.workers.dev when MGHAL_API_BASE is absent.
- PR #32 removes that proxy policy and replaces the route with lib/mghal-api-runtime.mjs, which runs the API handler in the Vercel Node.js runtime and requires DATABASE_URL.
- mghal-backend/worker.production.js is renamed into mghal-backend/api-handler.mjs. The current tree no longer contains wrangler.toml or worker.proxy.js.
- The production domain still runs the older proxy release. The PR #32 runtime is therefore a real architectural change, not merely a documentation update.

Recovery: keep PR #32 as the primary runtime migration. Before Production promotion, provision Production DATABASE_URL through the approved secure Vercel workflow, verify it without exposing the value, and repeat the health/readiness/API smoke tests on the actual Production target.

### B. Cloudflare Worker/D1 orphan

- Current source no longer contains a deployable Worker entrypoint.
- Cloudflare still has the mghal-api Worker.
- Its DB binding references a D1 ID that no longer exists.
- The Worker has no zone route or custom domain, but its workers.dev subdomain is enabled.

Recovery: do not restore the old Worker code into the new API path. After Production is confirmed on Vercel/Neon and the external upstream is proven unused, retire the Worker and its stale settings through an authorized Cloudflare operation.

### C. Project content source-of-truth duplication

The current branch contains:

- public/assets/projects/catalog.json with ten detailed project records.
- Ten generated public/projects/<slug>/index.html project pages.
- data/projects.ts with a separate Next.js list of ten projects using a smaller data model.

The rich catalogue and generated pages are present; this content is not missing. However, the two project data sources can drift. Before later content expansion, define one authoritative source and generate or adapt the second representation from it. Do not delete either dataset before a field-by-field reconciliation.

### D. PWA and reading progress

The current app/components/SiteExperience.tsx already:
- registers public/sw.js in Production over HTTPS;
- loads visitor-tracking.js and social-engagement.js;
- computes reading progress and updates the CSS variable.

The current public/sw.js uses cache version mghal-pwa-v6. PR #27's full layout patch is not safe to merge as-is because its app/layout.tsx contains duplicate imports and duplicate metadata entries. The standalone ReadingProgress component on feat/phase2-ux-design-system is redundant with the current SiteExperience behavior.

Recovery: no cherry-pick needed for the existing behavior. Verify with the PWA audit, hydration test, offline cache test, and a real mobile browser check.

### E. Photo archive and owner consent

PR #29 head: 39d9b5981a1ffdf52d3f256d39eb170da256d92f.

Unique files include:
- app/photos/page.tsx
- public/profile-gallery/*
- public/assets/images/mghal-profile-primary.jpg
- changes to app/about/page.tsx, app/page.tsx, app/HomePageEnglish.tsx, lib/structured-data.ts and public/sitemap.xml.

The current branch does not contain app/photos/page.tsx or the new public/profile-gallery directory. The PR #29 page includes mghal-with-companion-2026.jpg. The current structured-data image still points to the existing mghal-avatar.webp; PR #29 changes it to mghal-profile-primary.jpg, which is not present in the current tree.

Recovery: preserve PR #29 unchanged. Do not publish the companion image or switch structured-data references until the owner explicitly approves the exact images and the matching asset is included. Then selectively port the page, approved images, metadata, sitemap entries and tests.

### F. Credentials and social identity

- PR #23's verified credential ownership correction is in the current integration lineage.
- The current Neon-backed Preview API returns 18 credentials and ten projects.
- Current mghal-backend/api-handler.mjs contains follower, reaction, Google OAuth, identity-session and admin route handlers.
- PostgreSQL migration 0006 is present in the repository and applied to Preview's migration ledger; Production's ledger remains at 0005.
- Do not merge old Worker-based PR #15/#16 code over the current Node/Neon handler. Compare the API contracts and tests only.

### G. PR #26 partial integration

The current branch already reads the project catalogue from public/assets/projects/catalog.json. scripts/generate-project-pages.mjs and scripts/test-project-pages.mjs both use publicRoot. The Node server includes RATE_LIMIT_PER_MINUTE. These changes are present in the current tree even though PR #26 remains open. Its Worker-specific patch is superseded by the Vercel-native runtime. No wholesale PR #26 merge is needed.

## 9. Recommended recovery order

1. Keep all 40 remote branches and all 33 PRs intact until the final archival decision.
2. Treat PR #17 → #24 → #25 → #32 → #33 as the current integration stack. Review the base/head chain before any future merge.
3. Complete PR #32 Production prerequisites; do not merge or promote while Production DATABASE_URL and Production readiness remain unresolved.
4. Reconcile PR #31's unique documentation against PR #33; do not merge duplicate or stale release-state documents.
5. Keep PR #29 isolated until image consent is explicit; then cherry-pick only approved images and matching metadata/page changes.
6. Preserve PR #14 AI provider work for a future Vercel-compatible provider design; do not restore its Cloudflare Worker/D1 assumptions.
7. Keep the Render dual-deploy branch and Render-specific tracking code out of the target runtime.
8. Maintain one authoritative project catalogue before further content expansion.
9. After successful Production cutover, retire the old Vercel project/domain, validation project/domain, legacy Worker, and the fifteen Render services using authorized deletion tools or the relevant dashboards. Do not touch Debwan Live resources.

## 10. Phase-one closure gates

The combined infrastructure and conflict audit is complete, but Phase 1 is **not ready for formal closure**.

Remaining hard blockers:

- Production DATABASE_URL is absent from the official Vercel project.
- The official Production domain still serves the old external-proxy implementation; /api/ready returns 404.
- PR #32 is open and unmerged; its current head is not the Production release.
- Production migration ledger lacks 0006_google_follower_identity, even though the schema objects exist. Any ledger reconciliation requires explicit Production authorization.
- MGHAL_API_BASE remains in Production; its value was not inspected, so the upstream cannot be conclusively attributed.
- Fifteen Render services remain active and auto-deploying.
- The mghal-api Cloudflare Worker remains deployed with a stale D1 binding.
- mghal.vercel.app remains attached to the old Vercel project; mghal-next-validation.vercel.app remains attached to the validation project.
- The historical PR stack and branch archive have not been merged, closed, or deleted.

### Phase-two prerequisites only — not started

- Decide whether the target Node.js data layer remains pg plus the compatibility adapter or adopts Prisma. Prisma is not currently installed or present in the operational tree.
- Consolidate project catalogue data into one source of truth.
- Approve or reject the photo archive assets.
- Decide the future AI provider design without Cloudflare Worker/D1 runtime assumptions.
- Revalidate PWA, mobile UX, admin/RBAC, OAuth, visitor tracking, social engagement and analytics after the Production cutover.

**Final audit statement:** the resources and code paths have been mapped, unique work remains preserved in remote refs, and the main conflicts are documented. No destructive operation was performed. The infrastructure target is clear, but Production has not yet been moved to the Vercel-native Neon runtime, so Phase 1 must remain open.
