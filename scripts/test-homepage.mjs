import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
for (const [file, language] of [["index.html", "ar"], ["en/index.html", "en"]]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes('<html lang="' + language + '"'), file + ': correct language');
  for (const marker of ['<main id="main-content"', 'class="home-hero"', 'class="home-capability-grid"', 'class="home-project-grid"', 'class="home-profile-facts"', 'class="home-tech-list"', 'class="home-credential-summary"', 'class="home-knowledge"', 'class="home-contact"', 'nav-resume']) assert.ok(html.includes(marker), file + ': missing ' + marker);
  assert.doesNotMatch(html, /newsletter|subscribe by email|اشترك بالبريد/i, file + ': no fake email follow form');
  assert.doesNotMatch(html, /sample post|مقال تجريبي/i, file + ': no fabricated articles');
}
const ar = readFileSync("index.html", "utf8");
const ordered = ["home-hero", "home-capabilities", "home-projects", "home-profile", "home-skills", "home-credentials", "home-knowledge", "home-contact"];
let previous = -1;
for (const section of ordered) { const position = ar.indexOf('class="' + section + '"'); assert.ok(position > previous, 'Homepage order: ' + section); previous = position; }
console.log("Homepage architecture tests passed: bilingual parity, section order, résumé CTA, evidence-based content, and no fabricated follow/article UI.");
