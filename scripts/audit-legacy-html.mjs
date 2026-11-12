import assert from 'node:assert/strict';
import {readdirSync,existsSync,readFileSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve('public');
const html=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.html?$/i.test(entry.name))html.push(path.relative(root,full));}}
walk(root);
assert.deepEqual(html,[],'Public static HTML pages must be migrated to React routes: '+html.join(', '));
const retiredScripts=['accessibility.js','article-feed.js','article-page.js','database-content.js','home.js','project-cards.js','project-listing.js','projects.js','section-rail.js','site.js'];
for(const file of retiredScripts)assert.ok(!existsSync(path.join(root,'assets',file)),'Legacy DOM script must be retired: '+file);
for(const route of ['app/page.tsx','app/about/page.tsx','app/projects/page.tsx','app/credentials/page.tsx','app/education/page.tsx','app/achievements/page.tsx','app/knowledge/page.tsx','app/resume/page.tsx','app/admin/page.tsx','app/offline/page.tsx'])assert.ok(existsSync(route),'Missing canonical Next.js route: '+route);
const config=readFileSync('next.config.ts','utf8');
assert.ok(!config.includes("destination:'/admin/index.html'"),'Admin must not rewrite to a static HTML file.');
assert.ok(config.includes("source:'/admin/index.html',destination:'/admin'"),'Legacy admin URL must redirect to the React route.');
assert.ok(config.includes("source:'/offline.html',destination:'/offline'"),'Legacy offline URL must redirect to the React route.');
console.log('Frontend migration audit passed: '+html.length+' public HTML files and '+retiredScripts.length+' orphaned DOM scripts remain; primary, admin, offline, and project surfaces use Next.js React.');
