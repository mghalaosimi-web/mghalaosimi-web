import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
const sitemap=readFileSync(new URL('../public/sitemap.xml',import.meta.url),'utf8');
const robots=readFileSync(new URL('../public/robots.txt',import.meta.url),'utf8');
const rootSitemap=readFileSync(new URL('../sitemap.xml',import.meta.url),'utf8');
const base='https://mghalaosimi-web.vercel.app';
const urls=[...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>match[1]);
const locations=new Set(urls);
const all=["abdulmalik-erp","abdulmalik-store-pro","ramzei-erp","manar-schedule-system","waynah","mghal-digital-os","mghal-content-os","debwan-live","alnasr-supermarket-erp","yemen-ai","academic-os2","ciphersphere","abdulmalik-store-management","academicos","almanar-schedule-system","focusflow","mghal-digital-automation","mghal-official-website","cryptolab-x"];
const legacy=["waynah","yemen-ai","mghal-content-os","manar-schedule-system","ciphersphere","focusflow","mghal-official-website","almanar-schedule-system"];
test('sitemap structure and copies are valid',()=>{
 assert.match(sitemap,/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/);
 assert.match(sitemap,/xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/);
 assert.ok(sitemap.startsWith('<?xml'));
 assert.ok(sitemap.includes('</urlset>'));
 assert.equal(rootSitemap,sitemap);
});
test('only clean current React routes are listed',()=>{
 for(const path of ['/','/en','/about','/en/about','/projects','/en/projects','/skills','/en/skills','/research','/en/research','/contact','/en/contact','/labs','/en/labs','/credentials','/en/credentials']) assert.ok(locations.has(base+path),'missing '+path);
 assert.ok(!sitemap.includes('.html'));
 assert.ok(!sitemap.includes('mghal.vercel.app'));
});
test('all 19 public projects are listed in the correct route form',()=>{
 for(const slug of all){
  const suffix='';
  assert.ok(locations.has(base+'/projects/'+slug+suffix),'missing Arabic project '+slug);
  assert.ok(locations.has(base+'/en/projects/'+slug+suffix),'missing English project '+slug);
 }
});
test('all 19 project locale pairs expose reciprocal hreflang links',()=>{
 for(const slug of all){
  const suffix='';
  const ar=base+'/projects/'+slug+suffix,en=base+'/en/projects/'+slug+suffix;
  assert.ok(sitemap.includes('hreflang="ar" href="'+ar+'"'),'missing Arabic hreflang '+slug);
  assert.ok(sitemap.includes('hreflang="en" href="'+en+'"'),'missing English hreflang '+slug);
  assert.ok(sitemap.includes('hreflang="x-default" href="'+ar+'"'),'missing x-default hreflang '+slug);
 }
});
test('legacy static profile pages are listed as clean bilingual URL pairs',()=>{
 for(const slug of ['achievements','education','knowledge','profile','resume','showcase']){
  const ar=base+'/'+slug,en=base+'/en/'+slug;
  assert.ok(locations.has(ar),'missing '+ar);
  assert.ok(locations.has(en),'missing '+en);
  assert.ok(sitemap.includes('hreflang="ar" href="'+ar+'"'));
  assert.ok(sitemap.includes('hreflang="en" href="'+en+'"'));
  assert.ok(sitemap.includes('hreflang="x-default" href="'+ar+'"'));
 }
});
test('URLs are unique and use the official host',()=>{
 assert.equal(urls.length,locations.size);
 assert.ok(urls.every(url=>url.startsWith(base+'/')));
 assert.ok(urls.every(url=>!url.endsWith('.html')));
});
test('robots references the official sitemap',()=>assert.ok(robots.includes('Sitemap: '+base+'/sitemap.xml')));


test('photo gallery routes and all 12 gallery images are discoverable in the sitemap',()=>{
 for(const path of ['/photos','/en/photos']) assert.ok(locations.has(base+path),'missing '+path);
 const gallery=['mghal-eid-portrait-2026.png','mghal-cultural-portrait-2026.png','mghal-with-companion-2026.jpg','mghal-professional-poster-01.png','mghal-professional-poster-02.png','mghal-brand-visual-01.png','mghal-brand-portrait-visual.png','mghal-brand-visual-02.png','mghal-reading-portrait-2026.jpg','mghal-photo-2026-07-22.jpg','mghal-photo-2026-07-28-a.jpg','mghal-photo-2026-07-28-b.jpg'];
 for(const image of gallery) assert.ok(sitemap.includes(base+'/profile-gallery/'+image),'missing gallery image '+image);
 assert.equal(rootSitemap,sitemap);
});


const seoRefreshedPaths = [
  '/', '/en',
  '/about', '/en/about',
  '/projects', '/en/projects',
  '/skills', '/en/skills',
  '/research', '/en/research',
  '/contact', '/en/contact',
  '/labs', '/en/labs',
  '/credentials', '/en/credentials',
  '/photos', '/en/photos',
  ...all.flatMap(slug => ['/projects/' + slug, '/en/projects/' + slug]),
];
const sitemapLastmodByUrl = new Map(
  [...sitemap.matchAll(/<url>([\\s\\S]*?)<\\/url>/g)].map((match) => {
    const block = match[1];
    const url = block.match(/<loc>([^<]+)<\\/loc>/)?.[1];
    const lastmod = block.match(/<lastmod>([^<]+)<\\/lastmod>/)?.[1];
    return [url, lastmod];
  }),
);
test('sitemap lastmod reflects the 2026-11-19 SEO metadata updates', () => {
  for (const path of seoRefreshedPaths) {
    const url = base + path;
    assert.equal(
      sitemapLastmodByUrl.get(url),
      '2026-11-19',
      'stale lastmod for route updated on 2026-11-19: ' + url,
    );
  }
});
