import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const sitemap=readFileSync(new URL('../app/sitemap.ts',import.meta.url),'utf8');
const robots=readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
const config=readFileSync(new URL('../next.config.ts',import.meta.url),'utf8');
const registry=readFileSync(new URL('../data/projects.ts',import.meta.url),'utf8');
const base='https://mghalaosimi-web.vercel.app';

test('Next.js generates the sitemap from React routes and the approved project registry',()=>{
 assert.ok(sitemap.includes("const origin='"+base+"'"));
 assert.ok(sitemap.includes("import {projects} from '../data/projects'"));
 assert.ok(sitemap.includes("'/en/projects'")&&sitemap.includes("'/projects'"));
 assert.ok(sitemap.includes("projects.flatMap"));
 assert.doesNotMatch(sitemap,/\.html/);
 assert.doesNotMatch(sitemap,/humanity-system|mghal-esdp/);
});

test('the sitemap exposes bilingual clean routes for all primary pages',()=>{
 for(const route of ['/en','/en/about','/en/projects','/en/skills','/en/credentials','/en/labs','/en/research','/en/contact','/en/photos']){
  assert.ok(sitemap.includes("'"+route+"'"),'missing English route '+route);
 }
 for(const route of ["'/about'","'/projects'","'/skills'","'/credentials'","'/labs'","'/research'","'/contact'","'/photos'"]){
  assert.ok(sitemap.includes(route),'missing Arabic route '+route);
 }
});

test('legacy HTML paths permanently redirect to React pages',()=>{
 for(const legacy of ['profile.html','projects.html','certificates.html','skills.html','education.html','achievements.html','knowledge.html','contact.html','showcase.html','resume.html']){
  assert.ok(config.includes(legacy),'missing redirect for '+legacy);
 }
 assert.ok(config.includes("destination:'/en'+destination"),'English legacy routes must remain under the English React route tree.');
});

test('robots.txt points to the canonical Next.js sitemap',()=>{
 assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml'));
});

test('the public React registry contains no private project identifiers',()=>{
 assert.doesNotMatch(registry,/humanity-system|mghal-esdp/);
});
