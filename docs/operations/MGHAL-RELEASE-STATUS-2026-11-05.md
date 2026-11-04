# M.GH.AL — Engineering Release & Operations Report
**Snapshot:** 2026-11-05  
**Repository:** `mghalaosimi-web/mghalaosimi-web`  
**Working branch:** `feat/mghal-credentials-projects-expansion-2026-11-05`  
**Pull request:** [#12 — Expand M.GH.AL credentials, projects and research sections](https://github.com/mghalaosimi-web/mghalaosimi-web/pull/12)

> This is an evidence-based operational snapshot, not a declaration that every release gate is closed. Each state below distinguishes verified, pending, and blocked work.

## 1. Executive status

- **Render:** latest observed deployment is LIVE for commit `57d1bb46aba17993375f762ee47466351b33ecae`.
- **GitHub PR #12:** OPEN, not merged, reported mergeable. Current head is the same commit above.
- **CI:** Backend CI and Website Quality were IN PROGRESS immediately after the latest commit. The preceding Website Quality run failed at the design-token assertion because the audit expected `#64748B` while the approved theme uses the higher-contrast `#5B6678`. The assertion was corrected in commit `57d1bb4`; the rerun must finish before declaring CI green.
- **Vercel:** deployment status checks remain failed because the account hit Vercel's `api-deployments-free-per-day` / build-rate limit (HTTP 402). A READY preview deployment is not proof of a production alias update.
- **Admin owner:** no owner/admin account exists in D1 at this snapshot. Do not distribute credentials; none have been provisioned.
- **Cloudflare D1:** read-only verification returned 10 projects, 21 certificates, 0 admin users, 0 technologies, and 0 media records.
- **Public HTTP checks:** the available web inspection could not retrieve the Render homepage, admin route, or Worker health endpoint. Deployment state is confirmed by Render's deployment API, but independent HTTP/health verification remains outstanding.

## 2. Delivered website scope

### Identity and bilingual public site
- M.GH.AL professional identity hub in Arabic and English.
- Public areas include identity/profile, projects, certificates, research, and supporting professional pages.
- Corporate design system uses Navy `#172B4D`, Blue `#315A85`, White, Gray `#F3F5F7`, Text `#202B38`, accessible muted text `#5B6678`, Border `#DCE2E8`, Champagne Gold `#B69A62`, and darker gold text `#806333`.
- Responsive layouts, reduced-motion handling, forced-colors support, print rules, skip navigation and keyboard-focus styling are present in the codebase.

### Certificates
- 21 certificate records in each language: 14 Cisco, 6 Edraak, 1 OpenJS/Linux Foundation JSNAD.
- Original source previews are displayed where files exist; records without source imagery remain text-only rather than receiving invented images.
- JSNAD includes the known issue date (2024-11-12) and credential identifier `JSNAD-ALOSEIMI-20241112`.
- Exact individual Credly badge-to-certificate matching remains incomplete wherever a source mapping has not been established. Original images/documents for text-only certificate records are still needed.

### Projects
- 10 project records and 20 bilingual project-detail routes.
- Project status labels distinguish work state; available gallery metadata and covers are used.
- Private-source protections are included in project-page tests. Do not expose private repository contents.

### Research
- Arabic and English research hub pages exist.
- No unpublished research is represented as published research.

### Admin workspace (implementation scope)
- Admin interface and API coverage are designed for dashboard, identity, projects, certificates, articles, technologies, skills, education, achievements, followers, comment moderation, analytics, media, users, roles and RBAC.
- Authentication/bootstrap and PBKDF2 password hashing are implemented in the codebase.
- **Operational limitation:** an owner account is not provisioned. The original one-time bootstrap token cannot be recovered from its stored hash. A fresh, secure, one-time owner bootstrap flow must be completed before admin access can be used.

## 3. Backend and database

- Cloudflare Worker: `mghal-api`.
- D1 database: `mghal-db`.
- Database ID: `1e5682c3-6a68-4fe5-b2c5-01f9fbe1aabd`.
- Cloudflare account ID: `d9979a917e9175a9128bd146ff88bc9d`.
- Applied schema history previously recorded through migration `0005_technology_visibility.sql`; schema includes media BLOB storage and technology publication/archive fields.
- Latest read-only count query: `admin_users=0`, `projects=10`, `certificates=21`, `technologies=0`, `media=0`.
- The empty technologies/media tables mean those admin content sections are not populated in D1 yet; do not imply otherwise.
- Worker upload/deployment was previously recorded as successful, but a fresh live HTTP health check has not been independently confirmed in this snapshot.

## 4. CI and quality evidence

The prior successful quality snapshot recorded in PR #12 was commit `ba7aefcafe9477a86708192111872873454e597e`:
- 119 static output files passed the security audit.
- 98 HTML pages inspected.
- 44 public pages and 44 sitemap URLs inspected.
- 21 credentials per language; issuer distribution 14/6/1.
- 10 project records and 20 bilingual detail routes.
- HTML, SEO, PWA, corporate UI, credential, public-output, project-page and admin/platform scripted checks passed at that commit.

Important: those results are historical and must not be presented as a fresh pass for the current head.

At commit `b7b2a3e39c54fb019aec9a3d113a368c88557814`, Website Quality failed before browser audits ran. The exact failure was:
`AssertionError: Incorrect or missing design token: --mghal-muted`.
The theme token was `#5B6678`, but `scripts/audit-design.mjs` still expected `#64748B`. The audit expectation was aligned with the theme in commit `57d1bb46aba17993375f762ee47466351b33ecae`. CI run #156 and Backend CI run #87 were observed in progress immediately after that commit; final results must be checked.

## 5. Deployment inventory

### Render
- Service: `mghal-release-current`
- Service ID: `srv-dblr12ou01pc739c9img`
- URL: https://mghal-release-current.onrender.com
- Branch: `feat/mghal-credentials-projects-expansion-2026-11-05`
- Latest observed deployment: `dep-dblrm72vcj2c73b7057g`, status `live`, commit `57d1bb46aba17993375f762ee47466351b33ecae`.

### Vercel
- Project `mghalaosimi-web`: `prj_ZVjgkEPALtFwhTvdFJ5kseEz5e7s`.
- Team: `team_AN0BsF0wNcrfInHxBMGFjIPk`.
- Deployment checks are blocked by the account's build/deployment rate limit. Current release must not be described as live on the production Vercel aliases until a successful production-target deployment and alias verification are recorded.
- A READY deployment with `target=null` is a preview/untargeted deployment, not proof of production.

## 6. Outstanding release blockers

1. **Provision the first owner securely.** Reissue a fresh, single-use bootstrap secret through a permitted secure mechanism; never create a default password or place secrets in Git, logs, or this report.
2. **Finish current CI.** Confirm Website Quality and Backend CI for `57d1bb4`; if failed, inspect the exact failing step and correct the source rather than weakening tests.
3. **Resolve Vercel rate limit.** Wait for quota reset or use an authorized plan/quota path, then deploy the intended branch and verify production aliases.
4. **Verify live HTTP routes.** Independently check Render homepage, admin route, public API, Worker health, CORS and expected response codes.
5. **Complete content population.** Decide which technologies and media records should be published, then populate them from authentic source material.
6. **Complete certificate evidence.** Obtain original documents/images for text-only records and confirm exact badge-to-certificate mappings; do not fabricate QR codes or issuer proof.
7. **Complete accessibility acceptance.** Run full keyboard journeys, screen-reader tests, contrast verification, 200%/400% zoom and reflow, mobile-device checks, and print/PDF review. Scripted checks alone do not complete this gate.
8. **Review and release.** Keep PR #12 open until all release gates are accepted. Do not merge to `main` or claim production release without the explicit release step.

## 7. Change log in this snapshot

- `57d1bb46aba17993375f762ee47466351b33ecae` — `test(design): align muted token audit with accessible theme`.
- This change updates the design audit's expected muted token from `#64748B` to `#5B6678`, matching the actual theme token and the improved contrast choice.
- Render automatically deployed that commit and reported it LIVE.
- GitHub PR #12 remains open and unmerged.

## 8. Security and operational rules

- No default admin credentials.
- Never recover or expose a password from a hash.
- Never commit bootstrap tokens, API keys, or secrets.
- Keep private project source private.
- Preserve original credential evidence and issuer mappings; do not invent certificate imagery, QR codes or verification.
- Keep experimental/incomplete projects and label their status honestly rather than deleting useful work.
- Do not merge the PR or alter production data destructively without an explicit, reviewed release operation.

---
**Report status:** saved as a repository operations record. This report intentionally identifies the unresolved gates rather than marking the platform complete prematurely.
