import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const worker = readFileSync(new URL("../public/sw.js", import.meta.url), "utf8");
const site = readFileSync(new URL("../public/assets/site.js", import.meta.url), "utf8");
const offline = readFileSync(new URL("../public/offline.html", import.meta.url), "utf8");
const manifest = JSON.parse(readFileSync(new URL("../public/manifest.json", import.meta.url), "utf8"));
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const experience = readFileSync(new URL("../app/components/SiteExperience.tsx", import.meta.url), "utf8");
const shell = readFileSync(new URL("../app/mghal-portfolio.css", import.meta.url), "utf8");

function assertCachedFilesExist(section, label) {
  const match = worker.match(new RegExp(`const ${section} = \\[([\\s\\S]*?)\\];`));
  assert.ok(match, label + " list is missing.");
  const paths = [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
  assert.ok(paths.length > 0, label + " list must not be empty.");

  for (const path of paths) {
    const relative = path === "/"
      ? "../public/index.html"
      : path.endsWith("/")
        ? `../public${path}index.html`
        : `../public${path}`;
    assert.ok(existsSync(new URL(relative, import.meta.url)), `Missing cached PWA resource: ${path}`);
  }
  return paths.length;
}

assert.match(worker, /const CACHE_NAME = "mghal-pwa-v\\d+"/, "Service worker cache version is missing.");
const coreCount = assertCachedFilesExist("CORE_ASSETS", "Core asset");
const pageCount = assertCachedFilesExist("APP_PAGES", "Offline page");
assert.match(worker, /request\.mode === "navigate"/, "Document requests must use the network-first strategy.");
assert.match(worker, /cache\.match\("\/offline\.html"\)/, "Failed navigations must have a local offline fallback.");
assert.match(site, /navigator\.serviceWorker\.register\("\/sw\.js"/, "Legacy pages must register the service worker.");
assert.match(offline, /href=["']#main-content["']/, "Offline page must provide keyboard skip navigation.");
assert.equal(manifest.display, "standalone", "PWA display mode should remain standalone.");
assert.ok(manifest.start_url && manifest.scope === "/", "PWA start_url and scope are required.");

assert.ok(layout.includes("manifest: '/manifest.json'"), "The Next.js shell must expose the PWA manifest.");
assert.ok(layout.includes("<SiteExperience/>"), "The Next.js shell must mount shared PWA and reading-progress behavior.");
assert.match(experience, /navigator\.serviceWorker\s*\.register\('\/sw\.js'/, "The Next.js experience must register the existing service worker.");
assert.match(experience, /window\.addEventListener\('scroll'/, "Reading progress must respond to scrolling.");
assert.match(experience, /requestAnimationFrame/, "Reading progress updates must be animation-frame throttled.");
assert.match(experience, /ResizeObserver/, "Reading progress must recalculate when page content changes.");
assert.match(shell, /\.mghal-reading-progress\s*\{[^}]*position:fixed/s, "Reading progress must remain pinned to the viewport.");
assert.match(shell, /html\[dir="rtl"\] \.mghal-reading-progress\{transform-origin:right\}/, "Reading progress origin must respect RTL direction.");
assert.match(shell, /prefers-reduced-motion:reduce/, "The site shell must preserve reduced-motion support.");

console.log(`PWA audit passed: ${coreCount} cached assets, ${pageCount} offline pages, legacy + Next.js registration, manifest, offline fallback and RTL/LTR reading progress.`);
