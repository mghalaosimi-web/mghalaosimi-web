import test from 'node:test';
import assert from 'node:assert/strict';
import { handleMghalApiRequest, getPublicProjectsForLocale, getPublicCertificates, getPublicSkills } from '../../../lib/mghal-api-runtime.mjs';

test('API fails closed when a preview deployment has no isolated database URL', async () => {
  const response = await handleMghalApiRequest(
    new Request('https://preview.example.vercel.app/api/public/projects'),
    { path: ['public', 'projects'] },
    { environment: {}, getPool: () => null },
  );

  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), {
    error: { code: 'DATABASE_NOT_CONFIGURED', message: 'The application database is not configured.' },
  });
});

test('dispatches API requests internally and preserves method, query, auth, visitor token and body', async () => {
  let captured;
  const apiHandler = {
    async fetch(request, environment) {
      captured = { request, environment };
      return Response.json({ ok: true }, { status: 201 });
    },
  };

  const response = await handleMghalApiRequest(
    new Request('https://mghalaosimi-web.vercel.app/api/admin/projects?status=published', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        authorization: 'Bearer session-token',
        'x-visitor-token': 'visitor-token',
        'x-forwarded-for': '198.51.100.8, 203.0.113.7',
        'x-client-ip': '192.0.2.200',
      },
      body: JSON.stringify({ name: 'M.GH.AL' }),
    }),
    { path: ['admin', 'projects'] },
    {
      environment: {
        DATABASE_URL: 'postgresql://test.invalid/db',
        ALLOWED_ORIGINS: 'https://mghalaosimi-web.vercel.app',
        VERCEL_ENV: 'production',
      },
      getPool: () => ({ query: async () => ({ rows: [{ ok: 1 }] }) }),
      apiHandler,
    },
  );

  assert.equal(response.status, 201);
  assert.equal(captured.request.url, 'https://mghalaosimi-web.vercel.app/api/admin/projects?status=published');
  assert.equal(captured.request.method, 'POST');
  assert.equal(captured.request.headers.get('authorization'), 'Bearer session-token');
  assert.equal(captured.request.headers.get('x-visitor-token'), 'visitor-token');
  assert.equal(captured.request.headers.get('x-client-ip'), '203.0.113.7');
  assert.deepEqual(await captured.request.json(), { name: 'M.GH.AL' });
  assert.equal(captured.environment.VERCEL_ENV, 'production');
  assert.ok(captured.environment.DB);
});

test('readiness verifies the database using SELECT 1', async () => {
  let statement;
  const response = await handleMghalApiRequest(
    new Request('https://mghalaosimi-web.vercel.app/api/ready'),
    { path: ['ready'] },
    {
      environment: { DATABASE_URL: 'configured' },
      getPool: () => ({
        async query(sql) {
          statement = sql;
          return { rows: [{ ok: 1 }] };
        },
      }),
    },
  );

  assert.equal(statement, 'SELECT 1 AS ok');
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ready', database: 'connected' });
});

test('rejects unsupported methods and unknown paths without database access', async () => {
  let poolRequested = false;
  const dependencies = {
    environment: {},
    getPool: () => { poolRequested = true; return null; },
  };

  const methodResponse = await handleMghalApiRequest(
    new Request('https://example.vercel.app/api/public/projects', { method: 'PUT' }),
    { path: ['public', 'projects'] },
    dependencies,
  );
  assert.equal(methodResponse.status, 405);

  const pathResponse = await handleMghalApiRequest(
    new Request('https://example.vercel.app/api/internal/secret'),
    { path: ['internal', 'secret'] },
    dependencies,
  );
  assert.equal(pathResponse.status, 404);
  assert.equal(poolRequested, false);
});

test('rejects oversized request bodies before dispatch', async () => {
  const body = new Uint8Array(2_500_001);
  const response = await handleMghalApiRequest(
    new Request('https://example.vercel.app/api/public/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body,
    }),
    { path: ['public', 'comments'] },
    {
      environment: { DATABASE_URL: 'configured' },
      getPool: () => ({ query: async () => ({ rows: [{ ok: 1 }] }) }),
      apiHandler: { fetch: async () => { throw new Error('must not dispatch'); } },
    },
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large.' },
  });
});


test('stops reading an oversized streaming request body as soon as the limit is crossed', async () => {
  let pulls = 0;
  let cancelled = false;
  const stream = new ReadableStream({
    pull(controller) {
      pulls += 1;
      if (pulls === 1) controller.enqueue(new Uint8Array(1_500_000));
      else if (pulls === 2) controller.enqueue(new Uint8Array(1_000_001));
      else controller.enqueue(new Uint8Array(1));
    },
    cancel() {
      cancelled = true;
    },
  }, { highWaterMark: 0 });

  const response = await handleMghalApiRequest(
    new Request('https://mghalaosimi-web.vercel.app/api/public/comments', {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: stream,
      duplex: 'half',
    }),
    { path: ['public', 'comments'] },
    {
      environment: { DATABASE_URL: 'configured' },
      getPool: () => ({ query: async () => ({ rows: [{ ok: 1 }] }) }),
      apiHandler: { fetch: async () => { throw new Error('must not dispatch'); } },
    },
  );

  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), {
    error: { code: 'PAYLOAD_TOO_LARGE', message: 'Request body is too large.' },
  });
  assert.equal(cancelled, true);
  assert.equal(pulls, 2);
});

test('public project reader returns null when Neon is not configured and does not query', async () => {
  let queried = false;
  const result = await getPublicProjectsForLocale('ar', {
    environment: {},
    getPool: () => null,
  });
  assert.equal(result, null);
  assert.equal(queried, false);
});

test('public project reader uses a locale-safe published-only PostgreSQL query', async () => {
  let captured;
  const rows = [{ slug: 'waynah', name: 'وَيْنَه؟', status: 'In Progress' }];
  const result = await getPublicProjectsForLocale('ar', {
    environment: { DATABASE_URL: 'configured' },
    getPool: () => ({
      async query(sql, values) {
        captured = { sql, values };
        return { rows };
      },
    }),
  });
  assert.deepEqual(result, rows);
  assert.deepEqual(captured.values, ['ar', 'ar', 'ar']);
  assert.match(captured.sql, /is_published\s*=\s*1/);
  assert.match(captured.sql, /status\s*<>\s*'Archived'/);
  assert.match(captured.sql, /COALESCE\(NULLIF\(name_ar, ''\), name\)/);
  assert.match(captured.sql, /ORDER BY sort_order ASC/);
  assert.match(captured.sql, /^\s*SELECT\b/i);
});

test('public project reader normalizes unknown locales to English', async () => {
  let values;
  await getPublicProjectsForLocale('fr', {
    environment: { DATABASE_URL: 'configured' },
    getPool: () => ({
      async query(_sql, params) { values = params; return { rows: [] }; },
    }),
  });
  assert.deepEqual(values, ['en', 'en', 'en']);
});

test('public certificate reader returns null when Neon is unavailable', async () => {
  const result = await getPublicCertificates({ environment: {}, getPool: () => null });
  assert.equal(result, null);
});

test('public certificate reader returns only published issuer metadata in stable order', async () => {
  let captured;
  const rows = [{ slug: 'jsnad-node-js-application-developer-01', title: 'JSNAD' }];
  const result = await getPublicCertificates({
    environment: { DATABASE_URL: 'configured' },
    getPool: () => ({
      async query(sql, values) {
        captured = { sql, values };
        return { rows };
      },
    }),
  });
  assert.deepEqual(result, rows);
  assert.deepEqual(captured.values, undefined);
  assert.match(captured.sql, /^\s*SELECT\b/i);
  assert.match(captured.sql, /FROM certificates/);
  assert.match(captured.sql, /WHERE is_published = 1/);
  assert.match(captured.sql, /ORDER BY sort_order ASC/);
});

test('published skills reader handles an unavailable database without fabricating records', async () => {
  const result = await getPublicSkills({ environment: {}, getPool: () => null });
  assert.equal(result, null);
});

test('published skills reader performs a read-only published query', async () => {
  let captured;
  const rows = [{ id: 'skill-01', name: 'React', category: 'Frontend' }];
  const result = await getPublicSkills({
    environment: { DATABASE_URL: 'configured' },
    getPool: () => ({
      async query(sql, values) {
        captured = { sql, values };
        return { rows };
      },
    }),
  });
  assert.deepEqual(result, rows);
  assert.equal(captured.values, undefined);
  assert.match(captured.sql, /^\s*SELECT\b/i);
  assert.match(captured.sql, /FROM skills/);
  assert.match(captured.sql, /WHERE is_published = 1/);
  assert.match(captured.sql, /ORDER BY sort_order ASC/);
});
