# M.GH.AL — Public Portfolio Content Audit

**Review date:** 2026-11-14  
**Scope:** Public-facing portfolio content and publicly accessible repository metadata.

## Publication policy

- Only projects approved for public presentation belong in the website catalogue, public project pages, search index, or public repository inventory.
- Private and unpublished project records are maintained in the private application database for authorized internal use. They are not mirrored into public HTML, client-side registries, static JSON assets, or public documentation.
- A public project entry must distinguish documented repository scope from independently verified deployment, release, and production readiness.
- Repository links, screenshots, and live-demo URLs are included only when their public availability is established.

## Verification boundaries

- Repository README claims are attributed to their source and are not treated as independent test evidence.
- A successful build confirms the build pipeline only; it does not establish live deployment, indexing, or production acceptance.
- Search-engine indexing is confirmed only through the relevant search-console status, not by sitemap inclusion or an indexing request.

## Maintenance

When a project's visibility changes, update the private database and the public registry through separate reviewed changes. Add regression tests that verify private records cannot enter public catalogues, routes, sitemap files, or static assets.
