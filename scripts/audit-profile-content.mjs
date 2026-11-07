import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const arAbout = read("../app/about/AboutTabs.tsx");
const enAbout = read("../app/about/AboutTabsEnglish.tsx");
const arContact = read("../app/contact/page.tsx");
const enContact = read("../app/contact/ContactPageEnglish.tsx");
const enHome = read("../app/HomePageEnglish.tsx");
const arHome = read("../app/page.tsx");
const arProjects = read("../app/projects/ProjectsPageArabic.tsx");
const enProjects = read("../app/projects/ProjectsExplorerEnglish.tsx");
const research = read("../app/research/page.tsx");
const projects = read("../data/projects.ts");
const arLabs = read("../app/labs/LabsExplorer.tsx");
const enLabs = read("../app/labs/LabsExplorerEnglish.tsx");

assert.ok(arAbout.includes("محمد غالب العصيمي"), "Arabic profile must use the owner's exact name.");
assert.ok(arAbout.includes("بكالوريوس تقنية المعلومات"), "Arabic profile must state the confirmed IT degree.");
assert.ok(enAbout.includes("Mohammed Ghaleb") && enAbout.includes("Alaosimi"), "English profile must use the owner's exact name.");
assert.ok(enAbout.includes("Bachelor’s in Information Technology"), "English profile must state the confirmed IT degree.");
assert.ok(enAbout.includes("Al-Manar College for Science and Technology"), "English profile must use the official college name.");

const forbiddenIdentity = ["الكاملي", "أمن سيبراني وشبكات", "بكالوريوس الأمن السيبراني", "Arfat", "Alkamli", "Cybersecurity and Networks", "Bachelor’s in Cybersecurity", "AEGIS-TITAN", "Offline Academic Assistant"];
for (const [name, source] of [["Arabic about", arAbout], ["English about", enAbout], ["Arabic home", arHome], ["English home", enHome], ["Arabic projects", arProjects], ["English projects", enProjects], ["Research", research], ["Arabic labs", arLabs], ["English labs", enLabs]]) {
  for (const term of forbiddenIdentity) assert.ok(!source.includes(term), name + ": unsupported/reference-owner content leaked: " + term);
}
assert.ok(arAbout.includes("الأمن السيبراني اهتمام معرفي إضافي"), "Cybersecurity may only be represented as an additional learning interest.");
assert.ok(enAbout.includes("not as my academic degree specialization"), "English profile must distinguish cybersecurity interest from academic degree.");
assert.ok(arAbout.includes("active==='learning'?<Learning/>") && enAbout.includes("active==='learning'?<Learning/>"), "Unverified leadership tab must be replaced by learning content.");

const expectedSlugs = ["waynah","humanity-system","focusflow","mghal-content-os","manar-schedule-system","al-manar-schedule-system","yemen-ai-platform","ciphersphere","mghal-esdp","mghal-official-website"];
const actualSlugs = [...projects.matchAll(/slug:'([^']+)'/g)].map(match => match[1]);
assert.deepEqual(actualSlugs, expectedSlugs, "The project registry must contain exactly the ten owner-confirmed projects in the approved order.");
assert.ok(projects.includes("slug:'manar-schedule-system'") && projects.includes("slug:'al-manar-schedule-system'"), "The two academic scheduling projects must remain separate.");
assert.match(projects, /slug:'mghal-esdp'[^}]*status:'خاص · غير منشور'/, "ESDP must remain private and unpublished.");
assert.ok(research.includes("Transaction-Aware Authorization and Bounded Execution for AI Agents in ERP Systems"), "Research page must reflect the selected AI/ERP research direction.");
assert.ok(research.includes("Research direction in preparation · Not published"), "Research must not be represented as published.");

assert.ok(enContact.includes("https://www.linkedin.com/in/mohammed-alaosimi-038155443/"), "English contact must use the verified LinkedIn URL.");
assert.ok(enContact.includes("https://www.credly.com/users/mohammed-ghaleb-al-aosimi"), "English contact must use the owner's Credly profile.");
assert.ok(arContact.includes("https://www.linkedin.com/in/mohammed-alaosimi-038155443/"), "Arabic contact must use the verified LinkedIn URL.");
assert.ok(arContact.includes("https://www.credly.com/users/mohammed-ghaleb-al-aosimi"), "Arabic contact must use the owner's Credly profile.");
for (const [name, source] of [["Arabic contact", arContact], ["English contact", enContact]]) {
  for (const term of ["wa.me/","A_AB_ALK","users/mghalaosimi-web","mghalaosimi-web-399676409","Arfat"]) assert.ok(!source.includes(term), name + ": unverified reference contact detail leaked: " + term);
}
for (const [name, source] of [["English about", enAbout], ["English home", enHome], ["English projects", enProjects], ["English contact", enContact]]) {
  assert.ok(!/href=["']\/en\//.test(source), name + ": internal links must use cookie-localized root routes, not nonexistent /en app routes.");
}
for (const [name, source] of [["Arabic home", arHome], ["English home", enHome]]) {
  for (const oldPath of ["/projects.html","/skills.html","/certificates.html","/contact.html"]) assert.ok(!source.includes(oldPath), name + ": legacy static route remains in Next.js navigation: " + oldPath);
}
for (const [name, source] of [["Arabic projects", arProjects], ["English projects", enProjects], ["Arabic labs", arLabs], ["English labs", enLabs]]) {
  assert.ok(!source.includes("AEGIS"), name + ": reference-owner AEGIS branding remains.");
  assert.ok(!source.includes("__mghal_featured_disabled__"), name + ": disabled reference project sentinel remains.");
}
assert.ok(enHome.includes("Al-Manar College for Science and Technology"), "English homepage must use the official college name.");
assert.ok(enHome.includes("M.GH.AL"), "English homepage must use M.GH.AL identity branding.");
assert.ok(arContact.includes("M.GH.AL"), "Arabic contact page must use M.GH.AL identity branding.");
console.log("Profile-content audit passed: owner identity, IT degree, official college, ten-project registry, AI/ERP research, accurate contacts, localized routes, and no reference-owner identity/project residue.");
