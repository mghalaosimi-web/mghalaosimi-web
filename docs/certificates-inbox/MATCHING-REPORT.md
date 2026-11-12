# Certificate Asset Matching Report

Audit scope: files uploaded to `docs/certificates-inbox/` and the credential records in `app/credentials/page.tsx`.

## Confirmed record totals

- Cisco Networking Academy: 14 records
- Edraak: 6 records
- OpenJS JSNAD: 1 record
- Master EMC Shiraa 2026: 5 workshop records
- **Total: 26 records**

The credentials page now displays these 26 records. No second Cybersecurity Defense Analyst record was created.

## Confirmed image matches

### Cisco

| Credential | Image |
|---|---|
| Hardware and Upgrade Support | `Screenshot_٢٠٢٦١١١٣_٠١١٠١٠_OneDrive.jpg` |
| Cybersecurity Defense Analyst Career Path | `Screenshot_٢٠٢٦١١١٣_٠٠٤٧٢٣_OneDrive.jpg` |
| Junior Cybersecurity Analyst Career Path | `Screenshot_٢٠٢٦١١١٣_٠١٠٧٣٦_OneDrive.jpg` |
| Networking Basics | `Screenshot_٢٠٢٦١١١٣_٠١٠٨١٤_OneDrive.jpg` |
| Security and Connectivity Support | `Screenshot_٢٠٢٦١١١٣_٠١٠٩٠٦_OneDrive.jpg` |
| Python Essentials 1 | `Screenshot_٢٠٢٦١١١٣_٠١٠٩٥١_OneDrive.jpg` |
| Operating Systems Basics | `Screenshot_٢٠٢٦١١١٣_٠١٠٨٤٧_OneDrive.jpg` |
| IT Customer Support Basics | `Screenshot_٢٠٢٦١١١٣_٠١٠٥٢٢_OneDrive.jpg` |
| Introduction to Modern AI | `Screenshot_٢٠٢٦١١١٣_٠١٠٤٤٩_OneDrive.jpg` |
| Data Science Essentials With Python | `Screenshot_٢٠٢٦١١١٣_٠٠٥٥٠٤_OneDrive.jpg` |
| Endpoint Security | `Screenshot_٢٠٢٦١١١٣_٠٠٥٦٠٤_OneDrive.jpg` |
| IT Support Specialist Career Path | `Screenshot_٢٠٢٦١١١٣_٠١٠٠٤٠_OneDrive.jpg` |

All Cisco records now have a visual asset: full certificate previews where available, otherwise the issuer's Credly badge image. The unassigned screenshot `Screenshot_٢٠٢٦١١١٣_٠٠٥٤٠٨_OneDrive.jpg` was visually checked and is a duplicate of the Cybersecurity Defense Analyst certificate already represented by `Screenshot_٢٠٢٦١١١٣_٠٠٤٧٢٣_OneDrive.jpg`; it is not assigned to another credential.

### Edraak

- UI/UX Design — `Screenshot_٢٠٢٦١١١٢_٢٣٣٤٢٩_OneDrive.jpg`
- Communications Skills — `Screenshot_٢٠٢٦١١١٢_٢٣٣٥٢٤_Edraak.jpg`
- Interaction Design Fundamentals — `Screenshot_٢٠٢٦١١١٢_٢٣٣٢٢٩_OneDrive.jpg`
- UX Research — `Screenshot_٢٠٢٦١١١٢_٢٣٣٢٠٠_OneDrive.jpg`
- UX Design — `Screenshot_٢٠٢٦١١١٢_٢٣٣٣٤٠_OneDrive.jpg`
- User Interface Design Principles — `Screenshot_٢٠٢٦١١١٢_٢٣٣٢٥٧_OneDrive.jpg`

### OpenJS

- OpenJS Node.js Application Developer (JSNAD) — `1785613862401.png` is linked as the JSNAD preview based on the credential owner's explicit confirmation in this conversation. This is a user-confirmed asset match, not an independent visual/authenticity determination by the audit. The official Linux Foundation verification portal is linked; verification requires entering the family name and credential ID.

### EMC Shiraa 2026

- WS01 — `Screenshot_٢٠٢٦١١١٣_٠١١٥١٣_OneDrive.jpg`
- WS02 — `Screenshot_٢٠٢٦١١١٣_٠١١٣٣٦_Chrome.jpg`
- WS03 — `Screenshot_٢٠٢٦١١١٣_٠١١٥٣٠_OneDrive.jpg`
- WS04 — `Screenshot_٢٠٢٦١١١٣_٠١١٥٤٣_OneDrive.jpg`
- WS05 — `Screenshot_٢٠٢٦١١١٣_٠١٥٩٥٣_OneDrive.jpg`

## PDF matching

The credential page links the available original PDFs. Newly uploaded PDF links use the immutable Git commit containing the inbox assets, rather than a mutable branch URL.

Confirmed Cisco additions:
- Data Science Essentials With Python — full course-completion PDF, matched by title, recipient, completion date, and certificate ID.
- Endpoint Security — full course-completion PDF, matched by title, recipient, completion date, and certificate ID.
- IT Support Specialist Career Path — badge PDF matched by its exact credential title and issue date.

Confirmed EMC files:
- WS01 — `SHIRAA_Certificate_SHR-2026-WS01-0330.pdf`
- WS02 — `SHIRAA_Certificate_SHR-2026-WS02-0291.pdf`
- WS03 — `SHIRAA_Certificate_SHR-2026-WS03-0326.pdf`
- WS04 — `SHIRAA_Certificate_SHR-2026-WS04-0421.pdf`
- WS05 — `SHIRAA_Certificate_SHR-2026-WS05-0514.pdf`

## Missing PDF files

The following records currently have no confidently matched PDF in the uploaded set:

1. Communications Skills (Edraak)
2. UX Research (Edraak)
3. Operating Systems Support (Cisco)
4. English for IT 1 (Cisco)
5. OpenJS Node.js Application Developer (JSNAD) — no matched PDF supplied; the credential record and user-confirmed preview image are present.

## Unassigned or alternate files — do not auto-link

- `Screenshot_٢٠٢٦١١١٣_٠٠٥٤٠٨_OneDrive.jpg` — visually confirmed duplicate of the Cybersecurity Defense Analyst certificate image already used; not assigned twice.
- `Screenshot_٢٠٢٦١١١٣_٠١٠٧٥٦_OneDrive.jpg` — alternate IT Customer Support Basics image; the 010522 image is used as the primary preview.
- `CybersecurityDefenseAnalystCareerPathv120261112-20-hshmai.pdf` — same Git blob as the selected `...as0po8.pdf`; duplicate copy.
- `DataScienceEssentialswithPythonv120261112-20-o5zlo3.pdf` — badge-style export; the full course-completion PDF is linked instead.
- `EndpointSecurityUpdate20261112-20-kdjt2q.pdf` — badge-style export; the full course-completion PDF is linked instead.
- `IT_Support_Specialist_Career_Path_certificate_m-gh-alaosimi-gmail-com_39070537-a84b-4e8a-82d6-2168b7c6b355.pdf` — its extracted certificate title is “IT Support Specialist Pathway Exam”, not the exact “IT Support Specialist Career Path” credential title. It is intentionally not linked to that record pending confirmation.
- `SHIRAA_Certificate_SHR-2026-WS01-0330 (1).pdf` — second WS01 copy; the canonical filename without the suffix is linked.

## Publication note

Certificate cards use lazy-loaded images. Local previews are served through Next.js image optimization at quality 75; remote Credly badge and the WS05 preview are loaded unoptimized from their source URLs. This keeps local full-size certificate screenshots out of the initial eager-loading path.

The JSNAD preview association is based on the credential owner's explicit confirmation; issuer-side verification remains available through the official Linux Foundation portal and is not represented as completed by this repository update. The update is on the working feature branch only. It has not been merged or deployed to Production. Other unresolved assets remain unassigned rather than guessed.
