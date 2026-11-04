import assert from "node:assert/strict";
import { createServer } from "node:http";
import { createReadStream, existsSync, readFileSync, statSync, mkdirSync } from "node:fs";
import { resolve, extname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const root = resolve("public");
const artifacts = resolve("artifacts");
mkdirSync(artifacts, { recursive: true });
const mime = {".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".svg":"image/svg+xml",".png":"image/png",".jpg":"image/jpeg",".jpeg":"image/jpeg",".webp":"image/webp",".pdf":"application/pdf",".woff2":"font/woff2",".ico":"image/x-icon"};

const server = createServer((request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url || "/", "http://127.0.0.1").pathname);
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + "/")) return response.writeHead(403).end("Forbidden");
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file) || !statSync(file).isFile()) return response.writeHead(404).end("Not found");
    response.writeHead(200, {"content-type":mime[extname(file).toLowerCase()] || "application/octet-stream","x-content-type-options":"nosniff"});
    createReadStream(file).pipe(response);
  } catch { response.writeHead(400).end("Bad request"); }
});
await new Promise((resolveListen,reject)=>{server.once("error",reject);server.listen(4173,"127.0.0.1",resolveListen);});

const base="http://127.0.0.1:4173";
const routes=["/","/en/","/profile.html","/en/profile.html","/resume.html","/en/resume.html","/projects.html","/en/projects.html","/showcase.html","/en/showcase.html","/certificates.html","/en/certificates.html","/skills.html","/en/skills.html","/education.html","/en/education.html","/achievements.html","/en/achievements.html","/contact.html","/en/contact.html","/knowledge.html","/en/knowledge.html","/research.html","/en/research.html","/projects/waynah/","/en/projects/waynah/"];
const axeViolations=[], browserChecks=[];
const browser=await chromium.launch({headless:true,args:["--no-sandbox","--disable-dev-shm-usage"]});
try {
 for(const route of routes){
  const page=await browser.newPage({viewport:{width:1440,height:900}});
  const response=await page.goto(base+route,{waitUntil:"domcontentloaded",timeout:30000});
  assert.ok(response&&response.status()>=200&&response.status()<400,route+": page failed to load");
  await page.waitForFunction(() => document.querySelector(".skip-link")?.dataset.focusBound === "true", null, { timeout: 10000 });
  await page.addScriptTag({content:axeSource});
  const result=await page.evaluate(async()=>window.axe.run(document,{runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21a","wcag21aa","wcag22aa"]}}));
  for(const v of result.violations) axeViolations.push({route,id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.length,examples:v.nodes.slice(0,3).map(n=>({target:n.target,failureSummary:n.failureSummary,checks:[...n.any,...n.all,...n.none].map(c=>({id:c.id,data:c.data,message:c.message}))}))});
  await page.keyboard.press("Tab");
  const skip=await page.evaluate(()=>document.activeElement?.classList?.contains("skip-link")===true);
  assert.ok(skip,route+": first keyboard focus must be the skip link");
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => document.activeElement === document.querySelector("main"), null, { timeout: 2000 });
  const main=await page.evaluate(()=>document.activeElement === document.querySelector("main"));
  assert.ok(main,route+": skip link must focus main content");
  if(["/","/projects.html","/showcase.html","/certificates.html","/contact.html","/en/","/en/certificates.html"].includes(route)){
   for(const width of [320,375,768]){
    await page.setViewportSize({width,height:900});
    const d=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth}));
    assert.ok(d.document<=d.viewport+1&&d.body<=d.viewport+1,route+": horizontal overflow at "+width+"px "+JSON.stringify(d));
   }
   await page.emulateMedia({reducedMotion:"reduce"});
   assert.equal(await page.evaluate(()=>matchMedia("(prefers-reduced-motion: reduce)").matches),true);
   await page.emulateMedia({media:"print"});
   assert.ok(await page.locator("body").count()>0,route+": print document missing");
  }
  browserChecks.push({route,axeViolations:result.violations.length,keyboardSkipLink:true});
  await page.close();
 }
 const severe=axeViolations.filter(v=>v.impact==="critical"||v.impact==="serious");
 const report={generatedAt:new Date().toISOString(),routesTested:routes.length,browserChecks,axeViolations,severeViolationCount:severe.length};
 await import("node:fs/promises").then(fs=>fs.writeFile(join(artifacts,"accessibility-browser-report.json"),JSON.stringify(report,null,2)));
 console.log("Real-browser WCAG audit: "+routes.length+" routes; "+axeViolations.length+" violation groups; "+severe.length+" critical/serious.");
 if(axeViolations.length) console.log(JSON.stringify(axeViolations,null,2));
 assert.equal(severe.length,0,"Critical or serious WCAG violations detected.");
 const lighthouseResults=[],chromePath=chromium.executablePath();
 for(const [name,route] of [["home","/"],["projects","/projects.html"],["certificates","/certificates.html"]]){
  const output=join(artifacts,"lighthouse-"+name+".json");
  const run=spawnSync("npx",["lighthouse",base+route,"--output=json","--output-path="+output,"--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage","--quiet"],{encoding:"utf8",timeout:180000,env:{...process.env,CHROME_PATH:chromePath},maxBuffer:8*1024*1024});
  if(run.status!==0) throw new Error("Lighthouse failed for "+route+": "+(run.stderr||run.stdout||"unknown error"));
  const report=JSON.parse(readFileSync(output,"utf8"));
  const scores=Object.fromEntries(["performance","accessibility","best-practices","seo"].map(k=>[k,Math.round((report.categories[k]?.score??0)*100)]));
  lighthouseResults.push({route,scores}); console.log("Lighthouse "+route+": "+JSON.stringify(scores));
 }
 await import("node:fs/promises").then(fs=>fs.writeFile(join(artifacts,"lighthouse-summary.json"),JSON.stringify(lighthouseResults,null,2)));
} finally {await browser.close();await new Promise(resolveClose=>server.close(resolveClose));}
