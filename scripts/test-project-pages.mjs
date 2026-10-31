import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const catalog = JSON.parse(readFileSync(path.join(root, "assets/projects/catalog.json"), "utf8"));
assert.ok(Array.isArray(catalog.projects) && catalog.projects.length > 0, "The project catalogue must contain records.");
assert.match(catalog.siteOrigin, /^https:\/\//, "A canonical site origin is required.");

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
  assert.ok(existsSync(path.join(root, project.cover.slice(1))), "Missing project cover: " + project.cover);
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
    const file = path.join(root, relative);
    assert.ok(existsSync(file), "Generated page missing: " + relative);
    const html = readFileSync(file, "utf8");
    assert.match(html, new RegExp("<html lang='" + language + "'"));
    assert.match(html, new RegExp("dir='" + (language === "ar" ? "rtl" : "ltr") + "'"));
    const canonical = catalog.siteOrigin + "/" + (language === "en" ? "en/" : "") + "projects/" + project.slug + "/";
    assert.ok(html.includes("rel='canonical' href='" + canonical + "'"), "Canonical URL mismatch: " + relative);
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

const sitemap = readFileSync(path.join(root, "sitemap.xml"), "utf8");
for (const route of expectedRoutes) assert.ok(sitemap.includes("<loc>" + route + "</loc>"), "Sitemap entry missing: " + route);
const sitemapRoutes = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(sitemapRoutes).size, sitemapRoutes.length, "Sitemap URLs must be unique.");
console.log("Project portfolio tests passed: " + catalog.projects.length + " records, " + expectedRoutes.length + " bilingual routes, covers, gallery metadata, private-source guard, SEO, JSON-LD, accessibility and sitemap.");
