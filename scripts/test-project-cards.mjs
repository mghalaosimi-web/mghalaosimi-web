import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../assets/project-cards.js", import.meta.url), "utf8");
const required = [
  "Geospatial discovery & trusted local data",
  "الاستكشاف الجغرافي والبيانات المحلية الموثوقة",
  "Institutional workflow & records management",
  "AI-assisted content workflow automation",
  "GitHub repository",
  "Live preview",
  "engineeringEnhanced",
  "primary-action",
];
for (const token of required) assert.ok(source.includes(token), "Missing project enhancement: " + token);
assert.ok(source.includes('document.querySelectorAll(projectSelector)'));
console.log("Project card source checks passed (bilingual scopes, action labels, and idempotent enhancement).");
