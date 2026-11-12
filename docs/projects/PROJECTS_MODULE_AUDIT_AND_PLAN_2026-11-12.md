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
- Existing static project pages and generator tests continue to pass until migration is explicitly approved.
- No production domain, deployment, database, secret, Render resource, D1 resource, or unrelated project is modified.

## 6. Current branch status

This audit documents the starting point only. It does not claim that the catalogue has been unified or that the implementation sequence is complete.
