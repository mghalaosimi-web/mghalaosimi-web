import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

const routes = ["/", "/about", "/skills", "/projects", "/labs", "/research", "/credentials", "/contact"];
for (const route of routes) {
  assert.ok(header.includes(`href: '${route}'`), `Navigation is missing route ${route}`);
}
assert.match(header, /aria-current=\{active \? 'page' : undefined\}/, "The active route must be exposed accessibly.");
assert.match(header, /useRouter/, "Swipe navigation must use Next.js client routing.");
assert.match(header, /touchstart[\s\S]*touchend/, "Horizontal swipe listeners are required.");
assert.match(header, /Math\.abs\(dx\) < 72/, "A deliberate horizontal swipe threshold is required.");
assert.match(header, /Math\.abs\(dx\) < Math\.abs\(dy\) \* 1\.35/, "Vertical scrolling must not trigger route navigation.");
assert.match(header, /isEn \? dx < 0 : dx > 0/, "Swipe direction must respect RTL/LTR reading direction.");
assert.match(header, /a,button,input,textarea,select/, "Interactive controls must be excluded from swipe navigation.");
assert.match(header, /touch\.clientX < 20/, "System edge-swipe gestures must be preserved.");
assert.match(header, /touchcancel/, "Cancelled touch gestures must reset swipe state.");
assert.doesNotMatch(header, /mghal-menu-toggle|<Menu|<X/, "The old expanding mobile menu must not return.");
assert.match(shell, /\.mghal-header\{[\s\S]*?position:sticky/, "The site header must remain pinned while scrolling.");
assert.match(shell, /\.mghal-primary-nav\{[\s\S]*?overflow-x:auto/, "The navigation rail must scroll horizontally.");
assert.match(shell, /touch-action:pan-x/, "The rail must accept horizontal touch scrolling.");
assert.match(shell, /--mghal-color-navy:#172B4D/, "The central navy token is required.");
assert.match(shell, /--mghal-color-blue:#315A85/, "The central blue token is required.");
assert.match(shell, /--mghal-color-gold:#B69A62/, "The central gold token is required.");
assert.match(shell, /prefers-reduced-motion:reduce/, "Reduced-motion support is required.");
assert.match(layout, /<SiteHeader isEn=\{isEn\}\/>/, "The shared navigation must be mounted globally.");
console.log("Next.js navigation tests passed: 8 routes, sticky horizontal rail, RTL/LTR swipe, control guards, edge gestures, and shared brand tokens.");
assert.match(header, /scrollIntoView/, "The active route must be brought into view inside the horizontal rail.");
