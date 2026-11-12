import { Pool } from 'pg';
import apiHandler from '../mghal-backend/api-handler.mjs';
import { PgPreparedDatabase } from '../mghal-backend/node/postgres-adapter.mjs';
import { checkReadiness } from '../mghal-backend/node/health.mjs';

const POOL_KEY = Symbol.for('mghal.vercel.postgres.pool');
const MAX_BODY_BYTES = 2_500_000;
const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST', 'PATCH', 'DELETE', 'OPTIONS']);

function getDatabasePool(environment) {
  const connectionString = environment.DATABASE_URL;
  if (typeof connectionString !== 'string' || !connectionString.trim()) return null;

  if (!globalThis[POOL_KEY]) {
    const pool = new Pool({
      connectionString,
      max: 2,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 5_000,
      allowExitOnIdle: true,
      ssl: { rejectUnauthorized: true },
    });

    pool.on('error', (error) => {
      console.error('M.GH.AL PostgreSQL pool error:', error?.code || 'UNKNOWN');
    });

    globalThis[POOL_KEY] = pool;
  }

  return globalThis[POOL_KEY];
}

function jsonError(status, code, message) {
  return Response.json(
    { error: { code, message } },
    { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } },
  );
}

function getClientIp(headers) {
  const forwarded = headers.get('x-forwarded-for');
  const forwardedIp = forwarded?.split(',').map((value) => value.trim()).filter(Boolean).at(-1);
  return forwardedIp || headers.get('x-real-ip') || 'unknown';
}

/**
 * Dispatch the existing M.GH.AL API handler inside the current Vercel Node.js
 * function. The optional dependencies argument is used only by isolated tests.
 */
export async function handleMghalApiRequest(request, context, dependencies = {}) {
  const environment = dependencies.environment || process.env;
  const api = dependencies.apiHandler || apiHandler;
  const getPool = dependencies.getPool || getDatabasePool;
  const route = (context?.path || []).join('/');

  let apiPath;
  if (route === 'health') apiPath = '/health';
  else if (route === 'ready') apiPath = '/ready';
  else if (route.startsWith('public/') || route.startsWith('admin/')) apiPath = '/api/' + route;
  else return jsonError(404, 'NOT_FOUND', 'Route not found');

  if (!ALLOWED_METHODS.has(request.method)) {
    return jsonError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
  }

  const pool = getPool(environment);
  if (!pool) {
    return jsonError(503, 'DATABASE_NOT_CONFIGURED', 'The application database is not configured.');
  }

  if (route === 'ready') {
    if (request.method !== 'GET') {
      return jsonError(405, 'METHOD_NOT_ALLOWED', 'Method not allowed');
    }
    const readiness = await checkReadiness(pool);
    return Response.json(readiness.body, {
      status: readiness.statusCode,
      headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
    });
  }

  let body;
  if (!['GET', 'HEAD'].includes(request.method)) {
    const declaredLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return jsonError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
    }

    if (request.body) {
      const reader = request.body.getReader();
      const chunks = [];
      let totalBytes = 0;

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          totalBytes += value.byteLength;
          if (totalBytes > MAX_BODY_BYTES) {
            await reader.cancel().catch(() => {});
            return jsonError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
          }

          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }

      const limitedBody = new Uint8Array(totalBytes);
      let offset = 0;
      for (const chunk of chunks) {
        limitedBody.set(chunk, offset);
        offset += chunk.byteLength;
      }
      body = limitedBody.buffer;
    }
  } else {
    const declaredLength = Number(request.headers.get('content-length') || 0);
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return jsonError(413, 'PAYLOAD_TOO_LARGE', 'Request body is too large.');
    }
  }

  const incoming = new URL(request.url);
  incoming.pathname = apiPath;
  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('X-Client-IP', getClientIp(request.headers));

  const apiRequest = new Request(incoming, {
    method: request.method,
    headers,
    ...(body !== undefined ? { body } : {}),
  });

  const apiEnvironment = {
    DB: new PgPreparedDatabase(pool),
    ALLOWED_ORIGINS: environment.ALLOWED_ORIGINS,
    RATE_LIMIT_PER_MINUTE: environment.RATE_LIMIT_PER_MINUTE,
    OWNER_BOOTSTRAP_TOKEN: environment.OWNER_BOOTSTRAP_TOKEN,
    GOOGLE_AUTH_ENABLED: environment.GOOGLE_AUTH_ENABLED,
    GOOGLE_CLIENT_ID: environment.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: environment.GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI: environment.GOOGLE_REDIRECT_URI,
    PUBLIC_SITE_URL: environment.PUBLIC_SITE_URL,
    VERCEL_ENV: environment.VERCEL_ENV,
    VERCEL_URL: environment.VERCEL_URL,
  };

  try {
    return await api.fetch(apiRequest, apiEnvironment);
  } catch (error) {
    console.error('M.GH.AL API request failed:', error?.code || 'UNEXPECTED_ERROR');
    return jsonError(500, 'INTERNAL_ERROR', 'The API request could not be completed.');
  }
}


/**
 * Read the public project catalogue from the authoritative PostgreSQL database.
 * Returns null when the database is not configured or temporarily unavailable;
 * an empty array means the database was reached and has no published projects.
 * This server-only read bypasses the public API rate limiter while preserving
 * the same published-row filter and locale projection as /api/public/projects.
 */
export async function getPublicProjectsForLocale(locale = 'ar', dependencies = {}) {
  const environment = dependencies.environment || process.env;
  const getPool = dependencies.getPool || getDatabasePool;
  let pool;

  try {
    pool = getPool(environment);
  } catch (error) {
    console.error('M.GH.AL public project query could not acquire a database pool:', error?.code || 'UNKNOWN');
    return null;
  }

  if (!pool) return null;

  const language = locale === 'ar' ? 'ar' : 'en';
  const sql = `
    SELECT
      id,
      slug,
      CASE WHEN $1 = 'ar' THEN COALESCE(NULLIF(name_ar, ''), name) ELSE name END AS name,
      locale,
      CASE WHEN $2 = 'ar' THEN COALESCE(NULLIF(short_description_ar, ''), short_description) ELSE short_description END AS short_description,
      CASE WHEN $3 = 'ar' THEN COALESCE(NULLIF(description_ar, ''), description) ELSE description END AS description,
      status,
      repository_url,
      live_url,
      cover_media_id,
      started_at,
      completed_at,
      sort_order,
      created_at,
      updated_at
    FROM projects
    WHERE is_published = 1 AND status <> 'Archived'
    ORDER BY sort_order ASC
    LIMIT 100
  `;

  try {
    const result = await pool.query(sql, [language, language, language]);
    return result.rows;
  } catch (error) {
    console.error('M.GH.AL public project query failed:', error?.code || 'UNKNOWN');
    return null;
  }
}


/**
 * Read published certificate metadata from Neon. null means unavailable;
 * an empty array is an authoritative empty publication set.
 */
export async function getPublicCertificates(dependencies = {}) {
  const environment = dependencies.environment || process.env;
  const getPool = dependencies.getPool || getDatabasePool;
  let pool;
  try {
    pool = getPool(environment);
  } catch (error) {
    console.error('M.GH.AL public certificate query could not acquire a database pool:', error?.code || 'UNKNOWN');
    return null;
  }
  if (!pool) return null;

  try {
    const result = await pool.query(`
      SELECT id, slug, title, issuer, category, credential_id, issued_at,
             expires_at, verification_url, image_media_id, pdf_media_id,
             qr_url, description, sort_order
      FROM certificates
      WHERE is_published = 1
      ORDER BY sort_order ASC
      LIMIT 100
    `);
    return result.rows;
  } catch (error) {
    console.error('M.GH.AL public certificate query failed:', error?.code || 'UNKNOWN');
    return null;
  }
}


/**
 * Read the public skills directory from Neon. null means unavailable;
 * an empty array is an authoritative empty publication set.
 */
export async function getPublicSkills(dependencies = {}) {
  const environment = dependencies.environment || process.env;
  const getPool = dependencies.getPool || getDatabasePool;
  let pool;
  try {
    pool = getPool(environment);
  } catch (error) {
    console.error('M.GH.AL public skills query could not acquire a database pool:', error?.code || 'UNKNOWN');
    return null;
  }
  if (!pool) return null;

  try {
    const result = await pool.query(`
      SELECT id, name, locale, category, proficiency, sort_order
      FROM skills
      WHERE is_published = 1
      ORDER BY sort_order ASC
      LIMIT 200
    `);
    return result.rows;
  } catch (error) {
    console.error('M.GH.AL public skills query failed:', error?.code || 'UNKNOWN');
    return null;
  }
}
