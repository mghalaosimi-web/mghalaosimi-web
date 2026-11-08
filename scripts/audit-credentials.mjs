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
assert.ok(credentialsRoute.includes("export default async function CredentialsPage"), "Next.js credentials route must render the native credential archive.");
assert.equal(Array.from({length:11},(_,i)=>"id:'cisco-"+String(i+1).padStart(2,'0')+"'").filter(marker=>credentialsRoute.includes(marker)).length,11,"Native archive must include all eleven owner-verified Cisco records.");
assert.equal(Array.from({length:6},(_,i)=>"id:'edraak-"+String(i+1).padStart(2,'0')+"'").filter(marker=>credentialsRoute.includes(marker)).length,6,"Native archive must include all six Edraak certificates.");
assert.ok(credentialsRoute.includes("id:'jsnad-01'"),"Native archive must include the JSNAD credential.");
for (const [title,badge] of Object.entries(ciscoBadges)) {
  assert.ok(credentialsRoute.includes("name:'"+title+"'"),"Native archive is missing Cisco title "+title);
  assert.ok(credentialsRoute.includes(badge.id),"Native archive is missing the owner's Credly badge ID for "+title);
  assert.ok(credentialsRoute.includes(badge.image),"Native archive is missing the official Credly badge image for "+title);
}
