# M.GH.AL — UI/UX Parallel Workstream Baseline

**Date:** 2026-11-22  
**Scope:** Main Phase 1 only. This document establishes a separate UI/UX workstream; it does not authorize a Production release.

## Baseline verified from the current application source

- The shared public shell is rendered by `app/layout.tsx`, with a locale-aware footer and a sticky shared header component.
- `app/components/SiteHeader.tsx` contains eight primary navigation destinations. The mobile swipe-navigation index is derived from the same list, so changing its order or length must include gesture regression tests.
- The homepage is composed of a hero, extended biography, professional disciplines, featured projects, technical capabilities, credentials, and contact sections.
- The biography contains multiple long-form paragraphs. Its responsive layout collapses to one column below 900px, with additional typography/padding adjustments below 600px.
- The photo gallery uses a responsive auto-fit grid, Next.js Image, descriptive bilingual alt text, and server-rendered gallery copy.
- The contact experience has recent responsive and accessibility-oriented changes on the current mainline; do not overwrite those changes without a before/after comparison.
- The application already has design-token, navigation, PWA, image-optimization, search, and accessibility-related regression scripts. Reuse these rather than introducing parallel styling systems.

## UI/UX audit priorities

### P0 — Preserve behavior while improving presentation
1. Keep Arabic RTL and English LTR parity across all shared components and page-specific layouts.
2. Preserve keyboard focus visibility, skip navigation, reduced-motion behavior, semantic landmarks, and accessible names.
3. Keep the sticky horizontal navigation usable on narrow screens; verify touch scrolling separately from page-swipe navigation.
4. Do not change authentication, RBAC, admin visibility, contact submission, or API behavior as part of visual work.

### P1 — Responsive and visual consistency
1. Review the homepage's long-form biography density and vertical rhythm at 360px, 390px, 768px, 1024px, and desktop widths.
2. Review shared typography, spacing, card surfaces, borders, focus states, and CTA hierarchy against the official M.GH.AL palette.
3. Check project cards for consistent title wrapping, status visibility, image/illustration aspect ratios, and tap-target sizing.
4. Review the photo gallery at mobile and tablet widths for image containment, caption readability, and layout stability.
5. Review contact cards and form feedback on mobile without changing the recently stabilized form semantics.

### P2 — Validation
- Run `npm run audit:design`, `npm run test:navigation`, `npm run test:search`, `npm run test:security-headers`, `npm run test:seo`, `npm run test:sitemap`, `npm run test:image-optimization`, `npm run typecheck`, and the production build.
- Inspect both Arabic and English pages at mobile, tablet, and desktop breakpoints.
- Compare screenshots before and after each visual change; do not infer visual correctness from TypeScript/build success alone.
- Verify that UI changes do not alter canonical URLs, hreflang, sitemap coverage, structured data, page titles, descriptions, or robots directives.

## Workstream isolation

- Branch: `feat/mghal-ui-ux-parallel-2026-11-22`
- Base: current `main` snapshot at branch creation.
- SEO/indexing changes belong on the separate `fix/mghal-seo-indexing-audit-2026-11-22` branch.
- No direct commits to `main`; no production deployment or merge without the owner's later approval.
- This audit does not claim that visual QA has been completed. Physical-device and screenshot comparison remain explicit validation gates.

## Exit criteria

A UI change is complete only when the visual before/after is reviewed, Arabic and English parity is preserved, mobile behavior is verified, accessibility checks pass, and the relevant CI workflows succeed.
