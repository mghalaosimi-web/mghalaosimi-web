import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {join,relative,sep} from 'node:path';
import test from 'node:test';

const root=process.cwd();
const publicRoot=join(root,'public');
const excluded=new Set(['404.html','offline.html','article.html']);
function walk(directory,files=[]){
 for(const entry of readdirSync(directory,{withFileTypes:true})){
  if(entry.isDirectory()){
   if(entry.name!=='admin') walk(join(directory,entry.name),files);
  }else if(entry.isFile()&&entry.name.endsWith('.html')&&!excluded.has(entry.name)){
   files.push(join(directory,entry.name));
  }
 }
 return files;
}
const pages=walk(publicRoot);
const siteHtml=pages.map(file=>({file,html:readFileSync(file,'utf8'),path:relative(publicRoot,file).split(sep).join('/')}));
test('indexable static HTML pages ship language, title, description, canonical, and reciprocal hreflang in initial HTML',()=>{
 assert.ok(pages.length>=30,'expected the public static page set to be audited');
 for(const page of siteHtml){
  const {html,path}=page;
  assert.match(html,/<html\b[^>]*\blang=["'](?:ar|en)["']/i,'missing document language: '+path);
  assert.match(html,/<title>\s*[^<]+\s*<\/title>/i,'missing unique title: '+path);
  assert.match(html,/<meta\b[^>]*name=["']description["'][^>]*content=["'][^"']{30,}["']/i,'missing useful meta description: '+path);
  assert.match(html,/<link\b(?=[^>]*rel=["']canonical["'])[^>]*href=["']https:\/\/mghalaosimi-web\.vercel\.app\/[^"']*["']/i,'missing official canonical: '+path);
  const links=[...html.matchAll(/<link\b[^>]*>/gi)].map(match=>match[0]);
  for(const lang of ['ar','en','x-default']){
   assert.ok(links.some(tag=>/rel=["']alternate["']/i.test(tag)&&tag.includes('hreflang="'+lang+'"')&&tag.includes('https://mghalaosimi-web.vercel.app/')),'missing '+lang+' alternate: '+path);
  }
  assert.match(html,/<h1\b[^>]*>\s*[^<\s][\s\S]*?<\/h1>/i,'initial HTML has no readable H1: '+path);
  assert.doesNotMatch(html,/<link\b[^>]*rel=["']canonical["'][^>]*href=["'][^"']*\.html/i,'canonical contains .html: '+path);
  assert.doesNotMatch(html,/\bhref=["'](?:https:\/\/mghalaosimi-web\.vercel\.app)?\/[^"']*\.html(?:[?#][^"']*)?["']/i,'internal link contains .html: '+path);
 }
});
test('Next.js permanently redirects HTML file URLs and rewrites clean legacy page routes',()=>{
 const config=readFileSync(join(root,'next.config.ts'),'utf8');
 assert.match(config,/source:\s*'\/index\.html',\s*destination:\s*'\/',\s*permanent:\s*true/);
 assert.match(config,/source:\s*'\/:path\*\.html',\s*destination:\s*'\/:path\*',\s*permanent:\s*true/);
 assert.match(config,/source:\s*'\/certificates',\s*destination:\s*'\/credentials',\s*permanent:\s*true/);\n assert.match(config,/source:\s*'\/en\/certificates',\s*destination:\s*'\/en\/credentials',\s*permanent:\s*true/);
 for(const slug of ['achievements','education','knowledge','profile','resume','showcase']){
  assert.ok(config.includes("'"+slug+"'"),'missing clean legacy route slug: '+slug);
 }
});
test('sitemap and source HTML navigation expose no .html internal URLs',()=>{
 const sitemap=readFileSync(join(publicRoot,'sitemap.xml'),'utf8');
 assert.doesNotMatch(sitemap,/\.html/i);
 assert.equal(readFileSync(join(root,'sitemap.xml'),'utf8'),sitemap);
});
