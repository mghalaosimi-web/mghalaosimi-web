import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const tokensCss = readFileSync(new URL("../public/assets/design-tokens.css", import.meta.url), "utf8");

const tokens = {
  "--mghal-brand-navy": "#172B4D",
  "--mghal-brand-blue": "#315A85",
  "--mghal-brand-gold": "#B69A62",
  "--mghal-dark-bg": "#0B1117",
  "--mghal-dark-surface": "#111B26",
  "--mghal-dark-surface-raised": "#172431",
  "--mghal-dark-text": "#EEE9DF",
  "--mghal-dark-muted": "#AEB8BB",
  "--mghal-light-bg": "#FFFFFF",
  "--mghal-light-surface": "#F3F5F7",
  "--mghal-light-text": "#202B38",
  "--mghal-light-muted": "#64748B",
  "--mghal-light-border": "#DCE2E8",
};
for (const [name, value] of Object.entries(tokens)) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  assert.match(tokensCss, new RegExp(escaped + "\\s*:\\s*" + value, "i"), `Missing or incorrect shared token: ${name}`);
}
assert.match(layout, /href="\\/assets\\/design-tokens\\.css"/, "The shared token stylesheet must load before route styling.");
assert.match(css, /--mghal-color-navy:var\\(--mghal-brand-navy/, "Next.js routes must alias the shared navy token.");
assert.match(css, /--mghal-color-blue:var\\(--mghal-brand-blue/, "Next.js routes must alias the shared blue token.");
assert.match(css, /--mghal-color-gold:var\\(--mghal-brand-gold/, "Next.js routes must alias the shared gold token.");
assert.match(css, /\\.mghal-header\\s*\\{[^}]*position:\\s*sticky/s, "The shared header must remain sticky.");
assert.match(css, /\\.mghal-primary-nav\\s*\\{[\\s\\S]*?overflow-x:\\s*auto/, "The navigation rail must scroll horizontally.");
assert.match(css, /touch-action:\\s*pan-x/, "Horizontal rail touch behavior must be explicit.");
assert.match(css, /position:\\s*static!important/, "Mobile navigation must not become a floating drawer.");
assert.match(css, /min-width:\\s*max-content!important/, "Navigation labels must retain intrinsic width.");
assert.match(css, /prefers-reduced-motion:\\s*reduce/, "Reduced-motion support is required.");
assert.match(css, /:focus-visible/, "Visible keyboard focus styling is required.");
assert.match(header, /aria-current=\\{active \\? 'page' : undefined\\}/, "The current route must be exposed accessibly.");
assert.match(header, /touchcancel/, "Cancelled swipe gestures must reset.");
assert.match(globals, /--brass:var\\(--mghal-color-gold/, "Global gold aliases must use the shared brand token.");
assert.match(globals, /--copper:var\\(--mghal-color-blue/, "Global accent aliases must use the shared blue token.");
assert.match(globals, /--ink-950:var\\(--mghal-color-bg/, "Global backgrounds must use the shared background token.");
assert.match(layout, /<SiteHeader isEn=\\{isEn\\}\\/>/, "The shared header must be mounted globally.");

console.log("M.GH.AL design audit passed: shared brand/surface tokens, sticky horizontal navigation, RTL/LTR gesture guards, focus visibility and reduced motion.");
