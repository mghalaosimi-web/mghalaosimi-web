import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
const worker=readFileSync(new URL("../public/sw.js",import.meta.url),"utf8");
const offline=readFileSync(new URL("../app/offline/page.tsx",import.meta.url),"utf8");
const manifest=JSON.parse(readFileSync(new URL("../public/manifest.json",import.meta.url),"utf8"));
const layout=readFileSync(new URL("../app/layout.tsx",import.meta.url),"utf8");
const experience=readFileSync(new URL("../app/components/SiteExperience.tsx",import.meta.url),"utf8");
const shell=readFileSync(new URL("../app/mghal-portfolio.css",import.meta.url),"utf8");
function list(name){const start=worker.indexOf('const '+name+' = ['),end=worker.indexOf('];',start);assert.ok(start>=0&&end>start,name+' list is missing');return [...worker.slice(start,end).matchAll(/"([^"]+)"/g)].map(x=>x[1]);}
const core=list("CORE_ASSETS"),pages=list("APP_PAGES");
for(const asset of core){const path='../public'+asset;assert.ok(existsSync(new URL(path,import.meta.url)),'Missing cached PWA asset: '+asset);}
for(const route of pages){const routeFile=route==='/en'?'../app/en/page.tsx':'../app'+route+'/page.tsx';assert.ok(existsSync(new URL(routeFile,import.meta.url)),'Missing locale-stable cached route: '+route);}
const version=worker.match(/mghal-pwa-v(\d+)/)?.[1];assert.ok(version,'Service worker cache version is required');
assert.ok(worker.includes('const CACHED_DOCUMENT_PATHS = new Set(APP_PAGES);'),'Only explicit locale-stable React routes may be cached.');
assert.ok(worker.includes('request.mode === "navigate"'),'Document requests must use network-first.');
assert.ok(worker.includes('cache.match("/offline.html")'),'Offline fallback must remain available.');
assert.ok(!worker.includes('.html", "/projects.html'),'Old static pages must not be cached.');
assert.ok(offline.includes('id="main-content"'),'React offline page must expose a focusable main landmark.');
assert.ok(!existsSync(new URL("../public/offline.html",import.meta.url)),'Legacy offline HTML must be removed.');
assert.equal(manifest.display,"standalone");assert.equal(manifest.background_color,"#0B1117");
assert.ok(manifest.start_url&&manifest.scope==="/");
assert.ok(layout.includes("manifest: '/manifest.json'"));assert.ok(layout.includes("<SiteExperience/>"));
assert.ok(experience.includes(".register('/sw.js'"));assert.ok(experience.includes("window.addEventListener('scroll'"));
assert.ok(experience.includes("requestAnimationFrame"));assert.ok(experience.includes("new ResizeObserver"));
assert.ok(shell.includes(".mghal-reading-progress{")&&shell.includes("position:fixed"));
assert.ok(shell.includes('html[dir="rtl"] .mghal-reading-progress{transform-origin:right}'));
assert.ok(shell.includes("prefers-reduced-motion:reduce"));
console.log("PWA audit passed: "+core.length+" cached assets, "+pages.length+" locale-stable React routes, offline fallback, manifest, and RTL/LTR reading progress.");
