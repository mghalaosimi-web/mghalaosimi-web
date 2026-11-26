import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../public/assets/accessibility.js", import.meta.url), "utf8");

function mount(lang = "ar", hasExistingSkipLink = false) {
  const listeners = new Map();
  const main = {
    id: "",
    attributes: {},
    focused: false,
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    focus(options) { this.focused = true; this.focusOptions = options; },
    scrollIntoView(options) { this.scrolled = true; this.scrollOptions = options; },
    addEventListener(type, callback) {
      const list = listeners.get(type) ?? [];
      list.push(callback);
      listeners.set(type, list);
    },
    dispatch(type) { for (const callback of listeners.get(type) ?? []) callback(); },
  };
  const firstChild = { nodeName: "HEADER" };
  const body = {
    firstChild,
    inserted: null,
    insertBefore(node, before) { this.inserted = { node, before }; },
  };
  const skipLink = {
    className: "skip-link",
    href: hasExistingSkipLink ? "#old-target" : "",
    textContent: hasExistingSkipLink ? "Existing skip link" : "",
    dataset: {},
    listeners: new Map(),
    addEventListener(type, callback) { this.listeners.set(type, callback); },
    dispatch(type) {
      const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
      this.listeners.get(type)?.(event);
      return event;
    },
  };
  const document = {
    body,
    documentElement: { lang },
    querySelector(selector) {
      if (selector === "main") return main;
      if (selector === ".skip-link") return hasExistingSkipLink ? skipLink : null;
      return null;
    },
    createElement(tag) {
      assert.equal(tag, "a");
      return skipLink;
    },
  };
  vm.runInNewContext(source, { document, requestAnimationFrame(callback) { callback(); } });
  return { main, body, firstChild, skipLink };
}

function assertFocusBehavior(result) {
  const clickEvent = result.skipLink.dispatch("click");
  assert.equal(clickEvent.defaultPrevented, true);
  assert.equal(result.main.attributes.tabindex, "-1");
  assert.equal(result.main.focused, true);
  assert.equal(result.main.focusOptions.preventScroll, true);
  assert.equal(result.main.scrolled, true);
  assert.equal(result.main.scrollOptions.block, "start");
  result.main.dispatch("blur");
  assert.equal("tabindex" in result.main.attributes, false);
}

const ar = mount("ar");
assert.equal(ar.main.id, "main-content");
assert.equal(ar.skipLink.className, "skip-link");
assert.equal(ar.skipLink.href, "#main-content");
assert.equal(ar.skipLink.textContent, "تجاوز إلى المحتوى الرئيسي");
assert.equal(ar.body.inserted.node, ar.skipLink);
assert.equal(ar.body.inserted.before, ar.firstChild);
assert.equal(ar.skipLink.dataset.focusBound, "true");
assertFocusBehavior(ar);

const enExisting = mount("en", true);
assert.equal(enExisting.skipLink.href, "#main-content");
assert.equal(enExisting.skipLink.textContent, "Existing skip link");
assert.equal(enExisting.body.inserted, null);
assert.equal(enExisting.skipLink.dataset.focusBound, "true");
assertFocusBehavior(enExisting);


const credentialsPage = readFileSync(new URL("../app/credentials/page.tsx", import.meta.url), "utf8");
const searchComponent = readFileSync(new URL("../app/components/SiteSearch.tsx", import.meta.url), "utf8");
const galleryPage = readFileSync(new URL("../app/photos/page.tsx", import.meta.url), "utf8");
const socialStyles = readFileSync(new URL("../public/assets/social-engagement.css", import.meta.url), "utf8");

assert.ok(
  credentialsPage.includes('<div className="cisco-brand-mark" role="img" aria-label="Cisco">'),
  "Cisco issuer artwork must expose its accessible image role on the wrapper.",
);
assert.ok(
  credentialsPage.includes("99144d9ad3c56fc205df69df79af323dbc93519a") && !credentialsPage.includes("f71427766ef253271121310e5069e7744e9faa52"),
  "Credential source links must use the current verified asset revision, not a stale commit.",
);
assert.match(
  searchComponent,
  /aria-label=\{isEn \? 'Search' : 'بحث'\}/,
  "Search button accessible name must match its visible localized label.",
);
assert.ok(
  searchComponent.includes('<kbd aria-hidden="true">Ctrl K</kbd>'),
  "The visual keyboard shortcut must not be appended to the search button accessible name.",
);
assert.ok(
  galleryPage.includes("color: 'var(--mghal-dark-text, #EEE9DF)'"),
  "Gallery headings must inherit a light, readable color on the dark shell.",
);
assert.ok(
  galleryPage.includes("color: '#BCA477'"),
  "Gallery home navigation link must use a readable light accent.",
);
assert.ok(
  socialStyles.includes('html[data-mghal-theme="dark"] .mghal-social-eyebrow') &&
  socialStyles.includes('color:var(--mghal-brand-gold,#B69A62)!important;'),
  "Social eyebrow must use the accessible gold token in the dark theme.",
);
assert.ok(
  socialStyles.includes('html[data-mghal-theme="dark"] .mghal-reaction-like') &&
  socialStyles.includes('color:#9BBCE0;'),
  "Reaction buttons must use a high-contrast foreground in the dark theme.",
);

function relativeLuminance(hex) {
  const values = hex.replace("#", "").match(/.{2}/g).map((part) => parseInt(part, 16) / 255);
  const channels = values.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}
function contrastRatio(foreground, background) {
  const values = [relativeLuminance(foreground), relativeLuminance(background)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
assert.ok(contrastRatio("#B69A62", "#111B26") >= 4.5, "Dark social eyebrow accent must meet WCAG AA.");
assert.ok(contrastRatio("#9BBCE0", "#172431") >= 4.5, "Dark reaction button text must meet WCAG AA.");
assert.ok(contrastRatio("#EEE9DF", "#0B1117") >= 4.5, "Dark gallery heading text must meet WCAG AA.");
assert.ok(contrastRatio("#BCA477", "#0B1117") >= 4.5, "Dark gallery link text must meet WCAG AA.");

console.log("Accessibility tests passed (new and pre-existing localized skip links, keyboard focus, scroll, and tabindex cleanup).");
