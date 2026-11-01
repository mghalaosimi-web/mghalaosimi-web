# M.GH.AL Backend API

Cloudflare Worker API backed by the existing `mghal-db` D1 database.

## Runtime

- Worker: `mghal-api`
- Public endpoint: `https://mghal-api.m-gh-alaosimi.workers.dev`
- Canonical deployment entrypoint: `worker.production.js`
- D1 binding: `DB`
- Database ID: `1e5682c3-6a68-4fe5-b2c5-01f9fbe1aabd`
- CORS origins: official Vercel site and the configured Render site.
- Rate limit: 120 API requests per IP/minute; the limiter fails closed if D1 protection storage is unavailable.

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
- `POST /api/public/visitors` — creates/reuses an anonymous visitor-follower identity.
- `POST /api/public/events` — records allow-listed page and content events.
- `POST /api/public/comments` — submits a comment for moderation.
- `POST /api/public/reactions` — records a like/clap on a published article or project.

Visitor tokens are opaque random values held by the browser; only SHA-256 hashes are stored in D1. The anonymous visitor identity does not collect an email address and is not an email-marketing subscription or a record of explicit marketing consent. Browser tracking respects Do Not Track.

## Admin API

All admin routes require a valid Bearer session. Password hashes use PBKDF2-SHA256. Permissions are checked through the D1 role/permission tables.

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/dashboard`
- `GET /api/admin/followers`
- `GET /api/admin/comments`
- `PATCH /api/admin/comments/:id` with `approved|rejected|spam`
- `GET /api/admin/analytics?days=30`

No default owner account or password is created. The current D1 database has no admin user yet; first-owner provisioning must be completed through a separately secured one-time bootstrap before these routes can be used by an administrator.

## Imported content

The first content synchronization inserted:

- 10 project records from the reviewed project catalogue.
- 21 certificate records (6 Edraak, 14 Cisco, 1 JSNAD).
- 2 published identity profiles (Arabic and English).
- 1 current Information Technology bachelor education record.
- 21 published skill records with proficiency left as `not_specified`.

The public static website remains the SEO-friendly presentation layer. D1 is now populated for the API/admin platform. No article content, media objects, or unverified certificate-to-QR mappings were fabricated.

## Local validation

From this directory:

```bash
npm ci
npm run check
```

The check runs strict TypeScript, ESLint, Vitest and a Wrangler dry-run. The live Worker is deployed through Cloudflare; production D1 schema changes remain additive-only and require a numbered migration.
