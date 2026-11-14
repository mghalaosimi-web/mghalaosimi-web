import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import path from "node:path";

const read=(file)=>readFileSync(new URL(file,import.meta.url),"utf8");
const arAbout=read("../app/about/AboutTabs.tsx");
const enAbout=read("../app/about/AboutTabsEnglish.tsx");
const arHome=read("../app/page.tsx");
const enHome=read("../app/HomePageEnglish.tsx");
const arProjects=read("../app/projects/ProjectsPageArabic.tsx");
const enProjects=read("../app/projects/ProjectsExplorerEnglish.tsx");
const research=read("../app/research/page.tsx");
const registry=read("../data/projects.ts");
const detail=read("../app/projects/[slug]/page.tsx");
const search=read("../app/components/SiteSearch.tsx");
const searchIndex=JSON.parse(read("../public/assets/search-index.json"));
const sitemap=read("../app/sitemap.ts");
const englishRoutes=read("../app/en/[[...path]]/page.tsx");
const admin=read("../app/admin/page.tsx");
const auditDoc=read("../docs/portfolio-audit.md");

assert.ok(arAbout.includes("محمد غالب العصيمي"),"Arabic profile must use the confirmed public name.");
assert.ok(arAbout.includes("بكالوريوس تقنية المعلومات"),"Arabic profile must identify the IT degree accurately.");
assert.ok(enAbout.includes("Mohammed Ghaleb")&&enAbout.includes("Alaosimi"),"English profile must use the confirmed public name.");
assert.ok(enAbout.includes("Bachelor’s in Information Technology"),"English profile must identify the IT degree accurately.");
assert.ok(enAbout.includes("Al-Manar College for Science and Technology"),"English profile must use the confirmed college name.");
assert.ok(arAbout.includes("الأمن السيبراني اهتمام معرفي إضافي"),"Cybersecurity must remain an additional learning interest, not the degree.");
assert.ok(enAbout.includes("not as my academic degree specialization"),"English profile must distinguish cybersecurity interest from the degree.");
assert.ok(arAbout.includes("active==='learning'?<Learning/>")&&enAbout.includes("active==='learning'?<Learning/>"),"The public profile must use the learning tab, not unsupported leadership claims.");

const expectedSlugs=["abdulmalik-erp","abdulmalik-store-pro","ramzei-erp","manar-schedule-system","waynah","mghal-digital-os","mghal-content-os","debwan-live","alnasr-supermarket-erp","yemen-ai","academic-os2","ciphersphere","abdulmalik-store-management","academicos","almanar-schedule-system","focusflow","mghal-digital-automation","mghal-official-website","cryptolab-x"];
const slugs=[...registry.matchAll(/slug:'([^']+)'/g)].map(match=>match[1]);
const detailSlugs=[...detail.matchAll(/slug:'([^']+)'/g)].map(match=>match[1]);
assert.deepEqual(slugs,expectedSlugs,"Public React project registry must preserve the approved priority order.");
assert.deepEqual(detailSlugs,expectedSlugs,"Every public React project must have a matching detail page.");
assert.equal((registry.match(/repository:'https:\/\/github\.com\/mghalaosimi-web\//g)||[]).length,18,"Exactly eighteen public repository links must be represented.");
assert.ok(registry.includes("slug:'cryptolab-x'")&&registry.includes("slug:'ciphersphere'"),"CryptoLab-X and CipherSphere must remain distinct projects.");
assert.ok(registry.includes("M.GH.AL Content OS")&&!registry.includes("Content Studio"),"The approved Content OS name must be used.");
assert.ok(arProjects.includes("data-project-slug")&&enProjects.includes("data-project-slug"),"Both React project explorers must expose project identifiers.");
assert.ok(research.includes("Transaction-Aware Authorization and Bounded Execution for AI Agents in ERP Systems"),"The research page must retain the selected AI/ERP research direction.");

const projectRecords=searchIndex.filter(record=>/^\/projects\/[a-z0-9-]+$/.test(record.url));
assert.equal(projectRecords.length,19,"All nineteen public project records must be searchable.");
assert.ok(projectRecords.some(record=>record.title==="CryptoLab-X"&&record.url==="/projects/cryptolab-x"),"CryptoLab-X must have its own public search record.");
assert.ok(!searchIndex.some(record=>/\.html/i.test(record.url)),"The search index must contain no legacy HTML URLs.");
assert.ok(!search.includes("humanity-system")&&!search.includes("mghal-esdp"),"Search must not expose private project routes.");
assert.ok(!searchIndex.some(record=>/humanity-system|mghal-esdp|humanity system/i.test(JSON.stringify(record))),"Private project details must not enter the public search index.");
assert.ok(!registry.includes("humanity-system")&&!registry.includes("mghal-esdp"),"Private project records must not enter the public React registry.");
assert.ok(!detail.includes("humanity-system")&&!detail.includes("mghal-esdp"),"Private project detail routes must remain unavailable.");
assert.ok(!sitemap.includes("humanity-system")&&!sitemap.includes("mghal-esdp")&&!sitemap.includes(".html"),"The generated sitemap must include only clean public React routes.");
assert.ok(englishRoutes.includes("ProjectsExplorerEnglish")&&englishRoutes.includes("AboutTabsEnglish")&&englishRoutes.includes("ProjectDetail"),"English pages must use the same React page components.");
assert.ok(admin.includes("export default function AdminPage")&&admin.includes("<Script src=\"/assets/admin.js\""),"The owner dashboard must be routed through the React application.");
assert.ok(auditDoc.includes("private application database")&&auditDoc.includes("not mirrored into public HTML"),"The public content policy must keep private records out of public artifacts.");

const root=path.resolve(new URL("..",import.meta.url).pathname);
const htmlFiles=[];
function walk(directory){
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  if([".git","node_modules",".next"].includes(entry.name))continue;
  const full=path.join(directory,entry.name);
  if(entry.isDirectory())walk(full);
  else if(entry.name.toLowerCase().endsWith(".html"))htmlFiles.push(path.relative(root,full));
 }
}
walk(root);
assert.deepEqual(htmlFiles,[],"No tracked legacy HTML page may remain: "+htmlFiles.join(", "));
console.log("Profile/content audit passed: verified identity, nineteen public projects, eighteen public repositories, private-project isolation, React routes, search and sitemap.");
