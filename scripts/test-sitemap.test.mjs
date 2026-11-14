import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const sitemap=readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8');
const robots=readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
const rootSitemap=readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
const base='https://mghalaosimi-web.vercel.app';
const locations=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]));

test('sitemap declares the required XML and XHTML namespaces',()=>{
 assert.match(sitemap,/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
 assert.match(sitemap,/xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
 assert.ok(sitemap.includes('<urlset '),'sitemap root element missing');
 assert.ok(sitemap.includes('</urlset>'),'sitemap closing element missing');
});

test('home and primary Next.js routes are discoverable',()=>{
 for(const path of ['/','/en/','/about','/projects','/skills','/research','/contact','/labs']){
  assert.ok(locations.has(base+path),'missing sitemap URL: '+path);
 }
 assert.ok(!locations.has(base+'/en/index.html'),'English home must use its canonical /en/ route');
});

test('bilingual Next.js routes expose matching hreflang pairs',()=>{
 const pairs=[['/about','/en/profile.html'],['/projects','/en/projects.html'],['/skills','/en/skills.html'],['/research','/en/research.html'],['/contact','/en/contact.html']];
 for(const [ar,en] of pairs){
  assert.ok(sitemap.includes('hreflang="ar" href="'+base+ar+'"'),ar+' Arabic hreflang missing');
  assert.ok(sitemap.includes('hreflang="en" href="'+base+en+'"'),en+' English hreflang missing');
  assert.ok(sitemap.includes('hreflang="x-default" href="'+base+ar+'"'),ar+' x-default missing');
 }
});

test('all twenty project detail routes are listed in both languages with canonical trailing slashes',()=>{
 const slugs=['abdulmalik-erp','abdulmalik-store-pro','ramzei-erp','manar-schedule-system','waynah','mghal-digital-os','mghal-content-os','debwan-live','alnasr-supermarket-erp','yemen-ai','academic-os2','ciphersphere','abdulmalik-store-management','academicos','almanar-schedule-system','humanity-system','focusflow','mghal-digital-automation','mghal-official-website','mghal-esdp'];
 for(const slug of slugs){
  assert.ok(locations.has(base+'/projects/'+slug+'/'),'missing Arabic project URL: '+slug);
  assert.ok(locations.has(base+'/en/projects/'+slug+'/'),'missing English project URL: '+slug);
 }
});

test('robots.txt references the same public sitemap host',()=>{
 assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml'));
});


test('root and public sitemap copies stay byte-for-byte synchronized',()=>{
 assert.equal(rootSitemap,sitemap);
});

test('sitemap locations are unique and use only the official canonical host',()=>{
 const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
 assert.equal(urls.length,new Set(urls).size,'duplicate sitemap URL entries found');
 assert.ok(urls.every(url=>url.startsWith(base+'/')),'every sitemap URL must use the official canonical domain');
 assert.ok(!sitemap.includes('mghal.vercel.app'),'legacy domain must not appear in the public sitemap');
});
