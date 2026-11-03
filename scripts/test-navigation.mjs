import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const script = readFileSync(new URL("../assets/site.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/theme.css", import.meta.url), "utf8");
const detailCss = readFileSync(new URL("../assets/project-detail.css", import.meta.url), "utf8");
assert.match(script, /\.navlinks, \.links/, "Legacy header links must be normalized into the shared navigation.");
assert.match(script, /classList\.remove\("links"\)/, "Legacy navigation class must be removed after normalization.");
assert.match(script, /classList\.add\("navlinks"\)/, "Shared navigation class must be applied.");
assert.match(script, /Primary navigation/, "English navigation must receive a localized accessible label.");
assert.match(script, /التنقل الرئيسي/, "Arabic navigation must receive a localized accessible label.");
assert.ok(script.includes("Search M.GH.AL"), "English search dialog must be localized.");
assert.ok(script.includes("البحث في M.GH.AL"), "Arabic search dialog must be localized.");
assert.match(css, /\.nav-open \.navlinks\{display:flex!important\}/, "Mobile navigation open state is missing.");
assert.match(css, /--mghal-touch-target:44px/, "Touch target token is missing.");
assert.match(css, /@media\(max-width:390px\)/, "Small mobile breakpoint is missing.");
assert.match(detailCss, /var\(--mghal-navy/, "Project detail pages must use the shared corporate design tokens.");
assert.doesNotMatch(detailCss, /linear-gradient\(145deg,#070d18/, "Legacy dark project detail theme must be removed.");
assert.match(detailCss, /@media\(max-width:760px\)/, "Project detail responsive layout is missing.");

const htmlFiles = [];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === "public" || entry.name === ".git") continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".html")) htmlFiles.push(path);
  }
}
walk(".");
assert.ok(htmlFiles.length >= 40, "Expected the full bilingual public page set to be present.");
console.log(`Navigation UX tests passed: localized shared navigation, mobile menu, search, touch targets and ${htmlFiles.length} HTML documents retained.`);
