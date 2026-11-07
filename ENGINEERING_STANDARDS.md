# M.GH.AL Web Engineering Standards

**Status:** Adopted baseline for the modernization program  
**Date:** 2026-10-31  
**Scope:** Public bilingual static website and its build/quality tooling

## 1. Platform standards

- **HTML:** WHATWG HTML Living Standard. HTML is not a separately versioned “HTML 6” product; author semantic, valid HTML against the continuously maintained Living Standard.
- **CSS:** Current interoperable CSS specifications and Baseline-supported features. CSS has independently evolving modules rather than one global version number. Prefer progressive enhancement and provide fallbacks for features without broad support.
- **JavaScript:** ECMAScript 2026 language baseline where supported by the target browsers. Transpile only when a demonstrated browser-support requirement needs it; avoid unnecessary polyfills.
- **TypeScript:** TypeScript 7.0.2 stable as the initial pinned compiler baseline. Do not use 7.1 beta/nightly in production builds. Re-evaluate stable releases during scheduled dependency maintenance.
- **Graphics:** SVG for logos, icons, diagrams and crisp vector illustrations; AVIF/WebP for photographic and raster artwork with suitable fallbacks; preserve original source assets and provide responsive sizes.
- **Markup and direction:** Arabic pages use lang="ar" and dir="rtl"; English pages use lang="en" and dir="ltr". Shared components must rely on logical CSS properties (margin-inline, padding-inline, inset-inline, etc.).

## 2. Architecture decision

The current product is a bilingual static website/PWA made of HTML, CSS and browser JavaScript. Modernization must preserve that delivery model unless a measured requirement justifies a framework or server runtime.

- Keep the public output deployable as static files on Render, Vercel or another static host.
- Do not introduce React, Next.js, a server, a database or a runtime dependency merely to claim a newer stack.
- TypeScript is the preferred authoring language for new and progressively migrated application logic. Browser output must be standards-based JavaScript.
- Keep generated output and source clearly separated; do not require the static host to execute TypeScript.
- Keep shared visual tokens and components centralized. Avoid page-specific inline style systems and duplicated component rules.

## 3. Visual system

The corporate palette is:

| Token | Value | Intended use |
| --- | --- | --- |
| Navy | #172B4D | Primary brand and headings |
| Blue | #315A85 | Secondary actions and links |
| White | #FFFFFF | Main surface |
| Light gray | #F3F5F7 | Page background and subtle surfaces |
| Text | #202B38 | Primary body text |
| Muted | #64748B | Secondary text where contrast permits |
| Border | #DCE2E8 | Dividers and card borders |
| Gold | #B69A62 | Decorative accents only on light surfaces |
| Accessible gold text | #806333 | Gold-colored text on light surfaces |

Project artwork and issuing-organization logos retain their authentic source colors; those colors must not leak into the global interface palette.

## 4. Domain and environment independence

- Internal navigation and local assets use root-relative paths.
- The production origin is configuration data, not a design or content dependency.
- Canonical URLs, og:url, absolute structured-data URLs, sitemap and robots directives are generated or configured for the target environment.
- Render is a staging environment; production canonical URLs remain on the approved production origin.
- Staging must not be indexed. Do not change production DNS, canonical origin or deployment configuration as part of UI work without an explicit deployment decision.

## 5. Non-negotiable preservation rules

- Preserve all existing pages, bilingual content, credentials, certificates, project records, photographs, original artwork and verification references.
- Never invent credential metadata, issuer logos, dates, verification URLs or project claims.
- Do not modify the production branch, merge pull requests, force-push, change secrets, or deploy to production during modernization.
- Work incrementally on the designated development branch and validate each change before continuing.

## 6. Quality gates

Every phase must verify:

1. All 22 public Arabic/English pages remain available.
2. No broken internal links or missing local assets.
3. Navigation, search, credential filters and PWA/offline behavior remain functional.
4. RTL and LTR layouts remain equivalent in structure and behavior.
5. Responsive checks include 320px through 1920px.
6. Keyboard access, visible focus, reduced motion, semantic structure and contrast are tested.
7. HTML/CSS/TypeScript checks pass; generated JavaScript is tested in the browser.
8. Performance is measured before and after optimization.
9. Render staging is verified; production is not changed.

## 7. Migration sequence

1. Repository inventory and baseline capture.
2. Add reproducible TypeScript authoring and validation tooling without changing the deployed runtime.
3. Establish a single shared design-token and component layer.
4. Normalize the Arabic and English homepage against one visual specification.
5. Migrate shared navigation, footer, cards, search and credential components.
6. Normalize all internal pages without deleting or rewriting verified content.
7. Optimize responsive images, SVG illustrations, fonts and caching.
8. Complete accessibility, functional, SEO and performance regression testing.
9. Verify the Render staging deployment and report remaining limitations.

**A technology upgrade is accepted only when it improves maintainability, accessibility, performance or reliability without compromising static-host portability or existing content.**
