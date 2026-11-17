import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {join,relative,sep} from 'node:path';

const root=process.cwd();
const origin='https://mghalaosimi-web.vercel.app';
const legacyPages=['achievements','certificates','education','knowledge','profile','resume','showcase'];
const legacyProjects=['waynah','yemen-ai','mghal-content-os','manar-schedule-system','ciphersphere','focusflow','mghal-official-website','almanar-schedule-system'];
const ignored=new Set(['.git','node_modules','.next','.vercel','coverage','artifacts','mghal-backend']);

function walk(directory,files=[]){
  for(const entry of readdirSync(directory,{withFileTypes:true})){
    if(entry.isDirectory()){
      if(!ignored.has(entry.name)) walk(join(directory,entry.name),files);
    }else if(entry.isFile()&&entry.name.toLowerCase().endsWith('.html')){
      files.push(join(directory,entry.name));
    }
  }
  return files;
}

function cleanUrl(value){
  if(typeof value!=='string') return value;
  let url;
  try{
    if(value.startsWith(origin)) url=new URL(value);
    else if(value.startsWith('/')) url=new URL(value,origin);
    else return value;
  }catch{return value;}
  let pathname=url.pathname;
  if(pathname==='/index.html') pathname='/';
  else if(pathname.endsWith('/index.html')) pathname=pathname.slice(0,-'index.html'.length);
  else if(pathname.endsWith('.html')) pathname=pathname.slice(0,-'.html'.length);
  const project=pathname.match(/^\/(en\/)?projects\/([^/]+)\/$/);
  if(project) pathname='/'+(project[1]||'')+'projects/'+project[2];
  if(pathname.length>1&&pathname.endsWith('/')) pathname=pathname.slice(0,-1);
  url.pathname=pathname;
  return value.startsWith(origin)?url.toString():url.pathname+url.search+url.hash;
}

function routeForFile(file){
  let route=relative(root,file).split(sep).join('/');
  if(route.startsWith('public/')) route=route.slice(7);
  if(route==='index.html') return '/';
  if(route==='en/index.html') return '/en';
  if(route.endsWith('/index.html')) route=route.slice(0,-'/index.html'.length);
  else route=route.replace(/\.html$/,'');
  return '/'+route.replace(/^\/+|\/+$/g,'');
}

function ensureSeoHead(html,route){
  if(/\/(?:404|offline)(?:\.html)?$/.test(route)||route==='/admin') return html;
  const isEn=route==='/en'||route.startsWith('/en/');
  const arPath=isEn?(route.replace(/^\/en(?=\/|$)/,'')||'/'):route;
  const enPath=arPath==='/'?'/en':'/en'+arPath;
  const canonical=isEn?enPath:arPath;
  const absolute=(path)=>origin+(path==='/'?'/':path);
  const headMatch=html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if(!headMatch) return html;
  let head=headMatch[0];
  const canonicalTag='<link rel="canonical" href="'+absolute(canonical)+'">';
  const canonicalPattern=/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/i;
  if(canonicalPattern.test(head)) head=head.replace(canonicalPattern,canonicalTag);
  else head=head.replace(/<\/head>/i,canonicalTag+'</head>');
  for(const [lang,path] of [['ar',arPath],['en',enPath],['x-default',arPath]]){
    let found=false;
    head=head.replace(/<link\b[^>]*>/gi,tag=>{
      const rel=(tag.match(/\brel=["']([^"']+)["']/i)||[])[1];
      const hreflang=(tag.match(/\bhreflang=["']([^"']+)["']/i)||[])[1];
      if(rel==='alternate'&&hreflang===lang){
        found=true;
        return tag.replace(/\bhref=["'][^"']*["']/i,'href="'+absolute(path)+'"');
      }
      return tag;
    });
    if(!found){
      const tag='<link rel="alternate" hreflang="'+lang+'" href="'+absolute(path)+'">';
      head=head.replace(/<\/head>/i,tag+'</head>');
    }
  }
  return html.replace(headMatch[0],head);
}

const htmlFiles=walk(root);
let changedHtml=0,cleanedLinks=0;
for(const file of htmlFiles){
  const before=readFileSync(file,'utf8');
  let after=before.replace(/\b(href|content)=(['"])(.*?)\2/gi,(full,attribute,quote,value)=>{
    const cleaned=cleanUrl(value);
    if(cleaned!==value){cleanedLinks++;return attribute+'='+quote+cleaned+quote;}
    return full;
  });
  after=after.replace(/("url"\s*:\s*")(https:\/\/mghalaosimi-web\.vercel\.app\/[^" ]+)(")/g,(full,start,value,end)=>start+cleanUrl(value)+end);
  after=ensureSeoHead(after,routeForFile(file));
  if(after!==before){writeFileSync(file,after);changedHtml++;}
}

const sitemapPath=join(root,'public/sitemap.xml');
let sitemap=readFileSync(sitemapPath,'utf8');
for(const slug of legacyProjects){
  sitemap=sitemap.replaceAll('/projects/'+slug+'/', '/projects/'+slug);
  sitemap=sitemap.replaceAll('/en/projects/'+slug+'/', '/en/projects/'+slug);
}
const additions=[];
for(const slug of legacyPages){
  const ar=origin+'/'+slug,en=origin+'/en/'+slug;
  for(const loc of [ar,en]){
    additions.push(
      '  <url>\n'+
      '    <loc>'+loc+'</loc>\n'+
      '    <lastmod>2026-11-17</lastmod>\n'+
      '    <changefreq>monthly</changefreq>\n'+
      '    <priority>0.5</priority>\n'+
      '    <xhtml:link rel="alternate" hreflang="ar" href="'+ar+'"/>\n'+
      '    <xhtml:link rel="alternate" hreflang="en" href="'+en+'"/>\n'+
      '    <xhtml:link rel="alternate" hreflang="x-default" href="'+ar+'"/>\n'+
      '  </url>'
    );
  }
}
const existing=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]));
const missing=additions.filter(block=>!existing.has(block.match(/<loc>([^<]+)<\/loc>/)[1]));
if(missing.length) sitemap=sitemap.replace('</urlset>',missing.join('\n')+'\n</urlset>');
sitemap=sitemap.replace(/https:\/\/mghalaosimi-web\.vercel\.app\/[^<\s"]+\.html/g,url=>cleanUrl(url));
writeFileSync(sitemapPath,sitemap);
writeFileSync(join(root,'sitemap.xml'),sitemap);

const locs=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
if(locs.some(url=>url.endsWith('.html'))) throw new Error('Sitemap still contains a .html URL');
if(new Set(locs).size!==locs.length) throw new Error('Sitemap contains duplicate URLs');
console.log(JSON.stringify({htmlFiles:htmlFiles.length,changedHtml,cleanedLinks,sitemapUrls:locs.length,addedSitemapUrls:missing.length},null,2));
