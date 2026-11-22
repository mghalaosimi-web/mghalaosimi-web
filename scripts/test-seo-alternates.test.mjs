import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {resolveLocalizedAlternates} from '../lib/seo-paths.mjs';

test('home page exposes clean Arabic and English canonicals',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/','ar'),{canonical:'/',languages:{ar:'/',en:'/en','x-default':'/'}});
 assert.deepEqual(resolveLocalizedAlternates('/','en'),{canonical:'/en',languages:{ar:'/',en:'/en','x-default':'/'}});
});
test('primary React pages expose matching bilingual canonicals',()=>{
 const pairs=[['/about','/about','/en/about'],['/projects','/projects','/en/projects'],['/skills','/skills','/en/skills'],['/research','/research','/en/research'],['/contact','/contact','/en/contact'],['/labs','/labs','/en/labs'],['/credentials','/credentials','/en/credentials']];
 for(const [path,ar,en] of pairs){
  assert.equal(resolveLocalizedAlternates(path,'ar').canonical,ar);
  assert.equal(resolveLocalizedAlternates(path,'en').canonical,en);
  assert.equal(resolveLocalizedAlternates(path,'ar').languages?.en,en);
  assert.equal(resolveLocalizedAlternates(path,'en').languages?.ar,ar);
 }
});
test('legacy static project pages use clean bilingual canonicals',()=>{
 const ar=resolveLocalizedAlternates('/projects/waynah/','ar');
 const en=resolveLocalizedAlternates('/projects/waynah?source=portfolio','en');
 assert.equal(ar.canonical,'/projects/waynah');
 assert.equal(en.canonical,'/en/projects/waynah');
 assert.equal(ar.languages?.en,en.canonical);
 assert.equal(en.languages?.ar,ar.canonical);
});
test('dynamic React project pages expose clean reciprocal bilingual alternates',()=>{
 const ar=resolveLocalizedAlternates('/projects/abdulmalik-erp','ar');
 const en=resolveLocalizedAlternates('/projects/abdulmalik-erp','en');
 assert.equal(ar.canonical,'/projects/abdulmalik-erp');
 assert.equal(en.canonical,'/en/projects/abdulmalik-erp');
 assert.equal(ar.languages?.en,en.canonical);
 assert.equal(en.languages?.ar,ar.canonical);
});
test('legacy static pages expose reciprocal clean locale alternates',()=>{
 const slugs=['achievements','education','knowledge','profile','resume','showcase'];
 for(const slug of slugs){
  const ar=resolveLocalizedAlternates('/'+slug,'ar');
  const en=resolveLocalizedAlternates('/'+slug,'en');
  assert.equal(ar.canonical,'/'+slug);
  assert.equal(en.canonical,'/en/'+slug);
  assert.equal(ar.languages?.en,en.canonical);
  assert.equal(en.languages?.ar,ar.canonical);
  assert.equal(en.languages?.['x-default'],ar.canonical);
 }
});
test('unmapped routes are normalized',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/unknown/route/','en'),{canonical:'/en/unknown/route'});
 assert.equal(resolveLocalizedAlternates('projects/waynah//?q=1','ar').canonical,'/projects/waynah');
});
test('English static project URLs keep their locale prefix during internal rewrite',()=>{
 const middleware=readFileSync(new URL('../middleware.ts',import.meta.url),'utf8');
 assert.ok(middleware.includes('NextResponse.rewrite(destination,'));
 assert.ok(middleware.includes("const englishStaticProject=pathname.match(/^\\/en\\/projects\\/([^/]+)\\/?$/)"));
 assert.ok(middleware.includes("LEGACY_STATIC_PROJECT_SLUGS.has(englishStaticProject[1])"));
 assert.ok(middleware.includes("return setEnglishLocale(NextResponse.next(),request)"));
 assert.ok(middleware.includes("request.cookies.set('portfolio-locale','en')"));
});

test('all English legacy static project pages are preserved as English HTML routes',()=>{
 const slugs=['waynah','yemen-ai','mghal-content-os','manar-schedule-system','ciphersphere','focusflow','mghal-official-website','almanar-schedule-system'];
 for(const slug of slugs){
  const html=readFileSync(new URL('../public/en/projects/'+slug+'/index.html',import.meta.url),'utf8');
  assert.match(html,/<html lang=['"]en['"]/i,'wrong document language for '+slug);
  assert.ok(html.includes('https://mghalaosimi-web.vercel.app/en/projects/'+slug),'wrong English canonical for '+slug);
 }
});



test('photo gallery serves locale-specific metadata and server-rendered copy',()=>{
 const source=readFileSync(new URL('../app/photos/page.tsx',import.meta.url),'utf8');
 assert.ok(source.includes("localizedAlternates('/photos', en ? 'en' : 'ar')"));
 assert.ok(source.includes("cookies()).get('portfolio-locale')"));
 assert.ok(source.includes('Mohammed Ghaleb Alaosimi — Photo Gallery'));
 assert.ok(source.includes('معرض صور محمد غالب العصيمي'));
 assert.ok(source.includes('altEn:'));
 assert.ok(source.includes('altAr:'));
});

test('page titles do not duplicate the shared M.GH.AL suffix',()=>{
 const files=['../app/skills/page.tsx','../app/research/page.tsx','../app/credentials/page.tsx','../app/photos/page.tsx'];
 for(const file of files){
  const source=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.doesNotMatch(source,/title\s*:\s*['"][^'"]*\|\s*M\.GH\.AL['"]/,'page metadata must not repeat the root title suffix: '+file);
 }
});

test('projects and credentials pages provide page-specific Open Graph and Twitter metadata',()=>{
 const project=readFileSync(new URL('../app/projects/page.tsx',import.meta.url),'utf8');
 const credentials=readFileSync(new URL('../app/credentials/page.tsx',import.meta.url),'utf8');
 for(const source of [project,credentials]){
  assert.match(source,/openGraph:\s*\{/);
  assert.match(source,/url:\s*canonical/);
  assert.match(source,/title,\s*description/);
  assert.match(source,/twitter:\s*\{/);
  assert.match(source,/card:\s*'summary_large_image'/);
 }
});


test('global footer exposes the bilingual photo gallery route for crawl discovery',()=>{
 const layout=readFileSync(new URL('../app/layout.tsx',import.meta.url),'utf8');
 assert.ok(layout.includes(`<a href="/photos">{isEn?'Photo Gallery':'معرض الصور'}</a>`));
});


test('Arabic and English project cards expose crawlable detail links without removing preview dialogs',()=>{
 const ar=readFileSync(new URL('../app/projects/ProjectsPageArabic.tsx',import.meta.url),'utf8');
 const en=readFileSync(new URL('../app/projects/ProjectsExplorerEnglish.tsx',import.meta.url),'utf8');
 for(const source of [ar,en]){
  assert.match(source,/<article className="portfolio-project-card" key=\{p\.slug\}>/);
  assert.ok(source.includes(`<Link href={'/projects/'+p.slug}>`));
  assert.match(source,/aria-haspopup="dialog"/);
 }
});
