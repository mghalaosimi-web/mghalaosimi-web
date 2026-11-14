import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(file)=>readFileSync(new URL(file,import.meta.url),"utf8");
const ar=read("../app/page.tsx");
const en=read("../app/HomePageEnglish.tsx");
const routes=read("../app/en/[[...path]]/page.tsx");
const layout=read("../app/layout.tsx");

assert.ok(ar.includes("function HomeArabic()")&&ar.includes('className="home-v2"'),"Arabic homepage must be a React page.");
assert.ok(en.includes('className="home-v2"')&&en.includes("export default function HomePageEnglish"),"English homepage must be a React component.");
for(const marker of ["hv-hero","hv-biography","hv-work","hv-contact"])assert.ok(ar.includes(marker),"Arabic React homepage is missing "+marker);
for(const marker of ["hv-hero","hv-work","hv-contact"])assert.ok(en.includes(marker),"English React homepage is missing "+marker);
assert.ok(routes.includes("if(path.length===0)return <HomePageEnglish/>"),"The /en homepage must resolve through the React route tree.");
assert.ok(layout.includes("<SiteHeader isEn={isEn}/>"),"The shared React site shell must wrap the homepage.");
assert.doesNotMatch(ar,/newsletter|subscribe by email|اشترك بالبريد/i);
assert.doesNotMatch(en,/newsletter|subscribe by email|اشترك بالبريد/i);
assert.doesNotMatch(ar,/sample post|مقال تجريبي/i);
assert.doesNotMatch(en,/sample post|مقال تجريبي/i);
console.log("React homepage tests passed: Arabic and English pages, shared shell, key sections and no fabricated content.");
