# Public Image Asset Inventory — 2026-11-22

Repository: `mghalaosimi-web/mghalaosimi-web`
Audited ref: `main` at the public-pages audit baseline
Working branch: `feat/public-pages-figma-alignment-2026-11-22`
Purpose: evidence-based inventory for the public-page image redesign. This document is not an approval to replace identity images, delete duplicate files, or change SEO metadata.

## Inventory method and limits

- Enumerated image-like blobs from the Git tree API (`.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`, `.svg`, `.gif`).
- The tree contains **156 image paths**, representing **76 distinct blob SHAs**. Public-facing paths account for **83 entries**.
- A repeated blob SHA proves byte-identical files, not that all references can safely be removed. No file was deleted or renamed.
- Git tree metadata supplies byte size and blob SHA, but not pixel dimensions, color profile, focal point, photographic subject, or licensing. Those require binary/image inspection and owner/source confirmation. Dimensions are therefore deliberately marked **not measured** below.
- Asset path names and current page source establish likely role; they do not establish image rights or factual suitability.

## Current public-page image references

| Surface | Current implementation evidence | Finding / action |
| --- | --- | --- |
| Home hero | `app/page.tsx` loads `/assets/images/mghal-profile-primary.jpg` with Next Image, `priority`, and responsive `sizes`. | Current hero portrait. Preserve its existing URL and Person/OG identity role pending SEO review. |
| About metadata/profile | `app/about/page.tsx` uses `/assets/images/mghal-profile-primary.jpg` for localized social metadata. The current audit confirmed the shared image is also reused in the About profile surface. | Reuse is the known duplication. A distinct owner-approved photo is needed for the visible About composition; do not change metadata identity image as part of a styling-only change. |
| Photos | `app/photos/page.tsx` has a 12-item manifest under `/profile-gallery/`, with separate Arabic and English alt text and ImageGallery JSON-LD. | Preserve all 12 URLs, ordering, alt text, metadata and JSON-LD until a separate gallery/SEO review. |
| Project listing | `public/projects.html` references project SVG covers and `project-placeholder.svg`. | Several projects currently share a generic placeholder. Replace only with project-specific, evidence-backed screenshots/diagrams after reviewing each project. |
| Credentials | `app/credentials/page.tsx` and `public/assets/certificates/` contain issuer/certificate imagery. | Treat as documentary evidence. Do not replace official certificate artwork with generated graphics. Credential count conflict remains open (repository says 14 Cisco / 26 total; latest approved inventory snapshot says 11 Cisco). |
| Research / Labs / Skills | Current page components primarily use CSS/vector iconography and editorial layout rather than a complete set of dedicated image assets. | Prefer purpose-built SVG diagrams and CSS visuals. Avoid generic stock photography. |
| Contact | No dedicated page-specific image asset was confirmed in the audited source files. | A restrained abstract communication/network illustration can be added as a decorative asset; it must not depict a real person or event. |
| Resume / Showcase / Profile / Education / Knowledge / Achievements | Legacy static HTML and/or route-specific files exist in the repository; exact page ownership must be verified before assigning new assets. | Do not create duplicate routes or alter public URL ownership. |

## Existing profile and gallery assets

All sizes below are Git blob sizes in bytes. Pixel dimensions and image rights are not yet verified.

| Public path | Bytes | Current classification | Potential use / review |
| --- | ---: | --- | --- |
| `public/assets/images/mghal-profile-primary.jpg` | 601,543 | Current primary portrait | Home hero and existing identity/SEO image; keep stable. |
| `public/assets/images/mghal-avatar.webp` | 46,968 | Avatar | Small identity/avatar contexts; inspect crop and resolution before use at larger sizes. |
| `public/profile-gallery/mghal-eid-portrait-2026.png` | 136,534 | Gallery portrait by filename/manifest | Candidate for a distinct personal/profile surface only after visual and owner approval. |
| `public/profile-gallery/mghal-cultural-portrait-2026.png` | 187,546 | Gallery portrait by filename/manifest | Candidate for a distinct personal/profile surface only after visual and owner approval. |
| `public/profile-gallery/mghal-with-companion-2026.jpg` | 99,916 | Two-person gallery photograph by manifest alt | Keep in gallery; do not use as solo hero portrait. |
| `public/profile-gallery/mghal-reading-portrait-2026.jpg` | 601,543 | Reading portrait; byte-identical to primary portrait | Not a distinct photograph despite its separate path. Do not use it to satisfy the no-duplicate requirement. |
| `public/profile-gallery/mghal-photo-2026-07-22.jpg` | 1,598,989 | Personal gallery photo | Candidate only after visual review and confirmation of context. |
| `public/profile-gallery/mghal-photo-2026-07-28-a.jpg` | 1,120,474 | Personal gallery photo | Candidate only after visual review and confirmation of context. |
| `public/profile-gallery/mghal-photo-2026-07-28-b.jpg` | 2,196,910 | Personal gallery photo | Candidate only after visual review and confirmation of context. |
| `public/profile-gallery/mghal-professional-poster-01.png` | 153,924 | Identity poster | Gallery/brand artwork, not a replacement portrait. |
| `public/profile-gallery/mghal-professional-poster-02.png` | 2,223,244 | Identity poster | Gallery/brand artwork, not a replacement portrait. |
| `public/profile-gallery/mghal-brand-visual-01.png` | 2,304,724 | Brand visual | Gallery/brand artwork; inspect before any new use. |
| `public/profile-gallery/mghal-brand-portrait-visual.png` | 288,695 | Artistic brand portrait visual | Clearly label as artwork; never represent as a documentary photograph. |
| `public/profile-gallery/mghal-brand-visual-02.png` | 2,243,351 | Brand visual | Gallery/brand artwork; inspect before any new use. |

Note: the Photos page manifest has 12 items. The table above includes the current avatar as an additional reusable asset and lists all 12 gallery entries.

## Existing project artwork

The following public SVGs are present. Their SVG format and filename indicate project-cover intent; visual content should still be inspected before final assignment.

| Asset | Intended project family | Finding |
| --- | --- | --- |
| `public/assets/projects/waynah.svg` | WAYNAH | Dedicated cover exists. |
| `public/assets/projects/ciphersphere.svg` | CipherSphere | Dedicated cover exists. |
| `public/assets/projects/focusflow.svg` | FocusFlow | Dedicated cover exists. |
| `public/assets/projects/content-os.svg` | M.GH.AL Content OS | Dedicated cover exists. |
| `public/assets/projects/schedule.svg` | Schedule systems | Shared by more than one schedule project in legacy listing; verify distinction before reuse. |
| `public/assets/projects/yemen-ai.svg` | Yemen AI | Dedicated cover exists. |
| `public/assets/projects/mghal-official-website.svg` | M.GH.AL official website | Dedicated cover exists. |
| `public/assets/projects/project-placeholder.svg` | Generic fallback | Currently reused by multiple project cards; do not treat as unique project artwork. |

## Other public artwork and evidence assets

- `public/assets/og-image.svg` — current social preview artwork; preserve until explicit OG review.
- `public/assets/issuers/cisco-logo.svg` — issuer logo; preserve its brand usage.
- `public/assets/certificates/` — certificate and badge images, including Cisco and Edraak items. Use only with the matching credential record and issuer/verification source.
- `public/assets/certificates/previews/` — preview copies for certificate records. Many are byte-identical to items in `docs/certificates-inbox/`; avoid copying them into page-specific visual directories.

## Duplicate-content findings

The tree includes repeated copies of the same blobs across source, inbox, public and gallery directories. Examples:

- `assets/images/mghal-profile-primary.jpg`, `public/assets/images/mghal-profile-primary.jpg`, `public/images/profile/٢٠٢٦٠٧٢١_١٢١٩٥٢.jpg`, and `public/profile-gallery/mghal-reading-portrait-2026.jpg` share one blob SHA.
- `public/images/profile/1785462249202.png` and `public/profile-gallery/mghal-eid-portrait-2026.png` share one blob SHA.
- `public/images/profile/1785793323381.png` and `public/profile-gallery/mghal-cultural-portrait-2026.png` share one blob SHA.
- `public/images/profile/file_0000000015f881fda0bd4d7945acda55.png` and `public/profile-gallery/mghal-professional-poster-01.png` share one blob SHA.
- `public/images/profile/file_0000000024508208a53d35d5c5e0054b.png` and `public/profile-gallery/mghal-professional-poster-02.png` share one blob SHA.
- `public/images/profile/file_0000000072ec82089e9b575d6a2f6101.png` and `public/profile-gallery/mghal-brand-visual-01.png` share one blob SHA.
- `public/images/profile/file_0000000089c88210ab301d52dedf88ee.png` and `public/profile-gallery/mghal-brand-portrait-visual.png` share one blob SHA.
- `public/images/profile/file_000000008df08208b770f8f1d75d06af.png` and `public/profile-gallery/mghal-brand-visual-02.png` share one blob SHA.
- Multiple certificate screenshots are repeated in `docs/certificates-inbox/` and `public/assets/certificates/previews/`.

This is a repository hygiene opportunity, not authorization to delete. Before deduplication, verify every runtime URL, static HTML reference, migration/import script, and image sitemap entry. Prefer a later controlled cleanup PR.

## Proposed page-specific image system

| Page / section | Required visual asset | Source policy |
| --- | --- | --- |
| Home hero | Distinct professional portrait | Keep current real primary portrait. |
| About / profile | A second, different authentic portrait | Select from owner-supplied originals only after visual review; current duplicate must be removed from visible About composition. |
| Academic journey / education | Real college, learning, study or documented participation image; alternatively an editorial academic illustration | Do not fabricate campus, classroom attendance, events or institutional affiliation. |
| Skills | Custom technical SVGs: software architecture, API, database, frontend, backend, testing | Prefer crisp vector diagrams over stock photography. |
| Projects index | One cover per project | Use real screenshots, project-owned art or clearly labeled conceptual diagrams. |
| Project detail | Product screenshots, workflow and architecture diagrams | Each image must map to the specific project's actual state and implementation. |
| Credentials | Official issuer logos, badges and certificate previews | Keep source/issuer attribution and verification mapping. |
| Research | Research-method, system-model and data-flow diagrams | Mark conceptual models as diagrams, not completed research results. |
| Labs | Experiment/architecture diagrams and actual lab output where available | Do not imply a security lab was executed unless evidence exists. |
| Achievements | Verified award/certificate evidence or neutral milestone graphics | No fabricated awards, seals or event photography. |
| Photos | Existing personal/brand gallery | Keep the 12-item manifest intact unless separately reviewed. |
| Contact | Abstract communication/network illustration | Decorative only; no stock person. |
| Resume | Restrained editorial cover and verified evidence thumbnails | No invented employment or client logos. |
| Showcase | Project-specific visual previews | Use actual screenshots or clearly labeled conceptual artwork. |

## Implementation gates

1. Inspect the candidate profile images visually and confirm which authentic photo belongs to Home and which belongs to About.
2. Record pixel dimensions, file format, file size, crop focal point, AR/EN alt text and source/rights for every selected image.
3. Build a machine-readable asset manifest and automated check for missing local assets, duplicate use in designated hero/profile slots, missing alt text and oversized raster files.
4. Use responsive Next Image dimensions/sizes, lazy loading below the fold and priority only for the actual hero.
5. Preserve canonical URLs, hreflang, robots, sitemap, structured data, social identity image, gallery URLs and all 12 gallery records.
6. Do not merge or deploy this work until route/SEO/image regression checks and responsive visual QA pass.

## Explicitly not done

- No image files were uploaded, generated, renamed, compressed, deleted or modified.
- No portrait was selected as About's replacement without visual inspection and owner confirmation.
- No page component, metadata, URL, sitemap, structured data or production setting was changed.
- No production deployment or Neon operation was performed.
