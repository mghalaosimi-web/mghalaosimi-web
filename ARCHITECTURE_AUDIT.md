# M.GH.AL — Architecture Audit

**Audit date:** 2026-11-10  
**Operational anchor:** feat/node-postgres-backend-2026-11-08 @ 7de53f6becabee1dfaab4fa328d3cb9131ecebcf

## 1. Architecture decision

**PARTIALLY VERIFIED:** the current operational architecture is Next.js + Node.js HTTP API + pg + PostgreSQL (Neon candidate). It is not a Prisma-based runtime.

The checked root package.json on the Node branch contains Next.js 15.5.28, React 19.1.2 and React DOM 19.1.2. The Node API package uses pg and a PgD1Database compatibility adapter. No prisma/schema.prisma, @prisma/client dependency, root Prisma migration folder or Prisma CLI dependency was found on this branch. The expected Next.js + Node.js + Prisma + Neon candidate must therefore be corrected to the implementation actually present: Next.js + Node.js + pg compatibility adapter + Neon PostgreSQL candidate.

## 2. Verified request path

### Primary Vercel site/API path

1. Visitor requests the Next.js site on the official Vercel hostname.
2. The Next.js app routes API requests through app/api/[...path]/route.ts.
3. The route uses lib/api-proxy-policy.mjs to resolve the upstream.
4. Vercel project mghalaosimi-web has a production-target environment variable named MGHAL_API_BASE. The configured host is mghal-node-api-preview.onrender.com.
5. mghal-backend/node/server.mjs creates a Node HTTP server, requires DATABASE_URL, creates a pg Pool and passes a PgD1Database instance as DB to the shared handler.
6. The shared handler is mghal-backend/worker.production.js.
7. The compatibility adapter translates the supported D1/SQLite-oriented queries and batches to PostgreSQL transactions.
8. The PostgreSQL connection target is expected to be Neon, but the exact Render DATABASE_URL mapping is BLOCKED pending workspace confirmation.

### Cloudflare compatibility path

The deployed Cloudflare Worker is named mghal-api. The current worker source contains NODE_API_ORIGIN and forwarding fetch behavior, and does not contain env.DB access or the prior business-route implementation. It therefore operates as a proxy in the inspected deployed version.

Live Worker settings still list a D1 binding named DB, alongside plain-text configuration bindings and a secret binding name. The secret value was not read. The retained D1 binding is unused by the inspected active Worker source; do not remove it as part of Phase 1.

## 3. Runtime and configuration evidence

| Component | Evidence | Status |
|---|---|---|
| Next.js frontend | Node branch package.json, app/, app/layout.tsx, app/page.tsx | VERIFIED |
| Next API proxy | app/api/[...path]/route.ts and lib/api-proxy-policy.mjs | VERIFIED |
| Node HTTP API | mghal-backend/node/server.mjs | VERIFIED |
| Database adapter | mghal-backend/node/postgres-adapter.mjs | VERIFIED |
| Shared business handler | mghal-backend/worker.production.js | VERIFIED |
| PostgreSQL schema | mghal-backend/postgres/0001_initial.sql | VERIFIED |
| Neon project | billowing-snow-49569906 / mghal-portfolio-db | VERIFIED |
| Neon database | mghal_portfolio on branch br-morning-cherry-b9l25msz | VERIFIED |
| Exact Render DATABASE_URL target | Render service environment metadata not inspected | BLOCKED |
| Cloudflare Worker | mghal-api; current content forwards to NODE_API_ORIGIN | VERIFIED |
| Cloudflare D1 binding | DB still present in Worker settings | VERIFIED |
| Current Worker D1 use | no env.DB or business route references in inspected active Worker content | VERIFIED for the inspected deployed version |
| Prisma | no schema or runtime dependency found | NOT IMPLEMENTED |
| Render YAML | render.yaml absent on inspected Node branch | NOT IMPLEMENTED |
| Vercel JSON | vercel.json absent on inspected Node branch | NOT IMPLEMENTED |

## 4. Source-of-truth and documentation conflict

Three sources of evidence must be separated:

- Current Vercel configuration: MGHAL_API_BASE is set on the production target and points to the Render Node API hostname.
- Current Node API source: DATABASE_URL → pg Pool → PgD1Database → shared worker handler.
- Current Cloudflare Worker source: NODE_API_ORIGIN → fetch forwarding. D1 DB remains attached but is not accessed in the inspected source.

However, historical PR descriptions and docs/node-neon-phase2-audit-2026-11-08.md state that production remained on Worker/D1 and Node/Neon was only preview. mghal-backend/node/README.md on the current branch states Neon is the only application database. The Vercel production environment now routes to the Node API hostname, while the Render service details have not yet been read. This is a genuine time/state discrepancy; do not repeat the older D1-only claim as current fact without re-verification.

**Working decision:** Neon is the production application database candidate indicated by current frontend routing and Node API code. It becomes fully VERIFIED only after Render service configuration confirms that its DATABASE_URL points to the inspected Neon project/database/branch.

## 5. Frontend structure and duplication risk

The current Node branch contains both:
- Next.js application components and API route infrastructure under app/.
- Legacy bilingual static HTML pages and shared browser assets under the repository root/public output.

This coexistence is historical and may be intentional for compatibility. It creates duplication risks in navigation, search, visitor tracking, SEO and content data. The Next.js command palette and legacy site search have separate implementations. Do not delete the static experience or consolidate it in Phase 1; inventory route ownership and confirm actual production usage first.

## 6. Architecture risks

1. **Preview-named upstream in production:** MGHAL_API_BASE is a production-target Vercel variable but its host is mghal-node-api-preview.onrender.com. Confirm the Render service identity and uptime before renaming or changing it.
2. **Unverified DATABASE_URL mapping:** Node source requires a protected DATABASE_URL; the live Render value was not read. Do not expose or rotate it.
3. **D1 retained binding:** deployed Worker settings still include DB, though current Worker code is a proxy. Preserve until rollback and retention are explicitly reviewed.
4. **Database drift:** D1 and Neon have different row counts and table sets. No parity or backup restoration claim is valid.
5. **No Prisma:** introducing Prisma now would create a second database access abstraction and potential duplicate migrations. Do not add it merely to match the expected candidate architecture.
6. **Static/Next coexistence:** determine the canonical owner for each route before removing code.
7. **Legacy documents are stale:** M.GH.AL_MASTER_PROJECT_STATE.md says last verified 2026-11-06 and documents a D1-only static deployment. Do not treat that file as current deployment truth; preserve it as historical context.

## 7. Recommended target, subject to owner review

Visitor → Next.js → API proxy/authentication/authorization → Node.js HTTP API → shared handler → PostgreSQL adapter → Neon PostgreSQL.

The Cloudflare Worker remains a compatibility/edge proxy only while it is configured to forward to the same Node service. D1 remains preserved as legacy data until a deliberate, evidence-based backup-retention decision.

No architecture configuration or production route was changed during this audit.


## Final verification addendum — runtime route and confidence

The official Vercel alias is READY on 7de53f6becabee1dfaab4fa328d3cb9131ecebcf. Production variable MGHAL_API_BASE points to https://mghal-node-api-preview.onrender.com. The inspected deployed Cloudflare mghal-api Worker forwards requests to that same Node API hostname and does not access env.DB. D1 remains populated but is not accessed by the inspected Worker source.

The exact Render service behind the upstream hostname, its deployment SHA/state, health/readiness and DATABASE_URL target remain BLOCKED pending explicit confirmation of Render workspace My Workspace. Neon mghal-portfolio-db is the intended candidate, not proven runtime source of truth until Render configuration is inspected.


## Final verification addendum — 2026-11-11

- PR #31 head 1d60838d537f3181bded9d148ca0b066881ec583: GitHub Actions run #548 SUCCESS; all three Vercel contexts SUCCESS. These checks do not constitute browser, load, CRUD, or restoration tests.
- Official Vercel alias mghalaosimi-web.vercel.app is READY on feat/node-postgres-backend-2026-11-08 at 7de53f6becabee1dfaab4fa328d3cb9131ecebcf.
- Vercel production variable MGHAL_API_BASE exists and points to https://mghal-node-api-preview.onrender.com. Render service ownership, deployment commit, health/readiness, and DATABASE_URL mapping remain BLOCKED pending owner confirmation of My Workspace. No secret value was read.
- Git divergence: main vs Node branch 355 ahead / 45 behind; recovery vs Node branch 2 ahead / 0 behind. PR #25 OPEN/Draft; PR #29 OPEN/not merged; PR #30 CLOSED/MERGED; PR #31 OPEN/Draft.
- PR #29 head 39d9b5981a1ffdf52d3f256d39eb170da256d92f is 8 ahead / 1 behind Node. Its changed-file inventory contains 12 gallery image assets; photos page references 12 paths, canonical /photos, Open Graph and ImageGallery JSON-LD. Sitemap includes /photos and image entries. Page is Arabic RTL only; no English /en/photos or explicit locale alternate metadata was found. CI run #537 and all three Vercel contexts SUCCESS. Rights/consent evidence is unavailable; publication remains BLOCKED, especially the photo with another person.
- Read-only Neon counts: projects 10, certificates 21, followers 317, reactions 14, analytics_events 775, skills 21, roles 3, admin_users 1, media 0. D1 counts: projects 10, certificates 21, followers 157, reactions 9, analytics_events 405, skills 21, roles 3, admin_users 0, media 0. Both migration ledgers contain five rows. D1 lacks Neon tables follower_identities, follower_identity_sessions, oauth_transactions.
- Cloudflare D1 mghal-db remains populated. Inspected mghal-api Worker source forwards to the Node API hostname and does not access env.DB. D1 is a populated legacy/rollback resource, not a verified active application database or backup. No isolated restore test or verified restore procedure exists.
- Render runtime verification: BLOCKED. D1 restoration: NOT RUN / NOT VERIFIED. Image publication approval: BLOCKED. Browser/device E2E, full CRUD/auth/RBAC, AI E2E, load/pressure, failover and restoration tests: NOT RUN.

No production code, runtime configuration, secret, DNS, deployment, or production database rows were changed. Phase 2 remains unauthorized.


## PR #31 check-state correction — final documentation commit

The previously reported successful PR #31 run #548 and three successful Vercel contexts applied to the earlier head 1d60838d537f3181bded9d148ca0b066881ec583. Subsequent evidence additions advanced the recovery branch to 8 commits / 8 files. At the latest poll, the then-current head dc59b7abc2d4fea6ca7563b8be07f6f6a0b0a6ad had all three Vercel contexts PENDING and no GitHub Actions workflow run returned. Therefore do not carry forward the earlier PASS as the status of the newest documentation commit. The final report update itself creates another documentation-only commit; its checks must be polled after this write. No browser or runtime test was performed.
