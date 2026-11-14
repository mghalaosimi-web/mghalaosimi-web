import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");
const header = readFileSync(new URL("../app/components/SiteHeader.tsx", import.meta.url), "utf8");
const search = readFileSync(new URL("../app/components/SiteSearch.tsx", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const tokensCss = readFileSync(new URL("../public/assets/design-tokens.css", import.meta.url), "utf8");
const routeStyles = ["../app/home.css", "../app/contact/contact.module.css", "../app/projects/projects.css", "../app/language/language.css"].map((path) => readFileSync(new URL(path, import.meta.url), "utf8"));
const engagementCss = readFileSync(new URL("../public/assets/social-engagement.css", import.meta.url), "utf8");
const adminCss = readFileSync(new URL("../public/assets/admin.css", import.meta.url), "utf8");
const legacyExperienceCss = readFileSync(new URL("../public/assets/mghal-experience.css", import.meta.url), "utf8");
const legacyThemeCss = readFileSync(new URL("../public/assets/theme.css", import.meta.url), "utf8");
const adminPage = readFileSync(new URL("../app/admin/page.tsx", import.meta.url), "utf8");

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

assert.ok(legacyThemeCss.includes("--text:var(--mghal-dark-text)"), "Legacy dark routes must alias the shared text token.");
assert.ok(legacyThemeCss.includes("--accent:var(--mghal-brand-blue)"), "Legacy dark routes must alias the shared brand accent.");
assert.ok(legacyThemeCss.includes("background:var(--mghal-dark-bg)!important"), "Legacy dark routes must use the shared dark background.");
assert.ok(layout.includes('data-mghal-theme="dark"'), "Next.js must declare its dark theme for shared components.");
assert.ok(engagementCss.includes("var(--mghal-state-success)") && engagementCss.includes("var(--mghal-state-danger)"), "Follow/reaction feedback must use semantic state tokens.");
assert.ok(engagementCss.includes('html[data-mghal-theme="dark"] .mghal-follow-panel'), "Social engagement must render a dark token variant inside the Next.js shell.");
assert.ok(adminCss.includes("--success:var(--mghal-state-success)") && adminCss.includes("--danger:var(--mghal-state-danger)"), "The owner portal must use shared semantic states.");
assert.ok(adminPage.includes('href="/assets/design-tokens.css"'), "The React owner portal must load shared tokens before its stylesheet.");
assert.ok(legacyExperienceCss.includes("--mx-navy:var(--mghal-brand-navy)"), "Legacy public routes must use the shared brand palette.");
assert.ok(layout.includes("<SiteHeader isEn={isEn}/>"), "The shared header must be mounted globally.");

function tokenValue(name){
  const match=tokensCss.match(new RegExp(name+":\\s*([^;]+);"));
  assert.ok(match,"Missing contrast token: "+name);
  return match[1].trim();
}
function channel(value){const v=value/255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4}
function luminance(hex){
  assert.match(hex,/^#[0-9A-Fa-f]{6}$/,"Contrast tokens must be six-digit hex colors.");
  const rgb=[0,2,4].map(offset=>parseInt(hex.slice(offset+1,offset+3),16));
  return 0.2126*channel(rgb[0])+0.7152*channel(rgb[1])+0.0722*channel(rgb[2]);
}
function contrast(foreground,background){const values=[luminance(foreground),luminance(background)].sort((a,b)=>b-a);return (values[0]+0.05)/(values[1]+0.05)}
const accessibleTextTokens=["--mghal-dark-text","--mghal-dark-muted","--mghal-brand-gold","--mghal-focus-ring"];
const darkSurfaceTokens=["--mghal-dark-bg","--mghal-dark-surface","--mghal-dark-surface-raised","--mghal-dark-surface-alt"];
for(const foreground of accessibleTextTokens){
  for(const background of darkSurfaceTokens){
    const ratio=contrast(tokenValue(foreground),tokenValue(background));
    assert.ok(ratio>=4.5,foreground+" on "+background+" must meet WCAG AA (4.5:1); got "+ratio.toFixed(2)+":1");
  }
}
assert.ok(css.includes(".mghal-card h3,.mghal-skill-group h3{color:var(--mghal-color-text)}"),"Archive and skill headings must not use low-contrast navy text on dark surfaces.");
assert.ok(css.includes(".mghal-tags span,.mghal-status,.mghal-skill-list span,.mghal-skill-toggle>strong,.mghal-skill-icon,.mghal-research-card strong{color:var(--mghal-color-focus)}"),"Badges, skill labels and research values must use a readable foreground token.");
assert.ok(css.includes(".mghal-filter-row button:not(.active){background:var(--mghal-color-surface-raised);color:var(--mghal-color-text)"),"Inactive filter controls must use readable dark-surface styling.");
assert.ok(legacyThemeCss.includes("a:not(.btn)"),"Legacy text links must use the accessible focus/gold token instead of low-contrast brand blue.");
console.log("M.GH.AL design audit passed: shared brand/surface tokens, sticky horizontal navigation, RTL/LTR gesture guards, focus visibility and reduced motion.");
