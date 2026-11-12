import assert from "node:assert/strict";
import {existsSync,readdirSync,statSync} from "node:fs";
import path from "node:path";
const root=path.resolve("public");
assert.ok(existsSync(root)&&statSync(root).isDirectory(),"Public asset directory must exist.");
const forbiddenExtensions=new Set([".md",".markdown",".sql",".log",".zip",".7z",".rar",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".key",".pem",".p12",".pfx",".env",".bak",".dump"]);
const forbiddenNames=[/^Screenshot_/i,/Master Project Book/i,/m-gh-alaosimi-gmail-com/i,/PythonEssentials1Update20260725/i,/IT_Customer_Support_Basics_certificate_/i];
const violations=[];let files=0,html=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else{files++;const relative=path.relative(root,full).split(path.sep).join("/");if(entry.name.startsWith(".")||forbiddenExtensions.has(path.extname(entry.name).toLowerCase())||forbiddenNames.some(pattern=>pattern.test(entry.name)))violations.push(relative);if(entry.name.toLowerCase().endsWith(".html"))html.push(relative);}}}
walk(root);
for(const file of html)if(!["admin/index.html","offline.html"].includes(file))violations.push("LEGACY_HTML:"+file);
for(const required of ["assets","assets/projects/catalog.json","assets/design-tokens.css","manifest.json","sw.js","offline.html","robots.txt"])if(!existsSync(path.join(root,required)))violations.push("MISSING:"+required);
if(existsSync(path.join(root,"sitemap.xml")))violations.push("LEGACY_STATIC_SITEMAP: use app/sitemap.ts");
if(violations.length){console.error("Public asset audit failed:",violations);process.exit(1);}
console.log("Public asset audit passed ("+files+" files); only the isolated admin shell and offline fallback remain static HTML.");
