# M.GH.AL Unified UI/UX System

**Status:** Implemented in the feature branch; production not changed.  
**Scope:** Public bilingual website and a separately styled administration console.  
**Principle:** Preserve existing routes, content, credentials, projects, integrations and business behavior while standardizing presentation and navigation.

## 1. Experience principles

- Identity first: a first-time visitor should immediately understand the professional role and the purpose of the site.
- Progressive disclosure: homepage summaries lead to dedicated detail pages; avoid duplicating full records on the homepage.
- Evidence before claims: project status, credential issuer, dates and verification links must come from the existing verified records.
- Bilingual parity: Arabic is RTL and English is LTR; both locales expose the same information architecture and equivalent actions.
- Accessible by default: keyboard operation, visible focus, semantic landmarks, descriptive labels and reduced-motion support.
- Resilient delivery: public content remains readable if optional API-backed features are unavailable.

## 2. Canonical visual tokens

| Token | Value | Use |
|---|---|---|
| Navy | `#172B4D` | Brand, headings, strong emphasis |
| Blue | `#315A85` | Primary actions, links, active controls |
| White | `#FFFFFF` | Main surfaces |
| Surface | `#F3F5F7` | Alternate sections, subtle fills |
| Text | `#202B38` | Main body and headings |
| Muted | `#64748B` | Supporting copy and metadata |
| Border | `#DCE2E8` | Dividers, fields and cards |
| Champagne | `#B69A62` | Restrained accent, focus decoration |
| Gold ink | `#806333` | Text-bearing gold accent with stronger contrast |

Typography: IBM Plex Sans Arabic with system sans fallback for Arabic; Inter with system sans fallback for English. Use responsive `clamp()` sizing for display headings, 16–18px body text on desktop and no less than 15px for dense mobile content unless a compact metadata label is required.

Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80px.  
Radii: 8, 12, 14, 20px.  
Content width: 1180px maximum; reading measure: approximately 72ch.  
Touch target: 44px minimum for primary controls.

## 3. Navigation and information architecture

Primary destinations: Home, Identity/Profile, Projects, Credentials, Knowledge, Contact. Identity detail pages retain Education, Skills, Technologies and Achievements; Resume remains directly accessible from the profile and footer. Search and locale switching remain global utilities. Follow is a distinct opt-in action and must never be silently inferred from a page view.

Legacy public pages used both `.navlinks` and `.links` for the header navigation. The shared site script now normalizes either class into `.navlinks`, applies a localized navigation label, and activates the same mobile menu behavior. This is a presentation normalization; it does not rewrite URLs or remove links.

Breadcrumbs should be used on generated project details and future article details when the page has a clear parent. The homepage remains the root and should not show a breadcrumb.

## 4. Component rules

- Buttons: primary for the page's main action; secondary/outline for alternatives; disabled and loading states must be explicit.
- Cards: one consistent border, radius, padding and elevation; card variants may differ in content layout, not in unrelated visual language.
- Badges: use for verified status, category or project lifecycle only; never rely on color alone.
- Forms: visible labels, inline validation, clear success/error messages and keyboard-visible focus.
- Search: localized dialog labels and empty/error states; Escape closes and focus returns to the opener.
- Tables: preserve readable minimum width inside a horizontal scroll container; on narrow screens, prefer a meaningful stacked representation when one exists.
- Empty states: explain why the section is empty and provide a next action only when one is valid.
- Loading states: reserve layout space and expose status to assistive technology.
- Modals: labelled dialog, focus containment, Escape behavior and focus restoration.

## 5. Responsive behavior

- 320–390px: compact header, one-column content, stacked actions, no clipped controls.
- 391–680px: one-column content and collapsible primary navigation.
- 681–900px: compact navigation and two-column grids where content supports it.
- 901–1279px: desktop navigation with fluid content width.
- 1280px+: content remains capped at 1180px; avoid stretching paragraphs across the screen.

Arabic pages must retain RTL reading order while icons, chevrons and inline metadata use logical CSS properties (`margin-inline`, `padding-inline`, `border-inline-*`). English pages must remain LTR.

## 6. Homepage section order

1. Header and primary navigation.
2. Identity hero: name, professional headline, short evidence-based summary and two clear actions.
3. What I build: concise capability categories.
4. Selected projects: a small curated subset with status and detail links.
5. Professional profile: education and role summary.
6. Skills and technologies: selected strengths, with a link to the full inventory.
7. Credentials and achievements: issuer distribution and selected verified items.
8. Knowledge: published articles only; do not manufacture sample posts.
9. Follow and contact: separate follow and contact actions.
10. Footer: professional links, locale and copyright.

## 7. Projects and credentials

Projects retain all ten registry entries and their original status values. Supported lifecycle labels are Completed, In Progress, Experimental, Incomplete, Paused, Planned and Archived. Cards show title, concise summary, cover/logo when available, category, status, technologies and only valid links. Private repositories are never exposed as public source links.

Credentials retain the authoritative 21-record total (6 Edraak, 14 Cisco, 1 JSNAD/OpenJS-Linux Foundation). Original files, QR codes, badges, issuer assets and verification URLs must not be replaced with generated evidence. Missing exact titles or issuer-specific verification data remain visibly incomplete rather than fabricated.

## 8. Admin boundary

The admin console is a separate application surface with its own sidebar, top bar, forms, tables, dialogs and responsive layout. Public theme styles must not leak into `.admin-shell`; admin styles must not alter public routes. RBAC and API authorization remain the security boundary; hiding a control is not authorization.

## 9. Accessibility and QA gates

Target WCAG 2.2 AA. Verify contrast, keyboard-only navigation, visible focus, heading order, landmark uniqueness, form labels, image alternatives, dialog focus behavior, reduced motion, forced colors, zoom and touch target sizing. Run the repository quality suite after every shared CSS or navigation change.

## 10. Release boundaries

This implementation is committed only to the feature branch and is intended for preview validation. It does not merge PR #8, modify `main`, change Cloudflare D1/R2, deploy Render, promote Vercel Production or alter production domains. Those release actions remain separate gates.
