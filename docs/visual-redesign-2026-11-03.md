# M.GH.AL — Visual Redesign Report

**Date:** 3 November 2026  
**Working branch:** feat/mghal-visual-redesign-2026-11-03  
**Release state:** Preview-only; no production deployment, main-branch update, database migration, or domain change.

## Design direction

The public identity uses a calm editorial / professional technology direction rather than a generic dark developer portfolio.

- Navy #172B4D for identity, headings and emphasis.
- Blue #315A85 for primary actions and links.
- White #FFFFFF and cool gray #F3F5F7 for clean surfaces.
- Champagne gold #B69A62 as a restrained decorative accent; darker gold ink #806333 for readable text.
- IBM Plex Sans Arabic for Arabic and Inter for English.
- Shared content width, spacing, card, form, button, focus and responsive rules.

## Implemented

1. Added assets/mghal-experience.css as a shared visual layer for public pages, while preserving each page's existing route, content, and behavior.
2. Applied the visual layer to the Arabic and English public pages and to generated project-detail pages.
3. Re-composed the Arabic homepage hero into a balanced portrait / identity layout.
4. Added a direct عرض السيرة الذاتية action to the Arabic homepage hero and a View résumé action to the English homepage; the global navigation also retains the Resume destination.
5. Refined headers, typography, section rhythm, cards, metadata tags, metrics, forms, project covers, project discovery controls, focus states, reduced-motion behavior and print presentation.
6. Removed the oversized duplicate portrait from the profile page so the professional introduction and profile information appear immediately after navigation.
7. Preserved the existing project registry and all ten project records; generated bilingual project detail pages continue to use the shared design layer.
8. Kept the admin surface on its separate styling boundary.

## Certificate section — strict structure lock

certificates.html and en/certificates.html were intentionally excluded from stylesheet injection and were not edited by this redesign. No certificate ordering, grouping, data, images, QR codes, badges, issuer details or verification links were changed.

## Verification

The repository npm run quality suite completed successfully after the redesign:

- TypeScript checks and generated asset consistency.
- 94-page HTML audit.
- 42-page SEO and sitemap audit.
- Design token audit.
- PWA audit.
- Credential audit.
- Credential, accessibility, project-card and navigation behavior tests.
- Project portfolio tests: 10 records and 20 bilingual project routes.
- Admin/platform tests.

Browser preview review was performed for the Arabic homepage, English homepage, profile, projects listing and résumé. The homepage résumé action and bilingual hero layout were confirmed in the preview.

## Known follow-up checks

- The repository's current credential audit reports 18 detailed credential records per language, while the homepage currently describes 21 total records (18 detailed plus 3 Cisco records awaiting title matching). This is an existing content-inventory reconciliation item, not changed here because the certificate area is locked.
- The Node runtime in the sandbox was v25.9.0 while the project declares Node 24.x; the build and tests passed, but the runtime warning should be removed by running CI on Node 24.x.
- Final validation on real mobile devices and final production-domain review remain release gates.

## Release boundary

This branch is prepared for review only. Merge, production deployment, Render/Vercel promotion and any backend or database operation remain separate explicit release actions.
