import assert from 'node:assert/strict';
import test from 'node:test';
import {resolveLocalizedAlternates} from '../lib/seo-paths.mjs';

test('home page exposes distinct Arabic and English canonical URLs',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/','ar'),{canonical:'/',languages:{ar:'/',en:'/en','x-default':'/'}});
 assert.deepEqual(resolveLocalizedAlternates('/','en'),{canonical:'/en',languages:{ar:'/',en:'/en','x-default':'/'}});
});
test('all migrated Next.js content routes expose matching bilingual canonical URLs',()=>{
 const routes=['about','projects','skills','research','contact','credentials','education','achievements','knowledge','resume','labs'];
 for(const route of routes){
  const path='/'+route;
  assert.equal(resolveLocalizedAlternates(path,'ar').canonical,path);
  assert.equal(resolveLocalizedAlternates(path,'en').canonical,'/en'+path);
  assert.equal(resolveLocalizedAlternates(path,'ar').languages.en,'/en'+path);
  assert.equal(resolveLocalizedAlternates(path,'en').languages.ar,path);
 }
});
test('project detail pages pair the same slug across React routes',()=>{
 const ar=resolveLocalizedAlternates('/projects/waynah/','ar');
 const en=resolveLocalizedAlternates('/en/projects/waynah?source=portfolio','en');
 assert.equal(ar.canonical,'/projects/waynah');
 assert.equal(en.canonical,'/en/projects/waynah');
 assert.equal(ar.languages.en,en.canonical);
 assert.equal(en.languages.ar,ar.canonical);
});
test('unmapped routes do not emit false hreflang pairs',()=>{
 assert.deepEqual(resolveLocalizedAlternates('/unmapped/route/','en'),{canonical:'/unmapped/route'});
});
test('normalizes relative paths, duplicate slashes, query strings and trailing slashes',()=>{
 assert.equal(resolveLocalizedAlternates('projects/waynah//?q=1','ar').canonical,'/projects/waynah');
});
