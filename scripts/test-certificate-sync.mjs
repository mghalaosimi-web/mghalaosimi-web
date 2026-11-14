import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const page=readFileSync(new URL("../app/credentials/page.tsx",import.meta.url),"utf8");
const localeRoutes=readFileSync(new URL("../app/en/[[...path]]/page.tsx",import.meta.url),"utf8");
assert.ok(page.includes("export default async function CredentialsPage"),"Credentials must be rendered by the React route.");
assert.equal(Array.from({length:11},(_,i)=>"id:'cisco-"+String(i+1).padStart(2,'0')+"'").filter(marker=>page.includes(marker)).length,11,"All eleven owner-verified Cisco records must remain.");
assert.equal(Array.from({length:6},(_,i)=>"id:'edraak-"+String(i+1).padStart(2,'0')+"'").filter(marker=>page.includes(marker)).length,6,"All six Edraak certificates must remain.");
assert.ok(page.includes("id:'jsnad-01'"),"The JSNAD credential must remain.");
assert.ok(localeRoutes.includes("normalized==='credentials'"),"English credentials must use the same React credential archive.");
assert.ok(page.includes("credlyProfile")&&page.includes("edraakVerifyBase"),"Credential verification links must retain their official issuers.");
assert.doesNotMatch(page,/21 credentials|21 شهادة|14 Cisco|14 إنجازاً/i,"Stale credential totals must not return.");
assert.doesNotMatch(page,/additional Cisco record|سجل اعتماد إضافي/i,"Unsubstantiated placeholder credentials must not return.");
assert.doesNotMatch(page,/\.html/,"The React credentials page must not link to legacy HTML documents.");
console.log("Credential tests passed: 18 substantiated records, individual issuer verification, bilingual React route and no legacy HTML dependency.");
