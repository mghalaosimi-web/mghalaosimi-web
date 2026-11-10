import test from 'node:test';
import assert from 'node:assert/strict';
import { handleMghalApiRequest } from '../../../lib/mghal-api-runtime.mjs';

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
