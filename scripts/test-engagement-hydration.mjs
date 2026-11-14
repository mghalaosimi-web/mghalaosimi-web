import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=(path)=>readFileSync(new URL(path,import.meta.url),'utf8');
const layout=read('../app/layout.tsx');
const experience=read('../app/components/SiteExperience.tsx');
const engagement=read('../public/assets/social-engagement.js');
const tracking=read('../public/assets/visitor-tracking.js');
const nextHome=read('../app/page.tsx');
const enHome=read('../app/HomePageEnglish.tsx');
const arProjects=read('../app/projects/ProjectsPageArabic.tsx');
const enProjects=read('../app/projects/ProjectsExplorerEnglish.tsx');

assert.ok(layout.includes('<SiteExperience/>'),'The post-hydration experience component must be mounted.');
assert.ok(layout.includes('id="mghal-engagement-slot"'),'A stable engagement mount point must exist.');
assert.ok(layout.includes('suppressHydrationWarning'),'The externally populated mount point must suppress expected hydration noise.');
assert.ok(!layout.includes("from 'next/script'")&&!layout.includes('visitor-tracking.js')&&!layout.includes('social-engagement.js'),'Legacy engagement scripts must not be injected from the server-rendered root layout.');
assert.ok(experience.includes("if (process.env.NODE_ENV !== 'production') return;"),'Engagement scripts must stay disabled in development.');
assert.ok(experience.includes('data-mghal-experience'),'Script loading must detect an existing script element.');
assert.ok(experience.includes("await loadScript('/assets/visitor-tracking.js');")&&experience.includes("await loadScript('/assets/social-engagement.js');"),'Visitor initialization must load before social engagement.');
assert.ok(experience.includes('document.body.appendChild(script)'),'Scripts must be appended client-side after hydration.');
assert.ok(engagement.includes("const main=$('main.home-v2')"),'The homepage like panel must target the React homepage shell.');
assert.ok(engagement.includes("$('#mghal-engagement-slot')||main"),'Engagement panels must prefer the stable external mount point.');
assert.ok(nextHome.includes('className="home-v2"')&&enHome.includes('className="home-v2"'),'Both homepages must be React-rendered.');
assert.ok(arProjects.includes('data-project-slug')&&enProjects.includes('data-project-slug'),'Both React project explorers must expose reaction targets.');
assert.ok(engagement.includes('if(window.__mghalSocialEngagement)return;'),'The engagement script must be idempotent.');
assert.ok(tracking.includes('window.__mghalVisitorPromise')||tracking.includes('__mghalVisitor'),'Visitor tracking must expose a shared initialization promise.');
console.log('Engagement hydration tests passed: React route ownership, stable mount point, post-hydration script order, and idempotency.');
