import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import {resolveLocalizedAlternates} from "../lib/seo-paths.mjs";

const root = process.cwd();
const publicRoot = path.join(root, "public");
const catalog = JSON.parse(readFileSync(path.join(publicRoot, "assets/projects/catalog.json"), "utf8"));
assert.ok(Array.isArray(catalog.projects) && catalog.projects.length > 0, "The project catalogue must contain records.");
assert.match(catalog.siteOrigin, /^https:\/\//, "A canonical site origin is required.");

const privateSlugs = ["humanity-system", "mghal-esdp"];
const projectRegistry = readFileSync(path.join(root, "data/projects.ts"), "utf8");
const projectsArabicUi = readFileSync(path.join(root, "app/projects/ProjectsPageArabic.tsx"), "utf8");
const projectsEnglishUi = readFileSync(path.join(root, "app/projects/ProjectsExplorerEnglish.tsx"), "utf8");
const projectsData = readFileSync(path.join(root, "data/projects.ts"), "utf8");
const projectsCss = readFileSync(path.join(root, "app/projects/projects.css"), "utf8");
const projectDetailRoute = readFileSync(path.join(root, "app/projects/[slug]/page.tsx"), "utf8");
const nextConfig = readFileSync(path.join(root, "next.config.ts"), "utf8");
const seoPaths = readFileSync(path.join(root, "lib/seo-paths.mjs"), "utf8");
const registrySlugs = [...projectRegistry.matchAll(/slug:'([^']+)'/g)].map(match => match[1]);
const detailSlugs = [...projectDetailRoute.matchAll(/slug:'([^']+)'/g)].map(match => match[1]);
const legacySlugs = catalog.projects.map(project => project.slug);
const dynamicSlugs = registrySlugs.filter(slug => !legacySlugs.includes(slug));
assert.equal(registrySlugs.length, 19, "The public registry must contain all nineteen approved projects.");
assert.ok(projectsArabicUi.includes("publicProjects.filter(p=>filter==='all'||p.category===filter)"), "Arabic archive must show the full project registry without forcing one project into a separate lead slot.");
assert.ok(projectsEnglishUi.includes("publicProjects.filter(p=>filter==='all'||p.category===filter)"), "English archive must show the full project registry without forcing one project into a separate lead slot.");
assert.ok(!projectsArabicUi.includes("portfolio-featured-project") && !projectsEnglishUi.includes("portfolio-featured-project"), "No single project may be presented as the default lead project without an evidence-based ranking.");
const projectCoverPaths = [
  "/assets/projects/abdulmalik-erp-cover.svg","/assets/projects/abdulmalik-store-pro-cover.svg","/assets/projects/ramzei-erp-cover.svg","/assets/projects/manar-schedule-system.svg","/assets/projects/waynah.svg","/assets/projects/mghal-digital-os-cover.svg","/assets/projects/content-os.svg","/assets/projects/debwan-live-cover.svg","/assets/projects/alnasr-supermarket-erp-cover.svg","/assets/projects/yemen-ai.svg","/assets/projects/academic-os2-cover.svg","/assets/projects/ciphersphere.svg","/assets/projects/abdulmalik-store-management-cover.svg","/assets/projects/academicos-cover.svg","/assets/projects/almanar-schedule-system-cover.svg","/assets/projects/focusflow.svg","/assets/projects/mghal-digital-automation-cover.svg","/assets/projects/mghal-official-website.svg","/assets/projects/cryptolab-x-cover.svg"
];
for (const cover of projectCoverPaths) assert.ok(existsSync(path.join(publicRoot, cover.slice(1))), "Missing unique project cover: " + cover);
assert.equal(projectCoverPaths.length, registrySlugs.length, "Every project registry entry must have a dedicated conceptual cover.");
assert.ok(projectsArabicUi.includes("projectCovers[p.slug]") && projectsEnglishUi.includes("projectCovers[p.slug]"), "Both localized project archives must render per-project cover artwork.");
const coverMapPattern = /const projectCovers:Record<string,string> = (\{[\s\S]*?\});/;
const arCoverMap = projectsArabicUi.match(coverMapPattern);
const enCoverMap = projectsEnglishUi.match(coverMapPattern);
assert.ok(arCoverMap && enCoverMap, "Both localized archives must define their cover maps.");
const arCovers = JSON.parse(arCoverMap[1]);
const enCovers = JSON.parse(enCoverMap[1]);
assert.deepEqual(Object.keys(arCovers).sort(), [...registrySlugs].sort(), "Arabic cover map must match every project slug exactly.");
assert.deepEqual(enCovers, arCovers, "Arabic and English cover mappings must remain identical.");
assert.ok(projectsCss.includes(".portfolio-project-cover") && projectsCss.includes("background:var(--mghal-color-bg)"), "Project cover styling must use the shared design token.");
assert.doesNotMatch(projectsCss, /#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/, "Project route stylesheet must not introduce hard-coded colors.");

assert.ok(!projectsData.includes("onrender.com"), "The public project registry must not point to retired Render hosting.");

assert.ok(projectsArabicUi.includes("ترتيب البطاقات تنظيمي") && projectsEnglishUi.includes("organizational, not a comparative ranking"), "The project archive must clarify that display order is not a ranking.");

assert.ok(existsSync(path.join(publicRoot, "assets/projects/project-placeholder.svg")), "Dynamic project cards must have the neutral illustrative cover asset.");
assert.deepEqual(detailSlugs, registrySlugs, "Every public project must have a matching detail record.");
assert.equal(dynamicSlugs.length, 11, "Eleven non-legacy projects must use the Next.js dynamic route.");
const configuredLegacy = nextConfig.match(/const legacyStaticProjectSlugs = \[([^\]]+)\]/)?.[1].match(/'([^']+)'/g)?.map(value => value.slice(1,-1)) ?? [];
assert.deepEqual(configuredLegacy, legacySlugs, "Next.js static rewrites must match the eight legacy catalogue slugs exactly.");

assert.ok(nextConfig.includes("legacyStaticProjectSlugs.flatMap"), "Only legacy static projects should receive static-file rewrites.");
assert.ok(!nextConfig.includes("source: '/projects/:slug'") && !nextConfig.includes("source: '/en/projects/:slug'"), "A broad rewrite must not shadow dynamic project detail routes.");
assert.ok(seoPaths.includes("const projectMatch = pathname.match"), "SEO alternate generation must resolve all project slugs through one normalized route rule.");
assert.ok(!seoPaths.includes("legacyStaticProjectSlugs"), "SEO canonical generation must not preserve legacy-only trailing-slash rules.");
for (const slug of dynamicSlugs) {
  const ar = resolveLocalizedAlternates("/projects/" + slug, "ar");
  const en = resolveLocalizedAlternates("/projects/" + slug, "en");
  assert.equal(ar.canonical, "/projects/" + slug, "Dynamic Arabic project must use its real Next.js canonical path: " + slug);
  assert.equal(en.canonical, "/en/projects/" + slug, "Dynamic English project must use its real Next.js canonical path: " + slug);
  assert.equal(ar.languages?.en, en.canonical, "Dynamic project must expose an English alternate: " + slug);
  assert.equal(en.languages?.ar, ar.canonical, "Dynamic project must expose an Arabic alternate: " + slug);
}
for (const slug of legacySlugs) {
  const ar = resolveLocalizedAlternates("/projects/" + slug + "/", "ar");
  const en = resolveLocalizedAlternates("/projects/" + slug + "/", "en");
  assert.equal(ar.canonical, "/projects/" + slug, "Legacy static Arabic project canonical must be slashless: " + slug);
  assert.equal(en.canonical, "/en/projects/" + slug, "Legacy static English project canonical must be slashless: " + slug);
  assert.equal(ar.languages?.en, en.canonical, "Legacy static project must expose a clean English alternate: " + slug);
  assert.equal(en.languages?.ar, ar.canonical, "Legacy static project must expose a clean Arabic alternate: " + slug);
}

for (const cover of ["humanity.svg", "esdp.svg"]) {
  assert.ok(!existsSync(path.join(publicRoot, "assets/projects", cover)), "Private project cover must not be published: " + cover);
}
const publicProjectData = readFileSync(path.join(root, "data/projects.ts"), "utf8");
for (const slug of privateSlugs) {
  assert.ok(!catalog.projects.some(project => project.slug === slug), "Private project must not appear in the public catalogue: " + slug);
  assert.ok(!publicProjectData.includes("slug:'" + slug + "'"), "Private project must not appear in the public application registry: " + slug);
  for (const language of ["ar", "en"]) {
    const relative = path.join(language === "en" ? "en" : "", "projects", slug, "index.html");
    assert.ok(!existsSync(path.join(publicRoot, relative)), "Private project detail file must not be published: " + relative);
  }
}

const ids = new Set();
const slugs = new Set();
const expectedRoutes = [];
for (const project of catalog.projects) {
  assert.ok(project.id && project.slug && project.title?.ar && project.title?.en, "Stable ids, slugs and bilingual titles are required.");
  assert.ok(!ids.has(project.id) && !slugs.has(project.slug), "Project ids and slugs must be unique.");
  ids.add(project.id);
  slugs.add(project.slug);
  assert.ok(project.summary?.ar && project.summary?.en && project.problem?.ar && project.problem?.en, "Bilingual summaries and problem statements are required.");
  assert.ok(Array.isArray(project.technologies) && Array.isArray(project.features) && Array.isArray(project.gallery), "Technology, feature and gallery arrays are required.");
  assert.ok(project.cover?.startsWith("/assets/projects/"), "Project covers must use local portfolio assets.");
  assert.ok(existsSync(path.join(publicRoot, project.cover.slice(1))), "Missing project cover: " + project.cover);
  if (project.repository) assert.match(project.repository, /^https:\/\/github\.com\/mghalaosimi-web\//, "Repository links must point to the expected public owner.");
  if (project.visibility?.ar?.includes("خاص")) assert.equal(project.repository, null, "Private repositories must never be linked publicly.");
  for (const image of project.gallery) {
    assert.match(image.src, /^https:\/\//, "Gallery images must use HTTPS.");
    assert.ok(image.alt?.ar && image.alt?.en && image.caption?.ar && image.caption?.en, "Gallery images need bilingual alt text and captions.");
    assert.doesNotMatch(image.src, /humanity-system|\.env|localhost/i, "Private or local resources must not be referenced in public galleries.");
  }
  if (project.deploymentReference?.url) assert.match(project.deploymentReference.url, /^https:\/\//, "Deployment references must use HTTPS.");
  for (const language of ["ar", "en"]) {
    const relative = path.join(language === "en" ? "en" : "", "projects", project.slug, "index.html");
    const file = path.join(publicRoot, relative);
    assert.ok(existsSync(file), "Generated page missing: " + relative);
    const html = readFileSync(file, "utf8");
    assert.match(html, new RegExp("<html lang='" + language + "'"));
    assert.match(html, new RegExp("dir='" + (language === "ar" ? "rtl" : "ltr") + "'"));
    const canonical = catalog.siteOrigin + "/" + (language === "en" ? "en/" : "") + "projects/" + project.slug;
    const canonicalTag = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i)?.[0];
    const canonicalHref = canonicalTag?.match(/\bhref=["']([^"']+)["']/i)?.[1];
    assert.equal(canonicalHref, canonical, "Canonical URL mismatch: " + relative);
    assert.ok(html.includes("hreflang='ar'") && html.includes("hreflang='en'"), "Reciprocal language alternates are required.");
    assert.ok(html.includes("property='og:title'") && html.includes("property='og:description'") && html.includes("property='og:image'"), "Open Graph metadata is required.");
    assert.ok(html.includes("name='twitter:card'"), "Twitter card metadata is required.");
    assert.ok(html.includes("application/ld+json"), "Structured data is required.");
    const jsonLd = [...html.matchAll(/<script type='application\/ld\+json'>(.*?)<\/script>/g)];
    assert.ok(jsonLd.length > 0, "JSON-LD script block is required.");
    for (const match of jsonLd) assert.doesNotThrow(() => JSON.parse(match[1]), "JSON-LD must be valid JSON.");
    if (project.slug === "mghal-official-website") assert.ok(html.includes('"@type":"WebSite"'), "Official website must use WebSite structured data.");
    assert.ok(html.includes("id='main-content'") && html.includes("class='skip-link'"), "Accessible page landmarks are required.");
    assert.ok(html.includes("name='description'"), "Meta description is required.");
    assert.doesNotMatch(html, /(?:AIza[0-9A-Za-z_-]{20,}|EAAB[A-Za-z0-9]+|postgres(?:ql)?:\/\/[^ "'<>]+)/i, "Generated pages must not contain common credential patterns.");
    for (const match of html.matchAll(/<img\b([^>]*)>/g)) assert.match(match[1], /\balt=/, "Every image requires alt text.");
    expectedRoutes.push(canonical);
  }
}

const sitemap = readFileSync(path.join(publicRoot, "sitemap.xml"), "utf8");
for (const route of expectedRoutes) assert.ok(sitemap.includes("<loc>" + route + "</loc>"), "Sitemap entry missing: " + route);
const sitemapRoutes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(sitemapRoutes).size, sitemapRoutes.length, "Sitemap URLs must be unique.");
console.log("Project portfolio tests passed: " + catalog.projects.length + " records, " + expectedRoutes.length + " bilingual routes, covers, gallery metadata, private-source guard, SEO, JSON-LD, accessibility and sitemap.");
for (const project of catalog.projects) {
  for (const language of ["ar", "en"]) {
    const file = path.join(publicRoot, language === "en" ? "en" : "", "projects", project.slug, "index.html");
    const html = readFileSync(file, "utf8");
    const canonicalHref = html.match(/<link\b(?=[^>]*\brel=[\'"]canonical[\'"])[^>]*\bhref=[\'"]([^\'"]+)[\'"]/i)?.[1] ?? "";
    assert.ok(canonicalHref && !canonicalHref.endsWith("/"), "Project canonical must not end with a slash: " + file);
    assert.ok(html.includes("aria-label='Core site links'") || html.includes("aria-label='روابط الموقع الأساسية'"), "Project details must expose the shared lightweight footer navigation: " + file);
    for (const route of [language === "en" ? "/en/projects" : "/projects", language === "en" ? "/en/credentials" : "/credentials", language === "en" ? "/en/contact" : "/contact"]) {
      assert.ok(html.includes("href='" + route + "'"), "Project footer must link to clean core route " + route + ": " + file);
    }
    assert.ok(html.includes("class='navlinks'"), "Project details must use the shared primary navigation: " + file);
    assert.ok(html.includes('nav-resume'), "Project details must expose the résumé action: " + file);
    assert.ok(html.includes("src='/assets/site.js'"), "Project details must load shared navigation and search: " + file);
  }
}

for (const [slug, titleAr, titleEn] of [
  ["almanar-schedule-system", "Al-Manar Schedule System", "Al-Manar Schedule System"],
  ["manar-schedule-system", "Manar Schedule System", "Manar Schedule System"]
]) {
  const ar = readFileSync(path.join(publicRoot, "projects", slug, "index.html"), "utf8");
  const en = readFileSync(path.join(publicRoot, "en", "projects", slug, "index.html"), "utf8");
  assert.ok(ar.includes("<title>" + titleAr), "Arabic title must identify " + slug);
  assert.ok(en.includes("<title>" + titleEn), "English title must identify " + slug);
  assert.ok(ar.includes("name='description'") && en.includes("name='description'"), "Both schedule systems need descriptions");
  const arDescription = ar.match(/<meta name='description' content='([^']+)'/i)?.[1];
  const enDescription = en.match(/<meta name='description' content='([^']+)'/i)?.[1];
  assert.ok(arDescription && enDescription && arDescription !== enDescription, "Schedule project descriptions must be distinct by language and project");
}
const scheduleDescriptions = ["almanar-schedule-system", "manar-schedule-system"].map(slug => {
  const ar = readFileSync(path.join(publicRoot, "projects", slug, "index.html"), "utf8");
  const en = readFileSync(path.join(publicRoot, "en", "projects", slug, "index.html"), "utf8");
  return [
    ar.match(/<meta name='description' content='([^']+)'/i)?.[1],
    en.match(/<meta name='description' content='([^']+)'/i)?.[1]
  ];
});
assert.equal(new Set(scheduleDescriptions.map(pair => pair[0])).size, 2, "The two Arabic schedule projects must have different descriptions");
assert.equal(new Set(scheduleDescriptions.map(pair => pair[1])).size, 2, "The two English schedule projects must have different descriptions");
for (const [language, hubPath] of [["ar", "projects.html"], ["en", "en/projects.html"]]) {
  const hub = readFileSync(path.join(publicRoot, hubPath), "utf8");
  for (const project of catalog.projects.filter(item => ["waynah", "yemen-ai", "mghal-content-os", "ciphersphere", "focusflow", "almanar-schedule-system", "manar-schedule-system", "mghal-official-website"].includes(item.slug))) {
    const route = (language === "en" ? "/en" : "") + "/projects/" + project.slug;
    assert.ok(hub.includes("href='" + route + "'") || hub.includes('href="' + route + '"'), "Project hub must link to " + route);
  }
}
const projectDetailCss = readFileSync(new URL("../public/assets/project-detail.css", import.meta.url), "utf8");
assert.match(projectDetailCss, /\.evidence-list li[^}]*overflow-wrap:anywhere/, "Long evidence paths and unbroken tokens must wrap on narrow screens.");
