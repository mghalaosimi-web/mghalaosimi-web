# M.GH.AL — Phase 1 Historical Recovery & Branch/PR Reconciliation

**Snapshot:** 2026-11-12 (Asia/Aden)  
**Repository:** https://github.com/mghalaosimi-web/mghalaosimi-web  
**Operational anchor:** `fix/vercel-native-neon-api` — `ac21c3d0113d595ccb1dbec3dc381a8454b6d9f0`  
**Purpose:** evidence-based inventory of remote branches, pull requests, commit relationships, branch-only paths, CI state, and preserved work.  
**Safety:** this report does not merge, close, delete, force-push, rewrite history, change secrets, or alter production data.

> This report is a refreshed GitHub-source snapshot. It supersedes older branch/PR counts and stale current-head references in earlier recovery notes; it does not erase those historical reports.

## 1. Executive findings

- GitHub returned **40 remote branches** and **33 pull requests**: **21 open** (16 Draft), **10 merged**, and **2 closed without merge**.
- Six non-main branches have no PR head association: `backup/pre-credential-audit-2026-11-07`, `backup/pre-static-credential-project-audit-2026-11-07`, `chore/main-phase1-cleanup-2026-11-12`, `feat/phase2-ux-design-system-2026-11-08`, `feat/verified-project-portfolio-2026-10-31`, and `fix/owner-bootstrap-proxy-2026-11-06`. Two of these are low-delta historical snapshots; the others retain unique paths and must be preserved.
- The default `main` tree contains 95 entries and has **no root `package.json`, no `app/`, and no `pages/`**. It is the legacy static HTML site.
- The operational Next.js tree at `fix/vercel-native-neon-api` contains 431 tree entries, including `app/`, root `package.json`, `lib/`, and the Node/PostgreSQL backend.
- Commit comparison: operational anchor is **395 commits ahead of main and 0 behind**. PR #32 is **18 commits ahead of its Node backend base and 0 behind**. This operational line has not been merged into `main`.
- PR #33 is **21 commits ahead of PR #32's head, 0 behind**, with a net diff of 12 files. Its current diff is documentation/README-only; it is not a one-commit change as an older note implied.
- PR #31 is divergent from the operational anchor (**16 ahead / 85 behind**) and is documentation-only. PR #33 supersedes it as the current reconciliation note; PR #31 must not be merged wholesale.
- Several historical branches contain valuable project metadata and UI work not represented as files in the current Next.js tree. Their history is still available on GitHub; none was deleted.
- The current application backend is **Node.js + `pg` + a custom PostgreSQL prepared-query compatibility adapter + Neon target**, not Prisma. No `prisma/` path, `schema.prisma`, Prisma dependency, or Prisma client was found in the operational tree.
- No local workstation clone or local-only branch refs were exposed by the connected GitHub source. This report inventories GitHub remote refs only.

## 2. Repository and release-line relationships

| Reference | Current SHA | Relationship / evidence |
|---|---|---|
| `main` | `fdfea351455227f44e7f92e82166bfa7bdc5e1fe` | Default branch; legacy static HTML tree. |
| `feat/node-postgres-backend-2026-11-08` | `5533844490ea5a6f5c47070aa9c4cd01602c5bc5` | PR #25 head; PR #32 base. Operational anchor is 18 commits ahead. |
| `fix/vercel-native-neon-api` | `ac21c3d0113d595ccb1dbec3dc381a8454b6d9f0` | PR #32 head; current operational integration anchor. 395 commits ahead of main. |
| `chore/phase1-cleanup-operational-2026-11-12` | `faa0f74f96007275b261006d4f212e59c411fb4e` | PR #33 head; 21 commits ahead of PR #32 base, 12 changed files, net documentation/README-only diff. |
| `recovery/phase1-history-architecture-2026-11-10` | `fa25c4b87e822a1bf6c012284082c67854efaaec` | PR #31 head; 16 ahead / 85 behind operational anchor; divergent documentation branch. |

The 18 commits in PR #32 include the Vercel-native Node runtime, request-body streaming limits, password-hash constant-time comparison, PostgreSQL-compatible Google identity/reaction merge, OAuth return-path hardening, sitemap synchronization, and conflict-resolution merges. GitHub Actions on the PR #32 head returned success for Node API CI, Backend CI, and Next.js quality checks.

The 21 commits in PR #33 include credential-count corrections, removal of the obsolete Render badge/reference, Vercel/Neon state clarifications, historical-snapshot labeling, recovery inventory notes, and this reconciliation line's documentation updates. The current net PR diff contains 12 files and no application runtime file.

## 3. Complete remote branch inventory

Each row records the current remote branch head SHA and its associated PR, if any. PR status is the current GitHub state at the snapshot.

| Branch | Current head SHA | PR association |
|---|---|---|
| `audit/phase1-mghal-arfat-2026-11-08` | `b3cee4cb7dfa7b273631e7c6f9a2a2d670284717` | [#26](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/26) — open Draft |
| `backup/pre-credential-audit-2026-11-07` | `4652cb95547fc6c528bf8e063e052bdc9c9bcdf6` | No PR; 0 commits ahead of operational anchor, 328 behind |
| `backup/pre-static-credential-project-audit-2026-11-07` | `da37c189fe9ed2e1bae6e6b6f42913b149393bb6` | No PR; 2 branch-only files |
| `chore/main-phase1-cleanup-2026-11-12` | `0d208bd90e289a17455fe22d4c9161c717e28f65` | No PR; legacy static HTML snapshot |
| `chore/phase1-cleanup-operational-2026-11-12` | `faa0f74f96007275b261006d4f212e59c411fb4e` | [#33](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/33) — open Draft |
| `chore/unify-public-identity-2026-11-06` | `a6eec378a4c21266ebd742aadf026fde4bf73c4d` | [#13](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/13) — open Draft |
| `content/profile-photo-library-2026-11` | `2bccd990fd8526ad7d689a14fa004cb837bac8b9` | [#28](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/28) — merged into main |
| `design/arfat-inspired-ui-2026-11-07` | `3b046095bd46bd2db3b42c0a512528978ec0daf4` | [#18](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/18) — merged into main |
| `design/complete-reference-parity-2026-11-07` | `9a9d85002441a5c14184a5204bd84caaa07b6691` | [#19](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/19) — merged head differs; this branch continued after merge |
| `design/extra-reference-styling-2026-11-07` | `1b06d7d4481623cd68f31921477f4f4fb7ae9348` | [#21](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/21) — open Draft |
| `design/reference-details-followup-2026-11-07` | `cf0611ea878851f75f35f852919d0b691cb12c5c` | [#20](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/20) — merged into main |
| `feat/mghal-ai-platform-free-tier-2026-11-06` | `ea738c972f91178313305ee19bc7d73e51ea71a0` | [#14](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/14) — open Draft |
| `feat/mghal-complete-platform-2026-11-01` | `bea6e75b452386c60e9bd5c434ce2189635de2ef` | [#8](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/8) — open |
| `feat/mghal-credentials-projects-expansion-2026-11-05` | `50b6de193a82799f69a56a1f160d2d0bd482b763` | [#12](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/12) — open |
| `feat/mghal-google-identity-linking-2026-11-07` | `450e8ac10aa00aa72e0ba1e37e21e99b80403c02` | [#16](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/16) — open Draft |
| `feat/mghal-phase2-experience-2026-11-08` | `3bf5091e4cf1d8dcd4345af3be2df24a5fa4dcf4` | [#27](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/27) — closed, unmerged |
| `feat/mghal-social-engagement-2026-11-07` | `64a72af5fd7388711f735c70b9cafba2bbba88fe` | [#15](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/15) — open Draft |
| `feat/mghal-visual-redesign-2026-11-03` | `f06d227bda3f95480d5d71d0f6b83beb08dd6822` | [#9](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/9) — open Draft |
| `feat/mghal-visual-redesign-completion-2026-11-04` | `9579e6b9cfbbc92aaa11e827306f39f7831dba52` | [#10](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/10) — open Draft |
| `feat/node-postgres-backend-2026-11-08` | `5533844490ea5a6f5c47070aa9c4cd01602c5bc5` | [#25](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/25) — open Draft |
| `feat/phase2-ux-design-system-2026-11-08` | `255531f47a40c38ed949b20575df727f6980129f` | No PR; 9 branch-only files |
| `feat/platform-phases-1-3-2026-11-01` | `547f9626e87aa731db0b9c120c5b096ef0bda931` | [#6](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/6) — merged into historical PR #5 branch, not main |
| `feat/profile-media-and-credentials` | `7637b798f0d78abe64f020e209ce92603c82c92e` | [#4](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/4) — open |
| `feat/profile-photo-seo-2026-11-09` | `39d9b5981a1ffdf52d3f256d39eb170da256d92f` | [#29](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/29) — open |
| `feat/render-project-page-tracking-2026-11-01` | `09941a8dee190c375e41c371ac1ad082d6dba276` | [#7](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/7) — closed, unmerged |
| `feat/verified-project-portfolio-2026-10-31` | `985a15e48ef4323792cef6ebd08060ae87586811` | No PR; 19 branch-only files |
| `feature/digital-identity-hub-v2-completion` | `c7394e21ba405883c5f5a4e9f0eca98732b984a1` | [#3](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/3) — merged into main |
| `feature/digital-identity-hub-v2` | `18e791a949a2d3777c3b45bccc01cc04bd709f60` | [#2](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/2) — merged into main |
| `feature/mghal-arfat-full-integration` | `8b1192127027f18d10d1a814189a2452cf8e6458` | [#17](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/17) — open Draft; 0 commits ahead of operational anchor |
| `feature/portfolio-expansion` | `298182bceadd5024cba45531c89b4e4e04576e37` | [#1](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/1) — merged into main |
| `fix/credentials-owner-audit-2026-11-07` | `59dcd80baed245cb3459873285eee933211ec1ca` | [#23](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/23) — merged into PR #17's integration branch |
| `fix/mghal-dual-deploy-hardening-2026-11-05` | `d5d8239ef5dd59d9661f0350b5597512cb2f4d03` | [#11](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/11) — open Draft |
| `fix/mghal-hydration-engagement-2026-11-09` | `cadfebf1f14b401307eba2e74dcffb90b2f33de2` | [#30](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/30) — merged |
| `fix/mghal-official-light-brand-system-2026-11-07` | `f695747284c73fa64ebfaab76c4545dc4489ac95` | [#22](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/22) — open Draft |
| `fix/owner-bootstrap-proxy-2026-11-06` | `9ddd0d2e9745b484d798aa3f693c4fbae900bade` | No PR; 80 branch-only paths |
| `fix/site-quality-audit-2026-10-31` | `49441288aa9fc665723030ddc012193b410d7ab2` | [#5](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/5) — open Draft |
| `fix/social-admin-mobile-ux-2026-11-07` | `53571e379acc53aa79080246366f4382dfe23d76` | [#24](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/24) — open Draft; 0 commits ahead of operational anchor |
| `fix/vercel-native-neon-api` | `ac21c3d0113d595ccb1dbec3dc381a8454b6d9f0` | [#32](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/32) — open, not Draft |
| `main` | `fdfea351455227f44e7f92e82166bfa7bdc5e1fe` | Default branch |
| `recovery/phase1-history-architecture-2026-11-10` | `fa25c4b87e822a1bf6c012284082c67854efaaec` | [#31](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/31) — open Draft |

## 4. Pull-request stack and disposition

| PR | Head branch | Base branch | State |
|---:|---|---|---|
| [#33](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/33) | chore/phase1-cleanup-operational | fix/vercel-native-neon-api | Open · Draft |
| [#32](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/32) | fix/vercel-native-neon-api | feat/node-postgres-backend | Open |
| [#31](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/31) | recovery/phase1-history-architecture | fix/vercel-native-neon-api | Open · Draft · divergent |
| [#30](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/30) | fix/mghal-hydration-engagement | feat/node-postgres-backend | Closed · merged |
| [#29](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/29) | feat/profile-photo-seo | feat/node-postgres-backend | Open |
| [#28](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/28) | content/profile-photo-library | main | Closed · merged |
| [#27](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/27) | feat/mghal-phase2-experience | feat/node-postgres-backend | Closed · unmerged |
| [#26](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/26) | audit/phase1-mghal-arfat | feat/node-postgres-backend | Open · Draft |
| [#25](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/25) | feat/node-postgres-backend | fix/social-admin-mobile-ux | Open · Draft |
| [#24](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/24) | fix/social-admin-mobile-ux | feature/mghal-arfat-full-integration | Open · Draft |
| [#23](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/23) | fix/credentials-owner-audit | feature/mghal-arfat-full-integration | Closed · merged |
| [#22](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/22) | fix/mghal-official-light-brand-system | main | Open · Draft |
| [#21](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/21) | design/extra-reference-styling | main | Open · Draft |
| [#20](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/20) | design/reference-details-followup | main | Closed · merged |
| [#19](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/19) | design/complete-reference-parity | main | Closed · merged |
| [#18](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/18) | design/arfat-inspired-ui | main | Closed · merged |
| [#17](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/17) | feature/mghal-arfat-full-integration | main | Open · Draft |
| [#16](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/16) | feat/mghal-google-identity-linking | feat/mghal-social-engagement | Open · Draft |
| [#15](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/15) | feat/mghal-social-engagement | feat/mghal-ai-platform-free-tier | Open · Draft |
| [#14](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/14) | feat/mghal-ai-platform-free-tier | fix/owner-bootstrap-proxy | Open · Draft |
| [#13](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/13) | chore/unify-public-identity | main | Open · Draft |
| [#12](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/12) | feat/mghal-credentials-projects-expansion | feat/mghal-complete-platform | Open |
| [#11](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/11) | fix/mghal-dual-deploy-hardening | feat/mghal-complete-platform | Open · Draft |
| [#10](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/10) | feat/mghal-visual-redesign-completion | feat/mghal-complete-platform | Open · Draft |
| [#9](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/9) | feat/mghal-visual-redesign | feat/mghal-complete-platform | Open · Draft |
| [#8](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/8) | feat/mghal-complete-platform | fix/site-quality-audit | Open |
| [#7](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/7) | feat/render-project-page-tracking | fix/site-quality-audit | Closed · unmerged |
| [#6](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/6) | feat/platform-phases-1-3 | fix/site-quality-audit | Closed · merged into historical branch |
| [#5](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/5) | fix/site-quality-audit | main | Open · Draft |
| [#4](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/4) | feat/profile-media-and-credentials | main | Open |
| [#3](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/3) | feature/digital-identity-hub-v2-completion | main | Closed · merged |
| [#2](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/2) | feature/digital-identity-hub-v2 | main | Closed · merged |
| [#1](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/1) | feature/portfolio-expansion | main | Closed · merged |

### Important merge semantics

- PR #6 is marked merged, but its merge target was `fix/site-quality-audit`, not `main`. Its merge commit `49441288aa9fc665723030ddc012193b410d7ab2` is still **216 commits ahead / 459 behind** the operational anchor. Its static project/PWA/credential work is not part of the current Vercel operational line as a whole.
- PRs #1–3 and #18–20 merged into `main`; `main` is an ancestor of the operational anchor, so their merged history is present in the operational ancestry.
- PR #23 merged into the PR #17 integration branch; its merge commit `60a0ceb51b9f0e4a595f71054731485732d7908b` is an ancestor of the current operational line.
- PR #28 merged into `main`; the primary portrait change is represented in the current line.
- PR #30 merge commit `7de53f6becabee1dfaab4fa328d3cb9131ecebcf` is an ancestor of the current operational line. The hydration-fix files `SiteExperience.tsx`, `app/globals.css`, `app/layout.tsx`, `public/assets/social-engagement.js`, the hydration test, and the release-gate document match the merged branch content; `package.json` has since changed for the Node runtime.

## 5. Branch-only work and preservation classification

Path counts below are **blob paths present in a branch tree but absent from the operational tree at ac21c3d**. They are not counts of commits, not proof that every path is useful, and not mutually exclusive: several branches inherit the same legacy files from common ancestors.

| Branch family / reference | Branch-only paths | Preserved work or interpretation |
|---|---:|---|
| `fix/owner-bootstrap-proxy` | 80 | Legacy admin UI, article UI, credential/media assets, project catalog, Worker API and related tests. Historical source; do not reintroduce Worker runtime wholesale. |
| `feat/mghal-ai-platform`, `feat/mghal-social-engagement`, `feat/mghal-google-identity-linking`, `feat/mghal-credentials-projects-expansion` | 80 each | Mostly inherited legacy static-site path family. Their individual feature deltas must be judged from PR diffs, not by treating all 80 paths as newly introduced by each PR. |
| `feat/mghal-complete-platform` | 68 | Legacy static admin/articles, credentials, project catalog/pages, PWA and Worker assets. |
| `feat/mghal-visual-redesign` | 69 | Older static bilingual redesign and shared legacy assets. |
| `feat/mghal-visual-redesign-completion` | 72 | Later static redesign completion; overlaps the same legacy platform family. |
| `fix/mghal-dual-deploy-hardening` | 73 | Legacy dual-platform deployment line, including Render-oriented configuration; superseded by the owner's Vercel-only decision. |
| `fix/site-quality-audit` | 42 | Static-site accessibility, credentials, project catalog, project pages, PWA and Worker source. PR #5 remains open; PR #6 merged only into this branch. |
| `feat/platform-phases-1-3` | 42 | Static project pages, credentials/accessibility modules, PWA assets and legacy Worker backend. Some concepts have equivalents in Next.js, but the full tree is not in the operational branch. |
| `feat/render-project-page-tracking` | 44 | 20 Arabic/English project detail pages, generator, sitemap/visitor tracking and legacy Worker files. PR #7 is closed unmerged and is 24 commits ahead / 11 behind PR #6. |
| `feat/verified-project-portfolio` | 19 | Earlier portfolio/PWA/project catalog line. It diverges from PR #6's branch by 34/31 commits; preserve both until data reconciliation. |
| `feat/phase2-ux-design-system` | 9 | Includes the unique `app/components/ReadingProgress.tsx`, a browser audit, and legacy Worker/proxy artifacts. Reading progress is not in the current operational tree. |
| `feat/mghal-phase2-experience` | 6 | Unique paths are legacy Worker/proxy source and tests; most UI/PWA paths are shared with the operational tree. PR #27 is closed unmerged. |
| `audit/phase1-mghal-arfat` | 7 | Audit report and legacy proxy/Worker files. Its rate-limit environment setting is represented in the current Node server; project generator and test files match the operational tree. |
| `feat/profile-photo-seo` | 22 | `app/photos/page.tsx`, primary-photo path, and 11 additional profile-gallery image files, including a companion image. PR #29 remains open; publication is a separate consent gate. |
| `fix/credentials-owner-audit`, `feature/mghal-arfat-full-integration` | 4 each | Remaining unique paths are legacy Worker backend/test/config artifacts. PR #23's merge commit is in the operational ancestry; the active runtime does not use those Worker files. |
| `backup/pre-static-credential-project-audit` | 2 | `assets/brand-page-extras.css` and `assets/projects/mghal-website.svg`; retain until styling/asset comparison is complete. |
| `design/complete-reference-parity`, `design/extra-reference-styling` | 1 each | Shared `assets/brand-page-extras.css`; the former branch continued 22 commits after PR #19's merged head and is 2 commits behind PR #20's head. |
| `fix/mghal-official-light-brand-system` | 2 | Shared interior-page CSS plus `assets/projects/mghal-website.svg`; overlaps the static design branches. |
| `backup/pre-credential-audit` | 0 | No blob path unique to the operational tree; comparison shows 0 commits ahead and 328 behind. Candidate for archival only after reachability/backup verification. |
| `chore/main-phase1-cleanup` | 0 | Tree is the old static `main` snapshot; no root package or Next.js app. A Vercel build attempt was recorded as a framework mismatch. Keep as history; do not change official Vercel framework settings for it. |

### High-value content requiring selective reconciliation

1. **Project catalogue:** `assets/projects/catalog.json` in the historical credentials/projects branch contains 10 project records with problem, goal, audience, value proposition, technology stack, features, architecture, evidence and gallery fields. The current `data/projects.ts` contains the same 10 project slugs but only concise summaries/status/stack/contribution fields. The project entities are not missing; the richer descriptions and evidence are not fully represented in the current data model.
2. **Repository inventory:** `assets/projects/repository-inventory.json` contains repository metadata and explicit limitations. It is a historical source, not an automatically verified current inventory; revalidate each public/private status and claim before publishing.
3. **Project pages:** old branches contain 20 Arabic/English static project detail pages and a generator. The current app has a dynamic `app/projects/[slug]/page.tsx` route for the 10 current slugs. Prefer migrating verified structured content into the Next.js data model, not restoring old static HTML output.
4. **Profile photo archive:** PR #29 adds a separate gallery page and 11 archive images plus the primary image path. Keep unmerged until the owner approves publication of the complete archive and any other person's appearance. PR #28's primary portrait is already in the merged main history.
5. **Reading progress:** `ReadingProgress.tsx` is a standalone UI component in the no-PR phase-two design branch. It is a candidate for selective review, not a reason to merge that branch wholesale.
6. **AI:** `mghal-backend/src/ai/contracts.ts`, `index.ts`, `workers-ai-provider.ts`, and provider tests exist in the operational tree. The provider is a bounded Cloudflare Workers AI adapter, but the active API handler has no AI route and the active tree has no Wrangler/Worker runtime binding. Treat it as dormant provider foundation, not a live site AI feature.
7. **Social and Google identity:** the operational API handler includes public visitor/follower, follow/reaction, comments, and Google OAuth routes; PostgreSQL migration `mghal-backend/postgres/0006_google_follower_identity.sql` is present. These features have been ported to the Node/Neon line; historical Worker source should not be reintroduced.
8. **Worker artifacts:** `worker.production.js`, `worker.proxy.js`, `wrangler.toml`, and Worker proxy tests remain on historical branches but are absent from the active operational tree. The Vercel route uses Next.js Node runtime and a PostgreSQL adapter.
9. **Hydration and generator fixes:** PR #30 hydration fixes are present in the current tree. PR #26's dynamic `RATE_LIMIT_PER_MINUTE` is still passed into the current Node API, and `scripts/generate-project-pages.mjs` plus `scripts/test-project-pages.mjs` match the current tree.

## 6. CI and Vercel status for all 21 open PR heads

GitHub Actions workflow runs and GitHub commit statuses are separate. A Vercel status failure caused by a build-rate limit is not a failing GitHub Actions workflow. “No run” means no matching workflow run was returned for that exact head SHA.

| PR | GitHub Actions on current head | Vercel commit statuses |
|---:|---|---|
| #33 | Node API CI ✓; Backend CI ✓ | 3 failures, all target build-rate-limit |
| #32 | Node API CI ✓; Backend CI ✓; Next.js quality ✓ | official `mghalaosimi-web` failure due build-rate-limit; `mghal` and `mghal-next-validation` success |
| #31 | No matching workflow run | 3 failures, all target build-rate-limit |
| #29 | Next.js quality ✓ | 3 success |
| #26 | Node API CI ✓; Backend CI ✓ | 3 failures, all target build-rate-limit |
| #25 | Node API CI ✓; Backend CI ✓; Next.js quality ✓ | 3 success |
| #24 | Backend CI ✓; Next.js quality ✓ | 3 success |
| #22 | No matching workflow run | 2 failures, both target build-rate-limit |
| #21 | No matching workflow run | 2 failures, both target build-rate-limit |
| #17 | Backend CI ✓; Next.js quality ✓ | official `mghalaosimi-web` success; two other project contexts failure |
| #16 | Backend CI ✓ | 2 failures, both target build-rate-limit |
| #15 | Backend CI ✓ | 2 failures; failure reason not verified from status context |
| #14 | Backend CI ✓ | 2 success |
| #13 | No matching workflow run | 2 failures; failure reason not verified from status context |
| #12 | Backend CI ✓; Website Quality ✓ | 2 failures, both target build-rate-limit |
| #11 | Website Quality ✓ | 2 failures, both target build-rate-limit |
| #10 | Website Quality ✓ | 2 failures, both target build-rate-limit |
| #9 | No matching workflow run | 2 failures, both target build-rate-limit |
| #8 | Backend CI ✓ | 2 success |
| #5 | No matching workflow run | 2 failures, both target build-rate-limit |
| #4 | No matching workflow run | 2 failures, both target build-rate-limit |

The most relevant current release evidence is PR #32's three successful GitHub Actions workflows. Its official Vercel project status is still blocked by the reported build-rate limit, so those CI passes do not establish a current READY deployment or Production release. PR #33's two GitHub Actions workflows passed on `faa0f74...`, but all three Vercel project contexts returned the build-rate-limit failure.

## 7. Actual runtime architecture found in the operational tree

### Confirmed by source tree and package manifests

- Next.js `15.5.28`, React `19.1.2`, root dependency `pg`.
- `app/api/[...path]/route.ts` exports a **Node.js** runtime route and dispatches internally to `lib/mghal-api-runtime.mjs`.
- `lib/mghal-api-runtime.mjs` creates/caches a `pg.Pool`, requires `DATABASE_URL`, and wraps it with `PgPreparedDatabase`.
- `mghal-backend/node/server.mjs` is documented as a local HTTP harness, not the production API service. Its package declares Node `>=22`.
- `mghal-backend/node/postgres-adapter.mjs` exposes the old prepared-query interface (`prepare/bind/first/all/run/batch)) over PostgreSQL and runs batch operations in a transaction.
- `mghal-backend/api-handler.mjs` remains written against `env.DB`; it has PostgreSQL-specific `STRING_AGG`, `RETURNING`, and `TIMESTAMPTZ` queries. The adapter translates positional `?` placeholders and the two `email ... COLLATE NOCASE` patterns.
- The active API includes health/readiness, bootstrap, admin login/logout, Google OAuth, visitors/followers, events, articles, comments, reactions, admin users, content CRUD, media, dashboard, followers, comments, analytics, and public identity/education/skills/projects/certificates/achievements/technologies.
- The active tree has PostgreSQL SQL files under `mghal-backend/postgres/` and historical migration/D1 documentation. It has no `prisma/` directory, no `schema.prisma`, and no Prisma package dependency.
- The active tree has no `wrangler.toml`, `worker.production.js`, or `worker.proxy.js`. The standalone Workers AI provider source is present, but it is not routed through the active API.

### Architecture conclusion

The accurate description is **Next.js on Vercel Node.js + direct PostgreSQL via `pg` + a custom compatibility adapter + Neon as the intended database target**. It is not currently a Prisma-based data layer. Do not label it “Prisma adopted” until a separate approved implementation and migration exists. A decision is still required: formally accept and document the current `pg` adapter, or plan a controlled Prisma adoption without mixing it into the historical recovery operation.

## 8. Risks and required preservation controls

1. Do not merge PRs #4–#17 or #21–#22 wholesale into the current Next.js line. Several are based on the old static site or on nested feature branches; use file/content-level extraction only.
2. Do not delete the 6 no-PR branches until their unique content has been archived and reviewed. The 80-path owner-bootstrap snapshot and the 19/42/44-path portfolio families are especially important.
3. Do not delete or close PR #7 or PR #27 simply because they are closed/unmerged; their branches still carry historical work.
4. Do not publish PR #29's complete photo archive without explicit owner approval; one image includes another person.
5. Do not reintroduce Worker/Wrangler/D1 runtime artifacts into the Vercel-only application. Preserve their Git history and extract only portable business logic after tests.
6. Do not treat a green GitHub workflow as deployment proof. PR #32's official Vercel status is still rate-limited.
7. Do not treat the old `main` static tree as the current Next.js release. The operational branch is separate and unmerged.
8. Do not claim Prisma is active in this application; it is absent from the inspected operational source tree.
9. Local-only branches were not inspectable through the connected GitHub remote API.

## 9. Actions performed in this recovery pass

- Read-only enumerated all 40 GitHub branches and all 33 PRs.
- Mapped every branch head SHA to its PR association and current state.
- Compared the operational anchor against main, Node base, PR #31, PR #33, the PR #19 continuation, PR #6/#7 project-page lines, and selected historical branches.
- Inspected recursive Git trees to identify branch-only paths and shared-path content differences.
- Inspected the project catalog, repository inventory, AI provider, reading-progress component, project generator, photo archive branch, Node runtime, PostgreSQL adapter, API handler, package manifests, migration SQL, and selected tests.
- Retrieved current GitHub Actions workflow conclusions and Vercel commit status contexts for all 21 open PR heads.
- **No merge, PR close, branch delete, file delete, force push, secret update, production migration, or production deployment was performed.**
- The only repository write in this pass is this documentation inventory on PR #33's existing Draft branch.

## 10. Next safe recovery sequence

1. Preserve all historical refs; create a verified backup/reachability map before any archival cleanup.
2. Reconcile the rich 10-project catalog and repository inventory into the current Next.js data model after revalidating every public claim and repository state.
3. Review PR #29's archive separately under explicit photo-publication consent.
4. Compare the static admin/article/credential assets from the old platform branch with the active `public/admin` and Node API implementation; extract only missing capabilities.
5. Review `ReadingProgress.tsx` as an isolated UI candidate.
6. Decide explicitly whether `pg` compatibility adapter is the approved architecture or whether Prisma adoption is a separate planned change.
7. Keep PR #32 as the current operational integration candidate; do not merge it until Vercel Preview/Production deployment gates are verified.
8. Issue a final Phase 1 closure report only after code/data preservation, release checks, and infrastructure gates are complete. Do not start Phase 2 before explicit owner approval.
