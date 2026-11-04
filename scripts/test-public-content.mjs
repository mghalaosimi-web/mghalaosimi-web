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
for (const file of ["article.html", "en/article.html"]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes('id="article-comments" hidden'), file + ": comments must start hidden until an article is found");
  assert.ok(html.includes('src="/assets/site.js"'), file + ": shared navigation must load on article detail pages");
}
const articlePage = readFileSync("assets/article-page.js", "utf8");
assert.match(articlePage, /article-comments'\)\.hidden=true/, "Unavailable articles must not show the comment form.");
assert.match(articlePage, /article-comments'\)\.hidden=false/, "Published articles may show the comment form.");

const experienceCss = readFileSync("assets/mghal-experience.css", "utf8");
assert.match(experienceCss, /\.site-to-top\{position:fixed!important/, "Floating back-to-top control must remain fixed in the viewport.");
assert.match(experienceCss, /\.sheet\{box-sizing:border-box!important;width:100%!important;max-width:100%!important/, "Résumé sheet must not exceed its responsive container.");
assert.match(experienceCss, /html\{overflow-x:clip!important\}/, "Public pages must clip accidental root-level horizontal overflow.");
assert.match(experienceCss, /:where\(a,button,input,select,textarea,\[tabindex\]\):focus-visible/, "Interactive controls must expose a visible keyboard focus indicator.");
assert.match(experienceCss, /@media\(prefers-reduced-motion:reduce\)/, "Public pages must respect reduced-motion preferences.");
assert.match(experienceCss, /@media\(forced-colors:active\)/, "Public pages must retain visible boundaries in forced-colors mode.");
assert.match(experienceCss, /--mx-control-height:46px/, "Form controls must retain a comfortable minimum control height.");
assert.match(experienceCss, /min-height:44px/, "Mobile navigation targets must meet the project touch-target baseline.");
