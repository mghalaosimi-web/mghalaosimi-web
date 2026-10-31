import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
const root=process.cwd();
const catalog=JSON.parse(readFileSync(path.join(root,"assets/projects/catalog.json"),"utf8"));
assert.ok(catalog.projects.length >= 1,"The project catalogue must contain at least one project.");
const ids=new Set(),slugs=new Set();
for(const p of catalog.projects){
 assert.ok(p.id&&p.slug&&p.title?.ar&&p.title?.en,"Project identity and bilingual titles are required.");
 assert.ok(!ids.has(p.id)&&!slugs.has(p.slug),"Project ids and slugs must be unique.");
 ids.add(p.id);slugs.add(p.slug);
 assert.ok(p.summary?.ar&&p.summary?.en&&p.problem?.ar&&p.problem?.en,"Bilingual project summaries and problem statements are required.");
 assert.ok(Array.isArray(p.technologies)&&Array.isArray(p.features)&&Array.isArray(p.gallery),"Technology, features and gallery arrays are required.");
 if(p.repository)assert.match(p.repository,/^https:\/\/github\.com\/mghalaosimi-web\//);
 for(const lang of ["ar","en"]){
  const file=path.join(root,lang==="en"?"en":"","projects",p.slug,"index.html");
  assert.ok(existsSync(file),"Generated page missing: "+path.relative(root,file));
  const html=readFileSync(file,"utf8");
  assert.match(html,new RegExp("<html lang='"+lang+"'"));
  assert.match(html,/rel='canonical'/);
  assert.match(html,/hreflang='ar'/);
  assert.match(html,/hreflang='en'/);
  assert.match(html,/application\/ld\+json/);
  assert.match(html,/id='main-content'/);
  assert.match(html,/class='skip-link'/);
  assert.match(html,/name='description'/);
  assert.doesNotMatch(html,/(?:AIza[0-9A-Za-z_-]{20,}|EAAB[A-Za-z0-9]+|postgres(?:ql)?:\/\/[^ "'<>]+)/i,"Generated public pages must not contain credential-like values.");
  for(const m of html.matchAll(/<img\b([^>]*)>/g))assert.match(m[1],/\balt=/,"Every image requires alt text.");
 }
 if(p.visibility?.ar?.includes("خاص"))assert.equal(p.repository,null,"Private repositories must never be linked publicly.");
}
const sitemap=readFileSync(path.join(root,"sitemap.xml"),"utf8");
for(const p of catalog.projects)for(const l of ["ar","en"])assert.ok(sitemap.includes(catalog.siteOrigin+"/"+(l==="en"?"en/":"")+"projects/"+p.slug+"/"),"Sitemap entry missing: "+p.slug+"/"+l);
console.log(`Project portfolio tests passed: ${catalog.projects.length} records, ${catalog.projects.length*2} bilingual routes, private-source guard, metadata, JSON-LD, image alt text and sitemap.`);
