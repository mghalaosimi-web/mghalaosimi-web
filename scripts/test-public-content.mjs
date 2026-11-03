import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
for (const [file, expected] of [
  ["resume.html", ["21 شهادة", "14 شهادة من Cisco", "6 شهادات من إدراك", "JSNAD"]],
  ["en/resume.html", ["21 professional credentials", "14 Cisco Networking Academy", "6 Edraak certificates", "JSNAD"]]
]) {
  const html = readFileSync(file, "utf8");
  for (const phrase of expected) assert.ok(html.includes(phrase), file + ": missing " + phrase);
  assert.doesNotMatch(html, /18 credentials|18 شهادة|11 Cisco|11 إنجازاً/i, file + ": stale credential count");
}
for (const [file, expected] of [["achievements.html", ["21 شهادة", "14 من Cisco", "6 من إدراك", "JSNAD"]], ["en/achievements.html", ["21 professional credentials", "14 from Cisco", "6 from Edraak", "JSNAD"]]]) {
  const html = readFileSync(file, "utf8");
  for (const phrase of expected) assert.ok(html.includes(phrase), file + ": missing " + phrase);
  assert.doesNotMatch(html, /11 Cisco|11 شهادة|18 credentials|18 شهادة/i, file + ": stale achievement count");
}
const feed = readFileSync("assets/article-feed.js", "utf8");
assert.match(feed, /feedState='unavailable'/, "Article feed failure should not contradict the static empty state.");
assert.doesNotMatch(feed, /Published articles are temporarily unavailable|تعذر تحميل المقالات المنشورة/, "No duplicate API error message in empty article library.");
const knowledge = readFileSync("en/knowledge.html", "utf8");
assert.doesNotMatch(knowledge, /color-scheme:dark|#081211|#32a895/, "English knowledge page must not retain retired dark teal theme.");
console.log("Public content consistency tests passed: bilingual résumé credential totals and knowledge empty/error state.");
for (const [file, locale] of [["profile.html", "ar"], ["en/profile.html", "en"]]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes("profile-facts"), file + ": identity facts missing");
  assert.ok(html.includes("profile-focus-grid"), file + ": engineering focus missing");
  assert.ok(html.includes("profile-path"), file + ": academic/portfolio path missing");
  assert.ok(html.includes("nav-resume"), file + ": résumé action missing");
  assert.ok(html.includes(locale === "ar" ? "تقنية المعلومات" : "Information Technology"), file + ": academic field missing");
  assert.ok(html.includes(locale === "ar" ? "الأمن السيبراني مجال اهتمام" : "cybersecurity is an area of interest"), file + ": cybersecurity must not be represented as the degree specialization");
}
