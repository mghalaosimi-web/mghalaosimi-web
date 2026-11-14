import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";

const read=(path)=>readFileSync(new URL(path,import.meta.url),"utf8");
const worker=read("../public/sw.js");
const manifest=JSON.parse(read("../public/manifest.json"));
const layout=read("../app/layout.tsx");
const offline=read("../app/offline/page.tsx");

assert.match(worker,/mghal-pwa-v7/,"The service-worker cache version must advance after removing legacy HTML caching.");
assert.ok(worker.includes('const OFFLINE_DOCUMENT="/offline"'),"The PWA must use the React offline route.");
assert.ok(!worker.includes(".html"),"The service worker must not depend on legacy HTML documents.");
assert.ok(existsSync(new URL("../app/offline/page.tsx",import.meta.url)),"The React offline route must exist.");
assert.ok(offline.includes("أنت غير متصل بالإنترنت"),"The React offline page must explain the offline state.");
assert.ok(worker.includes('cache.add(OFFLINE_DOCUMENT)'),"The service worker must cache the React offline route.");
assert.ok(worker.includes("await cache.addAll(CORE_ASSETS)"),"Core PWA assets must be precached.");
for(const asset of ["/favicon.svg","/assets/pwa-icon.svg","/manifest.json","/assets/design-tokens.css","/assets/theme.css"]){
 const relative=asset==="/manifest.json"?"../public/manifest.json":asset==="/favicon.svg"?"../public/favicon.svg":asset==="/assets/pwa-icon.svg"?"../public/assets/pwa-icon.svg":asset==="/assets/design-tokens.css"?"../public/assets/design-tokens.css":"../public/assets/theme.css";
 assert.ok(existsSync(new URL(relative,import.meta.url)),"Missing PWA core asset: "+asset);
}
assert.equal(manifest.display,"standalone","PWA display mode should remain standalone.");
assert.equal(manifest.scope,"/","PWA scope must remain at the site root.");
assert.ok(layout.includes("manifest: '/manifest.json'"),"The Next.js shell must expose the PWA manifest.");
assert.ok(layout.includes("<SiteExperience/>"),"The Next.js shell must mount shared PWA behavior.");
console.log("PWA audit passed: React offline route, current assets, and no legacy HTML cache dependencies.");
