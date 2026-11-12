import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";

const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const middleware = readFileSync(new URL("../middleware.ts", import.meta.url), "utf8");
const tokens = readFileSync(new URL("../public/assets/design-tokens.css", import.meta.url), "utf8");

const routes = ["/", "/about", "/skills", "/projects", "/labs", "/research", "/credentials", "/education", "/achievements", "/knowledge", "/resume", "/contact"];
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

assert.ok(shell.includes('grid-template-areas:"brand language search cta" "nav nav nav nav"'), "Mobile navigation must occupy a visible second row rather than a hidden drawer.");
assert.ok(shell.includes("display:flex!important"), "The mobile navigation rail must remain visible.");
assert.ok(shell.includes("flex-direction:row!important"), "The mobile navigation rail must stay horizontal.");
assert.ok(shell.includes("overflow-y:hidden!important"), "The rail must not introduce vertical overflow.");
assert.ok(header.includes("data-horizontal-scroll"), "The navigation rail must be identified as a native horizontal scroll surface.");
assert.ok(layout.includes("dir={isEn?'ltr':'rtl'}"), "The global document direction must follow the selected locale.");
assert.ok(shell.includes("prefers-reduced-motion:reduce"), "Reduced-motion support is required.");
assert.ok(shell.includes(":focus-visible"), "Visible keyboard focus styling is required.");

for (const [name, value] of [
  ["--mghal-brand-navy", "#172B4D"],
  ["--mghal-brand-blue", "#315A85"],
  ["--mghal-brand-gold", "#B69A62"],
  ["--mghal-state-success", "#17623D"],
  ["--mghal-state-danger", "#A43131"],
]) {
  assert.ok(tokens.includes(`${name}: ${value};`), `The shared ${name} token is required.`);
}
assert.ok(layout.includes('<SiteHeader isEn={isEn}/>'), "The shared navigation must be mounted globally.");

assert.ok(!existsSync(new URL('../public/assets/section-rail.js', import.meta.url)), 'Legacy section-rail DOM adapter must remain retired.');
assert.ok(!existsSync(new URL('../public/assets/section-rail.css', import.meta.url)), 'Legacy section-rail stylesheet must remain retired.');

assert.ok(header.includes("const currentIndex = links.findIndex((item) => routePath === item.href)"), "Page swipes must use the normalized route path for both locales.");
assert.ok(header.includes("pathname.startsWith('/en/') ? pathname.slice(3)"), "English routes must normalize to the shared route identity.");
assert.ok(header.includes("encodeURIComponent(routePath)"), "Switching to Arabic must preserve the current logical route.");
assert.ok(header.includes("encodeURIComponent('/en' + (routePath === '/' ? '' : routePath))"), "Switching to English must preserve the current route under /en.");
assert.ok(middleware.includes("destination.pathname=pathname==='/'?'/en':'/en'+pathname"), "English cookie navigation must redirect to canonical /en routes.");
assert.ok(middleware.includes("portfolio-locale=en"), "The /en route middleware must set the English locale cookie.");
assert.ok(header.includes("window.getComputedStyle(ancestor)") && header.includes("ancestor.scrollWidth > ancestor.clientWidth + 1"), "Nested horizontal scrollers must not be intercepted by page-swipe navigation.");
console.log("Next.js navigation tests passed: 12 routes, sticky horizontal rail, RTL/LTR swipe, control guards, edge gestures, and shared brand tokens.");
