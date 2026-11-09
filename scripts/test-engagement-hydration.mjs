import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const layout = read('../app/layout.tsx');
const experience = read('../app/components/SiteExperience.tsx');
const engagement = read('../public/assets/social-engagement.js');
const tracking = read('../public/assets/visitor-tracking.js');

// React must own a stable, empty mount point; legacy scripts must not be injected
// by Next Script during the initial server render.
assert.ok(layout.includes('<SiteExperience/>'), 'The post-hydration experience component must be mounted.');
assert.ok(layout.includes('id="mghal-engagement-slot"'), 'A stable engagement mount point must exist.');
assert.ok(layout.includes('suppressHydrationWarning'), 'The externally populated mount point must suppress expected hydration noise.');
assert.ok(!layout.includes("from 'next/script'") && !layout.includes('visitor-tracking.js') && !layout.includes('social-engagement.js'),
  'Legacy engagement scripts must not be injected from the server-rendered root layout.');

// Script loading must happen after hydration, only once, and in dependency order.
assert.ok(experience.includes("if (process.env.NODE_ENV !== 'production') return;"),
  'Engagement scripts must stay disabled in development.');
assert.ok(experience.includes('data-mghal-experience'), 'Script loading must detect an existing script element.');
assert.ok(experience.includes("await loadScript('/assets/visitor-tracking.js');") &&
  experience.includes("await loadScript('/assets/social-engagement.js');"),
  'Visitor initialization must load before social engagement.');
assert.ok(experience.includes("document.body.appendChild(script)"), 'Scripts must be appended client-side after hydration.');

// The external widgets must mount outside React-owned page content and must not
// enhance homepage project cards by mutating React-managed DOM.
assert.ok(engagement.includes("const main=$('main.home-v2')"), 'The homepage like panel must target the current homepage shell.');
assert.ok(engagement.includes("$('#mghal-engagement-slot')||main"), 'Engagement panels must prefer the stable external mount point.');
assert.ok(engagement.includes('main:not(.home-v2) .grid .card[data-project-slug]') &&
  engagement.includes('main:not(.home-v2) .grid .card') &&
  engagement.includes('main:not(.home-v2) .home-project-card'),
  'The legacy project enhancer must exclude React-owned homepage cards.');
assert.ok(engagement.includes('if(window.__mghalSocialEngagement)return;'),
  'The engagement script must be idempotent across repeated loads.');
assert.ok(tracking.includes('window.__mghalVisitorPromise') || tracking.includes('__mghalVisitor'),
  'Visitor tracking must expose a shared initialization promise for dependent widgets.');

console.log('Engagement hydration tests passed: stable mount point, post-hydration script order, idempotency, and React DOM ownership guards.');
