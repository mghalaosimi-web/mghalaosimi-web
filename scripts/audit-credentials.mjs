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
      assert.match(logo[1], /\bsrc=["']https:\/\//i, language + ": issuer logo must use HTTPS.");
      assert.match(logo[1], /\balt=["'][^"']+["']/i, language + ": issuer logo needs alt text.");
      assert.match(logo[1], /\bloading=["']lazy["']/i, language + ": issuer logo must be lazy-loaded.");
      assert.match(logo[1], /\bdecoding=["']async["']/i, language + ": issuer logo must decode asynchronously.");
    }
  }
  assert.deepEqual(counts, expected, language + ": credential issuer counts do not match the verified register.");
  assert.equal(Object.values(counts).reduce((sum, value) => sum + value, 0), 18, language + ": expected 18 credentials.");

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
];
for (const page of pages) {
  const html = readFileSync(new URL(page.path, import.meta.url), "utf8");
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
  if (page.language === "en") assert.ok(!html.includes('alt="صورة أصلية لشهادة'), "English page has Arabic image alt text");
}
console.log("Extended credential checks passed: all Edraak IDs/dates, original PDF assets, 18-entry JSON-LD and English alt text.");
console.log("Credential audit passed: 18 records per language (11 Cisco, 6 Edraak, 1 JSNAD), all 11 Cisco badges match the owner's public Credly wallet, and no reference-owner badge IDs remain.");
