import { readdirSync, rmSync, mkdirSync, cpSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
const root=process.cwd(), output=path.join(root,"public");
rmSync(output,{recursive:true,force:true});mkdirSync(output,{recursive:true});
for(const e of readdirSync(root,{withFileTypes:true}))if(e.isFile()&&e.name.toLowerCase().endsWith(".html"))copyFileSync(path.join(root,e.name),path.join(output,e.name));
for(const name of ["assets","en","projects","admin"]){const src=path.join(root,name);if(existsSync(src))cpSync(src,path.join(output,name),{recursive:true,filter:(source)=>{const base=path.basename(source);return !base.endsWith(".txt")&&!base.startsWith("Screenshot_")&&!base.includes("Master Project Book")&&!base.includes("m-gh-alaosimi-gmail-com")&&!base.includes("PythonEssentials1Update20260725")&&!base.includes("IT_Customer_Support_Basics_certificate_");}});}
for(const name of ["favicon.svg","manifest.json","offline.html","robots.txt","sitemap.xml","sw.js"]){const src=path.join(root,name);if(existsSync(src))copyFileSync(src,path.join(output,name));}
console.log("Prepared static website output in ./public for the existing Vercel Output Directory setting.");