import assert from 'node:assert/strict';
import test from 'node:test';
import {resolveLocalizedAlternates} from '../lib/seo-paths.mjs';

test('home page exposes distinct Arabic and English canonical URLs',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/','ar'),{canonical:'/',languages:{ar:'/',en:'/en/','x-default':'/'}});
 assert.deepEqual(resolveLocalizedAlternates('/','en'),{canonical:'/en/',languages:{ar:'/',en:'/en/','x-default':'/'}});
});

test('Next.js content routes map to their existing bilingual static counterparts',()=>{
 const pairs=[
  ['/about','/about','/en/profile.html'],
  ['/projects','/projects','/en/projects.html'],
  ['/skills','/skills','/en/skills.html'],
  ['/research','/research','/en/research.html'],
  ['/contact','/contact','/en/contact.html']
 ];
 for(const [path,ar,en] of pairs){
  assert.equal(resolveLocalizedAlternates(path,'ar').canonical,ar,path+' Arabic canonical');
  assert.equal(resolveLocalizedAlternates(path,'en').canonical,en,path+' English canonical');
  assert.equal(resolveLocalizedAlternates(path,'ar').languages?.ar,ar,path+' Arabic hreflang');
  assert.equal(resolveLocalizedAlternates(path,'ar').languages?.en,en,path+' English hreflang');
 }
});

test('project detail pages pair the same slug across Arabic and English paths',()=>{
 const ar=resolveLocalizedAlternates('/projects/waynah/','ar');
 const en=resolveLocalizedAlternates('/projects/waynah?source=portfolio','en');
 assert.equal(ar.canonical,'/projects/waynah/');
 assert.equal(en.canonical,'/en/projects/waynah/');
 assert.equal(ar.languages?.en,en.canonical);
 assert.equal(en.languages?.ar,ar.canonical);
});

test('cookie-switched routes without a distinct English URL do not emit false hreflang',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/labs','en'),{canonical:'/labs'});
});

test('normalizes relative paths, duplicate slashes, query strings and trailing slashes',()=>{
 assert.equal(resolveLocalizedAlternates('projects/waynah//?q=1','ar').canonical,'/projects/waynah/');
 assert.equal(resolveLocalizedAlternates('/unmapped/route/','en').canonical,'/unmapped/route');
});

test('credentials uses its current canonical route without a false English alternate',()=>{\n assert.deepEqual(resolveLocalizedAlternates('/credentials','ar'),{canonical:'/credentials'});\n assert.deepEqual(resolveLocalizedAlternates('/credentials','en'),{canonical:'/credentials'});\n});\n