import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";

const source = readFileSync(new URL("../assets/credentials.js", import.meta.url), "utf8");

function createNode(properties = {}) {
  const listeners = new Map();
  return {
    ...properties,
    hidden: properties.hidden ?? false,
    textContent: properties.textContent ?? "",
    value: properties.value ?? "",
    attributes: {},
    addEventListener(type, callback) {
      const callbacks = listeners.get(type) ?? [];
      callbacks.push(callback);
      listeners.set(type, callbacks);
    },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    dispatch(type, event = {}) {
      for (const callback of listeners.get(type) ?? []) callback(event);
    },
  };
}

function mountCredentialsPage(lang = "ar") {
  const search = createNode();
  const count = createNode();
  const empty = createNode({ hidden: true });
  const cards = [
    createNode({ dataset: { category: "engineering" }, innerText: "JSNAD Node.js تطوير البرمجة" }),
    createNode({ dataset: { category: "security" }, innerText: "أساسيات الشبكات والأمن" }),
    createNode({ dataset: { category: "design" }, innerText: "تصميم تجربة المستخدم UX" }),
  ];
  const buttons = ["all", "engineering", "security", "design"].map(filter =>
    createNode({ dataset: { filter } }),
  );
  const root = {
    querySelector(selector) {
      return ({
        ".credential-search": search,
        ".credential-count": count,
        ".credential-empty": empty,
      })[selector] ?? null;
    },
    querySelectorAll(selector) {
      if (selector === ".credential-filter") return buttons;
      if (selector === ".credential-card") return cards;
      return [];
    },
  };
  const document = {
    documentElement: { lang },
    querySelector(selector) {
      return selector === ".credentials-page" ? root : null;
    },
  };

  vm.runInNewContext(source, { document });
  return { search, count, empty, cards, buttons };
}

// The script must be safe on pages that do not contain the credential component.
assert.doesNotThrow(() => vm.runInNewContext(source, {
  document: { querySelector: () => null },
}));

// Initial render shows every credential and reports the localized count.
const ar = mountCredentialsPage("ar");
assert.deepEqual(ar.cards.map(card => card.hidden), [false, false, false]);
assert.equal(ar.count.textContent, "3 من 3 اعتماداً معروضاً");

// Category filters update visibility and the accessible pressed state.
ar.buttons[2].dispatch("click");
assert.deepEqual(ar.cards.map(card => card.hidden), [true, false, true]);
assert.equal(ar.buttons[2].attributes["aria-pressed"], "true");
assert.equal(ar.buttons[0].attributes["aria-pressed"], "false");
assert.equal(ar.count.textContent, "1 من 3 اعتماداً معروضاً");

// Arabic text search is combined with the active category.
ar.search.value = "الشبكات";
ar.search.dispatch("input");
assert.deepEqual(ar.cards.map(card => card.hidden), [true, false, true]);
ar.search.value = "لا توجد نتيجة";
ar.search.dispatch("input");
assert.equal(ar.empty.hidden, false);

// Escape clears search while preserving the selected category.
ar.search.dispatch("keydown", { key: "Escape" });
assert.equal(ar.search.value, "");
assert.deepEqual(ar.cards.map(card => card.hidden), [true, false, true]);
assert.equal(ar.empty.hidden, true);

// Search normalization matches Arabic spelling variants.
ar.buttons[0].dispatch("click");
ar.search.value = "البرمجه";
ar.search.dispatch("input");
assert.deepEqual(ar.cards.map(card => card.hidden), [false, true, true]);

// English count copy is selected from the document language.
const en = mountCredentialsPage("en");
assert.equal(en.count.textContent, "3 of 3 credentials shown");

console.log("Credential browser tests passed (Arabic/English, filtering, search, Escape, empty state, and safe mounting).");
