import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const sitemap=readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8');
const robots=readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
const rootSitemap=readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
const base='https://mghalaosimi-web.vercel.app';
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
const locations=new Set(urls);
const slugs=["abdulmalik-erp","abdulmalik-store-pro","ramzei-erp","manar-schedule-system","waynah","mghal-digital-os","mghal-content-os","debwan-live","alnasr-supermarket-erp","yemen-ai","academic-os2","ciphersphere","abdulmalik-store-management","academicos","almanar-schedule-system","focusflow","mghal-digital-automation","mghal-official-website","cryptolab-x"];
test('sitemap structure and copies are valid',()=>{
 assert.match(sitemap,/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
 assert.match(sitemap,/xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
 assert.ok(sitemap.startsWith('<?xml'));
 assert.ok(sitemap.includes('</urlset>'));
 assert.equal(rootSitemap,sitemap);
});
test('only current clean React routes are listed',()=>{
 for(const path of ['/','/en','/about','/en/about','/projects','/en/projects','/skills','/en/skills','/research','/en/research','/contact','/en/contact','/labs','/en/labs','/credentials','/en/credentials']) assert.ok(locations.has(base+path),'missing '+path);
 assert.ok(!sitemap.includes('.html'),'legacy HTML paths must not be in sitemap');
 assert.ok(!sitemap.includes('mghal.vercel.app'),'legacy host must not be listed');
});
test('all public project routes are discoverable in both locales',()=>{
 for(const slug of slugs){assert.ok(locations.has(base+'/projects/'+slug));assert.ok(locations.has(base+'/en/projects/'+slug));}
});
test('URLs are unique and use the official canonical host',()=>{
 assert.equal(urls.length,locations.size);
 assert.ok(urls.every(url=>url.startsWith(base+'/')));
});
test('robots references the official sitemap',()=>assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml')));
