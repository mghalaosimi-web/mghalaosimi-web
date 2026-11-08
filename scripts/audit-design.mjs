import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const search = readFileSync(new URL("../app/components/SiteSearch.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const tokensCss = readFileSync(new URL("../public/assets/design-tokens.css", import.meta.url), "utf8");
const routeStyles = ["../app/home.css", "../app/contact/contact.module.css", "../app/projects/projects.css", "../app/language/language.css"].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));

const tokens = {
  "--mghal-brand-navy": "#172B4D",
  "--mghal-brand-blue": "#315A85",
  "--mghal-brand-gold": "#B69A62",
  "--mghal-dark-bg": "#0B1117",
  "--mghal-dark-surface": "#111B26",
  "--mghal-dark-surface-raised": "#172431",
  "--mghal-dark-text": "#EEE9DF",
  "--mghal-dark-muted": "#AEB8BB",
  "--mghal-dark-surface-alt": "#1D2D3C",
  "--mghal-dark-surface-contrast": "#293F53",
  "--mghal-dark-muted-strong": "#82929D",
  "--mghal-dark-text-soft": "#D5D0C6",
  "--mghal-dark-border-soft": "rgba(182, 154, 98, .14)",
  "--mghal-dark-border-strong": "rgba(182, 154, 98, .48)",
  "--mghal-state-success": "#5AAB84",
  "--mghal-state-warning": "#D0A05A",
  "--mghal-state-danger": "#D06D6D",
  "--mghal-state-info": "#6EA0CF",
  "--mghal-state-disabled": "#7B8794",
  "--mghal-light-bg": "#FFFFFF",
  "--mghal-light-surface": "#F3F5F7",
  "--mghal-light-text": "#202B38",
  "--mghal-light-muted": "#64748B",
  "--mghal-light-border": "#DCE2E8",
};
for (const [name, value] of Object.entries(tokens)) {
  assert.ok(tokensCss.includes(`${name}: ${value};`), `Missing or incorrect shared token: ${name}`);
}
assert.ok(layout.includes('href="/assets/design-tokens.css"'), "The shared token stylesheet must load in the Next.js shell.");
assert.ok(css.includes("--mghal-color-navy:var(--mghal-brand-navy"), "Next.js routes must alias the shared navy token.");
assert.ok(css.includes("--mghal-color-blue:var(--mghal-brand-blue"), "Next.js routes must alias the shared blue token.");
assert.ok(css.includes("--mghal-color-gold:var(--mghal-brand-gold"), "Next.js routes must alias the shared gold token.");
assert.ok(css.includes(".mghal-header{") && css.includes("position:sticky"), "The shared header must remain sticky.");
assert.ok(css.includes("overflow-x:auto"), "The navigation rail must scroll horizontally.");
assert.ok(css.includes("touch-action:pan-x"), "Horizontal rail touch behavior must be explicit.");
assert.ok(css.includes("position:static!important"), "Mobile navigation must not become a floating drawer.");
assert.ok(css.includes("min-width:max-content!important"), "Navigation labels must retain intrinsic width.");
assert.ok(css.includes("prefers-reduced-motion:reduce"), "Reduced-motion support is required.");
assert.ok(css.includes(":focus-visible"), "Visible keyboard focus styling is required.");
assert.ok(header.includes("aria-current={active ? 'page' : undefined}"), "The current route must be exposed accessibly.");
assert.ok(header.includes("touchcancel"), "Cancelled swipe gestures must reset.");
assert.ok(header.includes("scrollIntoView"), "The active navigation link must remain in view.");
assert.ok(header.includes("<SiteSearch isEn={isEn}/>"), "The shared header must expose the bilingual search palette.");
assert.ok(search.includes("aria-keyshortcuts") && search.includes("Control+K Meta+K"), "The search palette must expose its keyboard shortcut.");
assert.ok(search.includes("<dialog") && search.includes("onCancel={close}"), "Search must use a native accessible modal dialog.");
assert.ok(globals.includes("--brass:var(--mghal-brand-gold"), "Global gold aliases must use the shared brand token.");
assert.ok(globals.includes("--copper:var(--mghal-brand-blue"), "Global accent aliases must use the shared blue token.");
assert.ok(globals.includes("--ink-950:var(--mghal-dark-bg"), "Global backgrounds must use the shared background token.");
assert.ok(layout.includes("<SiteHeader isEn={isEn}/>"), "The shared header must be mounted globally.");

console.log("M.GH.AL design audit passed: shared brand/surface tokens, sticky horizontal navigation, RTL/LTR gesture guards, focus visibility and reduced motion.");
