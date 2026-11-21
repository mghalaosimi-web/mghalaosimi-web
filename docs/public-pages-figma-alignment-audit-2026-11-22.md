# Public Pages — Figma Alignment Audit

Date: 2026-11-22
Repository baseline: `main` at `8c9763a2aaac1122bd81adff77ca9353758c94a6`
Working branch: `feat/public-pages-figma-alignment-2026-11-22`
Figma file: `NbsDxMDcyiqaxjnsJIUlDF`

## Scope and safety boundary

This audit covers the public portfolio UI only. It does not authorize changes to production, Neon data, authentication, RBAC, public URL slugs, canonical URLs, hreflang, robots, sitemap, structured data, or rendering strategy. The work remains inside Main Phase 1. Figma mockups are visual references, not a source of truth for personal facts, credential counts, project ownership, or live metrics.

## Verified baseline

- GitHub default branch is `main`; repository permissions include push/admin.
- Latest `main` commit is `8c9763a2aaac1122bd81adff77ca9353758c94a6`.
- `package.json` defines Next.js 15.5.29, React 19.1.2, TypeScript 5.8.3 and a build pipeline with design, contact, navigation, search, security-header, structured-data, SEO, sitemap, clean-URL, image, project, engagement, and API-runtime checks.
- The public root page is implemented in `app/page.tsx`; it uses server-side locale cookies, localized metadata, the real profile image `/assets/images/mghal-profile-primary.jpg`, and project data from `data/projects`.
- Shared navigation is implemented in `app/components/SiteHeader.tsx`; it uses Next.js links, active-route state, language switching, search, and touch navigation.
- Public project listing is implemented in `app/projects/page.tsx` and `app/projects/ProjectsPageArabic.tsx`.
- About and skills routes have localized metadata and dedicated page components.
- Photos route exists at `app/photos/page.tsx`, with localized metadata, ImageGallery JSON-LD and a 12-item photo manifest.
- Credentials route exists at `app/credentials/page.tsx`, with localized metadata and a credential data array.
- The root layout currently sets `data-mghal-theme="dark"` and loads global design tokens plus shared portfolio CSS.

## Figma coverage

The existing Figma file contains the previously created admin concepts and public frames for the home page, about/skills, projects, credentials/research/labs, contact/photos/achievements, English parity, education, achievements, knowledge, profile, resume, showcase, and project detail template. The public home frame inspected for this audit is node `8:2`.

## Confirmed design-to-code gaps

1. **Theme mismatch:** the Figma public home frame uses a light surface palette (`#F3F5F7`, white cards, navy typography, blue accents, muted gray and gold). The current homepage styles in `app/home.css` use a dark navy surface, dark panels and light text. The root layout also declares the dark theme. This is a real design divergence, but changing the global theme would affect every route and must be handled as a controlled, route-aware visual migration.
2. **Homepage composition mismatch:** the current home page contains a distinct editorial hero, ORCID identity link, long biography, and custom portrait composition. Figma's home frame uses a compact light hero with a photo card, three focus cards, and selected project cards. Reconcile section-by-section; do not discard existing indexable content or real profile imagery.
3. **Navigation parity mismatch:** the current shared header orders Skills before Projects; the Figma header orders Projects before Skills. Preserve every existing destination and verify English route behavior before changing order.
4. **Photos styling debt:** `app/photos/page.tsx` contains substantial inline styling. This makes responsive and design-token alignment harder to maintain. Refactor only after capturing current rendering and preserving all image URLs, alt text, JSON-LD and metadata.
5. **Credential facts require source reconciliation:** current repository content and metadata state 14 Cisco records / 26 total records. The latest previously approved profile snapshot available to this audit lists 11 Cisco credentials. Do not change displayed credential data or counts until the canonical credential inventory and evidence are reconciled. This is a content-integrity blocker, not a styling decision.
6. **Figma placeholders are not production content:** project visuals, contact messages, metric values and profile data shown as sample text in the mockups must never be copied into production. Use only existing verified repository data and genuine assets.
7. **New template routes need route-level verification:** the Figma file contains Education, Achievements, Knowledge, Profile, Resume and Showcase templates. Exact initial lookups for `app/education/page.tsx` and `app/achievements/page.tsx` returned 404; this alone does not prove the routes are absent because route groups, alternate directories or static HTML may serve them. Resolve route ownership before implementing or adding any URL.

## Recommended implementation sequence

1. Capture current public-page baselines and enumerate all route handlers/static HTML routes.
2. Resolve credential inventory and verify each route's current canonical/hreflang/metadata contract.
3. Implement shared header and theme tokens only after a route-by-route impact map; do not force a global light theme if some existing pages intentionally use dark editorial sections.
4. Align the homepage in small sections, retaining all substantive biography, real portrait, ORCID link, verified projects and structured metadata.
5. Refactor Photos styling without changing its image manifest, alt text, metadata or ImageGallery JSON-LD.
6. Align About, Skills, Projects, Credentials, Research, Labs and Contact in isolated page-level changes.
7. Treat the six additional Figma templates as new route proposals only after confirming whether equivalent routes already exist and defining unique, evidence-backed content.
8. Run typecheck, lint, all relevant existing build checks, route/SEO regression checks and browser-based responsive/visual QA. A successful build alone is not visual QA.

## Not performed

- No production deployment.
- No Neon schema/data changes.
- No edits to SEO-critical metadata or public paths.
- No changes to credential counts or project claims.
- No code implementation yet; this commit records the verified audit baseline and sequencing constraints.
