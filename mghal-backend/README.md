# M.GH.AL Backend API

## Production architecture

The single application database is **Neon PostgreSQL**. The official Vercel site calls the Render Node.js API directly. The public Cloudflare Worker URL remains available as a compatibility edge proxy and forwards requests to the same Render Node API; it does not query or write to D1.

- Cloudflare Worker: `mghal-api`
- Compatibility API URL: `https://mghal-api.m-gh-alaosimi.workers.dev`
- Canonical API runtime: `https://mghal-node-api-preview.onrender.com`
- Canonical database: Neon PostgreSQL, project `billowing-snow-49569906`, branch `br-morning-cherry-b9l25msz`
- D1 database: retained as a temporary backup only; it is not the application source of truth and is not bound by the current Wrangler configuration.

The Node runtime reuses the reviewed API handler in `worker.production.js` through `PgD1Database`, a compatibility adapter backed by Neon. The Cloudflare Worker in `worker.proxy.js` forwards the original method, path, query, body, authorization, visitor token, cookies, and origin to that Node runtime. It overwrites forwarded client-IP headers with Cloudflare's edge address.

Do not re-enable the legacy D1 handler or attach the D1 binding to the production proxy. Do not delete the D1 backup until a separate backup-retention review and explicit approval.

## Runtime

- Worker compatibility proxy: Cloudflare Workers
- API runtime: Node.js 22+
- Database: Neon PostgreSQL
- Node server: native HTTP server with `pg` connection pool
- PostgreSQL compatibility layer: `mghal-backend/node/postgres-adapter.mjs`

## Public API

- `GET /health`
- `GET /api/public/identity`
- `GET /api/public/education`
- `GET /api/public/skills`
- `GET /api/public/technologies`
- `GET /api/public/projects`
- `GET /api/public/certificates`
- `GET /api/public/achievements`
- `GET /api/public/articles?locale=ar|en`
- `GET /api/public/articles/:slug`
- `POST /api/public/visitors`
- `POST /api/public/events`
- `POST /api/public/comments`
- `GET /api/public/reactions?targetType=project|article&targetId=...`
- `POST /api/public/reactions`

Visitor tokens are opaque random values held by the browser; only SHA-256 hashes are stored in Neon. Anonymous visitor identities are not email-marketing subscriptions and do not imply explicit marketing consent. Browser tracking respects Do Not Track.

## Admin API

All admin routes require a valid Bearer session. Password hashes use PBKDF2-SHA256. Permissions are checked through the Neon role/permission tables.

- `GET /api/admin/bootstrap/status`, `POST /api/admin/bootstrap/rotate`, `POST /api/admin/bootstrap`
- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/dashboard`
- `GET /api/admin/followers`
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:id`
- `GET /api/admin/analytics?days=30`
- `GET|POST|PATCH|DELETE /api/admin/{projects|certificates|articles|identity|education|skills|technologies|achievements}`
- `GET|POST /api/admin/media` and authenticated `GET /api/admin/media/:id`
- `GET|POST|PATCH /api/admin/users`
- `PATCH /api/admin/followers/:id`

No default owner account or password is created. First-owner bootstrap requires a protected `OWNER_BOOTSTRAP_TOKEN` of at least 32 characters. Configure the secret in the Render service environment, verify the stored SHA-256 bootstrap hash in Neon, create the first owner, and then rotate/remove the one-time secret. Never place the token in source control.

## Imported content

- 10 projects.
- 21 certificate records, with 18 published and 3 intentionally unpublished.
- 2 published identity profiles (Arabic and English).
- 1 current Information Technology bachelor education record.
- 21 skill records.

No article content, media objects, or unverified certificate-to-QR mappings are fabricated.

## Validation

From `mghal-backend/node`:

```bash
npm ci
npm run check
npm start
```

The check runs strict JavaScript syntax validation and Node tests, including PostgreSQL SQL compatibility, health handling, and API proxy routing. The Node service exposes `GET /live` for liveness and `GET /ready` for a PostgreSQL `SELECT 1` readiness check. Production readiness must be verified through `/ready` before changing or removing the retained D1 backup.
