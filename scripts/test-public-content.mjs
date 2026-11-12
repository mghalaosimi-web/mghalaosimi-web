import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

for (const [file, expected] of [
  ["public/resume.html", ["18 شهادة", "11 شهادة من Cisco", "6 شهادات من إدراك", "JSNAD"]],
  ["public/en/resume.html", ["18 verified professional credentials", "11 Cisco Networking Academy", "six Edraak certificates", "JSNAD"]],
]) {
  const html = readFileSync(file, "utf8");
  for (const phrase of expected) assert.ok(html.includes(phrase), file + ": missing " + phrase);
  assert.doesNotMatch(html, /21 credentials|21 شهادة|14 Cisco|14 إنجازاً/i, file + ": stale credential count");
}

for (const [file, locale, heading, link] of [
  ["public/achievements.html", "ar", "الإنجازات", "/certificates.html"],
  ["public/en/achievements.html", "en", "Achievements", "/en/certificates.html"],
]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes(heading), file + ": page heading missing");
  assert.ok(html.includes(link), file + ": credentials navigation missing");
}

const feed = readFileSync("public/assets/article-feed.js", "utf8");
assert.match(feed, /\/api\/public\/articles/, "Article feed must use the same-origin Vercel API.");
assert.match(feed, /feedState='unavailable'/, "Article feed failure should preserve the static empty state.");
assert.doesNotMatch(feed, /workers\.dev|onrender\.com/, "Article feed must not call an external API host.");
assert.doesNotMatch(feed, /Published articles are temporarily unavailable|تعذر تحميل المقالات المنشورة/, "No duplicate API error message in the empty article library.");

const knowledge = readFileSync("public/en/knowledge.html", "utf8");
assert.doesNotMatch(knowledge, /color-scheme:dark|#081211|#32a895/, "English knowledge page must not retain the retired dark teal theme.");
console.log("Public content consistency tests passed: bilingual credential totals, achievements routes, same-origin article feed and knowledge theme.");

for (const [file, locale] of [["public/profile.html", "ar"], ["public/en/profile.html", "en"]]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes("profile-facts"), file + ": identity facts missing");
  assert.ok(html.includes("profile-focus-grid"), file + ": engineering focus missing");
  assert.ok(html.includes("profile-path"), file + ": academic/portfolio path missing");
  assert.ok(html.includes("nav-resume"), file + ": résumé action missing");
  assert.ok(html.includes(locale === "ar" ? "تقنية المعلومات" : "Information Technology"), file + ": academic field missing");
  assert.ok(html.includes(locale === "ar" ? "الأمن السيبراني مجال اهتمام" : "cybersecurity is an area of interest"), file + ": cybersecurity must not be represented as the degree specialization");
}
for (const file of ["public/article.html", "public/en/article.html"]) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes('id="article-comments" hidden'), file + ": comments must start hidden until an article is found");
  assert.ok(html.includes('src="/assets/site.js"'), file + ": shared navigation must load on article detail pages");
}
const articlePage = readFileSync("public/assets/article-page.js", "utf8");
assert.match(articlePage, /article-comments'\)\.hidden=true/, "Unavailable articles must not show the comment form.");
assert.match(articlePage, /article-comments'\)\.hidden=false/, "Published articles may show the comment form.");
assert.match(articlePage, /try\{t=localStorage\.getItem\(visitorKey\)\}catch\{\}/, "Article interactions must survive blocked localStorage reads.");
assert.match(articlePage, /try\{localStorage\.setItem\(visitorKey,d\.visitorToken\)\}catch\{\}/, "Article interactions must survive blocked localStorage writes.");
assert.match(articlePage, /if\(!d\.visitorToken\)throw Error\('visitor token unavailable'\)/, "Article interactions must reject an empty visitor token response.");

const experienceCss = readFileSync("public/assets/mghal-experience.css", "utf8");
assert.match(experienceCss, /\.site-to-top\{position:fixed!important/, "Floating back-to-top control must remain fixed in the viewport.");
assert.match(experienceCss, /\.sheet\{box-sizing:border-box!important;width:100%!important;max-width:100%!important/, "Résumé sheet must not exceed its responsive container.");
assert.match(experienceCss, /html\{overflow-x:clip!important\}/, "Public pages must clip accidental root-level horizontal overflow.");
assert.match(experienceCss, /:where\(a,button,input,select,textarea,\[tabindex\]\):focus-visible/, "Interactive controls must expose a visible keyboard focus indicator.");
assert.match(experienceCss, /@media\(prefers-reduced-motion:reduce\)/, "Public pages must respect reduced-motion preferences.");
assert.match(experienceCss, /@media\(forced-colors:active\)/, "Public pages must retain visible boundaries in forced-colors mode.");
assert.match(experienceCss, /--mx-control-height:46px/, "Form controls must retain a comfortable minimum control height.");
assert.match(experienceCss, /min-height:44px/, "Mobile navigation targets must meet the project touch-target baseline.");

const engagementApiHandler=readFileSync("mghal-backend/api-handler.mjs","utf8");
const engagementUi=readFileSync("public/assets/social-engagement.js","utf8");
const engagementCss=readFileSync("public/assets/social-engagement.css","utf8");
for(const route of ['/api/public/followers/status','/api/public/followers/count','/api/public/followers','/api/public/reactions','/api/public/comments'])assert.ok(engagementApiHandler.includes(route),'missing engagement API '+route);
assert.match(engagementApiHandler,/INSERT INTO followers\(id,email_hash,status\) VALUES\(\?,\?,'active'\)/,'new visitor sessions should start as anonymous active follows');
assert.match(engagementApiHandler,/guestFollowing:f\.status==="active"&&f\.display_name===null/,'anonymous following state must be explicit in the visitor response');
assert.match(engagementApiHandler,/consent!==true/,'publishing a named follower profile must require explicit consent');
assert.match(engagementApiHandler,/status='active' AND consent_at IS NOT NULL/,'public follower count must include only explicitly consented followers');
assert.match(engagementApiHandler,/status='active' AND consent_at IS NULL AND display_name IS NULL/,'anonymous guest follows must be counted separately from named followers');
assert.match(engagementApiHandler,/\["active","unverified"\]\.includes\(f\.status\)/,'active visitor sessions may react and comment');
assert.match(engagementApiHandler,/status='unsubscribed'/,'unsubscribed visitors must not be silently reactivated');
assert.match(engagementApiHandler,/status='approved'/,'public comments must be moderated before display');
assert.match(engagementApiHandler,/"share","follow","unfollow","reaction","comment_submitted"/,'analytics must include social engagement events');
assert.match(engagementUi,/تابع M\.GH\.AL|Follow M\.GH\.AL/,'public follow component is missing');
assert.match(engagementUi,/navigator\.share/,'share action must use the native share sheet when available');
assert.match(engagementUi,/api\/public\/reactions/,'project reaction controls must call the API');
assert.match(engagementUi,/api\/public\/followers\/count/,'public follower count must be loaded from API');
for(const file of ['public/projects.html','public/en/projects.html'])assert.equal((readFileSync(file,'utf8').match(/data-project-slug=/g)||[]).length,10,file+': all 10 project cards must have a reaction target');
assert.match(engagementCss,/\.mghal-follow-panel/,'follow component must be styled');
assert.match(engagementCss,/\.mghal-comments-list/,'approved comments must be styled');
for(const file of ['public/article.html','public/en/article.html']){const html=readFileSync(file,'utf8');assert.match(html,/id="share-article"/,file+': article sharing control missing');assert.match(html,/id="article-comments-list"/,file+': approved comments list missing');}
const articleInteractions=readFileSync('public/assets/article-page.js','utf8');
assert.match(articleInteractions,/api\/public\/comments\?articleId=/,'approved comments must load from public API');
assert.match(articleInteractions,/api\/public\/reactions\?targetType=article/,'article reaction counts must load from public API');
for(const file of ['public/article.html','public/en/article.html'])assert.match(readFileSync(file,'utf8'),/id="clap-article"/,file+': article applause control missing');
assert.match(articleInteractions,/targetType:'article',targetId:article.id,reaction:'clap'/,'article applause must call the reaction API');
console.log('Engagement tests passed: explicit follow consent, browser-linked unsubscribe, project/article reactions, sharing and moderated comments.');
const sharedSite=readFileSync('public/assets/site.js','utf8'),visitorTracking=readFileSync('public/assets/visitor-tracking.js','utf8');
assert.match(sharedSite,/visitor-tracking\.js/,'all public pages must load visitor analytics');
assert.match(visitorTracking,/__mghalVisitorTracking/,'visitor analytics must be idempotent when detail pages also include it');
assert.match(engagementUi,/navigator\.doNotTrack==='1'/,'engagement analytics must respect Do Not Track');
assert.match(articleInteractions,/navigator\.doNotTrack==='1'/,'article analytics must respect Do Not Track');

