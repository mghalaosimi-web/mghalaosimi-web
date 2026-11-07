import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const script = readFileSync(new URL("../public/assets/certificate-sync.js", import.meta.url), "utf8");
assert.match(script, /\/api\/public\/certificates/, "certificate page must consume the published certificates API");
assert.match(script, /\/api\/public\/media\//, "published PDF media must use the guarded public media route");
assert.match(script, /sync\(\)\.catch\(/, "API failures must retain original static certificate content");
assert.doesNotMatch(script, /card\.hidden\s*=\s*true/, "an incomplete API must not hide verified static records");
assert.match(script, /if \(!record\)\s*\{[\s\S]*?continue;/, "missing API records must preserve static cards");
assert.match(script, /hasSpecificVerification/, "specific issuer verification URLs must take precedence over generic profile URLs");
assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML/, "API content must be inserted as text, not parsed as HTML");
assert.match(script, /record\.title && !heading\.textContent\.trim\(\)/, "API titles must never overwrite curated static titles");
assert.match(script, /description && !description\.textContent\.trim\(\)/, "API descriptions must never overwrite curated static descriptions");
assert.equal((script.match(/\["[^"]+", "[a-z0-9-]+"\]/g) || []).length, 18, "only 18 substantiated credentials may have stable source slugs");

const foreignIds = [
  "23bda189-2470-4ce0-8065-ee904979ba21",
  "e16ca722-84d2-4da2-ad1f-46e972453890",
  "2f9902ec-e035-4b56-bf1b-42c66f05ed75",
  "de9c51d6-2eb6-4f7e-833a-31670170e278",
  "43943e68-05c5-40ea-93d1-d2a26e07ced0",
  "4e822fcc-656e-4891-bc51-666ca95cd6e8",
  "f0520c01-63aa-4440-9df4-69c7303d8762",
  "a370a36f-7ce1-4531-b44b-b909e56ee52d",
  "dd68b74c-65f9-468f-9a51-3bb78adad239",
];
for (const file of ["../public/certificates.html", "../public/en/certificates.html"]) {
  const html = readFileSync(new URL(file, import.meta.url), "utf8");
  assert.match(html, /assets\/certificate-sync\.js/, file + ": certificate sync script is not loaded");
  assert.equal((html.match(/class=["'][^"']*\bcredential-card\b/g) || []).length, 18, file + ": expected 18 substantiated credential cards");
  const credlyLinks = [...html.matchAll(/href=["\']https:\/\/www\.credly\.com\/badges\/([0-9a-f-]+)\/public_url["\']/g)];
  assert.equal(new Set(credlyLinks.map(match => match[1])).size, 11, file + ": all 11 Cisco badges need individual verification links");
  assert.equal((html.match(/href=["']https:\/\/programs\.edraak\.org\/learn\/verify-certificate\//g) || []).length, 6, file + ": all six Edraak records need individual verification links");
  assert.match(html, /assets\/certificates\//, file + ": original certificate assets must remain available");
  assert.ok(!html.includes('class="cert-logo-box"'), file + ": issuer logos must be kept within individual credential cards, not duplicated in group headers");
  const imageTags = [...html.matchAll(/<img\\b[^>]*>/gi)].map(match => match[0]);
  assert.ok(imageTags.length > 0, file + ": credential page must include issuer/certificate images");
  for (const imageTag of imageTags) {
    assert.match(imageTag, /\\balt=["'][^"']*["']/i, file + ": every image needs alt text");
    assert.match(imageTag, /\\bloading=["']lazy["']/i, file + ": images must lazy-load");
    assert.match(imageTag, /\\bdecoding=["']async["']/i, file + ": images must use async decoding");
  }
  if (file.includes("/en/")) {
    const paragraphText = [...html.matchAll(/<p\\b[^>]*>([\\s\\S]*?)<\\/p>/gi)].map(match => match[1].replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ").trim());
    assert.ok(paragraphText.every(value => !/[\\u0600-\\u06FF]/.test(value)), "English credential page must not contain Arabic descriptions.");
  }
  for (const route of ["/projects", "/credentials", "/skills", "/about", "/contact"]) {
    assert.ok(html.includes('href="' + route + '"'), file + ": credential navigation must use the Next.js route " + route);
  }
  if (file.includes("/en/")) assert.ok(html.includes('href="/language/ar?next=/credentials"'), "English page must switch language through the locale cookie route");
  else assert.ok(html.includes('href="/language/en?next=/credentials"'), "Arabic page must switch language through the locale cookie route");
  assert.ok(!html.includes('href="/en/projects.html"') && !html.includes('href="/projects.html"'), file + ": legacy projects navigation must not remain on the Next.js credential page");
  for (const id of foreignIds) assert.ok(!html.includes(id), file + ": reference-owner badge ID leaked: " + id);
  assert.doesNotMatch(html, /سجل اعتماد إضافي|additional Cisco record/i, file + ": unsubstantiated placeholder credential leaked");
}
console.log("Certificate sync tests passed: 18 substantiated records, 11 individual Credly links, six Edraak links, safe static fallback and no foreign-owner/placeholder badges.");
