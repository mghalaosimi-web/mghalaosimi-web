import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const tokens = readFileSync(new URL("../public/assets/design-tokens.css", import.meta.url), "utf8");
const legacyNav = readFileSync(new URL("../public/assets/section-rail.js", import.meta.url), "utf8");
const legacyCss = readFileSync(new URL("../public/assets/section-rail.css", import.meta.url), "utf8");

const routes = ["/", "/about", "/skills", "/projects", "/labs", "/research", "/credentials", "/contact"];
for (const route of routes) {
  assert.ok(header.includes(`href: '${route}'`), `Navigation is missing route ${route}`);
}
assert.ok(header.includes("aria-current={active ? 'page' : undefined}"), "The active route must be exposed accessibly.");
assert.ok(header.includes("useRouter"), "Swipe navigation must use Next.js client routing.");
assert.ok(header.includes("touchstart") && header.includes("touchend"), "Horizontal swipe listeners are required.");
assert.ok(header.includes("Math.abs(dx) < 72"), "A deliberate horizontal swipe threshold is required.");
assert.ok(header.includes("Math.abs(dx) < Math.abs(dy) * 1.35"), "Vertical scrolling must not trigger route navigation.");
assert.ok(header.includes("isEn ? dx < 0 : dx > 0"), "Swipe direction must respect RTL/LTR reading direction.");
assert.ok(header.includes("a,button,input,textarea,select"), "Interactive controls must be excluded from swipe navigation.");
assert.ok(header.includes("dialog,[role=\"dialog\"]") && header.includes(".project-modal"), "Dialogs and project detail overlays must be excluded from swipe navigation.");
assert.ok(header.includes("video,audio,canvas,img"), "Media surfaces must not trigger page swipes.");
assert.ok(header.includes("touch.clientX < 20"), "System edge-swipe gestures must be preserved.");
assert.ok(header.includes("touchcancel"), "Cancelled touch gestures must reset swipe state.");
assert.ok(header.includes("scrollIntoView"), "The active route must be brought into view inside the horizontal rail.");
assert.ok(header.includes("<SiteSearch isEn={isEn}/>"), "The shared shell must expose site search.");
assert.ok(!header.includes("mghal-menu-toggle"), "The old expanding mobile menu must not return.");

assert.ok(shell.includes("position:sticky"), "The site header must remain pinned while scrolling.");
assert.ok(shell.includes("overflow-x:auto"), "The navigation rail must scroll horizontally.");
assert.ok(shell.includes("touch-action:pan-x"), "The rail must accept horizontal touch scrolling.");
assert.ok(shell.includes("position:static!important"), "The mobile navigation must not become a floating drawer.");
assert.ok(shell.includes("min-width:max-content!important"), "Navigation labels must retain intrinsic width.");
assert.ok(shell.includes("prefers-reduced-motion:reduce"), "Reduced-motion support is required.");
assert.ok(shell.includes(":focus-visible"), "Visible keyboard focus styling is required.");

for (const [name, value] of [
  ["--mghal-brand-navy", "#172B4D"],
  ["--mghal-brand-blue", "#315A85"],
  ["--mghal-brand-gold", "#B69A62"],
  ["--mghal-state-success", "#5AAB84"],
  ["--mghal-state-danger", "#D06D6D"],
]) {
  assert.ok(tokens.includes(`${name}: ${value};`), `The shared ${name} token is required.`);
}
assert.ok(layout.includes('<SiteHeader isEn={isEn}/>'), "The shared navigation must be mounted globally.");

assert.ok(legacyNav.includes("nav.querySelector('.navlinks, .links, .cert-nav-links')"), "Legacy Arabic/English pages must reuse their existing header navigation.");
assert.ok(legacyNav.includes("aria-current"), "Legacy routes must expose the active navigation item.");
assert.ok(legacyNav.includes("scrollIntoView"), "Legacy active navigation items must remain visible.");
assert.ok(legacyNav.includes("mghalHorizontalNav"), "Legacy pages must mark the horizontal navigation adapter.");
assert.ok(!legacyNav.includes("document.body.append(rail,mobile)"), "The former fixed sidebar must not be recreated.");
assert.ok(legacyCss.includes("position:sticky!important"), "Legacy page headers must remain sticky.");
assert.ok(legacyCss.includes("overflow-x:auto!important"), "Legacy section navigation must scroll horizontally.");
assert.ok(legacyCss.includes("touch-action:pan-x"), "Legacy navigation must support horizontal touch scrolling.");
assert.ok(legacyCss.includes("prefers-reduced-motion:reduce"), "Legacy navigation must respect reduced motion.");
assert.ok(legacyCss.includes(".site-menu-button") && legacyCss.includes("display:none!important"), "The expanding mobile menu must remain disabled.");

console.log("Next.js navigation tests passed: 8 routes, sticky horizontal rail, RTL/LTR swipe, control guards, edge gestures, and shared brand tokens.");
