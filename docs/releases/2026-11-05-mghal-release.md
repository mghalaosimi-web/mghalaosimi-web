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
- Git-connected Vercel project: mghal (project ID prj_oEeBkfAE2ofIETtwyUOHGR867X9k).
- READY deployment: dpl_J4vHHzVJKENmaj6Ex42HvnLUWwR8, built from the same source commit e4fa996cf3a64bbd36aeeff80c9c40cbc78c6e09 before this release-record-only commit.
- Alias mghal.vercel.app was explicitly assigned to that READY deployment and verified by reading the alias mapping.
- Project settings are now npm ci, npm run build, output public, Node.js 24.x. The next Git-triggered build should verify this setting against the newest commit.
- Direct API deployment requests can still return api-deployments-free-per-day (HTTP 402), but the Git-connected mghal project has successfully produced a READY deployment.
- A separate Vercel project named mghalaosimi-web still has mghalaosimi-web.vercel.app attached and its latest observed deployment is older (commit 7f3d35eea784e99bebfa3f7233ac29b5707fbf9b). Do not claim that hostname is updated until it is verified on the release commit.

## Release acceptance
A full dual-platform release is accepted only when Vercel and Render both serve the same Git commit and the public output passes the repository quality and static-output security audits.
