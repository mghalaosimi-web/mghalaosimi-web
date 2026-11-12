const CACHE_NAME = "mghal-pwa-v7";
const CORE_ASSETS = [
  "/offline.html",
  "/favicon.svg",
  "/assets/pwa-icon.svg",
  "/manifest.json",
  "/assets/design-tokens.css",
  "/assets/search-index.json"
];
const APP_PAGES = [
  "/en", "/en/about", "/en/projects", "/en/skills", "/en/labs",
  "/en/research", "/en/credentials", "/en/education", "/en/achievements",
  "/en/knowledge", "/en/resume", "/en/contact"
];
const CACHED_DOCUMENT_PATHS = new Set(APP_PAGES);

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
    await Promise.all(keys.filter((key) => key.startsWith("mghal-pwa-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const path = new URL(request.url).pathname;
  const cacheable = CACHED_DOCUMENT_PATHS.has(path);
  try {
    const response = await fetch(request);
    if (response?.ok && cacheable) await cache.put(request, response.clone());
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
    if (response?.ok) await cache.put(request, response.clone());
    return response;
  });
  if (cached) { update.catch(() => {}); return cached; }
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
      url.pathname === "/manifest.json" || url.pathname === "/assets/search-index.json") {
    event.respondWith(staleWhileRevalidate(request));
  }
});
