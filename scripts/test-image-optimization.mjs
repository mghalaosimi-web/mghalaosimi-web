import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const config = read('../next.config.ts');
const credentials = read('../app/credentials/page.tsx');
const photos = read('../app/photos/page.tsx');
const home = read('../app/page.tsx');

assert.doesNotMatch(
  config,
  /images\s*:\s*\{\s*unoptimized\s*:\s*true\s*\}/,
  'Local Next.js images must use the Vercel image optimizer by default.',
);
assert.match(
  credentials,
  /unoptimized=\{\(credential\.preview\|\|credential\.badgeImage\)!\.startsWith\('https:\/\/'\)\}/,
  'Remote credential previews must remain explicitly unoptimized.',
);
assert.match(
  credentials,
  /unoptimized className="credential-badge-image"/,
  'Remote Credly badge images must remain explicitly unoptimized.',
);
assert.match(photos, /<Image[\s\S]*?fill[\s\S]*?sizes=/, 'The gallery must use responsive Next.js image sizing.');
assert.match(home, /<Image[\s\S]*?priority[\s\S]*?sizes=/, 'The primary profile image must retain priority and responsive sizing.');

console.log('M.GH.AL image optimization audit passed: local images optimized, remote credential images preserved, responsive sizing retained.');
