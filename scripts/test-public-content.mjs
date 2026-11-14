import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(file)=>readFileSync(new URL(file,import.meta.url),"utf8");
const credentials=read("../app/credentials/page.tsx");
const englishRoutes=read("../app/en/[[...path]]/page.tsx");
const contact=read("../app/contact/page.tsx");
const labs=read("../app/labs/LabsExplorer.tsx");
const labsEnglish=read("../app/labs/LabsExplorerEnglish.tsx");
const api=read("../mghal-backend/api-handler.mjs");
const engagement=read("../public/assets/social-engagement.js");

assert.equal(Array.from({length:11},(_,i)=>"id:'cisco-"+String(i+1).padStart(2,'0')+"'").filter(marker=>credentials.includes(marker)).length,11);
assert.equal(Array.from({length:6},(_,i)=>"id:'edraak-"+String(i+1).padStart(2,'0')+"'").filter(marker=>credentials.includes(marker)).length,6);
assert.ok(credentials.includes("id:'jsnad-01'"));
assert.ok(englishRoutes.includes("normalized==='credentials'")&&englishRoutes.includes("normalized==='labs'"));
assert.ok(contact.includes("ContactForm"),"The React contact route must retain its functional form.");
assert.ok(labs.includes("/api/public/articles")||labs.includes("published-articles"),"Arabic labs must retain the published article data surface.");
assert.ok(labsEnglish.includes("/api/public/articles")||labsEnglish.includes("published-articles"),"English labs must retain the published article data surface.");
for(const route of ['/api/public/followers/status','/api/public/followers/count','/api/public/followers','/api/public/reactions','/api/public/comments'])assert.ok(api.includes(route),"Missing engagement API "+route);
assert.ok(engagement.includes("navigator.share"),"Share controls must retain native share support.");
assert.ok(engagement.includes("api/public/reactions"),"Project reaction controls must use the public API.");
assert.ok(englishRoutes.includes("achievements.html")&&englishRoutes.includes("showcase.html")&&englishRoutes.includes("resume.html"),"Old section paths must resolve to their React replacements.");
assert.ok(!read("../public/search-index.json").includes(".html"),"No legacy HTML URLs may be indexed.");
console.log("React public-content tests passed: credential evidence, contact workflow, article routes, engagement APIs and legacy route replacement.");
