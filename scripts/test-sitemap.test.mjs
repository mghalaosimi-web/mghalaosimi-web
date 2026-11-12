import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const routeSource=readFileSync(new URL('../app/sitemap.ts',import.meta.url),'utf8');
const routeMap=readFileSync(new URL('../lib/seo-paths.mjs',import.meta.url),'utf8');
const robots=readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
const catalog=JSON.parse(readFileSync(new URL('../public/assets/projects/catalog.json',import.meta.url),'utf8'));
const base='https://mghalaosimi-web.vercel.app';

test('Next.js generates the sitemap from canonical routes and the project catalogue',()=>{
 assert.match(routeSource,/MetadataRoute\.Sitemap/);
 assert.match(routeSource,/catalog\.projects/);
 assert.match(routeSource,/alternates:\{languages:/);
 assert.match(routeSource,/changeFrequency:'monthly'/);
 assert.ok(routeSource.includes("'/education'")&&routeSource.includes("'/achievements'")&&routeSource.includes("'/knowledge'")&&routeSource.includes("'/resume'"));
});
test('primary and legacy URL aliases map to modern route destinations',()=>{
 for(const route of ['/about','/projects','/skills','/research','/contact','/credentials','/education','/achievements','/knowledge','/resume','/labs']){
  assert.ok(routeMap.includes("'"+route+"'"),'missing localized route '+route);
  assert.ok(routeMap.includes("'/en"+route+"'"),'missing English route '+route);
 }
});
test('every project slug is included dynamically in both locale routes',()=>{
 for(const project of catalog.projects){
  assert.ok(routeSource.includes('catalog.projects'),'catalogue-backed project loop missing');
  assert.ok(routeMap.includes("'/en/projects/'"),'English project route pattern missing');
 }
});
test('robots.txt references the generated sitemap on the canonical domain',()=>{
 assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml'));
});
test('static HTML sitemap copies have been retired',()=>{
 assert.ok(!routeSource.includes('index.html'));
});
