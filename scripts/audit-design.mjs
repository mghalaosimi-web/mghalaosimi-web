import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const search = readFileSync(new URL("../app/components/SiteSearch.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const progress = readFileSync(new URL("../app/components/ReadingProgress.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const tokensCss = readFileSync(new URL("../public/assets/design-tokens.css", import.meta.url), "utf8");
const routeStyles = ["../app/home.css", "../app/contact/contact.module.css", "../app/projects/projects.css", "../app/language/language.css"].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const engagementCss = readFileSync(new URL("../public/assets/social-engagement.css", import.meta.url), "utf8");
const adminCss = readFileSync(new URL("../public/assets/admin.css", import.meta.url), "utf8");
const legacyExperienceCss = readFileSync(new URL("../public/assets/mghal-experience.css", import.meta.url), "utf8");
const legacyThemeCss = readFileSync(new URL("../public/assets/theme.css", import.meta.url), "utf8");
const legacyCredentialsCss = readFileSync(new URL("../public/assets/credentials.css", import.meta.url), "utf8");
const legacyTokenStyles = [
  "brand-home.css", "brand-resume.css", "certificates-page.css", "corporate-ui.css",
  "foundation.css", "home.css", "mghal-experience.css", "project-detail.css",
  "project-library.css", "projects.css", "research-hub.css", "section-rail.css",
  "social-engagement.css", "admin.css", "credentials.css", "theme.css"
].map((name) => readFileSync(new URL("../public/assets/" + name, import.meta.url), "utf8"));
const adminHtml = readFileSync(new URL("../public/admin/index.html", import.meta.url), "utf8");

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
  "--mghal-dark-surface-deep": "#101922",
  "--mghal-dark-border-cool": "rgba(174, 184, 187, .14)",
  "--mghal-dark-muted-strong": "#82929D",
  "--mghal-dark-text-soft": "#D5D0C6",
  "--mghal-dark-border-soft": "rgba(182, 154, 98, .14)",
  "--mghal-dark-border-strong": "rgba(182, 154, 98, .48)",
  "--mghal-state-success": "#5AAB84",
  "--mghal-state-warning": "#D0A05A",
  "--mghal-state-danger": "#D06D6D",
  "--mghal-state-info": "#6EA0CF",
  "--mghal-state-disabled": "#7B8794",
  "--mghal-shadow-raised": "0 5px 0 rgba(3, 8, 12, .62), 0 12px 24px rgba(0, 0, 0, .22), inset 0 1px rgba(255, 255, 255, .07)",
  "--mghal-light-bg": "#FFFFFF",
  "--mghal-light-surface": "#F3F5F7",
  "--mghal-light-text": "#202B38",
  "--mghal-light-muted": "#64748B",
  "--mghal-light-border": "#DCE2E8",
  "--mghal-light-surface-raised": "#F8FAFC",
  "--mghal-light-surface-subtle": "#FBFCFD",
  "--mghal-light-surface-alt": "#F7F9FB",
  "--mghal-light-surface-warm": "#FBFAF7",
  "--mghal-light-surface-warm-alt": "#F8F7F3",
  "--mghal-light-muted-strong": "#475569",
  "--mghal-light-border-soft": "#E4E9EF",
  "--mghal-light-border-strong": "#B9C8D8",
  "--mghal-state-success-bg": "rgba(90, 171, 132, .12)",
  "--mghal-state-success-border": "rgba(90, 171, 132, .42)",
  "--mghal-state-warning-bg": "rgba(208, 160, 90, .12)",
  "--mghal-state-warning-border": "rgba(208, 160, 90, .42)",
  "--mghal-state-danger-bg": "rgba(208, 109, 109, .12)",
  "--mghal-state-danger-border": "rgba(208, 109, 109, .42)",
  "--mghal-state-info-bg": "rgba(110, 160, 207, .12)",
  "--mghal-state-info-border": "rgba(110, 160, 207, .42)",
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
assert.ok(globals.includes("--ink-800:var(--mghal-dark-surface-alt"), "Global graphite surfaces must use the shared token set.");
assert.ok(globals.includes("--shadow-raised:var(--mghal-shadow-raised"), "Raised controls must use the shared elevation token.");
for (const [index, style] of routeStyles.entries()) {
  assert.ok(!/#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})(?![0-9a-fA-F])/.test(style), `Route stylesheet ${index + 1} must not reintroduce hard-coded colors.`);
}
assert.ok(engagementCss.includes("var(--mghal-state-success)") && engagementCss.includes("var(--mghal-state-danger)"), "Follow/reaction feedback must use semantic state tokens.");
assert.ok(adminCss.includes("--success:var(--mghal-state-success)") && adminCss.includes("--danger:var(--mghal-state-danger)"), "The owner portal must use shared semantic states.");
assert.ok(adminHtml.includes('href="/assets/design-tokens.css"'), "The owner portal must load shared tokens before its stylesheet.");
assert.ok(legacyExperienceCss.includes("--mx-navy:var(--mghal-brand-navy)"), "Legacy public routes must use the shared brand palette.");
assert.ok(layout.includes("<ReadingProgress isEn={isEn}/>"), "The Next.js shell must mount the route-aware progress indicator.");
assert.ok(progress.includes('role="progressbar"') && progress.includes("aria-valuenow={progress}"), "Reading progress must expose an accessible live value.");
assert.ok(progress.includes("usePathname") && progress.includes("ResizeObserver"), "Reading progress must recalculate on route and content-size changes.");
assert.ok(css.includes(".mghal-reading-progress{") && css.includes("html[dir=\"rtl\"] .mghal-reading-progress"), "Progress styling must respect the document direction.");
assert.ok(layout.includes('social-engagement.js" strategy="lazyOnload"'), "DOM-enhancing social widgets must wait until after initial hydration.");
assert.ok(legacyThemeCss.includes("var(--mghal-light-bg)") && legacyThemeCss.includes("var(--mghal-brand-navy)"), "Legacy theme surfaces must resolve through the shared palette.");
assert.ok(legacyCredentialsCss.includes("var(--mghal-brand-blue)") && legacyCredentialsCss.includes("var(--mghal-light-border)"), "Credential cards must resolve through the shared palette.");
for (const [index, style] of legacyTokenStyles.entries()) {
  assert.ok(style.includes("design-tokens.css") || style.includes("var(--mghal-brand-navy)"), `Public stylesheet ${index + 1} must consume the shared token system.`);
}
assert.ok(!/#(?:0f766e|155e56|16877d|a5b4fc)\b/i.test(legacyTokenStyles.slice(0, 13).join("\n")), "Legacy green/indigo brand accents must not reappear in public brand styles.");
assert.ok(layout.includes("<SiteHeader isEn={isEn}/>"), "The shared header must be mounted globally.");

console.log("M.GH.AL design audit passed: shared brand/surface tokens, sticky horizontal navigation, RTL/LTR gesture guards, focus visibility and reduced motion.");
