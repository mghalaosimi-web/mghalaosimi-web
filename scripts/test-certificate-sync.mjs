import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const script = readFileSync("assets/certificate-sync.js", "utf8");
assert.match(script, /\/api\/public\/certificates/, "certificate page must consume the published certificates API");
assert.match(script, /\/api\/public\/media\//, "published PDF media must use the guarded public media route");
assert.match(script, /sync\(\)\.catch\(/, "API failures must retain the original static certificate content");
assert.match(script, /card\.hidden = true/, "records absent from the published API must be hidden after a successful response");
assert.doesNotMatch(script, /innerHTML|insertAdjacentHTML/, "API content must be inserted as text, not parsed as HTML");
assert.match(script, /textContent = record\.title/, "API titles must be rendered as text");
assert.equal((script.match(/\["[^"]+", "[a-z0-9-]+"\]/g) || []).length, 21, "all 21 known credentials must have stable source slugs");

for (const file of ["certificates.html", "en/certificates.html"]) {
  const html = readFileSync(file, "utf8");
  assert.match(html, /assets\/certificate-sync\.js/, file + ": certificate sync script is not loaded");
  assert.equal((html.match(/class=["'][^"']*\bcredential-card\b/g) || []).length, 21, file + ": static 21-card inventory must be preserved");
  assert.match(html, /assets\/certificates\//, file + ": original certificate assets must remain available");
}
console.log("Certificate API integration tests passed: bilingual loading, 21 stable mappings, safe text rendering, unpublished filtering and static fallback.");
