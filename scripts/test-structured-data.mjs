import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout=readFileSync(new URL('../app/layout.tsx',import.meta.url),'utf8');
const schema=readFileSync(new URL('../lib/structured-data.ts',import.meta.url),'utf8');

assert.match(layout,/import \{siteJsonLd\} from '\.\.\/lib\/structured-data'/,'The shared Next.js shell must import the site JSON-LD graph.');
assert.match(layout,/type="application\/ld\+json"/,'The shared shell must emit structured data as JSON-LD.');
assert.match(layout,/JSON\.stringify\(siteJsonLd\(\)\)/,'The JSON-LD graph must be serialized into the page.');
assert.match(layout,/replace\(\/</g/,'JSON-LD serialization must escape less-than characters.');

for(const marker of [
  "'@type':'Person'",
  "'@type':'WebSite'",
  "name:'Mohammed Ghaleb Alaosimi'",
  "alternateName:['محمد غالب العصيمي','M.GH.AL']",
  "jobTitle:'Full-Stack Developer | Software Engineer | IT Student'",
  "sameAs:[",
  "knowsAbout:[",
  "'@id':personId",
  "publisher:{'@id':personId}"
]){
  assert.ok(schema.includes(marker),'Missing or incorrect structured-data field: '+marker);
}

assert.ok(schema.includes('https://mghalaosimi-web.vercel.app/#person'),'Person @id must use the canonical site origin.');
assert.ok(schema.includes('https://orcid.org/0009-0000-6007-3170'),'The academic identifier must be linked in sameAs.');
assert.ok(schema.includes('https://github.com/mghalaosimi-web'),'The official GitHub organization must be linked in sameAs.');
assert.ok(schema.includes('Al-Manar College for Science and Technology'),'The confirmed academic affiliation must be represented accurately.');

console.log('Structured-data tests passed: Person and WebSite JSON-LD graph, canonical IDs, verified profiles, and academic affiliation.');
