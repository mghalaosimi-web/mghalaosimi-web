import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../assets/accessibility.js", import.meta.url), "utf8");

function mount(lang = "ar") {
  const listeners = new Map();
  const main = {
    id: "",
    attributes: {},
    focused: false,
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
    focus(options) { this.focused = true; this.focusOptions = options; },
    scrollIntoView(options) { this.scrolled = true; this.scrollOptions = options; },
    scrollIntoView(options) { this.scrolled = true; this.scrollOptions = options; },
    addEventListener(type, callback) {
      const list = listeners.get(type) ?? [];
      list.push(callback);
      listeners.set(type, list);
    },
    dispatch(type) {
      for (const callback of listeners.get(type) ?? []) callback();
    },
  };
  const firstChild = { nodeName: "HEADER" };
  const body = {
    firstChild,
    inserted: null,
    insertBefore(node, before) { this.inserted = { node, before }; },
  };
  const skipLink = {
    className: "",
    href: "",
    textContent: "",
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
      if (selector === ".skip-link") return null;
      return null;
    },
    createElement(tag) {
      assert.equal(tag, "a");
      return skipLink;
    },
  };
  vm.runInNewContext(source, { document });
  return { main, body, firstChild, skipLink };
}

const ar = mount("ar");
assert.equal(ar.main.id, "main-content");
assert.equal(ar.skipLink.className, "skip-link");
assert.equal(ar.skipLink.href, "#main-content");
assert.equal(ar.skipLink.textContent, "تجاوز إلى المحتوى الرئيسي");
assert.equal(ar.body.inserted.node, ar.skipLink);
assert.equal(ar.body.inserted.before, ar.firstChild);
const clickEvent = const clickEvent = ar.skipLink.dispatch("click");
assert.equal(clickEvent.defaultPrevented, true);
assert.equal(clickEvent.defaultPrevented, true);
assert.equal(ar.main.attributes.tabindex, "-1");
assert.equal(ar.main.focused, true);
assert.equal(ar.main.focusOptions.preventScroll, true);
assert.equal(ar.main.scrolled, true);
assert.equal(ar.main.scrollOptions.block, "start");
assert.equal(ar.main.scrolled, true);
assert.equal(ar.main.scrollOptions.block, "start");
ar.main.dispatch("blur");
assert.equal("tabindex" in ar.main.attributes, false);

const en = mount("en");
assert.equal(en.skipLink.textContent, "Skip to main content");

console.log("Accessibility browser tests passed (localized skip link, main focus, and tabindex cleanup).");
