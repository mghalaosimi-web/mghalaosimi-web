import assert from "node:assert/strict";
import {existsSync,readFileSync,readdirSync} from "node:fs";
import path from "node:path";
const root=process.cwd(),publicRoot=path.join(root,"public");
const catalog=JSON.parse(readFileSync(path.join(publicRoot,"assets/projects/catalog.json"),"utf8"));
const sitemap=readFileSync(path.join(root,"app/sitemap.ts"),"utf8");
const routes=readFileSync(path.join(root,"lib/seo-paths.mjs"),"utf8");
const config=readFileSync(path.join(root,"next.config.ts"),"utf8");
const failures=[];
assert.ok(sitemap.includes("catalog.projects"),"Sitemap must derive project URLs from the canonical catalogue.");
assert.ok(sitemap.includes("alternates:{languages:"),"Bilingual hreflang data is required.");
assert.ok(config.includes("async redirects()"),"Legacy HTML URLs must use Next.js redirects.");
assert.ok(!config.includes("destination:'/projects/:slug/index.html'"),"Project routes must not rewrite to static HTML.");
for(const route of ["/about","/projects","/skills","/labs","/research","/credentials","/education","/achievements","/knowledge","/resume","/contact"]){
 if(!routes.includes("'"+route+"'"))failures.push("Missing canonical route "+route);
 if(!routes.includes("'/en"+route+"'"))failures.push("Missing English canonical route "+route);
}
for(const project of catalog.projects){
 if(!routes.includes("'/en/projects/'"))failures.push("Missing bilingual project route pattern.");
 if(!existsSync(path.join(publicRoot,project.brand.logo.slice(1))))failures.push("Missing project logo "+project.slug);
}
const html=[];
function walk(dir){for(const item of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,item.name);if(item.isDirectory())walk(full);else if(item.name.toLowerCase().endsWith(".html"))html.push(path.relative(publicRoot,full).split(path.sep).join("/"));}}
walk(publicRoot);
for(const file of html){if(!["admin/index.html","offline.html"].includes(file))failures.push("Legacy public HTML remains: "+file);}
assert.ok(existsSync(path.join(root,"app/sitemap.ts")));
if(failures.length){console.error(failures.join("\n"));process.exit(1);}
console.log("SEO architecture audit passed: "+catalog.projects.length+" bilingual project records, Next.js sitemap, route canonicals and legacy URL redirects.");
