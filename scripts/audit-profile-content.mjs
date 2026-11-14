import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

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
const siteSearch = read("../app/components/SiteSearch.tsx");
const databaseContent = read("../public/assets/database-content.js");
const publicCatalog = JSON.parse(read("../public/assets/projects/catalog.json"));
const publicSearchIndex = JSON.parse(read("../public/assets/search-index.json"));
const publicSitemap = read("../public/sitemap.xml");
const publicHomeAr = read("../public/index.html");
const publicHomeEn = read("../public/en/index.html");
const legacyHomeAr = read("../index.html");
const legacyHomeEn = read("../en/index.html");
const publicReadme = read("../README.md");
const publicAssetReadme = read("../public/README.md");
const publicAuditDoc = read("../docs/portfolio-audit.md");
const localizationMigration = read("../mghal-backend/migrations/0003_project_localization.sql");
const arLabs = read("../app/labs/LabsExplorer.tsx");
const enLabs = read("../app/labs/LabsExplorerEnglish.tsx");
const contentOsAr = read("../public/projects/mghal-content-os/index.html");
const contentOsEn = read("../public/en/projects/mghal-content-os/index.html");
const manarAr = read("../public/projects/manar-schedule-system/index.html");
const almanarAr = read("../public/projects/almanar-schedule-system/index.html");
const manarEn = read("../public/en/projects/manar-schedule-system/index.html");
const almanarEn = read("../public/en/projects/almanar-schedule-system/index.html");
const arListing = read("../public/projects.html");
const enListing = read("../public/en/projects.html");
const arRootListing = read("../projects.html");
const enRootListing = read("../en/projects.html");

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

const expectedSlugs = ["abdulmalik-erp","abdulmalik-store-pro","ramzei-erp","manar-schedule-system","waynah","mghal-digital-os","mghal-content-os","debwan-live","alnasr-supermarket-erp","yemen-ai","academic-os2","ciphersphere","abdulmalik-store-management","academicos","almanar-schedule-system","focusflow","mghal-digital-automation","mghal-official-website","cryptolab-x"];
const actualSlugs = [...projects.matchAll(/slug:'([^']+)'/g)].map(match => match[1]);
const cryptoLab = projects.slice(projects.indexOf("slug:'cryptolab-x'"), projects.indexOf("}", projects.indexOf("slug:'cryptolab-x'")));
assert.ok(cryptoLab.includes("category:'cyber-defense'") && cryptoLab.includes("مكتمل وفق إفادة المالك") && cryptoLab.includes("CipherSphere") && !cryptoLab.includes("repository:"), "CryptoLab-X must remain a separate owner-confirmed project without invented public source or stack claims.");
assert.deepEqual(actualSlugs, expectedSlugs, "The public project registry must contain exactly the 19 approved public records in priority order.");
const englishStatuses = [...enProjects.matchAll(/status:'([^']+)'/g)].map(match => match[1]);
assert.equal(englishStatuses.length, 19, "English project explorer must provide an explicit status for every public project.");
assert.ok(englishStatuses.every(status => !/[\u0600-\u06FF]/.test(status)), "English project statuses must not fall back to Arabic registry values.");
assert.ok(projects.includes("slug:'manar-schedule-system'") && projects.includes("slug:'almanar-schedule-system'"), "The two academic scheduling repositories must remain separate.");
const publicRepositories = ["abdulmalik-erp","abdulmalik-store-pro","ramzei-erp","manar-schedule-system","waynah","mghal-digital-os","mghal-content-os","debwan-live","alnasr-supermarket-erp","yemen-ai","academic-os2","ciphersphere","abdulmalik-store-management","academicos","almanar-schedule-system","focusflow","mghal-digital-automation","mghal-official-website"];
for (const slug of publicRepositories) assert.ok(projects.includes("slug:'" + slug + "'") && projects.slice(projects.indexOf("slug:'" + slug + "'"), projects.indexOf("}", projects.indexOf("slug:'" + slug + "'"))).includes("repository:'https://github.com/mghalaosimi-web/"), "Missing verified public repository for " + slug);
assert.equal((projects.match(/repository:'https:\/\/github\.com\/mghalaosimi-web\//g) || []).length, 18, "All 18 public repository URLs should be represented without exposing private repository details.");
const legacyStaticSlugs = ["waynah","focusflow","mghal-content-os","manar-schedule-system","almanar-schedule-system","yemen-ai","ciphersphere","mghal-official-website"];
for (const slug of legacyStaticSlugs) {
  assert.ok(existsSync(new URL("../public/projects/" + slug + "/index.html", import.meta.url)), "Missing Arabic project detail route for " + slug);
  assert.ok(existsSync(new URL("../public/en/projects/" + slug + "/index.html", import.meta.url)), "Missing English project detail route for " + slug);
}
assert.ok(existsSync(new URL("../app/projects/[slug]/page.tsx", import.meta.url)), "AL-NASR must be served through the dynamic Next.js project detail route.");
assert.ok(contentOsAr.includes("M.GH.AL Content OS") && contentOsEn.includes("M.GH.AL Content OS"), "The Content OS detail pages must use the approved project name.");
assert.ok(!contentOsAr.includes("Content Studio") && !contentOsEn.includes("Content Studio"), "The outdated Content Studio label must not remain.");
for (const [name, listing] of [["Arabic public listing", arListing], ["English public listing", enListing], ["Arabic root listing", arRootListing], ["English root listing", enRootListing]]) {
  assert.ok(listing.includes("M.GH.AL Content OS") && !listing.includes("Content Studio"), name + ": project list must use the approved Content OS name.");
}
assert.ok(manarAr.includes("<h1>Manar Schedule System</h1>") && almanarAr.includes("<h1>Al-Manar Schedule System</h1>"), "Arabic project details must keep the two scheduling systems distinct.");
assert.ok(manarEn.includes("<h1>Manar Schedule System</h1>") && almanarEn.includes("<h1>Al-Manar Schedule System</h1>"), "English project details must keep the two scheduling systems distinct.");
assert.ok(research.includes("Transaction-Aware Authorization and Bounded Execution for AI Agents in ERP Systems"), "Research page must reflect the selected AI/ERP research direction.");
assert.ok(research.includes("Research direction in preparation · Not published"), "Research must not be represented as published.");

assert.ok(enContact.includes("https://www.linkedin.com/in/mohammed-alaosimi-038155443/"), "English contact must use the verified LinkedIn URL.");
assert.ok(enContact.includes("https://www.credly.com/users/mohammed-ghaleb-al-aosimi"), "English contact must use the owner's Credly profile.");
assert.ok(arContact.includes("https://www.linkedin.com/in/mohammed-alaosimi-038155443/"), "Arabic contact must use the verified LinkedIn URL.");
assert.ok(arContact.includes("https://www.credly.com/users/mohammed-ghaleb-al-aosimi"), "Arabic contact must use the owner's Credly profile.");
for (const [name, source] of [["Arabic contact", arContact], ["English contact", enContact]]) {
  assert.ok(source.includes("https://wa.me/967776778675") && source.includes("tel:+967776778675"), name + ": primary owner-provided WhatsApp and phone links must be present.");
  assert.ok(source.includes("https://wa.me/967773775747") && source.includes("tel:+967773775747"), name + ": secondary owner-provided WhatsApp and phone links must be present.");
}
for (const [name, source] of [["Arabic contact", arContact], ["English contact", enContact]]) {
  for (const term of ["A_AB_ALK","users/mghalaosimi-web","mghalaosimi-web-399676409","Arfat"]) assert.ok(!source.includes(term), name + ": unverified reference contact detail leaked: " + term);
}
for (const [name, source] of [["English about", enAbout], ["English home", enHome], ["English projects", enProjects], ["English contact", enContact]]) {
  assert.ok(!/href=["\']\/en\/(?!projects\/)/.test(source), name + ": only the explicit /en/projects/:slug static detail route is allowed; other English navigation must use locale-cookie root routes.");
  assert.ok(!/href=["']\/en\/(?!projects\/)/.test(source), name + ": only the explicit /en/projects/:slug static detail route is allowed; other English navigation must use locale-cookie root routes.");
}
assert.ok(enHome.includes("/en/projects/") && enProjects.includes("/en/projects/"), "English project detail links must use the English static detail route.");
assert.ok(enAbout.includes('href="/en/projects/waynah"'), "English profile project links must preserve English detail routing.");
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
console.log("Profile-content audit passed: owner identity, IT degree, official college, 19-public-project registry, AI/ERP research, accurate contacts, localized routes, and private-project exclusion.");


const privateProjectMarkers = ["humanity-system", "mghal-esdp", "Humanity System", "M.GH.AL ESDP"];
for (const [name, source] of [["project registry", projects], ["Arabic about", arAbout], ["English about", enAbout], ["Arabic home", arHome], ["English home", enHome], ["Arabic project listing", arListing], ["English project listing", enListing], ["Arabic legacy listing", arRootListing], ["English legacy listing", enRootListing], ["site search", siteSearch], ["database media map", databaseContent], ["public sitemap", publicSitemap], ["Arabic static home", publicHomeAr], ["English static home", publicHomeEn], ["Arabic legacy home", legacyHomeAr], ["English legacy home", legacyHomeEn], ["README", publicReadme], ["public README asset", publicAssetReadme], ["portfolio audit", publicAuditDoc], ["public project catalogue", JSON.stringify(publicCatalog)], ["public search index", JSON.stringify(publicSearchIndex)]]) {
  for (const marker of privateProjectMarkers) assert.ok(!source.includes(marker), name + ": private project reference leaked: " + marker);
}
assert.ok(!existsSync(new URL("../public/assets/projects/repository-inventory.json", import.meta.url)), "Private repository inventory must not be shipped as a public asset.");
for (const slug of ["humanity-system", "mghal-esdp"]) {
  for (const language of ["ar", "en"]) assert.ok(!existsSync(new URL("../public/" + (language === "en" ? "en/" : "") + "projects/" + slug + "/index.html", import.meta.url)), "Private static project page must not exist: " + slug + " / " + language);
}

const indexedPublicProjects = publicSearchIndex.filter(record => /^\/projects\/[a-z0-9-]+\/$/.test(record.url));
assert.equal(indexedPublicProjects.length, 19, "All public project records must be present in the public search index.");
assert.ok(indexedPublicProjects.some(record => record.title === "CryptoLab-X"), "CryptoLab-X must be indexed as a separate public project.");
const privateMigrationRows = localizationMigration.split("\n").filter(line => line.includes("WHERE slug='humanity-system'") || line.includes("WHERE slug='mghal-esdp'"));
assert.equal(privateMigrationRows.length, 2, "Private project migration rows must remain available for database record continuity.");
for (const line of privateMigrationRows) {
  assert.ok(line.includes("سجل مشروع خاص غير منشور."), "Private migration rows must use generic public-safe descriptions.");
  for (const detail of ["Next.js", "Prisma", "Windows", "Android", "RBAC", "Capacitor", "com.mghal"]) assert.ok(!line.includes(detail), "Private implementation detail leaked into migration: " + detail);
}
