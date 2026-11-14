import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync} from 'node:fs';
import {resolveLocalizedAlternates} from '../lib/seo-paths.mjs';

test('home page exposes clean Arabic and English React canonicals',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/','ar'),{canonical:'/',languages:{ar:'/',en:'/en','x-default':'/'}});
 assert.deepEqual(resolveLocalizedAlternates('/','en'),{canonical:'/en',languages:{ar:'/',en:'/en','x-default':'/'}});
});

test('primary React routes expose paired bilingual canonicals',()=>{
 const pairs=[
  ['/about','/about','/en/about'],
  ['/projects','/projects','/en/projects'],
  ['/skills','/skills','/en/skills'],
  ['/research','/research','/en/research'],
  ['/contact','/contact','/en/contact'],
  ['/labs','/labs','/en/labs'],
  ['/credentials','/credentials','/en/credentials'],
  ['/photos','/photos','/en/photos']
 ];
 for(const [path,ar,en] of pairs){
  assert.equal(resolveLocalizedAlternates(path,'ar').canonical,ar,path+' Arabic canonical');
  assert.equal(resolveLocalizedAlternates(path,'en').canonical,en,path+' English canonical');
  assert.equal(resolveLocalizedAlternates(path,'ar').languages?.ar,ar,path+' Arabic hreflang');
  assert.equal(resolveLocalizedAlternates(path,'ar').languages?.en,en,path+' English hreflang');
 }
});

test('project detail pages pair the same slug across React locale trees',()=>{
 const ar=resolveLocalizedAlternates('/projects/waynah/','ar');
 const en=resolveLocalizedAlternates('/projects/waynah?source=portfolio','en');
 assert.equal(ar.canonical,'/projects/waynah');
 assert.equal(en.canonical,'/en/projects/waynah');
 assert.equal(ar.languages?.en,en.canonical);
 assert.equal(en.languages?.ar,ar.canonical);
});

test('unmapped routes are normalized and remain in their selected locale',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/unknown/route/','en'),{canonical:'/en/unknown/route'});
 assert.deepEqual(resolveLocalizedAlternates('projects/waynah//?q=1','ar').canonical,'/projects/waynah');
});

test('legacy HTML URLs permanently redirect to clean React paths',()=>{
 const config=readFileSync(new URL('../next.config.ts',import.meta.url),'utf8');
 assert.ok(config.includes("['/profile.html','/about']"));
 assert.ok(config.includes("['/projects.html','/projects']"));
 assert.ok(config.includes("['/certificates.html','/credentials']"));
 assert.ok(config.includes("{source:'/admin/index.html',destination:'/admin',permanent:true}"));
});
