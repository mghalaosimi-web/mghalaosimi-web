import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const script = readFileSync(new URL("../assets/site.js", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/theme.css", import.meta.url), "utf8");
const detailCss = readFileSync(new URL("../assets/project-detail.css", import.meta.url), "utf8");
const railCss = readFileSync(new URL("../assets/section-rail.css", import.meta.url), "utf8");
const railScript = readFileSync(new URL("../assets/section-rail.js", import.meta.url), "utf8");
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
assert.match(script, /section-rail\.js/, "The persistent rail must load independently of the main site runtime.");
assert.match(railScript, /mghal-rail\-mobile/, "The persistent section rail must include its mobile launcher.");
assert.match(script, /isCertificatePage/, "Certificate pages must retain their dedicated styling while receiving the shared rail.");
assert.match(railScript, /\['الرئيسية والهوية',[\s\S]*?\['المحتوى والتواصل'/, "Arabic rail groups must cover the full public site navigation.");
assert.match(railScript, /\['OVERVIEW',[\s\S]*?\['CONTENT & CONNECT'/, "English rail groups must cover the full public site navigation.");
for (const href of ["/profile.html", "/resume.html", "/projects.html", "/showcase.html", "/certificates.html", "/skills.html", "/education.html", "/achievements.html", "/knowledge.html", "/contact.html"]) {
  assert.ok(railScript.includes(href), `Persistent rail is missing public destination: ${href}`);
}
assert.match(railCss, /position:fixed/, "The section rail must remain fixed while scrolling.");
assert.match(railCss, /body\{padding-inline-start:278px;padding-inline-end:0\}/, "Desktop content must reserve the rail gutter at inline-start in both RTL and LTR.");
assert.match(railCss, /html\[dir="ltr"\] \.mghal-rail\{inset-inline:16px auto/, "LTR rail must be positioned at inline-start to match its content gutter.");
assert.match(railCss, /\.nav \.links,/, "Legacy header link groups must be hidden when the persistent rail is active.");
assert.match(railCss, /body\.mghal-rail-collapsed\{padding-inline-start:88px;padding-inline-end:0\}/, "Collapsed rail must reserve its reduced logical width.");
assert.match(railCss, /@media\(max-width:760px\)/, "The rail must switch to a mobile drawer at the mobile breakpoint.");
assert.match(railCss, /focus-visible/, "Rail controls must expose visible keyboard focus.");
assert.match(railScript, /querySelector\('.mghal-rail-link'\)\?\.focus\(\)/, "Opening the mobile rail must move focus into the navigation.");
assert.match(railCss, /body\.mghal-rail-collapsed \.mghal-rail-label,body\.mghal-rail-collapsed \.mghal-rail-foot\{display:initial\}/, "Mobile drawer must restore full labels after desktop collapse.");


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
