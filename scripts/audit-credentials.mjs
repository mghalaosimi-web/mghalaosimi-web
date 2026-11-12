import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

const pages = [
  { path: "../public/certificates.html", language: "ar" },
  { path: "../public/en/certificates.html", language: "en" },
];
const expected = { cisco: 11, edraak: 6, openjs: 1 };
const ownerBadgeIds = [
  "926baf56-48f3-4f9d-b86d-77b2c538663c",
  "eaec19be-fa80-429e-8055-5bbd260b0776",
  "96acb061-5011-4c45-89e3-07f8bf43980c",
  "31c303bf-725d-4061-b6b1-2dfb76d6ad3f",
  "dd87ef5f-4c10-4d9d-928b-cf0a995c5ccb",
  "6e1ad458-e752-4064-a997-27092902f884",
  "327cec43-3807-4a02-b144-c72407bdc4f3",
  "8d8f1cba-4a98-4cd5-b3b9-fe4233f085b1",
  "73d091cc-193d-4b57-b8e0-e64340df62c7",
  "2319c9be-ea2f-44ff-a256-d431cd48404e",
  "35fadd6d-f9d6-4d4f-b151-464d30637bbb",
];
const foreignBadgeIds = [
  "23bda189-2470-4ce0-8065-ee904979ba21",
  "e16ca722-84d2-4da2-ad1f-46e972453890",
  "2f9902ec-e035-4b56-bf1b-42c66f05ed75",
  "de9c51d6-2eb6-4f7e-833a-31670170e278",
  "43943e68-05c5-40ea-93d1-d2a26e07ced0",
  "4e822fcc-656e-4891-bc51-666ca95cd6e8",
  "f0520c01-63aa-4440-9df4-69c7303d8762",
  "a370a36f-7ce1-4531-b44b-b909e56ee52d",
  "dd68b74c-65f9-468f-9a51-3bb78adad239",
];
const ciscoBadges = {
  "Hardware and Upgrade Support": { id: "926baf56-48f3-4f9d-b86d-77b2c538663c", date: "2026-08-02", ar: "2 أغسطس 2026", en: "2 Aug 2026", image: "https://images.credly.com/size/340x340/images/94cbdf0d-3e44-44b2-b213-866fe22aa7d5/blob" },
  "Cybersecurity Defense Analyst Career Path": { id: "eaec19be-fa80-429e-8055-5bbd260b0776", date: "2026-07-29", ar: "29 يوليو 2026", en: "29 Jul 2026", image: "https://images.credly.com/size/340x340/images/a8d6cb9c-e0e3-4705-aab0-160cc9d10a11/blob" },
  "Operating Systems Support": { id: "96acb061-5011-4c45-89e3-07f8bf43980c", date: "2026-07-29", ar: "29 يوليو 2026", en: "29 Jul 2026", image: "https://images.credly.com/size/340x340/images/70cc28ef-542c-4ce2-8bad-e8d95daf5138/blob" },
  "English for IT 1": { id: "31c303bf-725d-4061-b6b1-2dfb76d6ad3f", date: "2026-07-27", ar: "27 يوليو 2026", en: "27 Jul 2026", image: "https://images.credly.com/size/340x340/images/77b1ea15-6287-4d97-8ecd-c5afa2d137ea/image.png" },
  "Junior Cybersecurity Analyst Career Path": { id: "dd87ef5f-4c10-4d9d-928b-cf0a995c5ccb", date: "2026-07-27", ar: "27 يوليو 2026", en: "27 Jul 2026", image: "https://images.credly.com/size/340x340/images/441578ec-c0f3-46cc-95fc-86b27e90cf4f/image.png" },
  "Networking Basics": { id: "6e1ad458-e752-4064-a997-27092902f884", date: "2026-07-27", ar: "27 يوليو 2026", en: "27 Jul 2026", image: "https://images.credly.com/size/340x340/images/5bdd6a39-3e03-4444-9510-ecff80c9ce79/image.png" },
  "Security and Connectivity Support": { id: "327cec43-3807-4a02-b144-c72407bdc4f3", date: "2026-07-27", ar: "27 يوليو 2026", en: "27 Jul 2026", image: "https://images.credly.com/size/340x340/images/a42c5fcd-6617-429c-b4a9-8805310e0b10/blob" },
  "Python Essentials 1": { id: "8d8f1cba-4a98-4cd5-b3b9-fe4233f085b1", date: "2026-07-26", ar: "26 يوليو 2026", en: "26 Jul 2026", image: "https://images.credly.com/size/340x340/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/image.png" },
  "Operating Systems Basics": { id: "73d091cc-193d-4b57-b8e0-e64340df62c7", date: "2026-07-25", ar: "25 يوليو 2026", en: "25 Jul 2026", image: "https://images.credly.com/size/340x340/images/dcdf1a3c-2594-4f4c-a33a-050b4bca58b5/image.png" },
  "IT Customer Support Basics": { id: "2319c9be-ea2f-44ff-a256-d431cd48404e", date: "2026-07-24", ar: "24 يوليو 2026", en: "24 Jul 2026", image: "https://images.credly.com/size/340x340/images/474a03c6-b5e1-44df-b313-adf0fed6c531/blob" },
  "Introduction to Modern AI": { id: "35fadd6d-f9d6-4d4f-b151-464d30637bbb", date: "2026-07-23", ar: "23 يوليو 2026", en: "23 Jul 2026", image: "https://images.credly.com/size/340x340/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/blob" },
};
const credentialsRoute = readFileSync(new URL("../app/credentials/page.tsx", import.meta.url), "utf8");
assert.match(credentialsRoute, /redirect\(en \? '\/en\/certificates\.html' : '\/certificates\.html'\)/, "Next.js credentials route must redirect to the audited bilingual pages.");
for (const id of foreignBadgeIds) assert.ok(!credentialsRoute.includes(id), "A reference-owner badge ID leaked into app/credentials/page.tsx: " + id);

function extractSection(html, startId, endId) {
  const start = html.indexOf('id="' + startId + '"');
  assert.notEqual(start, -1, "Missing " + startId + " section.");
  const end = endId ? html.indexOf('id="' + endId + '"', start + 1) : html.indexOf("</main>", start);
  assert.notEqual(end, -1, "Missing end boundary after " + startId + ".");
  return html.slice(start, end);
}

function inspectPage(path, language) {
  const html = readFileSync(new URL(path, import.meta.url), "utf8");
  assert.ok(html.includes('lang="' + language + '"'), language + ": incorrect document language.");
  const sections = {
    cisco: extractSection(html, "cisco-credentials", "edraak-credentials"),
    edraak: extractSection(html, "edraak-credentials", "openjs-credentials"),
    openjs: extractSection(html, "openjs-credentials", null),
  };
  const counts = {};
  for (const [issuer, section] of Object.entries(sections)) {
    const cards = [...section.matchAll(/<article\b[^>]*class=["'][^"']*\bcredential-card\b[^"']*["'][^>]*>[\s\S]*?<\/article>/gi)];
    counts[issuer] = cards.length;
    for (const [index, match] of cards.entries()) {
      const card = match[0];
      const issuerBadge = card.match(/<div\b[^>]*class=["'][^"']*\bissuer-badge\s+([a-z0-9-]+)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
      assert.ok(issuerBadge, language + ": " + issuer + " card " + (index + 1) + " has no issuer logo.");
      assert.equal(issuerBadge[1].toLowerCase(), issuer, language + ": issuer logo class mismatch.");
      const logo = issuerBadge[2].match(/<img\b([^>]*)>/i);
      assert.ok(logo, language + ": issuer logo image missing.");
      if (issuer === "cisco") assert.match(logo[1], /\bsrc=["\']\/assets\/issuers\/cisco-logo\.svg["\']/i, language + ": Cisco issuer logo must use the repository asset.");
      else assert.match(logo[1], /\bsrc=["\']https:\/\//i, language + ": external issuer logos must use HTTPS.");
      assert.match(logo[1], /\balt=["'][^"']+["']/i, language + ": issuer logo needs alt text.");
      assert.match(logo[1], /\bloading=["']lazy["']/i, language + ": issuer logo must be lazy-loaded.");
      assert.match(logo[1], /\bdecoding=["']async["']/i, language + ": issuer logo must decode asynchronously.");
    }
  }
  assert.deepEqual(counts, expected, language + ": credential issuer counts do not match the verified register.");
  assert.equal(Object.values(counts).reduce((sum, value) => sum + value, 0), 18, language + ": expected 18 credentials.");


  for (const [title, badge] of Object.entries(ciscoBadges)) {
    const titleIndex = html.indexOf("<h3>" + title + "</h3>");
    assert.notEqual(titleIndex, -1, language + ": missing Cisco title " + title);
    const cardStart = html.lastIndexOf("<article", titleIndex);
    const cardEnd = html.indexOf("</article>", titleIndex);
    const card = html.slice(cardStart, cardEnd);
    assert.ok(card.includes("https://www.credly.com/badges/" + badge.id + "/public_url"), language + ": badge ID is not mapped to " + title);
    assert.ok(card.includes(language === "ar" ? badge.ar : badge.en), language + ": issue date mismatch for " + title);
    assert.ok(card.includes('src="' + badge.image + '"'), language + ": official Credly badge image mismatch for " + title);
    assert.ok(card.includes(language === "ar" ? "شارة Credly الأصلية لاعتماد " + title : "Official Credly badge for " + title), language + ": badge alt text mismatch for " + title);
  }

  for (const id of ownerBadgeIds) {
    assert.ok(html.includes("https://www.credly.com/badges/" + id + "/public_url"), language + ": missing owner-verified Credly badge " + id);
  }
  for (const id of foreignBadgeIds) {
    assert.ok(!html.includes(id), language + ": another person's Credly badge leaked into this page: " + id);
  }
  return new Set(ownerBadgeIds);
}

const arabic = inspectPage(pages[0].path, "ar");
const english = inspectPage(pages[1].path, "en");
assert.deepEqual([...english].sort(), [...arabic].sort(), "Arabic and English pages must expose the same owner-verified Cisco badges.");
const edraakBadges = {
  "UI/UX Design": ["6addfdb9d4ce42cbb6581c5ad7798421", "2 أغسطس 2026", "2 Aug 2026"],
  "Communications Skills": ["e3d641d030654b5ea5a62a0011a80f41", "29 يوليو 2026", "29 Jul 2026"],
  "Interaction Design Fundamentals": ["b774c07893ef4cacb20a6271fcc126c3", "2 أغسطس 2026", "2 Aug 2026"],
  "UX Research": ["528490ad79e14aefb6f42e361200d20d", "29 يوليو 2026", "29 Jul 2026"],
  "UX Design": ["261ba96416f847dea412232020b915ec", "27 يوليو 2026", "27 Jul 2026"],
  "User Interface Design Principles": ["39ab850762d242e4aba085047a34a440", "2 أغسطس 2026", "2 Aug 2026"],
};
const originalPdfs = [
  "/assets/certificates/Hardware_and_Upgrade_Support_certificate_m-gh-alaosimi-gmail-com_bc68bb11-3b72-420d-877a-a92139aff2f6.pdf",
  "/assets/certificates/JuniorCybersecurityAnalystUpdate20260727-21-iou924.pdf",
  "/assets/certificates/NetworkingBasicsUpdate20260727-21-xz9ceq.pdf",
  "/assets/certificates/SecurityandConnectivitySupportv120260727-21-51cp9q.pdf",
  "/assets/certificates/PythonEssentials1Update20260727-20-xydgji.pdf",
  "/assets/certificates/OperatingSystemsBasicsUpdate20260727-20-mcda4y.pdf",
  "/assets/certificates/IT_Customer_Support_Basics_certificate_m-gh-alaosimi-gmail-com_c21859f1-476d-49bb-a798-ac1479307855.pdf",
  "/assets/certificates/IntrotoModernAIUpdate20260723-21-kproqx.pdf",
  "/assets/certificates/uiux-v1_certificate.PDF",
  "/assets/certificates/interactiondesign-v1_certificate.PDF",
  "/assets/certificates/uxdesign-v1_certificate.PDF",
  "/assets/certificates/uidesign-v1_certificate.PDF",
];
const originalImages = [
  "/assets/issuers/cisco-logo.svg",
  "/assets/certificates/interactiondesign-v1_certificate.png",
  "/assets/certificates/uxdesign-v1_certificate.png",
  "/assets/certificates/uidesign-v1_certificate.png",
];
for (const page of pages) {
  const html = readFileSync(new URL(page.path, import.meta.url), "utf8");
  assert.ok(!html.includes("/assets/certificates/1785613862401.png"), page.language + ": the unlabelled JSNAD archive image must not be presented as a verified credential.");
  for (const [title, [id, arDate, enDate]] of Object.entries(edraakBadges)) {
    const start = html.indexOf("<h3>" + title + "</h3>");
    assert.notEqual(start, -1, page.language + ": missing Edraak title " + title);
    const end = html.indexOf("</article>", start);
    const card = html.slice(start, end);
    assert.ok(card.includes("https://programs.edraak.org/learn/verify-certificate/" + id + "/?lang=en"), page.language + ": missing Edraak verify URL for " + title);
    assert.ok(card.includes(page.language === "ar" ? arDate : enDate), page.language + ": missing Edraak date for " + title);
  }
  for (const pdf of originalPdfs) {
    assert.ok(html.includes(pdf), page.language + ": missing original PDF link " + pdf);
    assert.ok(existsSync(new URL("../public" + pdf, import.meta.url)), "Missing PDF asset " + pdf);
  }
  for (const image of originalImages) {
    assert.ok(html.includes(image), page.language + ": missing original Edraak image " + image);
    assert.ok(existsSync(new URL("../public" + image, import.meta.url)), "Missing Edraak image asset " + image);
  }
  const jsonOpen = '<script type="application/ld+json">';
  const jsonStart = html.indexOf(jsonOpen);
  assert.notEqual(jsonStart, -1, page.language + ": JSON-LD missing");
  const payloadStart = jsonStart + jsonOpen.length;
  const payloadEnd = html.indexOf("</script>", payloadStart);
  assert.notEqual(payloadEnd, -1, page.language + ": JSON-LD script is not closed");
  const json = JSON.parse(html.slice(payloadStart, payloadEnd));
  assert.equal(json["@type"], "Person");
  assert.equal(json.hasCredential.length, 18);
  assert.equal(json.hasCredential.filter(item => item.recognizedBy?.name === "Cisco Networking Academy").length, 11);
  assert.equal(json.hasCredential.filter(item => item.recognizedBy?.name === "Edraak").length, 6);
  assert.ok(json.hasCredential.some(item => item.identifier?.value === "JSNAD-ALOSEIMI-20241112"));
  assert.ok(html.includes("https://training.linuxfoundation.org/certification/verify/"), page.language + ": official JSNAD verifier link is missing.");
  if (page.language === "en") assert.ok(!html.includes('alt="صورة أصلية لشهادة'), "English page has Arabic image alt text");
}
const achievementsPages = [
  { path: "../public/achievements.html", language: "ar" },
  { path: "../public/en/achievements.html", language: "en" },
];
for (const page of achievementsPages) {
  const html = readFileSync(new URL(page.path, import.meta.url), "utf8");
  assert.ok(html.includes('lang="' + page.language + '"'), page.language + ": achievement page language mismatch.");
  assert.ok(html.includes("JSNAD-ALOSEIMI-20241112"), page.language + ": JSNAD record ID is missing.");
  assert.ok(html.includes("https://training.linuxfoundation.org/certification/verify/"), page.language + ": official JSNAD verification tool is missing.");
  assert.ok(html.includes(page.language === "ar" ? "18 سجلاً تعليمياً ومهنياً" : "18 recorded learning and professional credentials"), page.language + ": achievement total must be 18.");
  assert.ok(html.includes(page.language === "ar" ? "11 شارة رقمية موثقة الملكية" : "11 owner-verified Cisco digital badges"), page.language + ": Cisco total must be 11.");
  assert.ok(html.includes(page.language === "ar" ? "6 شهادات من إدراك" : "6 Edraak certificates"), page.language + ": Edraak total must be six.");
  assert.ok(!html.includes("14 from Cisco") && !html.includes("14 recorded Cisco") && !html.includes("14 شهادة واعتماداً من Cisco"), page.language + ": stale 14-Cisco count remains.");
  assert.ok(!html.includes("21 professional credentials") && !html.includes("21 شهادة واعتماداً مهنياً"), page.language + ": stale 21-credential total remains.");
}
console.log("Extended credential checks passed: all Edraak IDs/dates, original PDF assets, 18-entry JSON-LD and English alt text.");
console.log("Credential audit passed: 18 records per language (11 Cisco, 6 Edraak, 1 JSNAD), all 11 Cisco badges match the owner's public Credly wallet, and no reference-owner badge IDs remain.");
