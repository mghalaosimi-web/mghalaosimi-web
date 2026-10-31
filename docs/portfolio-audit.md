# M.GH.AL — GitHub Portfolio Inventory Audit

**Review date:** 2026-10-31  
**Account:** https://github.com/mghalaosimi-web  
**Website repository:** https://github.com/mghalaosimi-web/mghalaosimi-web  
**Working branch:** `fix/site-quality-audit-2026-10-31`  

## Inventory result

- Repositories visible under the account owner: **9**.
- Public repositories: **8** (including the website repository).
- Private repositories accessible to the connected GitHub integration: **1**.
- Additional repositories returned under collaborator affiliation: **0**.
- Project repositories excluding the website: **8** (7 public and 1 private).
- Distinct portfolio project records: **9**, including the official website itself and ESDP. The two university scheduling repositories are grouped as one related project family but remain separate source repositories. ESDP is retained as a project record from the owner's existing project context; no corresponding repository was found in the accessible account inventory.
- No repository in the accessible owner inventory was marked archived.

## Repository register

| Repository | Visibility | Default branch | Portfolio relationship | Evidence / classification |
|---|---|---|---|---|
| `humanity-system` | Private | `main` | Humanity System | README and repository tree were readable through authorized integration. Private source link and internal screenshots are not published. |
| `focusflow` | Public | `main` | FocusFlow | Repository currently contains only README.md; no source tree or screenshots were found. Treat as experimental/documentation-only until source is added. |
| `manar-schedule-system` | Public | `main` | Al-Manar Schedule Systems | React/Vite + Express/Node + Prisma + PostgreSQL; README screenshots in docs/images. |
| `almanar-schedule-system` | Public | `main` | Related scheduling implementation | Separate repository with overlapping product purpose and related UI/assets/reports; exact duplication not established. |
| `CipherSphere` | Public | `main` | CipherSphere | Python/PyQt6 desktop application; source modules and docs/images/gui.png found. |
| `yemen-ai` | Public | `main` | Yemen AI Platform | Python/FastAPI and RAG-oriented platform; docs/images contains dashboard, document workspace and model-control visuals. |
| `waynah` | Public | `main` | WAYNAH | Next.js/Hono/TypeScript/PostgreSQL/PostGIS monorepo; architecture and UI images found in docs/images. |
| `mghal-content-os` | Public | `main` | M.GH.AL Content Studio | Next.js/TypeScript/Gemini/Prisma; 20 user-guide image assets found. |
| `mghalaosimi-web` | Public | `main` | M.GH.AL Official Website | Static bilingual website and portfolio source; included as a meta-project record as requested. |

## Project classification

- **Main projects:** WAYNAH, Humanity System, Yemen AI Platform, M.GH.AL Content Studio.
- **Professional platform:** M.GH.AL Official Website.
- **Academic / institutional systems:** Al-Manar Schedule Systems, CipherSphere.
- **Desktop applications:** CipherSphere, M.GH.AL ESDP.
- **Mobile project records:** FocusFlow (README-only evidence); Humanity Android/Capacitor packaging is present in its private repository.
- **Experimental / incomplete evidence:** FocusFlow. CipherSphere is retained as an educational desktop application prototype; no completed-release claim is made.
- **Archived projects:** none found in the accessible account inventory.

## Image evidence

Real public repository screenshots are referenced only for WAYNAH, Yemen AI, M.GH.AL Content Studio, the schedule systems and CipherSphere. Humanity System is private and its internal images are not used. FocusFlow and ESDP have no verified screenshots in the accessible source records; their site covers are explicitly labelled illustrative artwork, not application screenshots.

## Security finding — action required

The public `yemen-ai/README.md` contains default role credentials. Credential values are intentionally not copied into this report or the public portfolio. Before production use, rotate every exposed default credential, remove default credential values from the public README and related docs, and verify that the application rejects defaults. No credential or secret was changed by this portfolio task.

## Verification limits

- GitHub owner inventory and collaborator affiliation were queried; no repositories were returned for collaborator affiliation. The inventory covers repositories visible to the connected GitHub account, not inaccessible repositories or other accounts.
- The Humanity System private repository was accessible for metadata/README/tree review. No private content or internal image is exposed by the public pages.
- Deployment URLs mentioned in repository documentation were not treated as live demos unless their live response could be confirmed. No live demo is claimed in the generated project pages; WAYNAH's README-listed deployment is labelled unverified.
- Render workspace selection was unavailable in this session, so no Render service or deploy status was inspected.
- The latest branch preview deployment for commit `2c4bf618dba38c39c11b45368a28df967f394997` reached `READY`. Vercel logs confirm `npm run build`, static page generation, TypeScript checks, script compilation and static output preparation completed. This is a preview deployment, not a production promotion.
- Render was not inspected because the account workspace was not selected; no Render service was changed.
- Commit dates for every source repository were not included in this portfolio content pass. The project record review date is not represented as a source-code last-commit date.

## Safety boundaries

No main-branch changes, PR merge, production deployment, database change, secret rotation, or deletion was performed as part of the portfolio inventory. No PR was merged.
