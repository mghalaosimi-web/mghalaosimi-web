import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pages = [
  { path: "../certificates.html", language: "ar" },
  { path: "../en/certificates.html", language: "en" },
];
const expected = { openjs: 1, cisco: 14, edraak: 6 };

function inspectPage(path, language) {
  const html = readFileSync(new URL(path, import.meta.url), "utf8");
  const sections = [...html.matchAll(/<section\b[^>]*id=["'](cisco|edraak|openjs)-credentials["'][^>]*>([\s\S]*?)<\/section>/gi)];
  assert.equal(sections.length, 3, language + ": expected all three credential issuer sections.");

  const issuerCounts = { openjs: 0, cisco: 0, edraak: 0 };
  const logoMap = new Map();
  let total = 0;

  for (const section of sections) {
    const issuer = section[1].toLowerCase();
    const cards = [...section[2].matchAll(/<article\b[^>]*class=["'][^"']*\bcredential-card\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi)]
      .map((match) => match[0]);
    issuerCounts[issuer] += cards.length;
    total += cards.length;

    for (const [index, card] of cards.entries()) {
      const textOnly = /\bcert-card-text-only\b/i.test(card);
      const badge = card.match(/<div\b[^>]*class=["'][^"']*\bissuer-badge\s+([a-z0-9-]+)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);

      if (textOnly) {
        assert.ok(!/<img\b/i.test(card), language + ": text-only credential " + issuer + " #" + (index + 1) + " must not contain an image.");
        assert.ok(!badge, language + ": text-only credential " + issuer + " #" + (index + 1) + " must display its name only.");
        continue;
      }

      assert.ok(badge, language + ": image credential " + issuer + " #" + (index + 1) + " has no issuer badge.");
      assert.equal(badge[1].toLowerCase(), issuer, language + ": issuer badge does not match its section.");
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
      if (previous) assert.deepEqual(sources, previous, language + ": issuer logo source mapping is inconsistent.");
      else logoMap.set(issuer, sources);
    }
  }

  assert.equal(total, 21, language + ": expected all 21 credential records.");
  assert.deepEqual(issuerCounts, expected, language + ": issuer distribution changed; review before updating this audit.");
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

console.log("Credential audit passed: all 21 records per language, correct issuer distribution, original source previews where available, text-only records without fabricated imagery, and bilingual issuer-logo consistency.");
