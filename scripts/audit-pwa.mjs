import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const worker = readFileSync(new URL("../sw.js", import.meta.url), "utf8");
const site = readFileSync(new URL("../assets/site.js", import.meta.url), "utf8");
const offline = readFileSync(new URL("../offline.html", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../manifest.json", import.meta.url), "utf8"));

assert.match(worker, /const CACHE_NAME = "mghal-pwa-v\\d+"/, "Service worker cache version is missing.");
for (const asset of ["/assets/theme.css", "/assets/site.js", "/assets/accessibility.js", "/assets/project-cards.js", "/assets/search-index.json"]) {
  assert.ok(worker.includes('"' + asset + '"'), "Critical offline asset is not precached: " + asset);
}
assert.match(worker, /"script"/, "Service worker must apply its script caching strategy.");
assert.match(site, /navigator\\.serviceWorker\\.register/, "The site must register its service worker.");
assert.match(offline, /href=["']#main-content["']/, "Offline page must provide keyboard skip navigation.");
assert.equal(manifest.display, "standalone", "PWA display mode should remain standalone.");
assert.ok(manifest.start_url, "PWA start_url is required.");

console.log("PWA audit passed (cache version, critical offline assets, registration, offline navigation, and manifest).");
