# M.GH.AL Projects Module — Branch Audit and Implementation Plan

**Date:** 2026-11-12  
**Working branch:** `feature/projects-catalog`  
**Base branch:** `chore/phase1-cleanup-operational-2026-11-12`  
**Base commit:** `994fa3eddd6d243b9416736d1aeb606a085e25ce`  
**Production deployment:** Not changed  
**Pull requests merged:** None

## 1. Scope

This branch is dedicated to the projects catalogue and project-detail experience. It is intentionally based on the latest operational development snapshot rather than the production `main` branch. Phase 1 infrastructure/recovery closure is deferred to the final integration workstream by the project owner's direction; this does not authorize production changes or deletion of historical branches.

## 2. Verified current implementation

The base commit contains a Next.js application (Next 15.5.28, React 19.1.2, TypeScript) and the following project-related sources:

- `data/projects.ts`: a TypeScript project list with 10 records and a compact model (`slug`, `name`, `category`, `label`, `summary`, `stack`, `status`, `contribution`, optional `repository` and `featured`).
- `app/projects/page.tsx`: locale-aware route metadata and a locale-dependent Arabic/English project explorer.
- `app/projects/ProjectsPageArabic.tsx` and `app/projects/ProjectsExplorerEnglish.tsx`: interactive catalogue experiences consuming the TypeScript project list.
- `app/projects/[slug]/page.tsx`: project-detail route with a second hard-coded array of 10 project records.
- `public/assets/projects/catalog.json`: a separate, richer bilingual catalogue with 10 records, features, technology lists, cover assets, gallery metadata, visibility and repository references.
- `scripts/generate-project-pages.mjs`: generator for bilingual static project pages.
- `public/projects/<slug>/index.html` and `public/en/projects/<slug>/index.html`: generated Arabic and English static project pages.
- `scripts/test-project-pages.mjs`: assertions for catalogue shape, bilingual generated routes, local covers, repository ownership, private-repository link protection, SEO metadata, JSON-LD, accessibility landmarks, sitemap entries and shared navigation.

The existing test suite's project-page test is part of the root build script.

## 3. Findings and risks to resolve

### P0 — Multiple project data sources

The project catalogue currently exists in at least two independently maintained data structures:
1. `data/projects.ts` for the Next.js catalogue.
2. `public/assets/projects/catalog.json` for generated bilingual static project pages.

The dynamic detail route adds a third hard-coded project array in `app/projects/[slug]/page.tsx`. This creates a risk that names, statuses, summaries, repository URLs, contribution statements and technology stacks diverge.

### P0 — Detail pages are less complete than the rich catalogue

The dynamic detail page currently renders a limited subset of project information (name, summary, status, stack and an optional WAYNAH deployment URL). The richer static catalogue already models additional fields such as bilingual problem statements, features, cover art, gallery items, visibility and repository references. The detail experience should use verified fields from a single canonical model rather than silently dropping this information.

### P1 — Source evidence and contribution boundaries

Project claims must remain evidence-based. Preserve explicit distinctions among:
- individually developed work,
- team/collaborative contributions,
- private projects whose source must not be exposed,
- experimental or incomplete projects,
- illustrative artwork versus actual product screenshots,
- verified live deployments versus unverified references.

Do not inflate ownership, completion, performance, security or production-readiness claims.

### P1 — Related scheduling projects

The catalogue contains both `manar-schedule-system` and `almanar-schedule-system` as separate records. Their repository mappings and relationship must be checked against their actual repository identities and documented contribution history before changing labels or links. Do not merge them into one record merely because their purpose overlaps.

### P1 — Arabic/English parity

Catalogue cards, detail pages, filters, status labels, contribution statements, gallery captions, image alt text, navigation and metadata should remain equivalent in Arabic RTL and English LTR. No language should expose private repository links or unsupported claims.

### P1 — Static/Next route compatibility

The project work must preserve the existing generated static routes and their current SEO/accessibility protections until an explicit architecture decision retires them. Do not remove static assets or generators as a side effect of improving the Next.js pages.

## 4. Implementation sequence

1. Establish a field-by-field comparison of the TypeScript catalogue, rich JSON catalogue, generated pages and project repository evidence.
2. Define one canonical, typed bilingual project model with explicit visibility, contribution, status, evidence, technology, features, gallery and external-reference fields.
3. Migrate the Next.js catalogue and dynamic detail route to consume that model; remove duplicated hard-coded detail records only after parity is verified.
4. Keep the static page generator compatible with the canonical model, or generate its JSON input from the canonical source through a deterministic script. Do not introduce runtime network calls.
5. Improve project detail pages with verified content, clear contribution attribution, safe repository/deployment links, accessible gallery handling and responsive layouts.
6. Update/add tests for uniqueness, required bilingual fields, private-link protection, contribution accuracy, gallery assets, metadata, route parity and generated output.
7. Run the project-specific tests, TypeScript checks and full production build where the available execution environment permits. Report any tests not run; never claim success without output.
8. Review the diff and open a draft PR into the agreed integration branch. Do not merge into production.

## 5. Acceptance criteria

- Exactly one authoritative project record per stable project identity; no accidental duplicates.
- Arabic and English catalogue/detail experiences show the same verified project set.
- No private repository URL, secret, internal screenshot or private implementation detail leaks to public pages.
- Team contribution is not presented as sole ownership.
- Incomplete/experimental status is visible and accurate.
- Project covers, gallery images and alt text are valid and accessible.
- Detail routes work for all catalogue slugs; unknown slugs return 404.
- SEO metadata, canonical URLs, language alternates, structured data and sitemap remain correct.
- Public project pages are served through Next.js React routes; legacy .html URLs permanently redirect to canonical routes, and no public static HTML pages remain.
- No production domain, deployment, database, secret, Render resource, D1 resource, or unrelated project is modified.

## 6. Current branch status

This audit documents the starting point only. It does not claim that the catalogue has been unified or that the implementation sequence is complete.


## 7. Implementation progress — 2026-11-12

The following changes have been committed to `feature/projects-catalog` after the initial audit. The catalogue now contains the ten original projects plus three additional verified entries:

- Added a bilingual project brand definition to every existing catalogue record: a dedicated SVG logo path and distinct primary/secondary/accent colors.
- Added explicit bilingual contribution statements. Collaborative work, private work, and projects with insufficient public implementation evidence are not presented as sole-authored or production-ready.
- Expanded the domain taxonomy to: web platforms, enterprise systems, AI, cybersecurity/cryptography, academic systems, mobile applications, and desktop software.
- Replaced the independent TypeScript project array with a mapping derived from `public/assets/projects/catalog.json`. The catalogue JSON is now the data source for the project explorer and detail route.
- Updated Arabic and English project explorers to use the expanded categories, per-project brand marks, and independent project-profile links.
- Replaced the hard-coded detail-page array with a bilingual detail view sourced from the rich catalogue. The page includes overview, problem, goal, audience, value, documented features, technology stack, architecture, contribution, gallery, evidence, and verification notes.
- Added project-page tests for logo existence, valid and distinct primary brand colors, bilingual contribution statements, supported categories, and canonical data-source usage.
- Added dedicated SVG brand marks for all 13 published catalogue projects under `public/assets/projects/logos/`.

### Verification and deployment state

- The first build exposed a design-audit failure caused by hard-coded color literals in the project stylesheet; those literals were replaced with shared M.GH.AL design tokens.
- A subsequent build exposed an incorrect relative import for the shared project stylesheet; the import was corrected.
- GitHub Actions completed the full quality workflow successfully on commit 5dd4f631c4890290335025cef4a5ba45f481144e: dependency audits, credential/profile/design/HTML/PWA audits, API tests, SEO/sitemap/project/admin/navigation tests, ESLint, TypeScript typecheck, and next build all passed. This is CI verification, not a Vercel deployment.
- No production deployment, merge, PR merge, database change, secret change, Render change, or deletion was performed.
- The latest verified branch head at the time of this progress note is recorded in the branch history; inspect the live branch head before making subsequent edits.

### Additional repository inventory — candidates for the next catalogue expansion

The organization inventory contains additional repositories that should be assessed as distinct project records, subject to provenance and source evidence:

1. `abdulmalik-store-management`: active foundation-stage project with React, TypeScript, Vite, Tauri 2, Rust and SQLite. Repository history includes user-authored implementation commits for product records, local product images, offline POS/sales validation and printable receipts. Its README explicitly states that it is not production-ready. No screenshot assets were found in its repository tree.
2. `mghal-digital-os`: active Next.js 16 / React 19 / TypeScript application using Prisma, PostgreSQL and Upstash Redis. Its README documents implemented workspace/project/task/knowledge/content CRUD, owner authentication, audit events, an editorial calendar and AI draft generation. AI does not publish automatically; multi-user authorization, workers and social publishing are not complete. No screenshot assets were found in its repository tree.
3. `debwan-live`: an independent product distribution derived from TIVIFY under the preserved MIT attribution. The user's repository history documents subsequent modifications including security hardening, football-hub work and release/CI changes. Any portfolio entry must explicitly identify it as derivative work and must not claim sole authorship of the upstream platform. The repository contains a real product logo but no application screenshot assets in the inspected tree.
4. `ABDULMALIK-STORE-PRO`: explicitly excluded from the public catalogue pending written rights and licensing evidence. Its PROVENANCE.md records 236 upstream commits under the MHAMMED AL-AOSIMI identity plus commits from other contributors; the inspected snapshot had no root open-source license, and the written single-shop permission referenced by its README was not included. Repository rebranding does not establish a rights transfer. Its catalogue entry and artwork were removed; do not restore it until rights are verified.
5. `ABDULMALIK-ERP`: related upstream/source repository for the Store Pro snapshot. Its history includes other contributors; do not represent the complete product as solely authored by the portfolio owner.
6. `mghal-digital-automation`: README and recent commit history identify it as the upstream Postiz codebase; it should not be represented as an original M.GH.AL product. M.GH.AL Content OS and MGHAL Digital OS are separate projects and should remain distinct.
7. `ramzei.ERP`: repository was empty in the inspected inventory; do not create a portfolio entry without source evidence.

Before adding these candidates, inspect their repository trees, exact screenshot paths, relevant manifests and commit attribution. A missing screenshot must be stated honestly; do not substitute illustrative cover artwork and label it as an application screenshot.

### Remaining work — updated after the successful CI build

1. Verify the current branch head and retain the successful GitHub Actions result after the latest documentation-only update.
2. Complete a browser-level visual and interaction review of Arabic/English routes, mobile navigation, project detail pages, admin login/bootstrap states, and offline behavior. CI currently verifies source/build contracts, not full cross-device visual acceptance.
3. Extend the same safe Neon publication integration to certificates, education, skills and identity records. Project listing/detail synchronization is now implemented; the remaining public resources still need a clear database-versus-curated source policy.
4. Review whether certificates, education, skills and achievements should be published from the database or remain Git-managed. Do not leave the admin UI implying that a database edit changes a public page when the page is still statically driven.
5. Continue source verification for any future portfolio additions. Keep mghal-digital-automation, empty ramzei.ERP, ABDULMALIK-ERP, and ABDULMALIK-STORE-PRO excluded unless new provenance, source evidence and rights support a public entry.
6. Do not merge, deploy Production, change production secrets, apply Neon migrations, or modify Render/other project resources without the owner's separate approval.

### 8. React / Next.js migration — 2026-11-12

- Removed every public .html file from the repository. The Next.js App Router now owns the home, profile, projects, credentials, education, achievements, knowledge, résumé, contact, admin, and offline surfaces.
- Added permanent redirects in next.config.ts for the old public .html paths so existing inbound links resolve to their modern route equivalents.
- Converted the administration and offline fallback surfaces to React/Next.js routes; removed the old public/admin/index.html, admin JavaScript/CSS bundle, and public/offline.html.
- Removed ten orphaned legacy DOM scripts that only enhanced the retired static pages: accessibility.js, article-feed.js, article-page.js, database-content.js, home.js, project-cards.js, project-listing.js, projects.js, section-rail.js, and site.js.
- The remaining public JavaScript assets are limited to the active visitor-tracking module, social-engagement module, and the PWA service worker. These remain JavaScript runtime modules; the page UI and route composition are implemented in React/TypeScript.
- Updated PWA routing and tests to use the React /offline route, and added a regression audit that rejects reintroduced public HTML and retired DOM scripts.
- Replaced outdated admin/engagement/navigation assertions that still depended on deleted static HTML with assertions against the current React route tree and typed catalogue.
- Removed the unreachable project-detail modal from both project explorers. Every project card and the featured WAYNAH call-to-action now navigates directly to its dedicated bilingual detail route.
- Expanded the catalogue from ten to thirteen projects by adding mghal-digital-os, abdulmalik-store-management, and debwan-live, with truthful contribution/provenance notes. The two academic scheduling repositories remain distinct.
- Excluded abdulmalik-store-pro from the public catalogue and removed its logo/cover assets until written redistribution/licensing rights are verified.
- Confirmed from the Git tree that no .html files remain and only the three active public JavaScript assets listed above remain.
- Successful full GitHub Actions workflow: https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/43277988189, commit 5dd4f631c4890290335025cef4a5ba45f481144e.
- This branch remains unmerged and undeployed. The production domain, Neon production schema/data, environment secrets, Render services, and unrelated projects were not changed.

### 9. Neon-backed project publication — 2026-11-12

- Added a server-only PostgreSQL read helper that uses the existing pooled Neon connection and selects only published, non-archived project records. It does not write to the database and does not pass through the public API rate limiter.
- The ten original catalogue entries are explicitly marked database-managed; the three verified additions (M.GH.AL Digital OS, Abdulmalik Store Management, and Debwan Live) remain Git-curated because they are not present in the current public project table.
- The server-rendered Arabic and English project index merges published Neon fields into the curated catalogue: localized name/summary, status, repository URL, live URL, description, and cover media. The detail route resolves the same published state and returns 404 for a database-managed project that is no longer published.
- If Neon is not configured or temporarily unavailable, the full curated catalogue remains available. If the database is reachable and has no published rows, database-managed projects are hidden while curated-only projects remain visible.
- Newly published database projects without a curated record appear under an explicit Unclassified category and receive a neutral M.GH.AL brand mark and generic cover. Their page clearly states that detailed stack, features, and individual contribution have not yet been documented; no unsupported technical claims are invented.
- Repository links are restricted to HTTPS GitHub URLs, and live links are restricted to HTTPS before rendering. Database-provided descriptions remain escaped React text.
- A read-only inspection of the selected Neon branch found 10 published project records, 18 published certificates, one published education record, 21 published skills, two identity-profile records, and no published achievements or technologies. No database writes or migrations were performed.
- Added unit tests for Neon-unavailable fallback, locale projection, published-only SQL, and the server-rendered catalogue merge. Full GitHub Actions passed on commit 95c559db804921028d5902eb50c2abe87fc64437, including lint, typecheck, and next build.
- The latest successful CI run is https://github.com/mghalaosimi-web/mghalaosimi-web/actions/runs/43279838419. This is not a Vercel deployment; the Vercel preview history still contains failed builds from earlier commits and has no deployment record for the current successful branch head.
