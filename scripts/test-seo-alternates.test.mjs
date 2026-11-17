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
test('legacy static project pages keep their slash-terminated bilingual canonicals',()=>{
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
 const slugs=['achievements','certificates','education','knowledge','profile','resume','showcase'];
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


test('page titles do not duplicate the shared M.GH.AL suffix',()=>{
 const files=['../app/skills/page.tsx','../app/research/page.tsx','../app/credentials/page.tsx','../app/photos/page.tsx'];
 for(const file of files){
  const source=readFileSync(new URL(file,import.meta.url),'utf8');
  assert.doesNotMatch(source,/title\s*:\s*['"][^'"]*\|\s*M\.GH\.AL['"]/,'page metadata must not repeat the root title suffix: '+file);
 }
});
