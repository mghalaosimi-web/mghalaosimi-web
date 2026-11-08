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
  const start = worker.indexOf(`const ${section} = [`);
  const end = worker.indexOf("];", start);
  assert.ok(start >= 0 && end > start, label + " list is missing.");
  const paths = [...worker.slice(start, end).matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
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

const cacheVersion = worker.split('const CACHE_NAME = "mghal-pwa-v')[1]?.split('"')[0];
assert.ok(cacheVersion && /^[0-9]+$/.test(cacheVersion), "Service worker cache version is missing.");
const coreCount = assertCachedFilesExist("CORE_ASSETS", "Core asset");
const pageCount = assertCachedFilesExist("APP_PAGES", "Offline page");
assert.ok(worker.includes('request.mode === "navigate"'), "Document requests must use the network-first strategy.");
assert.ok(worker.includes('cache.match("/offline.html")'), "Failed navigations must have a local offline fallback.");
assert.ok(site.includes('navigator.serviceWorker.register("/sw.js"'), "Legacy pages must register the service worker.");
assert.ok(offline.includes('href="#main-content"'), "Offline page must provide keyboard skip navigation.");
assert.equal(manifest.display, "standalone", "PWA display mode should remain standalone.");
assert.ok(manifest.start_url && manifest.scope === "/", "PWA start_url and scope are required.");

assert.ok(layout.includes("manifest: '/manifest.json'"), "The Next.js shell must expose the PWA manifest.");
assert.ok(layout.includes("<SiteExperience/>"), "The Next.js shell must mount shared PWA and reading-progress behavior.");
assert.ok(experience.includes(".register('/sw.js'"), "The Next.js experience must register the existing service worker.");
assert.ok(experience.includes("window.addEventListener('scroll'"), "Reading progress must respond to scrolling.");
assert.ok(experience.includes("requestAnimationFrame"), "Reading progress updates must be animation-frame throttled.");
assert.ok(experience.includes("new ResizeObserver"), "Reading progress must recalculate when page content changes.");
assert.ok(shell.includes(".mghal-reading-progress{") && shell.includes("position:fixed"), "Reading progress must remain pinned to the viewport.");
assert.ok(shell.includes('html[dir="rtl"] .mghal-reading-progress{transform-origin:right}'), "Reading progress origin must respect RTL direction.");
assert.ok(shell.includes("prefers-reduced-motion:reduce"), "The site shell must preserve reduced-motion support.");

console.log(`PWA audit passed: ${coreCount} cached assets, ${pageCount} offline pages, legacy + Next.js registration, manifest, offline fallback and RTL/LTR reading progress.`);
