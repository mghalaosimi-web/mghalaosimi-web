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
- Implementation has since been added on this branch: distinct About and Academic Journey imagery, and dedicated conceptual SVG covers for all 19 project archive records in Arabic and English. The remaining audit items below are not implied to be complete.


## Visual image system requested for the public portfolio

The owner explicitly requested distinct imagery by page and by section rather than reusing the same portrait everywhere. Apply the following image taxonomy while keeping the M.GH.AL visual identity consistent:

| Page / section | Image type | Source and usage rules |
| --- | --- | --- |
| Home hero | One distinct, authentic professional portrait of the owner, different crop/shot from the About page | Use a separately supplied real photograph; do not synthesize or alter facial identity. Keep the current primary portrait as the structured Person identity image until a deliberate SEO asset review. |
| About / profile | A second authentic portrait, editorial/profile framing | Must be a different real photograph from the home hero; maintain natural appearance and accurate alt text. |
| Academic / career journey | Documentary academic imagery: real college/classroom/lab photograph, actual study desk or documented participation photo | Use only real supplied/documented images. If none exists, use a restrained editorial illustration of books, research notes, learning and systems—not a fabricated campus, certificate, event, employer or attendance claim. |
| Skills | Technical editorial illustrations: code editor, architecture diagram, database/network concepts, UI wireframe | Prefer custom vector/diagram artwork and genuine UI/code screenshots with secrets removed; no generic stock-photo collage. |
| Projects index | A unique project cover/thumbnail per project | Use actual product screenshots, repository-provided artwork, architecture diagrams, or a clearly labeled conceptual illustration. Never imply an unfinished project is production-ready. |
| Project details | Product screenshots, workflow diagrams, architecture/data-flow illustrations, actual device mockups | Each project gets its own image set. Clearly distinguish implementation screenshots from conceptual diagrams. |
| Credentials | Official issuer badge/certificate scans already present in the verified inventory | Preserve issuer artwork and verification links; no decorative replacement badges. |
| Research / Labs / Knowledge | Research diagrams, experiment visuals, document/data-flow illustrations, real lab screenshots where available | Use topic-specific technical visuals; label conceptual images as illustrations. |
| Achievements | Actual award/certificate/event evidence or restrained milestone graphics | Do not create fake award photographs, event scenes, or institutional seals. |
| Photos gallery | User-provided personal photographs and brand artwork, classified separately | Keep existing 12-image gallery inventory and accurate alt descriptions; do not repurpose gallery art as documentary evidence without review. |
| Contact | Minimal brand illustration or abstract communication/network graphic | Avoid unrelated portraits or stock people. |
| Resume / Showcase | One editorial cover graphic plus verified project/credential thumbnails | Use evidence-backed content and do not invent employment history or client logos. |

### Asset naming and technical treatment

- Store approved originals under descriptive, route-specific names (for example `home-portrait-2026.*`, `about-editorial-portrait-2026.*`, `journey-academic-documentary-01.*`, `skills-software-architecture-01.svg`, `project-waynah-cover.*`); choose extensions only after inspecting actual files.
- Maintain a source/rights ledger for every new asset: source, owner/permission, date, intended page, factual status (documentary vs conceptual), alt text AR/EN, crop focal point, dimensions, and whether it may be used for Open Graph.
- Use responsive Next/Image sizes, explicit dimensions/aspect ratios, lazy loading below the fold, and priority only for the actual hero image. Provide meaningful Arabic and English alt text; decorative diagrams use empty alt text when implemented as decorative.
- Do not duplicate one binary image under multiple filenames to simulate variety.
- Do not use AI-generated images as documentary evidence or as a replacement for the owner's real face. Conceptual abstract/vector artwork may be generated only when clearly labeled as illustration and not as a real event, person, institution, or product screenshot.
- Keep the existing primary portrait URL in Person structured data and social metadata until the owner explicitly approves a new identity image and a separate SEO impact review is completed.

### Current asset inventory finding

At the audit baseline, Home and About reused `/assets/images/mghal-profile-primary.jpg`. This branch now assigns `/profile-gallery/mghal-photo-2026-07-22.jpg` to the visible About profile and `/profile-gallery/mghal-photo-2026-07-28-a.jpg` to the Academic Journey tab in Arabic and English; Home and Person/OG identity metadata retain the primary portrait. The Photos route retains its 12-item gallery. The project archive now uses 19 distinct local conceptual SVG covers; no new raster/photo binaries were added.

### Required acceptance criteria for the image pass

1. Home hero and About profile use two distinct, owner-approved real photographs.
2. Journey uses real documented academic imagery or a clearly conceptual editorial illustration—not an invented personal history scene.
3. Every featured project uses its own evidence-backed cover/thumbnail; placeholders are explicitly labeled.
4. Skills, research, labs, knowledge, contact and showcase visuals are semantically relevant and not repeated filler.
5. Every image has accurate AR/EN alternative text, responsive sizing, a verified source/rights record, and no broken asset URL.
6. Structured data, canonical URLs, hreflang, sitemap, and existing gallery image inventory remain unchanged unless separately reviewed and approved.

## Preview verification update — 2026-11-22

- GitHub Actions quality workflow run #975 succeeded on `1268300438250c63092439f67741218ba505c877`.
- Vercel Preview deployment `dpl_DqvUhoGFdt1HXYz5USDjahSAU1R4` reached `READY` for the same commit. It remains a Preview deployment; Production was not changed.
- Authenticated HTTP retrieval returned 200 for `/`, `/projects`, `/en/projects`, `/projects/waynah`, and `/en/projects/waynah`. The two archive routes each returned 19 project images and retained the official canonical URLs and locale alternates. Preview responses correctly carry `noindex` at the response-header level.
- A desktop browser screenshot of `/projects` was captured and visually inspected. The archive hero and project-card layout rendered; this is a limited desktop check, not full-page or cross-device visual acceptance.
- Browser automation reached the Vercel authentication wall before a share link was issued. A temporary authenticated browser session then captured the desktop archive. The temporary browser box later hit the account compute limit; mobile screenshots and additional route screenshots therefore remain unverified.
- The static legacy detail route `/projects/waynah` returns 200 and retains its own canonical/hreflang and project-specific image gallery. It is not evidence that all legacy detail pages have been migrated to the new Next.js archive cover system.
- A visible `Visitor session unavailable` message appeared in the project archive preview. Its cause has not been established; do not classify it as a production defect without testing the corresponding production runtime/API.
- PR #70 remains Draft and unmerged. No production deployment, Neon operation, credential change, or production configuration change was performed.
