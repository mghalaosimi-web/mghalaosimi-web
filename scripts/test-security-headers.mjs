import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const config = readFileSync(new URL('../next.config.ts', import.meta.url), 'utf8');

const requiredHeaders = {
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

assert.match(config, /async headers\(\)/, 'Next.js must expose a response-header policy.');
assert.match(config, /source:\s*'\/:path\*'/, 'Security headers must cover every route and static asset.');

for (const [name, value] of Object.entries(requiredHeaders)) {
  assert.ok(config.includes("key: '" + name + "'"), 'Missing security header: ' + name);
  assert.ok(config.includes("value: '" + value + "'"), 'Incorrect security-header value: ' + name);
}

console.log('Security-header tests passed: HSTS, MIME sniffing protection, clickjacking protection, referrer policy, and restricted browser capabilities.');
