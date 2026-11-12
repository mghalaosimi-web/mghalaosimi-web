const CACHE_NAME = "mghal-pwa-v6";
const CORE_ASSETS = [
  "/index.html",
  "/offline.html",
  "/favicon.svg",
  "/assets/pwa-icon.svg",
  "/manifest.json",
  "/assets/theme.css",
  "/assets/site.js",
  "/assets/accessibility.js",
  "/assets/project-cards.js",
  "/assets/search-index.json"
];
const APP_PAGES = [
  "/profile.html", "/projects.html", "/showcase.html", "/certificates.html",
  "/skills.html", "/education.html", "/achievements.html", "/knowledge.html",
  "/contact.html", "/en/", "/en/index.html", "/en/profile.html",
  "/en/projects.html", "/en/showcase.html", "/en/certificates.html",
  "/en/skills.html", "/en/education.html", "/en/achievements.html",
  "/en/knowledge.html", "/en/contact.html"
];

// Only cache locale-stable legacy documents; Next.js pages vary by a locale cookie.
const CACHED_DOCUMENT_PATHS = new Set(["/index.html", ...APP_PAGES]);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await Promise.allSettled(APP_PAGES.map((path) => cache.add(path)));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith("mghal-pwa-") && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const path = new URL(request.url).pathname;
  const cacheable = CACHED_DOCUMENT_PATHS.has(path);
  try {
    const response = await fetch(request);
    if (response && response.ok && cacheable) await cache.put(request, response.clone());
    return response;
  } catch {
    const exact = cacheable ? await cache.match(request) : null;
    if (exact) return exact;
    const pathMatch = cacheable ? await cache.match(path, { ignoreSearch: true }) : null;
    if (pathMatch) return pathMatch;
    return (await cache.match("/offline.html")) || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (response && response.ok) await cache.put(request, response.clone());
    return response;
  });
  if (cached) {
    update.catch(() => {});
    return cached;
  }
  try { return await update; } catch { return Response.error(); }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate" || request.destination === "document") {
    event.respondWith(networkFirst(request));
    return;
  }

  if (["style", "script", "image", "font"].includes(request.destination) ||
      url.pathname === "/manifest.json" ||
      url.pathname === "/assets/search-index.json") {
    event.respondWith(staleWhileRevalidate(request));
  }
});
