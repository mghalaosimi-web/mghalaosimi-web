# M.GH.AL — Branch and Pull Request Inventory

**Inspection date:** 2026-11-10  
**Repository:** mghalaosimi-web/mghalaosimi-web

## 1. Repository history inventory

- GitHub default branch: main.
- Current main head: fdfea351455227f44e7f92e82166bfa7bdc5e1fe.
- Baseline inventory before creating the recovery artifacts: 36 branches and 30 PRs.
- Handoff inventory after creating the recovery artifacts: 37 branches and 31 PRs (one dedicated recovery branch and PR #31 added by this phase).
- Non-PR issues returned: 0.
- Matching tag refs: 0.
- GitHub releases: 0.
- Commit pagination: main returned 132 commits (100 on page 1, 32 on page 2, 0 on page 3). The current Node/Neon branch returned 442 commits (100 each on pages 1–4, 42 on page 5, 0 on page 6).

## 2. Baseline branches and recovery branch

The 36 branches listed below are the complete pre-recovery inventory returned during discovery. Phase 1 then created one additional branch:

| Added branch | Head SHA at handoff | Purpose |
|---|---|---|
| recovery/phase1-history-architecture-2026-11-10 | 09b1c546ca0c11168cc36fbd5ecb61e8fbdbbc46 | Seven Phase 1 reports; created from current Vercel operational SHA 7de53f6 |

This makes 37 branches at handoff. All 36 pre-existing branches were returned as unprotected; the new recovery branch was not modified by force push.

## 3. Baseline pull requests and recovery PR #31

The 30 PRs below are the complete pre-recovery inventory. Phase 1 opened the following additional Draft PR:

| PR | State | Draft | Head branch | Base branch | Summary |
|---:|---|---|---|---|---|
| 31 | OPEN | Yes | recovery/phase1-history-architecture-2026-11-10 | feat/node-postgres-backend-2026-11-08 | Seven evidence-based Phase 1 recovery reports; documentation-only; 1 commit, 7 files, 825 additions |

[PR #31](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/31) head is `09b1c546ca0c11168cc36fbd5ecb61e8fbdbbc46`; base is `7de53f6becabee1dfaab4fa328d3cb9131ecebcf`. It remains Draft and unmerged. The handoff total is 31 PRs.

## 4. Baseline branch list

| Branch | Current head SHA |
|---|---|
| audit/phase1-mghal-arfat-2026-11-08 | b3cee4cb7dfa7b273631e7c6f9a2a2d670284717 |
| backup/pre-credential-audit-2026-11-07 | 4652cb95547fc6c528bf8e063e052bdc9c9bcdf6 |
| backup/pre-static-credential-project-audit-2026-11-07 | da37c189fe9ed2e1bae6e6b6f42913b149393bb6 |
| chore/unify-public-identity-2026-11-06 | a6eec378a4c21266ebd742aadf026fde4bf73c4d |
| content/profile-photo-library-2026-11 | 2bccd990fd8526ad7d689a14fa004cb837bac8b9 |
| design/arfat-inspired-ui-2026-11-07 | 3b046095bd46bd2db3b42c0a512528978ec0daf4 |
| design/complete-reference-parity-2026-11-07 | 9a9d85002441a5c14184a5204bd84caaa07b6691 |
| design/extra-reference-styling-2026-11-07 | 1b06d7d4481623cd68f31921477f4f4fb7ae9348 |
| design/reference-details-followup-2026-11-07 | cf0611ea878851f75f35f852919d0b691cb12c5c |
| feat/mghal-ai-platform-free-tier-2026-11-06 | ea738c972f91178313305ee19bc7d73e51ea71a0 |
| feat/mghal-complete-platform-2026-11-01 | bea6e75b452386c60e9bd5c434ce2189635de2ef |
| feat/mghal-credentials-projects-expansion-2026-11-05 | 50b6de193a82799f69a56a1f160d2d0bd482b763 |
| feat/mghal-google-identity-linking-2026-11-07 | 450e8ac10aa00aa72e0ba1e37e21e99b80403c02 |
| feat/mghal-phase2-experience-2026-11-08 | 3bf5091e4cf1d8dcd4345af3be2df24a5fa4dcf4 |
| feat/mghal-social-engagement-2026-11-07 | 64a72af5fd7388711f735c70b9cafba2bbba88fe |
| feat/mghal-visual-redesign-2026-11-03 | f06d227bda3f95480d5d71d0f6b83beb08dd6822 |
| feat/mghal-visual-redesign-completion-2026-11-04 | 9579e6b9cfbbc92aaa11e827306f39f7831dba52 |
| feat/node-postgres-backend-2026-11-08 | 7de53f6becabee1dfaab4fa328d3cb9131ecebcf |
| feat/phase2-ux-design-system-2026-11-08 | 255531f47a40c38ed949b20575df727f6980129f |
| feat/platform-phases-1-3-2026-11-01 | 547f9626e87aa731db0b9c120c5b096ef0bda931 |
| feat/profile-media-and-credentials | 7637b798f0d78abe64f020e209ce92603c82c92e |
| feat/profile-photo-seo-2026-11-09 | 39d9b5981a1ffdf52d3f256d39eb170da256d92f |
| feat/render-project-page-tracking-2026-11-01 | 09941a8dee190c375e41c371ac1ad082d6dba276 |
| feat/verified-project-portfolio-2026-10-31 | 985a15e48ef4323792cef6ebd08060ae87586811 |
| feature/digital-identity-hub-v2-completion | c7394e21ba405883c5f5a4e9f0eca98732b984a1 |
| feature/digital-identity-hub-v2 | 18e791a949a2d3777c3b45bccc01cc04bd709f60 |
| feature/mghal-arfat-full-integration | b4f33ad31cb87cd20363c90fb16d1bb4f6f14a33 |
| feature/portfolio-expansion | 298182bceadd5024cba45531c89b4e4e04576e37 |
| fix/credentials-owner-audit-2026-11-07 | 59dcd80baed245cb3459873285eee933211ec1ca |
| fix/mghal-dual-deploy-hardening-2026-11-05 | d5d8239ef5dd59d9661f0350b5597512cb2f4d03 |
| fix/mghal-hydration-engagement-2026-11-09 | cadfebf1f14b401307eba2e74dcffb90b2f33de2 |
| fix/mghal-official-light-brand-system-2026-11-07 | f695747284c73fa64ebfaab76c4545dc4489ac95 |
| fix/owner-bootstrap-proxy-2026-11-06 | 9ddd0d2e9745b484d798aa3f693c4fbae900bade |
| fix/site-quality-audit-2026-10-31 | 49441288aa9fc665723030ddc012193b410d7ab2 |
| fix/social-admin-mobile-ux-2026-11-07 | 39d48c688bb475225da42995d78cad177a60102b |
| main | fdfea351455227f44e7f92e82166bfa7bdc5e1fe |

All 36 existing branches were returned by the API as unprotected. No branch was deleted, renamed, force-updated or rewritten in this phase.

## 5. Baseline PR list (PR #1–#30)

| PR | State | Draft | Head branch | Base branch | Summary |
|---:|---|---|---|---|---|
| 30 | CLOSED / MERGED | No | fix/mghal-hydration-engagement-2026-11-09 | feat/node-postgres-backend-2026-11-08 | Hydration/engagement fixes; merged into operational Node branch |
| 29 | OPEN | No | feat/profile-photo-seo-2026-11-09 | feat/node-postgres-backend-2026-11-08 | 12-image gallery, photos route and image SEO |
| 28 | CLOSED / MERGED | No | content/profile-photo-library-2026-11 | main | Profile photo library and primary portrait |
| 27 | CLOSED / UNMERGED | Yes | feat/mghal-phase2-experience-2026-11-08 | feat/node-postgres-backend-2026-11-08 | PWA and reading progress; closed without merge |
| 26 | OPEN | Yes | audit/phase1-mghal-arfat-2026-11-08 | feat/node-postgres-backend-2026-11-08 | Earlier Phase 1 audit and low-risk fixes |
| 25 | OPEN | Yes | feat/node-postgres-backend-2026-11-08 | fix/social-admin-mobile-ux-2026-11-07 | Node.js + Neon backend foundation |
| 24 | OPEN | Yes | fix/social-admin-mobile-ux-2026-11-07 | feature/mghal-arfat-full-integration | UX, credentials, SEO and release hardening |
| 23 | CLOSED / MERGED | No | fix/credentials-owner-audit-2026-11-07 | feature/mghal-arfat-full-integration | Credential ownership correction |
| 22 | OPEN | Yes | fix/mghal-official-light-brand-system-2026-11-07 | main | Official light brand system |
| 21 | OPEN | Yes | design/extra-reference-styling-2026-11-07 | main | Remaining reference styling |
| 20 | CLOSED / MERGED | No | design/reference-details-followup-2026-11-07 | main | Interior reference styling |
| 19 | CLOSED / MERGED | No | design/complete-reference-parity-2026-11-07 | main | Bilingual design parity |
| 18 | CLOSED / MERGED | No | design/arfat-inspired-ui-2026-11-07 | main | Portfolio UI redesign retaining M.GH.AL identity |
| 17 | OPEN | Yes | feature/mghal-arfat-full-integration | main | Digital identity hub design integration |
| 16 | OPEN | Yes | feat/mghal-google-identity-linking-2026-11-07 | feat/mghal-social-engagement-2026-11-07 | Optional Google identity linking |
| 15 | OPEN | Yes | feat/mghal-social-engagement-2026-11-07 | feat/mghal-ai-platform-free-tier-2026-11-06 | Anonymous follow and reactions |
| 14 | OPEN | Yes | feat/mghal-ai-platform-free-tier-2026-11-06 | fix/owner-bootstrap-proxy-2026-11-06 | Isolated AI provider foundation |
| 13 | OPEN | Yes | chore/unify-public-identity-2026-11-06 | main | Public-name and official-links unification |
| 12 | OPEN | No | feat/mghal-credentials-projects-expansion-2026-11-05 | feat/mghal-complete-platform-2026-11-01 | Credentials, projects and research sections |
| 11 | OPEN | Yes | fix/mghal-dual-deploy-hardening-2026-11-05 | feat/mghal-complete-platform-2026-11-01 | Dual-platform deployment hardening |
| 10 | OPEN | Yes | feat/mghal-visual-redesign-completion-2026-11-04 | feat/mghal-complete-platform-2026-11-01 | Bilingual homepage/public experience |
| 9 | OPEN | Yes | feat/mghal-visual-redesign-2026-11-03 | feat/mghal-complete-platform-2026-11-01 | Bilingual public experience redesign |
| 8 | OPEN | No | feat/mghal-complete-platform-2026-11-01 | fix/site-quality-audit-2026-10-31 | Platform phases 1–8 |
| 7 | CLOSED / UNMERGED | No | feat/render-project-page-tracking-2026-11-01 | fix/site-quality-audit-2026-10-31 | Render project tracking; closed without merge |
| 6 | CLOSED / MERGED | No | feat/platform-phases-1-3-2026-11-01 | fix/site-quality-audit-2026-10-31 | Backend API, visitor tracking and identity foundation |
| 5 | OPEN | Yes | fix/site-quality-audit-2026-10-31 | main | Portfolio and verified credentials hub |
| 4 | OPEN | No | feat/profile-media-and-credentials | main | Profile imagery and bilingual credential gallery |
| 3 | CLOSED / MERGED | No | feature/digital-identity-hub-v2-completion | main | M.GH.AL V2.1 |
| 2 | CLOSED / MERGED | No | feature/digital-identity-hub-v2 | main | Digital Identity Hub V2.0 |
| 1 | CLOSED / MERGED | No | feature/portfolio-expansion | main | Portfolio and digital identity pages |

## 6. Detailed ancestry and changed-file findings

### PR #25

- 209 commits ahead of its recorded base fix/social-admin-mobile-ux-2026-11-07; 0 behind at the current head.
- Compared with main: 355 ahead, 45 behind; common ancestor d7378bffeb55ca957829995fb4fee8355181d792; 280 changed files.
- 79 files are in the PR diff against its declared base.
- The current PR head is the current operational Vercel production revision.
- Tests on 7de53f6: three GitHub workflows completed successfully; Vercel contexts succeeded.
- Safe to preserve as the operational code line; not safe to merge wholesale into main without reconciliation.

### PR #29

- 8 commits ahead and 1 behind the current operational Node branch.
- 19 changed files; changes are concentrated in Next.js photo routes/metadata, profile components, the primary portrait, 12 public gallery assets and sitemap.
- It is not included in the current Vercel production deployment.
- Current head CI and Vercel statuses report success, but publication consent and current-base review remain gates.

### PR #30

- 11 commits and 7 changed files.
- Merged to the Node branch; merge/result commit 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.
- The merge result is the current Vercel production revision.
- Preserve the hydration test and changes; do not reapply them from the closed PR.

## 7. Existing recovery/audit work

PR #26 is a separate earlier Phase 1 audit branch and remains OPEN/Draft. It contains 11 changed files and previous low-risk code/test changes. It diverged from the current production Node branch after that earlier audit. This recovery branch does not overwrite PR #26 or duplicate its older report; it records the current 2026-11-10 state in seven new requested files.

## 8. Integration base decision

The GitHub default branch main is not the revision currently aliased to the official Vercel production hostname. The actual production alias is attached to 7de53f6 on feat/node-postgres-backend-2026-11-08. The dedicated Phase 1 recovery branch was therefore created from that exact operational commit. This does not retarget main, change GitHub default settings, merge PR #25, or imply that main can be discarded.

## 9. Historical preservation rules

- Preserve every listed branch and PR; no historical branch or PR was deleted or rewritten.
- Do not close Draft PRs merely to simplify the list.
- Do not merge the 45-commit-behind/355-commit-ahead Node branch directly into main.
- Re-evaluate PR #29 against the current operational base before integration.
- Treat closed unmerged PRs #7 and #27 as historical attempts, not as shipped features.
