import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = readFileSync(new URL("../data/projects.ts", import.meta.url), "utf8");
const page = readFileSync(new URL("../app/projects/[slug]/page.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");

const slugs = [...data.matchAll(/slug:'([^']+)'/g)].map((match) => match[1]);
assert.equal(slugs.length, 10, "The canonical project inventory must remain complete.");
assert.equal(new Set(slugs).size, slugs.length, "Canonical project slugs must be unique.");

const englishBlock = page.match(/const englishCopy:[\s\S]*?= \{([\s\S]*?)\n\};/);
assert.ok(englishBlock, "Bilingual case-study copy is required.");
for (const slug of slugs) {
  const key = slug.includes("-") ? `'${slug}'` : slug;
  assert.ok(englishBlock[1].includes(`${key}: {`), `English case-study copy is missing for ${slug}.`);
}

assert.ok(page.includes("import { projects, type ProjectCategory } from '../../../data/projects';"), "Case studies must use the canonical project data source.");
assert.ok(page.includes("projects.find((project) => project.slug === slug)"), "Project lookup must use canonical slugs.");
assert.ok(page.includes("project.contribution"), "Every case study must expose the verified contribution/attribution record.");
assert.ok(page.includes("project.stack.map"), "Technology lists must come from canonical project data.");
assert.ok(page.includes("project.repository"), "Only recorded public repositories may be linked.");
assert.ok(page.includes("liveUrls"), "Public deployment links must be explicitly allowlisted.");
assert.ok(page.includes("'@type': 'CreativeWork'"), "Case studies must expose structured CreativeWork data.");
assert.ok(page.includes("sameAs: project.repository"), "Structured data may link only the recorded public repository.");
assert.doesNotMatch(page, /author:\s*person/i, "Collaborative projects must not be falsely attributed to one author.");
assert.ok(page.includes("localizedAlternates"), "Arabic and English case studies must expose localized alternates.");
assert.ok(page.includes("notFound()"), "Unknown project slugs must return not found.");
assert.ok(page.includes("dangerouslySetInnerHTML"), "JSON-LD must be rendered as structured data.");
assert.doesNotMatch(page, /const items\s*=/, "The route must not maintain a duplicate project inventory.");

for (const selector of [".mghal-case-grid", ".mghal-case-section", ".mghal-case-actions", ".mghal-case-note"]) {
  assert.ok(shell.includes(selector), `Responsive case-study styling is missing: ${selector}`);
}
assert.ok(shell.includes("@media(max-width:760px)"), "Case-study sections must reflow on narrow screens.");
assert.ok(shell.includes("var(--mghal-color-border)"), "Case-study controls must use shared design tokens.");

console.log(`Project case-study tests passed: ${slugs.length} canonical projects, bilingual copy, contribution attribution, public links, structured data and responsive layout.`);
