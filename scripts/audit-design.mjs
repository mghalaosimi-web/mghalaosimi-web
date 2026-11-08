import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

const tokens = {
  "--mghal-color-navy": "#172B4D",
  "--mghal-color-blue": "#315A85",
  "--mghal-color-gold": "#B69A62",
  "--mghal-color-bg": "#0B1117",
  "--mghal-color-surface": "#111B26",
  "--mghal-color-surface-raised": "#172431",
  "--mghal-color-text": "#EEE9DF",
  "--mghal-color-muted": "#AEB8BB",
};
for (const [name, value] of Object.entries(tokens)) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(css, new RegExp(escaped + "\\s*:\\s*" + value, "i"), `Missing or incorrect design token: ${name}`);
}
assert.match(css, /\.mghal-header\s*\{[^}]*position:\s*sticky/s, "The shared header must remain sticky.");
assert.match(css, /\.mghal-primary-nav\s*\{[^}]*overflow-x:\s*auto/s, "The navigation rail must scroll horizontally.");
assert.match(css, /touch-action:\s*pan-x/, "Horizontal rail touch behavior must be explicit.");
assert.match(css, /position:\s*static!important/, "Mobile navigation must not become a floating drawer.");
assert.match(css, /min-width:\s*max-content!important/, "Navigation labels must retain intrinsic width.");
assert.match(css, /prefers-reduced-motion:\s*reduce/, "Reduced-motion support is required.");
assert.match(css, /:focus-visible/, "Visible keyboard focus styling is required.");
assert.match(header, /aria-current=\{active \? 'page' : undefined\}/, "The current route must be exposed accessibly.");
assert.match(header, /touchcancel/, "Cancelled swipe gestures must reset.");
assert.match(globals, /--brass:var\(--mghal-color-gold/, "Global gold aliases must use the shared brand token.");
assert.match(globals, /--copper:var\(--mghal-color-blue/, "Global accent aliases must use the shared blue token.");
assert.match(globals, /--ink-950:var\(--mghal-color-bg/, "Global backgrounds must use the shared background token.");
assert.match(layout, /<SiteHeader isEn=\{isEn\}\/>/, "The shared header must be mounted globally.");

console.log("M.GH.AL design audit passed: approved palette tokens, sticky horizontal navigation, RTL/LTR gesture guards, focus visibility and reduced motion.");
