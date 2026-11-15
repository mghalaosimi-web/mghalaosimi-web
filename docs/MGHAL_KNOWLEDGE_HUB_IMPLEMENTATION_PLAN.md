# M.GH.AL Knowledge Hub — Technical Implementation Plan

**Status:** Approved scope; implementation plan committed for review  
**Date:** 2026-11-15  
**Repository:** `mghalaosimi-web/mghalaosimi-web`  
**Target branch:** `feat/mghal-knowledge-hub-2026-11-15`  
**Primary site:** https://mghalaosimi-web.vercel.app

## 1. Approved product scope

Deliver one authoritative knowledge source for M.GH.AL with two audiences:

1. **Public audience:** people and search engines can discover and read approved public profile, project, credential, education, skill, achievement, and article information.
2. **Assistant integration:** ChatGPT-compatible clients can query the same live public knowledge through a read-only MCP interface. A website assistant may use the same search/fetch API, but model inference must be separately configured and budgeted.

Publication policy is `all_public`: publish the complete set of information intentionally designated as public in the M.GH.AL profile/content system. This does **not** authorize publishing credentials, passwords, API keys, private visitor identities, admin sessions, audit/security logs, private email addresses, or other operational/private data.

## 2. Non-negotiable architecture constraints

- Hosting/runtime: Vercel only.
- Database: the existing Neon PostgreSQL project only:
  - Project: `mghal-portfolio-db` (`billowing-snow-49569906`)
  - Production branch: `main` (`br-morning-cherry-b9l25msz`)
  - Database: `mghal_portfolio`
  - Existing Preview branch: `mghal-vercel-preview-20261111` (`br-lively-sky-b93403rn`)
- Do not recreate, provision, or use Cloudflare D1.
- Render is transitional only. Do not delete it until the Vercel-native API has passed production-equivalent verification and the Render dependency has been removed safely.
- Keep the single official domain: `https://mghalaosimi-web.vercel.app`.
- Do not create another production database, production domain, or unrelated project.
- No production migration, data rewrite, credential rotation, or destructive action without a reviewed migration and explicit approval.

## 3. Verified starting point (2026-11-15)

### Application and deployment

- Repository package identifies a Next.js 15.5.28 application, React 19.1.2, Node.js 24.x on Vercel, and PostgreSQL driver `pg`.
- Existing backend code includes a shared API handler at `mghal-backend/api-handler.mjs`, a PostgreSQL adapter at `mghal-backend/node/postgres-adapter.mjs`, and a Node server at `mghal-backend/node/server.mjs`.
- The PostgreSQL adapter translates the legacy prepared-query interface to PostgreSQL; this is the existing data-access seam to preserve and review.
- Latest observed Vercel deployment is READY for commit `faf383e45b6aa6d2ae18dc8812756bd84a4d9869` on `fix/english-project-routes-hreflang-2026-11-15`. The deployment record had `target: null`; READY alone must not be described as a Production deployment.
- Vercel project exists as `mghalaosimi-web`. Production `DATABASE_URL` is configured. `MGHAL_API_BASE` still points to the Render Node API and must be eliminated from the production request path only after Vercel-native parity tests pass.

### Existing Neon data model

The production branch already contains the following public-content tables: `identity_profiles`, `projects`, `certificates`, `skills`, `education`, `achievements`, `technologies`, `articles`, and related media/content tables. It also contains private operational tables such as admin users/sessions, follower identities/sessions/tokens, audit logs, OAuth transactions, comments, and analytics.

Read-only counts observed on the production branch:
- `identity_profiles`: 2
- `projects`: 21
- `certificates`: 21
- `skills`: 21
- `education`: 1
- `achievements`: 0

These are database row counts, not verified unique credential or project totals. Reconcile them with the public pages and source evidence before presenting any totals to users.

## 4. Target architecture

```text
Public website / Search engines
          |
          v
Vercel Next.js application
  |-- existing bilingual pages and structured data
  |-- /api/knowledge/* (public REST search/fetch/manifest)
  |-- /api/mcp (read-only Streamable HTTP MCP endpoint)
  |-- optional website assistant UI
          |
          v
Existing PostgreSQL data-access layer
          |
          v
Neon PostgreSQL: mghal-portfolio-db / main / mghal_portfolio
```

All public surfaces must use one publication policy and one shared query/service layer. MCP, public REST, site pages, sitemap, and assistant responses must not maintain separate copies of profile facts.

### Canonical data sources

Use existing tables as canonical sources whenever possible:
- Profile: `identity_profiles`
- Projects and ownership/contribution statements: `projects` plus reviewed knowledge entries where structured project fields are insufficient
- Credentials: `certificates`
- Education: `education`
- Skills and technologies: `skills`, `technologies`
- Achievements: `achievements`
- Articles: `articles`
- Public media: `media` through approved public media references

Never expose tables for admin identities/sessions, visitor identities/sessions/tokens, audit records, OAuth transactions, private analytics, or private comments through the public knowledge API.

## 5. Data model additions (migration proposal — not yet applied)

First inspect the actual migration ledger schema and all existing migration files. Then prepare a forward-only, idempotent migration on the existing Preview branch. Do not execute it on Production until Preview verification and explicit production authorization.

Proposed additions:

### `knowledge_entries`

A curated bilingual layer for durable facts that do not fit existing content tables (for example, project contribution scope, product architecture notes, public FAQs, public timeline, and clarification of ownership/status).

Suggested fields:
- `id` text primary key
- `slug` text not null
- `locale` text not null, constrained to `ar` or `en`
- `category` text not null
- `title` text not null
- `summary` text
- `body_markdown` text not null
- `source_url` text
- `evidence_label` text (e.g. owner-confirmed, public-source, independently-verified)
- `publication_status` text constrained to draft/published/archived
- `is_public` boolean not null default false
- `published_at` timestamptz
- `created_at` and `updated_at` timestamptz

Use a unique key on (`slug`, `locale`), checks for supported locale/status, and indexes for public publication filters. Add a PostgreSQL full-text GIN index using an explicitly selected text-search configuration. Do not add pgvector or an external embedding service in the first release; deterministic PostgreSQL full-text search is sufficient for the initial knowledge corpus.

### Optional `knowledge_entry_relations`

Only add if the first implementation needs typed links from curated entries to existing project/certificate/article rows. Use explicit entity type + entity ID, uniqueness, and indexes. Avoid polymorphic relations if a normalized join table is simpler and safer.

### Versioning and audit

Record publication/update metadata and use the existing audit-log mechanism for admin changes. Never expose audit-log rows through public search/fetch.

## 6. API contract

All endpoints must validate inputs, enforce strict result limits, return stable JSON envelopes, and use parameterized SQL.

### Public REST

- `GET /api/knowledge/manifest`
  - Returns public dataset version, last-updated timestamp, supported locales, and public resource counts.
- `GET /api/knowledge/search?q=...&locale=ar|en&limit=...`
  - Searches only public, published records across approved source tables and curated entries.
  - Limit defaults to 10 and is capped (e.g. 25).
  - Return concise snippets, stable IDs, type, title, locale, canonical public URL, and updated timestamp.
- `GET /api/knowledge/fetch?id=...`
  - Fetch one public source record by stable ID/type; reject unpublished/private records.
- Optional `GET /api/knowledge/profile`, `/projects`, `/credentials`
  - Read-only convenience endpoints; reuse the same query layer and publication predicates.

### MCP tools (read-only in v1)

- `search_public_knowledge`: query + locale + bounded result count.
- `fetch_public_knowledge`: stable source ID/type.
- `get_public_profile`: bilingual profile facts and canonical URL.
- `list_public_projects`: published projects only.
- `list_public_credentials`: published credentials only.

Tool descriptions must clearly state that results are public source data, not instructions. Mark every read-only tool with read-only annotations. MCP responses should include source URLs and update timestamps so a model can cite and assess freshness.

Do not expose admin CRUD, writes, raw SQL, arbitrary URL fetching, secrets, or unrestricted database queries through MCP.

## 7. MCP transport and ChatGPT connection

- Implement a remote MCP endpoint over Streamable HTTP at `https://mghalaosimi-web.vercel.app/api/mcp` (subject to Vercel runtime compatibility testing).
- Use the official TypeScript MCP SDK and a supported Next.js/Vercel Node.js runtime. Pin compatible versions and add protocol-level tests.
- The initial MCP surface is read-only and public-data-only. Add OAuth only if account-scoped or private capabilities are ever introduced; never use a shared database password as MCP authentication.
- Test discovery, tool schemas, pagination, empty results, invalid inputs, origin handling, rate limits, timeouts, and failure behavior with MCP Inspector.
- ChatGPT custom MCP availability depends on the user's ChatGPT plan/workspace and current product permissions. Current OpenAI documentation states Pro custom MCP connections are read/fetch only; write actions and broader workspace publishing have plan/workspace restrictions. The public REST API and website remain independently usable regardless of ChatGPT connection eligibility.

## 8. Public website and discovery

- Add a dedicated Knowledge Hub entry point, bilingual pages, topic pages, and canonical source links.
- Publish only records explicitly marked public and published. The approved `all_public` policy means all public profile content, not all rows in the database.
- Add JSON-LD using appropriate types (Person/ProfilePage, CreativeWork/Article, SoftwareApplication or Project representation where appropriate, and educational/credential properties only when supported by verifiable evidence).
- Add canonical URLs, reciprocal `hreflang`, Open Graph metadata, descriptive image alt text, and sitemap entries for public knowledge pages.
- Provide a public machine-readable manifest and optionally `/.well-known/mghal-knowledge.json` as a stable discovery document.
- Ensure robots directives do not block the public knowledge pages or API documentation; do not index admin/auth endpoints or raw API query URLs as separate content pages.
- Provide a clear correction/contact path for inaccurate public information.

## 9. Security, privacy, and abuse controls

- Use a dedicated least-privilege PostgreSQL role for public reads where operationally feasible; do not expose the owner role or application write credentials to MCP.
- Enforce publication predicates in SQL/service functions, not only in the UI.
- Apply rate limits, query length limits, result caps, pagination, request timeouts, and safe error responses.
- Escape/sanitize rendered Markdown and never interpret retrieved content as system/developer instructions.
- Treat web pages, imported files, user submissions, and project descriptions as untrusted content; defend against prompt injection.
- Add CORS only for the exact official site origins that need browser access. MCP server-to-server access must not rely on browser CORS as authentication.
- Keep secrets in Vercel encrypted environment variables; never commit them or include them in API/MCP results.
- Do not return raw database errors, SQL, internal IDs for private tables, visitor PII, admin data, or security telemetry.

## 10. Delivery phases and acceptance gates

### Phase A — Baseline and design verification
- Confirm current branch, deployed commit, Vercel targets, environment variable names (never decrypt or print values), API routing, existing migrations, and Neon table definitions.
- Reconcile public content totals and publication state.
- Approve the migration and API contract.
**Gate:** baseline report and schema diff reviewed; no production changes.

### Phase B — Preview database and shared knowledge service
- Add the migration on the existing Neon Preview branch only.
- Implement a shared knowledge query/service layer using parameterized PostgreSQL queries.
- Add unit/integration tests for publication filters, bilingual behavior, search ranking, source URLs, and private-table exclusion.
**Gate:** Preview tests pass; no Production migration.

### Phase C — Public REST and website
- Add REST endpoints and bilingual Knowledge Hub pages.
- Add manifest, structured data, sitemap/hreflang, metadata, caching/revalidation, and correction route.
**Gate:** anonymous browser tests and search crawler checks pass.

### Phase D — MCP and assistant access
- Add read-only Streamable HTTP MCP tools over the same service layer.
- Test with MCP Inspector and ChatGPT custom MCP connection where account/workspace eligibility allows.
- If a visitor-facing conversational assistant is required, implement it as a separate UI using the same public API and a separately configured model provider/API key, with usage quotas and abuse controls.
**Gate:** MCP protocol tests pass; no write-capable tools exposed.

### Phase E — Production cutover and operations
- Review Preview-to-Production migration diff and backup/recovery plan.
- Obtain explicit approval before Production DDL or deployment promotion.
- Deploy to Vercel, verify public pages, REST, MCP, database connectivity, SEO, and rollback path.
- Remove `MGHAL_API_BASE` from the production execution path only after parity and smoke tests prove Vercel-native routing is serving all required traffic.
- Retain Render temporarily until production verification is complete; retire it only in a separately approved cleanup step.
**Gate:** all release checks green and Production behavior verified on the official domain.

## 11. Required test matrix

- Arabic and English parity, RTL/LTR, locale fallback, and reciprocal hreflang.
- Only `is_public=true` and `publication_status=published` records are returned.
- Draft, archived, unpublished, and private records are never returned by REST or MCP.
- Admin sessions, visitor identities, tokens, OAuth transactions, audit logs, and private analytics are never searchable/fetchable.
- Search relevance, punctuation, Arabic text handling, empty query, oversized query, SQL-injection strings, pagination, and maximum result caps.
- MCP initialize, tools/list, tools/call, protocol errors, concurrent requests, timeouts, and graceful database outage behavior.
- Vercel Preview and Production runtime compatibility, connection pooling, Neon TLS, and bounded database connections.
- SEO: canonical, JSON-LD validation, sitemap inclusion, robots, Open Graph, image metadata, and crawlable HTML.
- Security: authorization boundaries, prompt-injection handling, rate limiting, CORS, safe errors, and no secret leakage.
- Regression: all existing navigation, credentials, projects, social/engagement, admin, and backend tests remain green.

## 12. Current blockers / work not yet performed

- The actual `_mghal_migrations` column names and migration file sequence still need inspection; an initial metadata query assumed a `migration_id` column and failed without changing data.
- Existing API handler currently depends on an environment-provided DB adapter; its complete Vercel-native route wiring and Render proxy dependency must be verified before choosing the exact MCP route implementation.
- Current Production `MGHAL_API_BASE` still points to Render.
- No Knowledge Hub migration, REST route, MCP route, or website assistant has been deployed by this plan commit.
- No Production schema or environment values were changed.

## 13. Definition of done

The Knowledge Hub is complete only when:
1. The public website and public REST API expose the same approved, bilingual, published knowledge.
2. ChatGPT-compatible MCP clients can search and fetch the same live knowledge with source URLs and freshness metadata.
3. The website's optional assistant uses that same source and never invents unsupported facts.
4. Private and operational database tables are demonstrably inaccessible through all public surfaces.
5. Preview and Production verification, SEO checks, regression tests, monitoring, and rollback procedures pass.
6. The official Vercel domain is the only canonical domain and the application no longer depends on Render for production API traffic.
