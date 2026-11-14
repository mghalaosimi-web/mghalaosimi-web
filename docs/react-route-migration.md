# React Route Migration

The portfolio is served by the Next.js App Router. Legacy static HTML documents are intentionally not retained.

## Route ownership

- Arabic pages use the root App Router routes (for example `/`, `/about`, `/projects`, and `/projects/[slug]`).
- English pages use the `/en` catch-all route and render the shared React page components.
- English project details are resolved by the `/en/projects/[slug]` branch in the catch-all route.
- The admin shell and offline fallback are React routes at `/admin` and `/offline`.
- `app/sitemap.ts` generates the bilingual sitemap from the approved public project registry.

## Legacy URL handling

`next.config.ts` permanently redirects known legacy `.html` URLs to their clean React equivalents. Old static project detail URLs are redirected to the dynamic project routes. Do not reintroduce generated HTML documents or static project catalogues.

## Public-content boundary

The public registry in `data/projects.ts` is the source for project listings, details, search and sitemap entries. Private or unpublished projects must not be exposed through any of those surfaces. Do not delete private database records to enforce this public presentation boundary.

## Validation gates

Before merging or deploying, run the complete Next.js quality workflow, including credential/profile audits, PWA checks, API runtime tests, SEO/sitemap tests, project route tests, navigation/search tests, TypeScript checks and `next build`. Verify both locales, dynamic project details, legacy redirects, admin access and offline fallback in a deployed preview before Production promotion.
