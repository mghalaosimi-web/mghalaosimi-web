import assert from "node:assert/strict";
import {existsSync,readFileSync,readdirSync} from "node:fs";
import path from "node:path";

const read=(file)=>readFileSync(new URL(file,import.meta.url),"utf8");
const registry=read("../data/projects.ts");
const detail=read("../app/projects/[slug]/page.tsx");
const arListing=read("../app/projects/ProjectsPageArabic.tsx");
const enListing=read("../app/projects/ProjectsExplorerEnglish.tsx");
const route=read("../app/en/[[...path]]/page.tsx");
const config=read("../next.config.ts");
const sitemap=read("../app/sitemap.ts");
const slugs=[...registry.matchAll(/slug:'([^']+)'/g)].map(match=>match[1]);
const detailSlugs=[...detail.matchAll(/slug:'([^']+)'/g)].map(match=>match[1]);

assert.equal(slugs.length,19,"The React public project registry must contain nineteen approved records.");
assert.deepEqual(detailSlugs,slugs,"Every public project must have a matching React detail record in priority order.");
assert.ok(detail.includes("if(!p)notFound()"),"Unknown and private project slugs must return a real 404.");
assert.ok(arListing.includes("import {projects")&&enListing.includes("import {projects"),"Both project explorers must render from the React project registry.");
assert.ok(route.includes("ProjectsExplorerEnglish")&&route.includes("ProjectDetail"),"English listing and detail routes must use React components.");
assert.ok(config.includes("permanent:true")&&config.includes("projects/:slug/index.html"),"Legacy project HTML URLs must permanently redirect to React detail routes.");
assert.ok(sitemap.includes("projects.map")||sitemap.includes("projects.flatMap"),"The sitemap must be generated from the React project registry.");
assert.ok(!registry.includes("humanity-system")&&!registry.includes("mghal-esdp"),"Private project records must not enter the public React registry.");
assert.ok(!detail.includes("humanity-system")&&!detail.includes("mghal-esdp"),"Private project detail records must not be publicly routable.");
assert.ok(existsSync(new URL("../app/projects/page.tsx",import.meta.url)),"The React project listing route must exist.");

const root=path.resolve(new URL("..",import.meta.url).pathname);
const legacy=[];
function walk(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  if([".git","node_modules",".next"].includes(entry.name))continue;
  const full=path.join(dir,entry.name);
  if(entry.isDirectory())walk(full);
  else if(entry.name.toLowerCase().endsWith(".html"))legacy.push(path.relative(root,full));
 }
}
walk(root);
assert.deepEqual(legacy,[],"Legacy HTML documents must be removed after React route migration: "+legacy.join(", "));
console.log("React project route audit passed: 19 public projects, private-route exclusion, redirects, generated sitemap, and zero tracked HTML documents.");
