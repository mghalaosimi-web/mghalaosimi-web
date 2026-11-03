# M.GH.AL — Complete Public UI/UX Redesign Report

**Date:** 3 November 2026
**Branch:** feat/mghal-visual-redesign-2026-11-03
**PR:** #9 — draft review
**Release state:** Preview/review only. No merge to main, production deployment, database migration, or production-domain change.

## 1. Design direction

A calm editorial technology identity replaces the previous mixed visual language. The design is deliberately professional, readable, and restrained rather than a dark gamer-style developer portfolio.

| Token | Value | Purpose |
|---|---|---|
| Navy | #172B4D | Brand, headings, navigation |
| Blue | #315A85 | Primary actions, links |
| White | #FFFFFF | Main surfaces |
| Cool gray | #F3F5F7 | Secondary surfaces |
| Champagne gold | #B69A62 | Decorative accent |
| Gold ink | #806333 | Accessible gold text |
| Main text | #202B38 | Body/heading contrast |
| Muted text | #64748B | Supporting text |
| Border | #DCE2E8 | Dividers and component boundaries |

Typography: IBM Plex Sans Arabic for Arabic and Inter for English. Arabic and English layouts retain RTL/LTR direction respectively.

## 2. Implemented across the public site

- Added assets/mghal-experience.css as a shared visual layer, preserving existing content, routes, and page-specific behavior.
- Loaded the layer on the public Arabic and English pages, résumé pages, article pages, 404/offline pages, and all generated project-detail routes.
- Kept the administration interface on its separate design boundary.
- Unified visual tokens, typography scale, content widths, section rhythm, cards, buttons, tags, metadata, borders, forms, focus states, empty/error states, and responsive rules.
- Added consistent card hover/focus behavior, reduced-motion support, forced-colors handling, and print styles.
- Refined page headings, section titles, metrics, project imagery, article reading surfaces, and résumé layout.
- Improved shared navigation behavior at tablet/mobile widths using the existing accessible menu and search controls.
- Preserved the existing Arabic/English routes and language-switch destinations.

## 3. Homepage and résumé

- Re-composed the Arabic homepage hero into a balanced identity/portrait composition.
- Kept the professional title and concise identity description prominent.
- Added a visible عرض السيرة الذاتية action to the Arabic homepage.
- Added View résumé to the English homepage.
- Kept résumé available in the site navigation.
- Standardized résumé navigation and added the shared navigation/search behavior.
- Refined résumé print/PDF presentation and responsive two-column content layout.

## 4. Page-specific refinements

- Profile: clearer identity, education, and professional summary cards; removed the oversized duplicate portrait.
- Projects: refined project cards, covers, status labels, filters, search controls, and project counts.
- Project details: shared visual layer applied to all 20 generated Arabic/English detail routes.
- Skills: consistent category cards and technology tags.
- Education and achievements: clearer timeline-style cards and metadata hierarchy.
- Knowledge/articles: improved reading width, code blocks, notices, comment forms, and empty/loading/error surfaces without inventing unpublished articles.
- Contact/showcase: consistent contact cards, gallery tiles, and external-link actions.
- Résumé: readable CV sheet, responsive portrait placement, consistent navigation, and print-specific rules.

## 5. Certificate section — strict structure lock

certificates.html and en/certificates.html were intentionally excluded from the new stylesheet and were not edited. No certificate ordering, grouping, data, images, QR codes, issuer details, badges, or verification links were changed.

The existing automated credential audit reports 18 detailed records per language. The wider profile inventory states 21 total credentials. This data reconciliation remains separate from the UI redesign and must not be used as a reason to rearrange the certificate section.

## 6. Verification

The full npm run quality command passed after the shared UI changes:

- TypeScript checks and generated asset consistency.
- Generated portfolio: 10 project records and 20 bilingual project-detail routes.
- HTML audit: 94 pages inspected; structure, landmarks, metadata, image alternatives, IDs, and local references passed.
- SEO audit: 42 deployed public pages and 42 sitemap URLs; canonical, reciprocal hreflang, descriptions, OG/Twitter metadata, JSON-LD syntax, sitemap coverage, and robots reference passed.
- Design-system audit passed.
- PWA audit passed.
- Credential audit passed: 18 records per language, issuer distribution, original-image-only cards, and issuer-logo consistency.
- Browser behavior tests passed for credentials, accessibility, project cards, navigation, mobile menu, search, and touch targets.
- Admin/platform tests passed for auth bootstrap, RBAC, content CRUD, followers, moderation, analytics, media, and bilingual article presentation.

Browser preview was visually reviewed on representative Arabic/English pages, including homepage, profile, projects, project details, skills, education, achievements, knowledge, contact, article state, and résumé.

## 7. Explicit release gates / limitations

- The sandbox ran Node 25.9.0; the project declares Node 24.x. Run CI under Node 24.x before release.
- Browser previews and automated responsive checks do not replace final verification on physical Android/iOS devices and desktop browsers.
- The visitor tracking implementation currently creates anonymous browser visitor sessions. It does not have a public email-subscription/Google-account email retrieval flow. No misleading email-follow form was added to the UI.
- The 18-vs-21 credential inventory difference remains a content-data reconciliation item; the certificate section itself remains untouched.

## 8. Release boundary

This branch is prepared for review only. Merge, production deployment, Render/Vercel promotion, domain changes, backend changes, and database migrations remain separate explicit release actions.
