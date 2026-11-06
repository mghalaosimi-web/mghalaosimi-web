# M.GH.AL — MASTER PROJECT STATE

> **Purpose:** Single concise source of truth for project continuation. This document records verified state, not assumptions.
> **Last verified:** 2026-11-06 (Asia/Aden, UTC+03:00)
> **Repository:** https://github.com/mghalaosimi-web/mghalaosimi-web
> **Current verification branch:** `feat/mghal-credentials-projects-expansion-2026-11-05`
> **Last verified code commit:** `980b98f2c2f53699c8e8a0f8cd594e1a163160b0` (latest development code checkpoint before this state refresh)

## 1. Project identity

**M.GH.AL — Mohammed Ghaleb Alaosimi** is the user's bilingual professional digital identity and engineering portfolio. It is intended to be a verifiable professional hub for profile, education, skills, projects, certificates, résumé, knowledge, contact and (in later phases) managed publishing, followers, engagement and analytics.

Primary public URLs:
- Vercel: https://mghalaosimi-web.vercel.app
- Render current release: https://mghal-release-current.onrender.com
- Legacy Render: https://mghal-static.onrender.com
- API: https://mghal-api.m-gh-alaosimi.workers.dev

## 2. Final vision

Complete a secure, bilingual, accessible and maintainable professional identity platform. Preserve real projects and credentials, distinguish verified facts from pending source matching, and keep public content separate from authenticated administration. Do not fabricate metrics, content, credential mappings, screenshots or proficiency levels.

## 3. Approved decisions and safety boundaries

- Keep the project incremental; do not recreate it.
- Never modify `main`, force-push, merge a PR, or retarget a PR without explicit approval and reconciliation.
- Never apply production D1 migrations or alter production data/secrets without explicit approval.
- Never delete project assets, repositories, credentials or historical records.
- Never create a default owner account or invent/reveal credentials.
- No mock APIs or synthetic production content.
- Preserve the distinct Manar Schedule System and Al-Manar Schedule System records.
- Academic field is Information Technology; cybersecurity is an interest, not the academic specialization.
- Public branding uses the M.GH.AL identity and the approved restrained navy/blue/white/gray/champagne-gold system.
- Keep Render and Vercel output parity as a release requirement; do not claim parity while they serve different revisions.

## 4. Technical architecture

- Public site: static bilingual HTML/CSS/JS; TypeScript build tooling; Node.js 24.x declared in `package.json`; generated project-detail pages and sanitized `public/` output.
- Backend: Cloudflare Worker `mghal-api`, source in `mghal-backend/worker.production.js`.
- Database: Cloudflare D1 `mghal-db`; binding `DB`.
- Existing Worker bindings verified: D1 `DB`, `ALLOWED_ORIGINS`, `RATE_LIMIT_PER_MINUTE`, `SESSION_TTL_SECONDS`. No secret values are recorded here.
- Deployment targets: Render static service(s) and Vercel project `mghalaosimi-web`.

## 5. Public website status

**Render current release:** service `mghal-release-current` (`srv-dblr12ou01pc739c9img`) is LIVE on code commit `ed3beed547d03949c1fef085e1b85f97003efb93` (deployment `dep-dbme06ql7uoc73cubq10`). Published path is `public`; build command is `npm ci && npm run build`. Live page inspection shows the current bilingual identity presentation, 10 projects and 21 certificates. The admin page includes the bootstrap-recovery form, shown when the Worker reports `rotationRequired: true`.

**Vercel:** project `mghalaosimi-web` exists. The latest listed production deployment was ERROR on `main` commit `d7378bffeb55ca957829995fb4fee8355181d792`, with build error `ENOENT` and message `npm run quality` exited with 254. A previous production deployment on `22cc0d3bee06141b9031c62143775e27ee024c8e` was READY. The public alias `mghalaosimi-web.vercel.app` currently serves older content (9 projects; 21 credential records with only 18 detailed records). Do not describe Vercel as current-release parity.

**Other Render services:** `mghal-release` tracks `fix/mghal-dual-deploy-hardening-2026-11-05`; `mghal-official` tracks `main`; `mghal-static` tracks `fix/site-quality-audit-2026-10-31`. Do not confuse these with `mghal-release-current`.

## 6. Administration panel

- Static admin UI exists at `admin/index.html` with `assets/admin.js` and `assets/admin.css`.
- Worker contains admin authentication, session handling, RBAC, content CRUD for projects/certificates/articles/skills/education/achievements/identity/technologies, media handling, follower/comment moderation and analytics endpoints.
- Roles present in D1: `owner`, `editor`, `analyst`.
- Admin account count is **0**. Production Worker Version 16 reports `available: true`, `ownerExists: false`, and `rotationRequired: false`. The `OWNER_BOOTSTRAP_TOKEN` secret binding is not configured; no owner account has been created.
- A bootstrap hash exists in `site_settings`; the plaintext token is not available in this record. Never guess, retrieve, or disclose bootstrap credentials.
- The development branch contains the complete recovery UI and secret-gated rotation route. Production Version 16 received the separately reviewed minimal recovery patch after the user's explicit approval; the secret remains user-controlled and the owner form must be completed by the user.

## 7. API status

Live read-only checks on 2026-11-06:
- `GET /health` → `status: ok`, `database: connected` on Worker Version 16.
- `GET /api/public/projects?locale=en` → HTTP 200, 10 published project records.
- `GET /api/public/certificates` → HTTP 200, 21 published certificate records.
- `GET /api/public/skills` → successful JSON response.
- `GET /api/public/technologies` → successful JSON response; currently empty.
- `GET /api/public/followers/count` → successful JSON response; currently reports 1 consented active follower.
- `GET /api/admin/bootstrap/status` → successful JSON response; bootstrap available, no owner.
- These checks establish route responses, not a complete security, CORS, browser or load test.

## 8. Database status

Cloudflare D1 database: `mghal-db`; ID `1e5682c3-6a68-4fe5-b2c5-01f9fbe1aabd`. Cloudflare metadata reports 25 tables and 401,408 bytes.

Read-only row counts at last verification:
| Table | Rows |
|---|---:|
| projects | 10 |
| certificates | 21 |
| skills | 21 |
| education | 1 |
| identity_profiles | 2 |
| followers | 20 |
| reactions | 3 |
| analytics_events | 63 |
| admin_users | 0 |
| technologies | 0 |
| articles | 0 |
| media | 0 |
| comments | 0 |

Note: the public followers-count endpoint counts only active followers with explicit consent; it returned 1, not the total 20 follower rows.

Applied migration records verified:
- `0001_core_platform`
- `0002_admin_permissions`
- `0003_project_localization`
- `0004_d1_media_storage`
- `0005_technology_visibility`

`PRAGMA foreign_key_check` returned no rows. All D1 checks were read-only; no rows were written.

## 9. Authentication and permissions

- Admin sessions store token hashes; the Worker verifies bearer sessions and checks role-permission mappings.
- Password hashes use PBKDF2-SHA-256 in the Worker implementation.
- One-time owner bootstrap and secret rotation routes exist in the active production Worker Version 16; `rotationRequired=false` until the user configures the Worker Secret. No owner account exists.
- Never add a default owner/password, bypass bootstrap, or expose a bootstrap hash/token.
- Confirm login, logout, session expiry, RBAC and CORS with an authenticated browser test after secure owner bootstrap.

## 10. Projects and credentials

- D1 and current Render release contain 10 project records and 21 certificate records.
- Credential inventory: 14 Cisco, 6 Edraak, 1 OpenJS/Linux Foundation JSNAD.
- JSNAD identifier: `JSNAD-ALOSEIMI-20241112`; issue date: 2024-11-12.
- Original source-to-certificate matching remains incomplete for some Cisco records. Do not fabricate QR, PDF, image or badge mappings.
- Technologies and media tables are currently empty; populate only from authentic source material.
- Project lifecycle states must remain explicit; do not discard experimental, incomplete, paused or private project records.

## 11. Git branches, commits and PRs

Repository default branch is `main`, currently at `d7378bffeb55ca957829995fb4fee8355181d792`.

Current PR:
- PR **#12**, “Expand M.GH.AL credentials, projects and research sections”.
- State: OPEN, not merged; draft=false; mergeable=true at last read.
- Last verified code head: `feat/mghal-credentials-projects-expansion-2026-11-05` at `980b98f2c2f53699c8e8a0f8cd594e1a163160b0`; this state-file refresh is a subsequent documentation-only commit.
- Base: `feat/mghal-complete-platform-2026-11-01` at `bea6e75b452386c60e9bd5c434ce2189635de2ef`.
- PR contains 99 changed files and 281 commits at the latest metadata read; GitHub reports mergeable=true and mergeable_state=unstable while checks are still running.
- The platform base branch and `main` are **diverged**: platform branch is 323 commits ahead and 19 behind `main`. This is a verified compare result; do not merge or retarget without deliberate reconciliation.
- The PR head is not the production branch and must not be promoted automatically.

Other relevant branches include `feat/mghal-visual-redesign-2026-11-03`, `feat/mghal-visual-redesign-completion-2026-11-04`, `fix/mghal-dual-deploy-hardening-2026-11-05`, `fix/site-quality-audit-2026-10-31` and `feat/platform-phases-1-3-2026-11-01`. Preserve them.

## 12. CI/CD and deployment evidence

On the previously deployed code head `ed3beed...`:
- GitHub Actions **M.GH.AL Backend CI** run `42098683461`: completed SUCCESS on backend implementation commit `b1d19925...`, including five bootstrap-rotation regression tests.
- GitHub Actions **Website Quality** run `42099101015`: full website quality suite completed SUCCESS on `ed3beed...`; browser audit stage (Chromium, accessibility, keyboard, reflow, print and Lighthouse) was still in progress at last read. An earlier UI-test run failed; the over-escaped assertions were corrected in `ed3beed...` and the full suite then passed.
- Render `mghal-release-current`: deployment `dep-dbme06ql7uoc73cubq10`, LIVE on `ed3beed...`.
- Both Vercel preview status checks on `ed3beed...` returned SUCCESS; this does not change the older public production alias.
- Cloudflare Worker `mghal-api`: production Version **16** is active at 100%, version ID `1c7c5b7f-a2d7-4d05-8583-15040fcaf165`, deployment ID `407e2059-10ee-49cf-a0bc-b4742c1aba1c`. It retains the existing D1 binding. The production recovery patch is deployed; `OWNER_BOOTSTRAP_TOKEN` is not yet configured and no owner account exists.
- Version 14 ID: `509e6147-1e3a-4fa9-9bee-7fc3d7acf7e3`; superseded by version 15.
- CI success does not equal full production acceptance. Manual assistive-technology, keyboard, 200%/400% reflow, real-device and print/PDF acceptance remain open.

## 13. Open defects and release blockers

**P0 — Owner bootstrap**
- No admin owner exists. The existing bootstrap hash is present, but its plaintext token is unrecoverable.
- The development branch and Render admin UI now contain the tested end-to-end recovery flow. Configure a high-entropy `OWNER_BOOTSTRAP_TOKEN` as a Cloudflare Worker secret, deploy the updated Worker, use the admin recovery form to call `POST /api/admin/bootstrap/rotate`, then complete one-time owner bootstrap and remove the secret binding.
- No secret has been configured and no production Worker/D1 change has been made. Configuration, Worker deployment and rotation require explicit approval. Render static auto-deployment from the development branch does not update the Worker or D1.

**P1 — Vercel/Render divergence**
- Current Render release is live on PR head; Vercel's latest production deployment failed on `main` and its public alias serves older content.
- Investigate the Vercel build error, reconcile branch/deployment source deliberately, then prove both platforms serve the intended same commit before release.

**P1 — Content completion**
- Technologies and media are empty.
- Some original certificate assets still need exact title/badge mapping.
- Articles are empty; do not publish invented articles.

**P1 — Acceptance testing**
- Complete manual keyboard and assistive-technology review, 200%/400% reflow, physical-device testing, print/PDF review, and authenticated admin workflow tests after owner bootstrap.
- Verify CORS allow/deny behavior from real browsers and test all public API routes against the live Worker.

## 14. Risks

- PR base divergence from `main` (19 commits behind) creates integration risk.
- Vercel production error and stale public content create inconsistent public identity surfaces.
- No owner account means the admin console is not operational for an authorized administrator.
- Empty technologies/media/articles limit completeness; filling them with fabricated content is prohibited.
- D1 stores uploaded media blobs; monitor storage and row-size constraints before large uploads.
- Current live API smoke checks are read-only and do not establish full security certification.

## 15. Completed work (evidence-backed)

- Current PR head and implementation commit identified and confirmed.
- Backend CI passed on the bootstrap-rotation implementation; full website quality suite passed on the latest UI commit.
- Render current release is LIVE with the admin recovery form.
- Production Worker remains version 15; the new rotation route is not deployed and no production secret is configured.
- Worker version 15 is deployed at 100% with the D1 binding.
- D1 migrations 0001–0005 are recorded as applied.
- D1 inventory and foreign-key check read successfully; no FK violations.
- Worker health and key public API routes returned successful responses.
- Current public Render page exposes the expanded 10-project / 21-certificate inventory.

## 16. Remaining work (ordered)

1. Obtain explicit approval to configure `OWNER_BOOTSTRAP_TOKEN` as a Cloudflare Worker secret and deploy the reviewed Worker change; do not ask the user to paste the secret into chat.
2. Use the admin recovery form to rotate the stored bootstrap hash, perform the one-time owner bootstrap under user control, and remove the secret binding.
3. Verify authenticated admin login, session lifecycle, RBAC and content CRUD in a controlled test.
4. Diagnose Vercel production build error and reconcile Vercel source/branch with the intended release without touching `main` until approved.
5. Populate technology and media records from authentic source files; reconcile certificate mappings.
6. Complete manual accessibility, device, reflow and print acceptance.
7. Finalize cross-platform release parity and public SEO/indexing checks.

## 17. Last verified checkpoint

At the latest verification on 2026-11-05:
- PR #12 remains open and unmerged; mergeability is true while GitHub reports checks as unstable/in progress.
- Last verified code commit is `ed3beed547d03949c1fef085e1b85f97003efb93`.
- Render current release is LIVE on that code commit with the updated admin UI.
- Worker version 15 is active.
- Backend CI is successful; the full Website Quality suite is successful on the latest code commit, while browser/Lighthouse audits remain in progress at last read.
- D1 contains the inventory listed above; no admin owner exists.
- Vercel production is not in parity and latest deployment failed.

## 18. Exact next task

**P0: Activate the reviewed end-to-end bootstrap-recovery flow.** The development branch and Render admin UI contain the secret-gated rotation flow; Backend CI and the full website quality suite passed. Production still runs Worker version 15 and has no `OWNER_BOOTSTRAP_TOKEN` secret. Obtain explicit approval before configuring the secret and deploying the Worker. Never request or store the secret in chat. After deployment, use the recovery form to rotate the hash, create the first owner once, remove the secret binding, then verify login/RBAC.

## 19. Context-management policy

- Update this file only after evidence-backed changes.
- Record timestamp, branch, commit, deployment/version IDs, CI run IDs and actual test outcomes.
- Keep stable architecture/decisions concise; keep open tasks and operational evidence current.
- Do not copy source files, full logs, secrets or full conversation history into this document.
- At handoff, read this file and verify mutable state again before acting.


---

## 20. Live verification addendum — 2026-11-06 (Asia/Aden, UTC+03:00)

This addendum supersedes conflicting operational statements in earlier sections until a newer verification is recorded. All production checks below were read-only.

### Repository and pull request
- Repository branches include `main`, `feat/mghal-credentials-projects-expansion-2026-11-05`, `feat/mghal-complete-platform-2026-11-01`, `fix/mghal-dual-deploy-hardening-2026-11-05`, and the preserved redesign/quality branches.
- PR #12 remains OPEN and unmerged (GitHub issue snapshot). Its description still contains the historical head `81eada27...`; do not treat that description as current branch-head metadata. The latest observed deployment on the development branch is documentation commit `d58c5eba83c968e70586f765d4aa1d02a2b59051`; latest verified code commit remains `ed3beed547d03949c1fef085e1b85f97003efb93`.
- No merge, retarget, force-push, or main-branch change was performed.

### Live deployments
- Render `mghal-release-current` is LIVE on documentation commit `6814282602e6e6acf8c0d815cb12253410f5de6f`, deployment `dep-dbmhu30473hc73d5si20`; it tracks the development branch and publishes `public` using `npm ci && npm run build`.
- Live Render root returned HTTP 200 and exposed 10 project records and 21 credential records.
- Vercel latest inspected production deployment remains ERROR on `main` commit `d7378bff...`. Build logs identify the exact cause: Vercel runs `npm run quality` at repository root, but `/vercel/path0/package.json` does not exist (npm ENOENT). Do not change Vercel project/build settings or promote another branch without approval.
- A Vercel Preview deployment for the development branch documentation commit `d58c5eba...` is READY. Preview readiness is not production parity.

### Worker and API
- Cloudflare `mghal-api` remains on Worker Version 15, Version ID `01abb3a3-1313-4782-a90d-59abcbf90d40`, deployment ID `f710e941-a8da-4129-b4d6-d09d1a248c49`, routed at 100%.
- Live `GET /health` returned HTTP 200 with `status: ok` and `database: connected`.
- Live `GET /api/admin/bootstrap/status` returned HTTP 200: `available: true`, `ownerExists: false`.
- Live `GET /api/public/projects` returned HTTP 200 with 10 records; `GET /api/public/certificates` returned HTTP 200 with 21 records.
- No Worker version, secret, binding, route or production setting was changed.

### D1 read-only verification
- Database metadata: 25 tables; 401,408 bytes; APAC.
- Current counts: projects 10; certificates 21; admin_users 0; technologies 0; articles 0; media 0; followers 20.
- Applied migration records: `0001_core_platform`, `0002_admin_permissions`, `0003_project_localization`, `0004_d1_media_storage`, `0005_technology_visibility`.
- The queries returned zero rows written and `changed_db: false`. No migration or data write was performed.
- Existing distinction remains: the public follower count is consent-filtered and is not the raw `followers` table row count.
- The live certificates API currently returns null `image_media_id`, `pdf_media_id` and `qr_url` for all 21 records. Three Cisco entries are generic additional-record labels without individual certificate titles; the six Edraak entries currently have no issue dates or verification URLs. This establishes missing API/database mappings, not that original certificate files do not exist elsewhere. Preserve source assets and reconcile exact records before claiming the public credential gallery is fully linked.

### CI verification
- Backend CI run `42099111695` completed SUCCESS on code commit `ed3beed...`.
- Website Quality run `42099101015`: the full quality-suite step completed SUCCESS, but the real-browser accessibility/keyboard/reflow/print/Lighthouse step was CANCELLED. A later run `42099111618` was also CANCELLED. Therefore browser/Lighthouse acceptance is OPEN, not passed.
- Vercel Preview status checks for deployment `dpl_G1caVDBgP7paMYpJJwmdThbL46g7` reported SUCCESS; this does not alter the production failure.

### Current blockers and exact next actions
1. **P0 — secure owner bootstrap:** no admin owner exists. The branch-only secret-gated bootstrap-recovery implementation is not deployed to Worker v15. Explicit approval is required before configuring `OWNER_BOOTSTRAP_TOKEN` and deploying the Worker. The secret must be created through the provider UI/secure secret channel, never pasted into chat. User-controlled one-time owner creation and subsequent secret removal remain required.
2. **P1 — Vercel root build configuration:** diagnose and propose a safe project-level build configuration or root-directory correction in a non-production preview; do not alter production settings without approval.
3. Complete authenticated login/session/RBAC/CRUD verification after owner bootstrap.
4. Populate technologies/media only from authentic sources; reconcile original certificate files and exact issuer mappings.
5. Complete browser accessibility, keyboard, reflow, real-device and print/PDF acceptance.
6. Verify Vercel/Render release parity and public SEO/indexing after the release path is approved.

### Last verified checkpoint
- Latest observed Render deployment: `d58c5eba...` LIVE.
- Latest verified code commit: `ed3beed...`; later `d58c5eba...` is documentation-only.
- Worker v15 active; D1 migrations 0001–0005 applied; no admin owner.
- API health is healthy; production Vercel remains failed due to missing root `package.json`.
- **Next safe work:** investigate the Vercel project build/root-directory configuration in read-only mode and prepare a preview-only correction proposal. **Next production action:** wait for explicit approval for Worker secret configuration/deployment and owner bootstrap.


---

## 21. Live verification addendum — 2026-11-06 03:31 Asia/Aden (UTC+03:00)

This is the newest verified checkpoint and supersedes older deployment/CI statements above. All Cloudflare/D1 checks were read-only; no production mutations were performed.

### Repository, PR and CI
- Development branch head: `00cc8446a07342a6d773bd930d9383e3501fb9e4` (`docs(state): record live API and credential mapping checks`); this commit is documentation-only. Latest code changes remain at `ed3beed547d03949c1fef085e1b85f97003efb93`.
- PR #12 remains OPEN, unmerged, and GitHub reports mergeable=true. Current head matches `00cc8446...`; 284 commits, 99 changed files.
- Backend CI run `42137072152` completed SUCCESS on `00cc8446...`.
- Website Quality runs `42137072331` and `42137063315` both completed SUCCESS on `00cc8446...`. The successful job completed the full quality suite and Chromium-based accessibility, keyboard, reflow, print and Lighthouse audit steps.
- The earlier Website Quality run on `6814282...` was cancelled while a duplicate run was active; it is superseded by the two successful runs on `00cc8446...`.
- No main-branch update, PR merge, retarget, force-push or destructive Git operation occurred.

### Current deployment state
- Render `mghal-release-current` is LIVE on `00cc8446...`, deployment `dep-dbmhuabbc2fs73f7pmng`.
- Vercel Preview deployment `dpl_3r599YnDjiu4kCGrRRAXC2b5Rigm` is READY on the same `00cc8446...` commit. This is a preview deployment, not production.
- Vercel production remains ERROR on `main` commit `d7378bff...`; the failed build log shows Vercel invokes `npm run quality` from `/vercel/path0` and cannot find `/vercel/path0/package.json`.
- Root-cause comparison: the current development branch contains a root `package.json`; `main` does not. Thus this is a source-branch content gap, not evidence that the current development branch lacks a package manifest. The Vercel project has Node `24.x`, framework `null`, and SSO protection enabled for non-custom deployment URLs. No Vercel project setting or production alias was changed.
- Git comparison confirms the platform PR base is 323 commits ahead and 19 behind `main`; PR head is 607 commits ahead and 19 behind `main`. Do not merge this large divergent branch directly into `main` or switch Vercel production branch without an explicit integration/release decision.

### Cloudflare Worker, API and D1
- `mghal-api` remains on Worker Version 15 at 100%: Version ID `01abb3a3-1313-4782-a90d-59abcbf90d40`, deployment ID `f710e941-a8da-4129-b4d6-d09d1a248c49`.
- Live `GET /health` returned `status: ok`, `database: connected`.
- Live bootstrap status remains `available: true`, `ownerExists: false`. No owner account exists.
- D1 read-only counts: projects 10; certificates 21; roles 3; admin_users 0; admin_sessions 0; media 0; technologies 0; migrations 5. Database metadata remains 25 tables / 401,408 bytes.
- Migration records `0001_core_platform` through `0005_technology_visibility` are present. The read-only query reported zero rows written and `changed_db: false`.
- No Worker version, secret, binding, route, D1 migration or production setting was changed.

### Credential mapping audit
- The 21 D1 certificate records are grouped as 14 Cisco, 6 Edraak and 1 JSNAD.
- All 21 D1 records currently have null `image_media_id`, `pdf_media_id` and `qr_url`. Cisco records currently point to the generic Credly profile URL rather than individual badge URLs; Edraak D1 verification URLs are null.
- Eleven Cisco rows have named titles; three are generic placeholders (“سجل اعتماد إضافي 12/13/14”). The static certificate page has original image assets for eight Cisco entries, while six Cisco cards remain text-only.
- The repository includes original Edraak PDFs for UI/UX Design, Interaction Design, UX Design and User Interface Design Principles; original image/PDF assets are not yet connected to D1 media records. Do not infer exact QR or verification URL-to-title matches without inspecting the relevant original document.
- The public static certificate page and the D1-backed API therefore have different levels of media completeness. Preserve all 21 records and reconcile original files before changing any record.

### Current next actions
1. **P0 — Owner bootstrap remains approval-gated.** Configure a high-entropy `OWNER_BOOTSTRAP_TOKEN` as a Cloudflare Worker Secret and deploy the reviewed Worker only after explicit approval. Never paste the secret into chat. After deployment, use the recovery UI, create the first owner once, remove the secret binding, and verify login/RBAC.
2. **P1 — Vercel production integration.** Decide how to reconcile the 19-commit divergence and 607-commit feature history. Keep work in preview until a release target is explicitly approved; do not alter production project settings or `main` autonomously.
3. **P1 — Credential media reconciliation.** Map the original Cisco/Edraak/JSNAD files, individual badge/verification URLs and QR codes to the correct certificate records. Keep D1 writes approval-gated.
4. Populate technologies/media from authentic sources only; both D1 tables are currently empty.
5. Complete authenticated admin acceptance after owner bootstrap and perform public SEO/indexing and cross-platform parity checks.

### Exact stop point
- Latest branch head: `00cc8446...`; latest code commit: `ed3beed...`.
- Latest Render deployment and Vercel Preview are both READY/LIVE on `00cc8446...`.
- Backend CI and both full Website Quality runs succeeded on `00cc8446...`.
- Production Worker v15 and D1 remain unchanged; no owner exists.
- Safe read-only diagnosis of the Vercel production failure is complete. Next production-changing action is blocked on explicit approval for Worker secret configuration/deployment; no production action was taken.


---

## 22. Public content delivery integration audit — 2026-11-06

Read-only source inspection found an additional functional gap in the admin publishing architecture:

- `GET /api/public/certificates` returns the 21 published D1 records, but `certificates.html` contains hardcoded certificate markup and does not call that endpoint. `assets/credentials.js` only filters existing DOM cards and contains no `fetch()`.
- The public projects listing script `assets/project-listing.js` loads `/assets/projects/catalog.json`; it does not load `/api/public/projects`. The listing therefore remains a static catalog rather than a live projection of admin-managed D1 projects.
- Consequently, successful admin CRUD/API writes are not yet proven to propagate to the public certificate and project pages. This is a release-blocking integration gap for the promised “publish in Admin → appear publicly” workflow.
- The Worker currently serves `/api/public/media/{id}` only when the media MIME type is `image/*`. Admin upload accepts PDFs and certificate records have `pdf_media_id`, but there is no public PDF delivery path in the current Worker route. Do not expose arbitrary uploaded PDFs; a safe implementation should serve a PDF only when it is referenced by a published certificate.
- No source files, records, or settings were changed during this audit.

### Next safe engineering batch
1. Design a progressive-enhancement content adapter for certificates and projects: fetch the real public API, retain authentic static fallback content when the API is unavailable, and avoid mock data.
2. Add a protected-by-publication PDF media route (published certificate reference required), with MIME, `nosniff`, inline disposition and regression tests.
3. Add integration tests proving published D1 records render on the public pages and unpublished records remain hidden.
4. Keep the work on the development branch. Do not write production D1 media rows until the owner account and upload workflow are safely available.

This integration batch is independent of the owner bootstrap, but its production use still depends on a reviewed Worker deployment and authentic media mappings.


---

## 23. Backend media-delivery fix — 2026-11-06 (latest code checkpoint)

- Added a public media delivery branch for `application/pdf` only when the file is referenced by `pdf_media_id` from a certificate with `is_published=1`.
- Existing public image delivery remains supported. PDF responses use `Content-Type: application/pdf`, inline disposition and `X-Content-Type-Options: nosniff`.
- Worker code commit: `621447a6d45f2bde9c2afc1df7527d1abbb734ed`.
- Regression-test commits: `dc27587f59da1180d3fb2e919fadab6e51667248` and `83bf95a4ef23d9b4690f66b7d0d3d1bcb1fb468d`.
- Backend CI run `42138005255` completed SUCCESS on `83bf95a...`; Vitest reported 2 files and 28 tests passed, and `node --check worker.production.js` passed.
- Render static deployment `dep-dbmi1rfb9u1s73d2j9h0` is LIVE on `83bf95a...`. Vercel Preview `dpl_2kufrquGuuAM3adzjeTYRonA1jzF` is READY on the same commit. Neither deployment updates Cloudflare Worker.
- Website Quality full quality-suite step passed on `83bf95a...`; the real-browser Chromium accessibility/reflow/print/Lighthouse stage was still in progress at last read. Do not mark that final browser stage passed until its run completes.
- Production Worker remains Version 15; no `OWNER_BOOTSTRAP_TOKEN` was configured, no Worker version was deployed, no owner was created, and no D1 row/migration was written.
- Remaining: connect public certificate/project pages to their actual public API while retaining static fallback; construct public PDF links from `pdf_media_id`; map authentic source files and individual verification URLs. This work remains development-only until reviewed and deployed.


---

## 21. Production owner-recovery checkpoint — 2026-11-06

### Explicit authorization and deployment
- User explicitly approved the owner-recovery procedure, with the conditions that no secret be sent in chat and no owner account be created without the user's control.
- Live Worker `mghal-api` was upgraded from Version 15 to Version 16.
- Active version ID: `1c7c5b7f-a2d7-4d05-8583-15040fcaf165`.
- Active deployment ID: `407e2059-10ee-49cf-a0bc-b4742c1aba1c`, routing 100% to Version 16.
- This was a minimal production-baseline patch: constant-time secret comparison, bootstrap rotation readiness status, `POST /api/admin/bootstrap/rotate`, and validation that first-owner bootstrap matches the configured Worker secret when present.
- Existing bindings were preserved: `ALLOWED_ORIGINS`, D1 `DB`, `RATE_LIMIT_PER_MINUTE`, and `SESSION_TTL_SECONDS`. No D1 migration or data write was run during deployment.
- **Source parity note:** the deployed patch was applied to the active production Worker source to avoid deploying unrelated API changes from the still-open development PR. The development branch already contains the broader reviewed recovery implementation; exact source/version parity remains a follow-up before any future full Worker release.

### Post-deployment verification
- `GET /health`: HTTP 200, `status=ok`, `database=connected`.
- `GET /api/admin/bootstrap/status`: HTTP 200, `available=true`, `ownerExists=false`, `rotationRequired=false`.
- Worker secret bindings remain empty; `OWNER_BOOTSTRAP_TOKEN` has **not** been configured yet.
- Render admin page `/admin/`: HTTP 200 and the secret-rotation form is present.
- No owner account was created. No credentials or secret values were generated, viewed, or sent in chat.

### User-controlled next steps — waiting
1. In Cloudflare Dashboard → Workers & Pages → `mghal-api` → Settings → Variables and Secrets, add a **Secret** named `OWNER_BOOTSTRAP_TOKEN` with a cryptographically random value of at least 32 characters (prefer 64 random hexadecimal characters). Save/deploy the Worker configuration. Do not use Plaintext Variables and do not share the value in chat.
2. Open `https://mghal-release-current.onrender.com/admin/` over HTTPS. Enter that same secret into the rotation form. The UI calls the rotation endpoint and carries the token into the one-time owner setup form.
3. User personally enters the owner display name, email and a unique password (12+ characters) and submits account creation.
4. After user confirms completion, verify the owner exists and remove the temporary Worker secret binding. Do not create or alter the owner account on the user's behalf.

### Current stop point
- Production recovery endpoint is deployed and healthy.
- Waiting for user to configure the Worker secret in Cloudflare Dashboard and complete the owner form themselves.
- Do not repeat Worker deployment unless verification shows the secret configuration did not activate the new code.


---

## 22. Public certificate synchronization — 2026-11-06

- Added `assets/certificate-sync.js` to synchronize both Arabic and English certificate pages with `GET /api/public/certificates`.
- Wired the script into `certificates.html` and `en/certificates.html`; the page's existing static certificate cards and original document/image assets remain the initial fallback.
- Stable slug mappings cover the existing 21 records (14 Cisco, 6 Edraak, 1 OpenJS/Linux Foundation JSNAD).
- On a successful API response, cards absent from the published dataset are hidden; API titles, issuer labels and descriptions update existing content as available. Published PDF media IDs are converted to the guarded public media route; verification and QR URLs are added only when supplied by the record.
- API-provided text is assigned with `textContent`; no API HTML is injected. If the request fails or the response is invalid, the script logs a warning and leaves the original static content intact.
- Added `scripts/test-certificate-sync.mjs` and included it in `npm run test:unit`. The regression checks cover both language pages, all 21 mappings/cards, safe text rendering, published-record filtering and static fallback.
- Commits: script `f5414f1de167aefa0ac1427d621ec5d57aeb18cf`; Arabic page `bf1b886c0e5e8703b20b3b381e2d58dfb68b6d23`; English page `11082081a2677f679a719daae85b8a17cfe96e23`; regression test `be78081735b3941af00b20141fc71c71b29338f2`; package test integration `000aa33776b22c0b5feef16c73c68cb13d314455`.
- GitHub Actions runs triggered by the latest package commit: Website Quality run `42140037779` (pending at this checkpoint) and Backend CI run `42140037813` (in progress). No test result is claimed until these runs complete.
- No changes were made to `main`, PR targets, Cloudflare Worker, D1, production secrets or owner records in this task. The certificate UI change is branch-only; production visibility is not claimed.


### CI follow-up
- Backend CI run `42140037813` completed SUCCESS; dependency installation and `npm run check` passed.
- Website Quality run `42140037779` was cancelled by workflow scheduling before jobs ran. Its cancelled quality job (`127637965266`) was successfully re-requested through GitHub Actions; the rerun has not yet returned a completed result. Do not treat the website quality suite as passed until the rerun completes.


---

## 23. Public project API synchronization — 2026-11-06

- Updated `assets/database-content.js` so bilingual project pages consume the published `GET /api/public/projects?locale=ar|en` response as the primary source for project names, summaries and statuses.
- Project repository and live links prefer published API values, with authentic static-catalogue links retained as fallback when optional API fields are empty. External links are restricted to HTTPS; unsafe schemes are rejected.
- Project cover media uses the guarded public media route when `cover_media_id` is present; otherwise the existing local gallery/illustrative asset is preserved.
- After a successful non-empty API response, cards absent from the published project set are hidden. If the API fails or returns no records, the original static catalogue remains visible.
- Added `scripts/test-project-api-sync.mjs` and included it in `npm run test:unit`. Updated the admin/platform test to recognize the separated certificate and project adapters.
- Commits: project API adapter `fa91ccad02d1e6edb83d39909f7597ba98e539b9`; integration test `d542ee8c409f91ef1f213a420b809e228ffa947e`; test command `c4255fbcfd6003a1244203e35a8559553be4a314`; test alignment `84c37bd180a9e14ee8b002104fc77e8877a94e90`; HTTPS link hardening `e0a969e0710175e05caf78cbec0e17f3a0ff51a2`; URL regression assertion `34adcdd98630befcaa39f5fe0c52432c05146b4c`.
- Live API shape was checked read-only: 10 published projects and 21 published credentials. This does not prove the website deployment is already consuming the latest code.
- GitHub Actions on `34adcdd...`: Website Quality run `42140651039` and Backend CI run `42140651051` were `in_progress` at the last check. Two Vercel preview status checks were `failure`; investigate their deployment logs before considering the branch preview ready. No successful CI result is claimed for these latest commits yet.
- The local checkout's `npm run quality` had passed before the GitHub-side commits were applied, but it was not the final remote branch head. Treat the current remote CI runs as authoritative.
- No changes were made to `main`, PR targets, Cloudflare Worker, D1, production secrets, or owner records in this project API batch.


---

## 24. Website Quality CI dependency correction — 2026-11-06

- The first Website Quality run for the public project API changes, run `42140651039`, failed before executing site tests. The failing command was `npm run typecheck`; the runner reported `sh: 1: tsc: not found`.
- The job's install step used `npm ci --ignore-scripts`, and the install output reported only the root package despite TypeScript being declared as a development dependency in the lockfile. The failure is an environment/dependency-install issue, not a failing TypeScript diagnostic or site assertion.
- Updated `.github/workflows/quality.yml` to run `npm ci --include=dev --ignore-scripts`, explicitly including the TypeScript compiler and all other development dependencies.
- Workflow fix commit: `d443a14535b2fccce9ea3743f74d9660330b4098`.
- The replacement workflow run has not yet been observed as started/completed at this checkpoint. Re-check the run associated with this commit before declaring Website Quality green.
- Backend CI run `42140651051` completed SUCCESS on the prior commit. Two Vercel status checks on `34adcdd...` were FAILURE; their deployment logs still require diagnosis. These checks do not authorize a production alias change.
- No production Worker, D1, secret, owner, `main` branch, or PR target was changed.


### Follow-up correction to Section 24

- Further inspection of the exact GitHub Actions merge commit showed that the actual root cause was the root `package.json` manifest: the TypeScript `devDependencies` entry had been dropped while updating the scripts, although `package-lock.json` still contained the TypeScript package. Consequently, `npm ci` installed only the root package and `tsc` was unavailable.
- The intermediate attempt to restore the dependency produced invalid JSON and Vercel correctly rejected that manifest. This was corrected by regenerating the complete manifest as valid JSON and restoring `devDependencies.typescript = 7.0.2`.
- Corrected package manifest commit: `e983a89e68a3265712d3e41434a49b5e4e5ecf8b`. The manifest was read back and parsed successfully; the lockfile already contains the matching TypeScript 7.0.2 entry.
- Vercel created new preview deployments for this commit: project `mghalaosimi-web` is BUILDING and project `mghal` is QUEUED at last observation. Earlier ERROR deployments are explained by the invalid package manifest and are not production deployments.
- Re-run/verify Website Quality against the corrected manifest before claiming green status. The previous run still failed on `tsc: not found`; the workflow's explicit `--include=dev` alone could not fix a missing package manifest dependency.


---

## 25. Project adapter test correction and current preview limits — 2026-11-06

- The Website Quality run `42141065203` on commit `a0af150...` completed the build, HTML/SEO/design/PWA/credential audits, and certificate sync tests. It then failed in `scripts/test-project-api-sync.mjs` because the test expected the previous direct repository expression, while the implementation had been hardened to use `safeExternalUrl(...)`.
- Updated the project integration test to assert HTTPS validation for both API repository URLs and static fallback repository URLs. The latest code commit for this correction is `980b98f2c2f53699c8e8a0f8cd594e1a163160b0`.
- Rewrote `assets/database-content.js` with normal source line breaks (no literal escaped newline sequences) and added `node --check` for both public API adapter scripts to the build command. This prevents a malformed browser adapter from passing static source assertions.
- Backend CI run `42141065149` completed SUCCESS on `a0af150...`.
- Both Vercel preview projects reached READY on `a0af150...`: `mghalaosimi-web` deployment `dpl_7aEwuPLD1scNja2V4Ev3nS5D5G9C` and `mghal` deployment `dpl_BohtGVsEcSxm8hy3ffndJy1actmZ`. These are previews, not production aliases.
- New Vercel builds for later commits are blocked by Vercel's reported `build-rate-limit`; do not keep triggering redundant deployments. The latest combined statuses on `980b98f...` report this limit for both preview projects.
- The latest Website Quality rerun for commit `980b98f...` has not yet been observed. Do not mark the website suite green until its GitHub Actions result is confirmed.
