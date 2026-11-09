# M.GH.AL production release gates — 2026-11-10

## Release objective

Ship a stable, secure, accessible, bilingual digital-identity platform. A successful deployment is not sufficient by itself: the release must preserve the current production API/data path, prove the public visitor flows, and provide a tested rollback route.

This document is a release-control checklist, not a claim that the gates have passed.

## Current release boundary

- Production API remains on the existing Cloudflare Worker / D1 path.
- Node.js / Neon remains an isolated preview until route parity, migration, and rollback are proven.
- Do not change production secrets, database connections, DNS, service configuration, or production aliases as part of these pull requests.
- Do not merge or deploy the photo archive until the owner confirms that every publicly exposed image, especially photographs containing another person, is approved for publication.
- PR #25 (Node / Neon foundation) remains Draft.
- PR #29 (12-image gallery and image SEO) remains open; publication consent and Vercel release checks are outstanding.
- PR #30 (hydration and engagement fixes) remains Draft; full build, typecheck, lint, and browser verification are required.

## P0 — release blockers

### 1. Build and source integrity
- [ ] Install dependencies from the committed lockfiles in a clean environment.
- [ ] Run every documented root and backend test script, not only the scripts invoked by the Next.js production build.
- [ ] Run TypeScript typecheck and ESLint for both frontend and backend.
- [ ] Run the full production build on the exact release commit.
- [ ] Verify CI checks are green on the final PR head SHA; rerun after any subsequent commit.
- [ ] Resolve the Render frontend build failure where ESLint is unavailable by ensuring backend dependencies are installed before the root lint script runs.
- [ ] Confirm there are no uncommitted or environment-only changes required for the release.

### 2. Hydration and visitor engagement
- [ ] Verify there are no hydration warnings/errors on first load, refresh, locale switch, or client navigation.
- [ ] Verify visitor tracking initializes once and only after client hydration.
- [ ] Verify follow, unfollow, page like, project reactions, comments, and share controls against the intended API.
- [ ] Verify each mutation has loading, success, failure, and retry behavior; server counts must not be fabricated.
- [ ] Verify DNT behavior, anonymous-follow disclosure, public-name consent, and privacy copy in Arabic and English.
- [ ] Verify project cards remain React-owned and are not mutated by legacy scripts.
- [ ] Verify the visitor session and engagement state survive refresh without creating duplicate followers or reactions.

### 3. Authentication, authorization, and backend
- [ ] Prove first-owner bootstrap is safe, single-use, and disabled after owner creation.
- [ ] Test unauthenticated, authenticated, unauthorized, expired-token, and blocked-account cases for every admin resource.
- [ ] Add consistent request-schema validation and negative tests to every admin/public write endpoint.
- [ ] Add dedicated login/bootstrap brute-force controls and a bounded rate-limit retention strategy.
- [ ] Trust forwarded client IP headers only when the proxy chain is explicitly configured and verified.
- [ ] Confirm secrets are environment-only and never appear in logs, client bundles, repository history, or error responses.
- [ ] Add request IDs, redacted structured errors, and route-level latency/error telemetry.
- [ ] Exercise live Neon integration tests for auth, RBAC, CRUD, reactions, follows, comments, and transaction rollback.
- [ ] Keep production on D1 until a production-shaped migration, row-level reconciliation, uniqueness checks, media parity, and tested rollback are approved.

### 4. Runtime and deployment
- [ ] Verify /live reports process liveness and /ready fails closed when PostgreSQL is unavailable.
- [ ] Configure the Render health check to use /ready only after the service configuration can be safely updated and verified.
- [ ] Verify the exact frontend and API commit SHAs deployed to each preview service.
- [ ] Confirm production environment variables and API routing point to the existing production Worker/D1 path.
- [ ] Confirm a rollback artifact and previous known-good deployment are available.
- [ ] Do not treat a successful preview build as a production deployment.

## P1 — required before public launch

### Browser, mobile, and accessibility
- [ ] Test desktop and mobile widths, portrait and landscape, touch navigation, horizontal rail scrolling, and browser back/forward.
- [ ] Test Arabic RTL and English LTR across all public routes, locale switching, direct deep links, and refresh.
- [ ] Test keyboard-only navigation, visible focus, dialog focus restoration, screen-reader names, contrast, and reduced motion.
- [ ] Confirm no horizontal page overflow, clipped controls, dead links, broken images, or console errors.
- [ ] Test on a real Android browser and at least one desktop browser; automated DOM tests do not replace device QA.

### SEO, identity, and content accuracy
- [ ] Verify canonical URLs, hreflang alternates, robots rules, sitemap XML, image sitemap, Open Graph, and Twitter metadata on the deployed host.
- [ ] Validate Person, WebSite, ProfilePage, Article, and ImageGallery structured data against the actual visible content.
- [ ] Ensure Arabic and English names, education, role, certificates, dates, and project claims are consistent and factually accurate.
- [ ] Ensure each public image has meaningful alt text and a legitimate publication basis.
- [ ] Verify all sitemap URLs return the intended canonical page and no staging hostname leaks into production metadata.
- [ ] Submit sitemap and inspect important URLs in Search Console after the actual production release; do not claim indexing is guaranteed.

### Performance and resilience
- [ ] Measure Core Web Vitals on representative mobile pages and optimize any failing LCP, INP, or CLS.
- [ ] Verify images use appropriate dimensions, modern formats, lazy loading where suitable, and no layout shift.
- [ ] Verify service-worker cache behavior cannot serve stale HTML or API responses after a release.
- [ ] Test graceful behavior when the API, database, analytics, or external identity provider is unavailable.
- [ ] Verify retry behavior does not duplicate writes.

## Release decision record

Record the following against the exact release commit before approval:

| Evidence | Required value |
|---|---|
| Release commit | Full Git SHA |
| GitHub CI | All required checks green |
| Typecheck / lint / build | Pass |
| Browser QA | Desktop + mobile, AR + EN |
| API and RBAC tests | Pass against isolated test data |
| Database boundary | Production still on D1 until approved cutover |
| SEO validation | Metadata, sitemap, structured data pass |
| Image publication | Owner approval recorded |
| Rollback | Previous known-good release identified |
| Approval | Explicit owner approval |

## Stop conditions

Stop the release if any required check is missing, any production secret or database boundary is unclear, any visitor interaction silently fails, any public image lacks approval, or the deployed commit differs from the reviewed commit. Report the exact failing gate and evidence; never mark an unexecuted check as passed.
