# M.GH.AL release record — 2026-11-05

## Source
- Repository: mghalaosimi-web/mghalaosimi-web
- Release branch: feat/mghal-credentials-projects-expansion-2026-11-05
- Verified application source commit before this release record: e4fa996cf3a64bbd36aeeff80c9c40cbc78c6e09

## Render
- Static site: mghal-release-current
- URL: https://mghal-release-current.onrender.com
- Build: npm ci && npm run build
- Publish directory: public
- Auto-deploy: enabled for the release branch
- Verified deploy: dep-dblr130u01pc739c9j1g
- Verified commit: e4fa996cf3a64bbd36aeeff80c9c40cbc78c6e09
- Status: live

## Cloudflare backend
- Worker: mghal-api
- Worker source: mghal-backend/worker.production.js
- D1 binding: DB (existing mghal-db)
- CORS allowlist includes the current Render release hostname and the official Vercel hostname.
- Worker upload completed successfully on 2026-11-05.
- D1 migration 0004: added media.blob_data BLOB.
- D1 migration 0005: added technologies.is_published and technologies.archived plus idx_technologies_public.
- Existing technology rows retain is_published=1 and archived=0 through additive defaults.
- No admin credentials or secrets are stored in this release record.

## Vercel
- Project: mghalaosimi-web
- Build: npm ci; npm run build
- Output directory: public
- Node.js: 24.x
- Latest observed Vercel branch deployment at release time was older than the Render commit.
- A direct deployment request for the release commit was rejected by Vercel with api-deployments-free-per-day (HTTP 402). This is not a successful deployment.
- Vercel branch deployment must be rechecked after the account limit resets; do not claim dual-platform release until the exact commit is READY on Vercel.

## Release acceptance
A full dual-platform release is accepted only when Vercel and Render both serve the same Git commit and the public output passes the repository quality and static-output security audits.
