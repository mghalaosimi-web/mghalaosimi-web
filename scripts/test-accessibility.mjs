import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../assets/accessibility.js", import.meta.url), "utf8");

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

console.log("Accessibility tests passed (new and pre-existing localized skip links, keyboard focus, scroll, and tabindex cleanup).");
