import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = [
  { path: "../certificates.html", language: "ar" },
  { path: "../en/certificates.html", language: "en" },
];

function inspectPage(path, language) {
  const html = readFileSync(new URL(path, import.meta.url), "utf8");
  const cards = [...html.matchAll(/<article\b[^>]*class=["'][^"']*\bcredential-card\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi)]
    .map((match) => match[0]);

  assert.equal(cards.length, 21, language + ": expected 21 credential cards.");

  const issuerCounts = { openjs: 0, cisco: 0, edraak: 0 };
  const logoMap = new Map();

  for (const [index, card] of cards.entries()) {
    const badge = card.match(/<div\b[^>]*class=["'][^"']*\bissuer-badge\s+([a-z0-9-]+)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
    assert.ok(badge, language + ": credential " + (index + 1) + " has no issuer badge.");

    const issuer = badge[1].toLowerCase();
    assert.ok(Object.hasOwn(issuerCounts, issuer), language + ": unknown issuer badge class " + issuer + ".");
    issuerCounts[issuer] += 1;

    const images = [...badge[2].matchAll(/<img\b([^>]*)>/gi)];
    assert.ok(images.length > 0, language + ": " + issuer + " badge has no issuer logo image.");

    const sources = [];
    for (const image of images) {
      const attrs = image[1];
      const src = attrs.match(/\bsrc=["']([^"']+)["']/i)?.[1];
      const alt = attrs.match(/\balt=["']([^"']*)["']/i)?.[1];
      assert.ok(src && /^https:\/\//i.test(src), language + ": issuer logo must use an HTTPS source.");
      assert.ok(alt?.trim(), language + ": issuer logo is missing descriptive alt text.");
      assert.match(attrs, /\bloading=["']lazy["']/i, language + ": issuer logos must be lazy-loaded.");
      assert.match(attrs, /\bdecoding=["']async["']/i, language + ": issuer logos must decode asynchronously.");
      sources.push(src);
    }

    const previous = logoMap.get(issuer);
    if (previous) {
      assert.deepEqual(sources, previous, language + ": issuer logo source mapping is inconsistent.");
    } else {
      logoMap.set(issuer, sources);
    }
  }

  assert.deepEqual(issuerCounts, { openjs: 1, cisco: 14, edraak: 6 }, language + ": issuer distribution changed; review before updating this audit.");
  return { issuerCounts, logoMap };
}

const arabic = inspectPage(pages[0].path, pages[0].language);
const english = inspectPage(pages[1].path, pages[1].language);

for (const issuer of ["openjs", "cisco", "edraak"]) {
  assert.deepEqual(
    english.logoMap.get(issuer),
    arabic.logoMap.get(issuer),
    "Arabic and English pages must use the same issuer logo sources for " + issuer + ".",
  );
}

console.log("Credential audit passed: 21 cards per language, expected issuer distribution, descriptive logo alternatives, HTTPS sources, lazy loading, and bilingual logo consistency.");
