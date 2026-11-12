import assert from "node:assert/strict";
import {existsSync,readFileSync} from "node:fs";
import path from "node:path";

const root=process.cwd(),publicRoot=path.join(root,"public");
const catalog=JSON.parse(readFileSync(path.join(publicRoot,"assets/projects/catalog.json"),"utf8"));
assert.ok(Array.isArray(catalog.projects)&&catalog.projects.length>0,"The canonical project catalogue must contain records.");
assert.match(catalog.siteOrigin,/^https:\/\//);
const ids=new Set(),slugs=new Set(),colors=new Set();
for(const project of catalog.projects){
 assert.ok(project.id&&project.slug&&project.title?.ar&&project.title?.en,"Bilingual project identity is required.");
 assert.ok(!ids.has(project.id)&&!slugs.has(project.slug),"Project identifiers and slugs must be unique.");
 ids.add(project.id);slugs.add(project.slug);
 assert.ok(project.summary?.ar&&project.summary?.en&&project.problem?.ar&&project.problem?.en,"Bilingual descriptions are required.");
 assert.ok(Array.isArray(project.technologies)&&Array.isArray(project.features)&&Array.isArray(project.gallery),"Verified stack, features, and gallery records are required.");
 assert.ok(project.cover?.startsWith("/assets/projects/")&&existsSync(path.join(publicRoot,project.cover.slice(1))),"Project artwork must exist.");
 assert.ok(project.brand?.logo?.startsWith("/assets/projects/logos/")&&existsSync(path.join(publicRoot,project.brand.logo.slice(1))),"Every project needs an actual logo asset.");
 for(const color of [project.brand.primary,project.brand.secondary,project.brand.accent])assert.match(color,/^#[0-9A-Fa-f]{6}$/);
 assert.ok(!colors.has(project.brand.primary.toLowerCase()),"Primary brand colors must be distinct.");
 colors.add(project.brand.primary.toLowerCase());
 assert.ok(project.contribution?.ar&&project.contribution?.en,"Contribution must be stated in both languages.");
 assert.ok(["web","enterprise","ai","cybersecurity","academic","mobile","desktop"].includes(project.categoryKey),"Project category must use the approved taxonomy.");
 if(project.repository)assert.match(project.repository,/^https:\/\/github\.com\/mghalaosimi-web\//);
 if(project.visibility?.ar?.includes("خاص"))assert.equal(project.repository,null,"Private repositories must not be linked publicly.");
 for(const image of project.gallery){
  assert.match(image.src,/^https:\/\//);
  assert.ok(image.alt?.ar&&image.alt?.en&&image.caption?.ar&&image.caption?.en);
  assert.doesNotMatch(image.src,/humanity-system|\.env|localhost/i);
 }
}
const detail=readFileSync(path.join(root,"app/projects/[slug]/page.tsx"),"utf8");
assert.match(detail,/catalog\.projects/,"React detail route must read the canonical project catalogue.");
for(const section of ["problem","goal","audience","value","features","technologies","architecture","contribution","gallery","evidence"])assert.ok(detail.includes(section),"Project detail view must include "+section);
const englishDetail=readFileSync(path.join(root,"app/en/projects/[slug]/page.tsx"),"utf8");
assert.match(englishDetail,/projects\/\[slug\]\/page/,"English project detail route must reuse the shared React detail page.");
const listing=readFileSync(path.join(root,"data/projects.ts"),"utf8");
assert.match(listing,/catalog\.projects\.map/,"Project explorer must derive from the canonical catalogue.");
const sitemap=readFileSync(path.join(root,"app/sitemap.ts"),"utf8");
assert.match(sitemap,/catalog\.projects/,"Sitemap must generate project URLs from the canonical catalogue.");
assert.match(sitemap,/alternates:\{languages:/,"Sitemap must expose bilingual alternates.");
assert.ok(!existsSync(path.join(publicRoot,"projects.html")),"Legacy project listing HTML must be removed.");
assert.ok(!existsSync(path.join(publicRoot,"en/projects.html")),"Legacy English project listing HTML must be removed.");
for(const project of catalog.projects){
 assert.ok(!existsSync(path.join(publicRoot,"projects",project.slug,"index.html")),"Legacy Arabic HTML project detail must be removed: "+project.slug);
 assert.ok(!existsSync(path.join(publicRoot,"en","projects",project.slug,"index.html")),"Legacy English HTML project detail must be removed: "+project.slug);
}
console.log("Project portfolio tests passed: "+catalog.projects.length+" canonical records, distinct brand marks, bilingual contribution, React detail routes, and generated sitemap.");
