import assert from 'node:assert/strict';
import {readdirSync,existsSync} from 'node:fs';
import path from 'node:path';
const root=path.resolve('public');
const html=[];
function walk(dir){for(const entry of readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(/\.html?$/i.test(entry.name))html.push(path.relative(root,full));}}
walk(root);
assert.deepEqual(html,[],'Public static HTML pages must be migrated to React routes: '+html.join(', '));
for(const route of ['app/page.tsx','app/about/page.tsx','app/projects/page.tsx','app/credentials/page.tsx','app/education/page.tsx','app/achievements/page.tsx','app/knowledge/page.tsx','app/resume/page.tsx','app/admin/page.tsx','app/offline/page.tsx'])assert.ok(existsSync(route),'Missing canonical Next.js route: '+route);
const config=(await import('node:fs')).readFileSync('next.config.ts','utf8');
assert.ok(!config.includes('admin/index.html'),'Admin must not rewrite to a static HTML file.');
console.log('Legacy HTML audit passed: '+html.length+' public HTML files remain; all primary, admin, and offline surfaces are Next.js React routes.');
