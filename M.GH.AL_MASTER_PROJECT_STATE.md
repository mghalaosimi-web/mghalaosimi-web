# M.GH.AL — MASTER PROJECT STATE

> **Purpose:** Single concise source of truth for project continuation. This document records verified state, not assumptions.
> **Last verified:** 2026-11-05 (Asia/Aden, UTC+03:00)
> **Repository:** https://github.com/mghalaosimi-web/mghalaosimi-web
> **Current verification branch:** `feat/mghal-credentials-projects-expansion-2026-11-05`
> **Last verified implementation commit:** `b1d19925ba2a414cc8b85a7e3f5ae335eb0a07f3` (the follow-up state-document commit is documentation-only)

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

**Render current release:** service `mghal-release-current` (`srv-dblr12ou01pc739c9img`) is LIVE on commit `81eada27b9d22a4ffc5c872dd54dce7b9e0bc276`. Published path is `public`; build command is `npm ci && npm run build`. Live page inspection shows the current bilingual identity presentation, 10 projects and 21 certificates.

**Vercel:** project `mghalaosimi-web` exists. The latest listed production deployment was ERROR on `main` commit `d7378bffeb55ca957829995fb4fee8355181d792`, with build error `ENOENT` and message `npm run quality` exited with 254. A previous production deployment on `22cc0d3bee06141b9031c62143775e27ee024c8e` was READY. The public alias `mghalaosimi-web.vercel.app` currently serves older content (9 projects; 21 credential records with only 18 detailed records). Do not describe Vercel as current-release parity.

**Other Render services:** `mghal-release` tracks `fix/mghal-dual-deploy-hardening-2026-11-05`; `mghal-official` tracks `main`; `mghal-static` tracks `fix/site-quality-audit-2026-10-31`. Do not confuse these with `mghal-release-current`.

## 6. Administration panel

- Static admin UI exists at `admin/index.html` with `assets/admin.js` and `assets/admin.css`.
- Worker contains admin authentication, session handling, RBAC, content CRUD for projects/certificates/articles/skills/education/achievements/identity/technologies, media handling, follower/comment moderation and analytics endpoints.
- Roles present in D1: `owner`, `editor`, `analyst`.
- Admin account count is **0**. The live bootstrap status endpoint returns `available: true`, `ownerExists: false`.
- A bootstrap hash exists in `site_settings`; the plaintext token is not available in this record. The current Worker settings response did not show an `OWNER_BOOTSTRAP_TOKEN` binding. Do not attempt bootstrap with guessed credentials.
- A branch-only recovery route `POST /api/admin/bootstrap/rotate` now uses a high-entropy `OWNER_BOOTSTRAP_TOKEN` Worker secret, rejects weak/mismatched tokens, refuses rotation once any admin exists, and stores only the SHA-256 digest. Backend CI passed on the implementation commit. This code is **not deployed to the production Worker**; the secret is not configured. Production owner creation remains blocked pending explicit approval.

## 7. API status

Live read-only checks on 2026-11-05:
- `GET /health` → `status: ok`, `database: connected`.
- `GET /api/public/projects` → successful JSON response.
- `GET /api/public/certificates` → successful JSON response.
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
- One-time owner bootstrap route exists; no owner account exists yet. The development branch now contains a secret-gated rotation route and regression tests; production Worker version 15 does not yet contain this change.
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
- Last verified implementation head: `feat/mghal-credentials-projects-expansion-2026-11-05` at `b1d19925ba2a414cc8b85a7e3f5ae335eb0a07f3`; a later documentation-only commit updates this state file.
- Base: `feat/mghal-complete-platform-2026-11-01` at `bea6e75b452386c60e9bd5c434ce2189635de2ef`.
- PR contains 99 changed files and 278 commits at the latest metadata read.
- The platform base branch and `main` are **diverged**: platform branch is 323 commits ahead and 19 behind `main`. This is a verified compare result; do not merge or retarget without deliberate reconciliation.
- The PR head is not the production branch and must not be promoted automatically.

Other relevant branches include `feat/mghal-visual-redesign-2026-11-03`, `feat/mghal-visual-redesign-completion-2026-11-04`, `fix/mghal-dual-deploy-hardening-2026-11-05`, `fix/site-quality-audit-2026-10-31` and `feat/platform-phases-1-3-2026-11-01`. Preserve them.

## 12. CI/CD and deployment evidence

On PR head `81eada27...`:
- GitHub Actions **M.GH.AL Backend CI** run `42098683461`: completed, conclusion SUCCESS on implementation commit `b1d19925...` (including the bootstrap rotation tests).
- GitHub Actions **Website Quality** run `42098675537`: PENDING at last read on `b1d19925...`; prior Website Quality run `42098319326` completed SUCCESS on the documentation-only commit `393c199b...`.
- Render `mghal-release-current`: deployment `dep-dbmdut2vcj2c739oej0g`, LIVE on implementation commit `b1d19925...`.
- Cloudflare Worker `mghal-api`: version **15** remains the active 100% production deployment. Version ID `01abb3a3-1313-4782-a90d-59abcbf90d40`; deployment ID `f710e941-a8da-4129-b4d6-d09d1a248c49`; deployed 2026-11-05 19:28 UTC. It retains the D1 binding. The new bootstrap-rotation code exists only in the Git branch and has not been deployed to Cloudflare.
- Version 14 ID: `509e6147-1e3a-4fa9-9bee-7fc3d7acf7e3`; superseded by version 15.
- CI success does not equal full production acceptance. Manual assistive-technology, keyboard, 200%/400% reflow, real-device and print/PDF acceptance remain open.

## 13. Open defects and release blockers

**P0 — Owner bootstrap**
- No admin owner exists. The existing bootstrap hash is present, but its plaintext token is unrecoverable.
- A tested implementation is now on the development branch: configure a high-entropy `OWNER_BOOTSTRAP_TOKEN` as a Cloudflare Worker secret, deploy the updated Worker, call `POST /api/admin/bootstrap/rotate` with that value as a Bearer token, then perform the one-time owner bootstrap and remove the secret binding.
- No secret has been configured and no production Worker/D1 change has been made. Configuration, deployment and rotation require explicit approval.

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
- Backend CI passed on the implementation commit, including the new rotation tests.
- Render current release is LIVE on the implementation commit.
- Production Worker remains version 15; the new rotation route is not deployed.
- Worker version 15 is deployed at 100% with the D1 binding.
- D1 migrations 0001–0005 are recorded as applied.
- D1 inventory and foreign-key check read successfully; no FK violations.
- Worker health and key public API routes returned successful responses.
- Current public Render page exposes the expanded 10-project / 21-certificate inventory.

## 16. Remaining work (ordered)

1. Obtain explicit approval to configure `OWNER_BOOTSTRAP_TOKEN` as a Cloudflare Worker secret and deploy the reviewed Worker change; do not ask the user to paste the secret into chat.
2. Rotate the stored bootstrap hash through the new route, perform the one-time owner bootstrap under user control, and remove the secret binding.
3. Diagnose Vercel production build error and reconcile Vercel source/branch with the intended release without touching `main` until approved.
3. Verify authenticated admin login, session lifecycle, RBAC and content CRUD in a controlled test.
4. Populate technology and media records from authentic source files; reconcile certificate mappings.
5. Complete manual accessibility, device, reflow and print acceptance.
6. Finalize cross-platform release parity and public SEO/indexing checks.

## 17. Last verified checkpoint

At the latest verification on 2026-11-05:
- PR #12 remains open and unmerged; mergeability is true while GitHub reports checks as unstable/in progress.
- Last verified implementation commit is `b1d19925ba2a414cc8b85a7e3f5ae335eb0a07f3`.
- Render current release is LIVE on that implementation commit.
- Worker version 15 is active.
- Backend CI on the implementation commit is successful; Website Quality is pending at last read.
- D1 contains the inventory listed above; no admin owner exists.
- Vercel production is not in parity and latest deployment failed.

## 18. Exact next task

**P0: Activate the reviewed bootstrap-recovery path.** The development branch now contains the secret-gated rotation endpoint and regression tests; Backend CI passed. Production still runs Worker version 15 and has no `OWNER_BOOTSTRAP_TOKEN` secret. Obtain explicit approval before configuring the secret and deploying the Worker. Never request or store the secret in chat. After deployment, the user controls the one-time owner creation; remove the secret binding afterward and verify login/RBAC.

## 19. Context-management policy

- Update this file only after evidence-backed changes.
- Record timestamp, branch, commit, deployment/version IDs, CI run IDs and actual test outcomes.
- Keep stable architecture/decisions concise; keep open tasks and operational evidence current.
- Do not copy source files, full logs, secrets or full conversation history into this document.
- At handoff, read this file and verify mutable state again before acting.
