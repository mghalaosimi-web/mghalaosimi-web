import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout=readFileSync(new URL('../app/layout.tsx',import.meta.url),'utf8');
const schema=readFileSync(new URL('../lib/structured-data.ts',import.meta.url),'utf8');
const seo=readFileSync(new URL('../lib/seo.ts',import.meta.url),'utf8');

assert.match(layout,/import \{siteJsonLd\} from '\.\.\/lib\/structured-data'/,'The shared Next.js shell must import the site JSON-LD graph.');
assert.match(layout,/type="application\/ld\+json"/,'The shared shell must emit structured data as JSON-LD.');
assert.match(layout,/JSON\.stringify\(siteJsonLd\(\)\)/,'The JSON-LD graph must be serialized into the page.');
assert.ok(layout.includes('replace(/</g'),'JSON-LD serialization must escape less-than characters.');

for(const marker of [
  "'@type':'Person'",
  "'@type':'ProfilePage'",
  "'@type':'WebSite'",
  "name:'محمد غالب العصيمي'",
  "'محمد غالب ناصر العصيمي'",
  "'محمد العصيمي'",
  "'Mohammed Ghaleb Alaosimi'",
  "'Mohammed Alaosimi'",
  "'M.GH.AL'",
  "jobTitle:'Full-Stack Developer | Software Engineer | IT Student'",
  "mainEntity:{'@id':personId}",
  "sameAs:[",
  "knowsAbout:[",
  "'@id':personId",
  "publisher:{'@id':personId}"
]){
  assert.ok(schema.includes(marker),'Missing or incorrect structured-data field: '+marker);
}

assert.ok(schema.includes("const siteUrl='https://mghalaosimi-web.vercel.app'")&&schema.includes("const personId=siteUrl+'/#person'"),'Person @id must be built from the canonical site origin.');
assert.ok(schema.includes("image:siteUrl+'/assets/images/mghal-profile-primary.jpg'"),'Person schema must point to the authentic profile portrait.');
assert.ok(schema.includes('https://orcid.org/0009-0000-6007-3170'),'The academic identifier must be linked in sameAs.');
assert.ok(schema.includes('https://github.com/mghalaosimi-web'),'The official GitHub organization must be linked in sameAs.');
assert.ok(schema.includes('Al-Manar College for Science and Technology'),'The confirmed academic affiliation must be represented accurately.');
assert.ok(layout.includes("images: [{url:profilePortrait,alt:"),'Root Open Graph preview must use the authentic portrait.');
assert.ok(layout.includes("images: [profilePortrait]"),'Root Twitter preview must use the authentic portrait.');
assert.ok(seo.includes("image='/assets/images/mghal-profile-primary.jpg'"),'Localized social previews must default to the authentic portrait.');

console.log('Structured-data tests passed: unified Person/ProfilePage/WebSite graph, name variants, verified profiles, academic affiliation, and authentic portrait previews.');
