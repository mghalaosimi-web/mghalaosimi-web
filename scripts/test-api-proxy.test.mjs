import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_MGHAL_API_UPSTREAM, resolveMghalApiUpstream } from '../lib/api-proxy-policy.mjs';

test('only approved production hosts retain the production API origin', () => {
  for (const host of [
    'mghalaosimi-web.vercel.app',
    'mghal.vercel.app',
    'mghal-official.onrender.com'
  ]) {
    assert.equal(
      resolveMghalApiUpstream(`https://${host}/api/health`, {}),
      DEFAULT_MGHAL_API_UPSTREAM,
      host + ' must resolve to the production API'
    );
  }
});

test('all Render release and final-preview hosts fail closed by default', () => {
  for (const host of [
    'mghal-static.onrender.com',
    'mghal-release.onrender.com',
    'mghal-release-current.onrender.com',
    'mghal-final-web.onrender.com',
    'mghal-final-site.onrender.com',
    'mghal-final-preview.onrender.com'
  ]) {
    const url = `https://${host}/api/health`;
    assert.equal(resolveMghalApiUpstream(url, {}), null, host + ' must not inherit production');
    assert.equal(
      resolveMghalApiUpstream(url, { MGHAL_API_BASE: DEFAULT_MGHAL_API_UPSTREAM }),
      null,
      host + ' must ignore the production override'
    );
  }
});

test('the final web preview can use only the explicitly configured isolated Node API', () => {
  const url = 'https://mghal-final-web.onrender.com/api/health';
  assert.equal(
    resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: 'https://mghal-node-api-preview.onrender.com' }),
    'https://mghal-node-api-preview.onrender.com'
  );
  assert.equal(
    resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: DEFAULT_MGHAL_API_UPSTREAM }),
    null
  );
});

test('preview hosts never inherit the production API through the default or MGHAL_API_BASE', () => {
  const url = 'https://mghal-next-preview.onrender.com/api/health';
  assert.equal(resolveMghalApiUpstream(url, {}), null);
  assert.equal(resolveMghalApiUpstream(url, { MGHAL_API_BASE: DEFAULT_MGHAL_API_UPSTREAM }), null);
  assert.equal(resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: DEFAULT_MGHAL_API_UPSTREAM }), null);
});

test('a preview may use only an explicit isolated HTTPS Worker origin', () => {
  const url = 'https://mghal-next-preview.onrender.com/api/health';
  assert.equal(
    resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: 'https://mghal-preview-api.example.workers.dev' }),
    'https://mghal-preview-api.example.workers.dev'
  );
});

test('allows only the explicitly named isolated Render Node API host', () => {
  const url = 'https://mghal-final-preview.onrender.com/api/health';
  assert.equal(resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: 'https://mghal-node-api-preview.onrender.com' }), 'https://mghal-node-api-preview.onrender.com');
  assert.equal(resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: 'https://other-api.onrender.com' }), null);
});

test('rejects insecure, credentialed, path-based, non-Worker, or production preview upstreams', () => {
  const url = 'https://mghal-next-preview.onrender.com/api/health';
  for (const value of [
    'http://mghal-preview-api.example.workers.dev',
    'https://user:pass@mghal-preview-api.example.workers.dev',
    'https://mghal-preview-api.example.workers.dev/api',
    'https://api.example.com',
    'https://localhost:8787',
    'https://mghal-api.m-gh-alaosimi.workers.dev'
  ]) {
    assert.equal(resolveMghalApiUpstream(url, { MGHAL_PREVIEW_API_BASE: value }), null);
  }
  assert.equal(
    resolveMghalApiUpstream('https://unknown-host.example/api/health', { MGHAL_API_BASE: DEFAULT_MGHAL_API_UPSTREAM }),
    null
  );
});

test('local development fails closed until a preview API is explicitly configured', () => {
  assert.equal(resolveMghalApiUpstream('http://localhost:3000/api/health', {}), null);
});
