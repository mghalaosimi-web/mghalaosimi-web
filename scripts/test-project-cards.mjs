import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../assets/project-cards.js", import.meta.url), "utf8");

function classList() {
  const values = new Set();
  return { add(value) { values.add(value); }, contains(value) { return values.has(value); } };
}

function element(tagName = "div") {
  return {
    tagName,
    className: "",
    textContent: "",
    children: [],
    classList: classList(),
    append(...nodes) { this.children.push(...nodes); },
    after(node) { this.afterNode = node; },
    closest() { return null; },
  };
}

function mount(lang = "ar", pathname = "/projects.html") {
  const cover = element("img");
  const title = { textContent: "WAYNAH | وَيْنَه؟" };
  const originalStatus = { textContent: "قيد التطوير" };
  const anchors = [
    Object.assign(element("a"), { href: "https://github.com/mghalaosimi-web/waynah", textContent: "Repository" }),
    Object.assign(element("a"), { href: "https://waynah.vercel.app", textContent: "Preview" }),
  ];
  const card = {
    dataset: {},
    classList: classList(),
    children: [],
    querySelector(selector) {
      if (selector === "h2, h3") return title;
      if (selector === ".status") return originalStatus;
      if (selector === ".project-cover") return cover;
      return null;
    },
    querySelectorAll(selector) { return selector === "a[href]" ? anchors : []; },
    prepend(node) { this.children.unshift(node); },
    append(node) { this.children.push(node); },
  };
  const document = {
    documentElement: { lang },
    querySelectorAll(selector) {
      const expected = pathname.endsWith("projects.html") ? "main .grid .card, main .item" : "#projects .card";
      assert.equal(selector, expected);
      return [card];
    },
    createElement(tag) { return element(tag); },
  };
  const context = { document, location: { pathname } };
  vm.runInNewContext(source, context);
  const firstMeta = cover.afterNode;
  vm.runInNewContext(source, context);
  return { card, cover, firstMeta, anchors, originalStatus };
}

const ar = mount("ar");
assert.equal(ar.card.dataset.engineeringEnhanced, "true");
assert.equal(ar.card.classList.contains("engineering-card"), true);
assert.equal(ar.firstMeta.className, "engineering-meta");
assert.match(ar.firstMeta.children[0].textContent, /الاستكشاف الجغرافي/);
assert.equal(ar.firstMeta.children.length, 1, "The original status badge must not be duplicated.");
assert.equal(ar.originalStatus.textContent, "قيد التطوير");
assert.equal(ar.anchors[0].textContent, "المستودع على GitHub ↗");
assert.equal(ar.anchors[1].textContent, "المعاينة المباشرة ↗");
assert.equal(ar.anchors[1].classList.contains("primary-action"), true);
assert.equal(ar.card.children.length, 1, "Enhancement must be idempotent.");

const en = mount("en", "/en/projects.html");
assert.match(en.firstMeta.children[0].textContent, /Geospatial discovery/);
assert.equal(en.anchors[0].textContent, "GitHub repository ↗");
assert.equal(en.anchors[1].textContent, "Live preview ↗");

console.log("Project card behavior tests passed (Arabic/English, scope, original status preservation, actions, and idempotency).");
