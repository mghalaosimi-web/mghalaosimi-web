import { createServer } from "node:http";
import { Pool } from "pg";
import worker from "../worker.production.js";
import { PgD1Database } from "./postgres-adapter.mjs";
import { checkReadiness } from "./health.mjs";

const port = Number(process.env.PORT || 3001);
const maxBodyBytes = Number(process.env.MAX_BODY_BYTES || 2_500_000);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: Number(process.env.PG_POOL_MAX || 5),
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000,
  allowExitOnIdle: false,
  ssl: process.env.PGSSLMODE === "disable" ? false : { rejectUnauthorized: true }
});

const env = {
  DB: new PgD1Database(pool),
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  RATE_LIMIT_PER_MINUTE: process.env.RATE_LIMIT_PER_MINUTE,
  OWNER_BOOTSTRAP_TOKEN: process.env.OWNER_BOOTSTRAP_TOKEN,
  GOOGLE_AUTH_ENABLED: process.env.GOOGLE_AUTH_ENABLED,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  PUBLIC_SITE_URL: process.env.PUBLIC_SITE_URL
};

function getClientIp(headers, socket) {
  // Render/Cloudflare append the connecting client address to this header.
  // Use the last entry rather than trusting a caller-supplied first entry.
  const forwarded = headers.get("x-forwarded-for");
  const forwardedIp = forwarded?.split(",").map((value) => value.trim()).filter(Boolean).at(-1);
  return forwardedIp || headers.get("x-real-ip") || socket?.remoteAddress || "unknown";
}

async function readRequestBody(request) {
  if (["GET", "HEAD"].includes(request.method || "GET")) return undefined;

  const chunks = [];
  let total = 0;

  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buffer.byteLength;

    if (total > maxBodyBytes) {
      const error = new Error("Request body too large");
      error.statusCode = 413;
      throw error;
    }

    chunks.push(buffer);
  }

  return chunks.length ? Buffer.concat(chunks) : undefined;
}

function sendJson(response, status, body) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.setHeader("cache-control", "no-store");
  response.end(JSON.stringify(body));
}

const server = createServer(async (incoming, outgoing) => {
  try {
    const headers = new Headers();

    for (const [name, value] of Object.entries(incoming.headers)) {
      if (Array.isArray(value)) {
        for (const item of value) headers.append(name, item);
      } else if (typeof value === "string") {
        headers.set(name, value);
      }
    }

    // Never trust a client-supplied CF-Connecting-IP header on the Node service.
    headers.set("CF-Connecting-IP", getClientIp(headers, incoming.socket));

    const host = headers.get("x-forwarded-host") || headers.get("host") || `localhost:${port}`;
    const protocol = headers.get("x-forwarded-proto")?.split(",")[0]?.trim() || "http";
    const url = new URL(incoming.url || "/", `${protocol}://${host}`);

    if (incoming.method === "GET" && url.pathname === "/live") {
      sendJson(outgoing, 200, { status: "ok", runtime: "node" });
      return;
    }

    if (incoming.method === "GET" && url.pathname === "/ready") {
      const readiness = await checkReadiness(pool);
      sendJson(outgoing, readiness.statusCode, readiness.body);
      return;
    }

    const body = await readRequestBody(incoming);

    const request = new Request(url, {
      method: incoming.method || "GET",
      headers,
      ...(body ? { body } : {})
    });

    const response = await worker.fetch(request, env);
    outgoing.statusCode = response.status;

    response.headers.forEach((value, name) => {
      outgoing.setHeader(name, value);
    });

    if (incoming.method === "HEAD" || response.status === 204 || response.status === 304) {
      outgoing.end();
      return;
    }

    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    const status = Number(error?.statusCode) || 500;

    if (status === 413) {
      sendJson(outgoing, 413, {
        error: { code: "PAYLOAD_TOO_LARGE", message: "Request body is too large." }
      });
      return;
    }

    // Do not leak SQL, connection strings, or stack traces to API callers.
    console.error("M.GH.AL Node API request failed:", error?.message || "unknown error");
    sendJson(outgoing, 500, {
      error: { code: "INTERNAL_ERROR", message: "The API request could not be completed." }
    });
  }
});

server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;

server.listen(port, "0.0.0.0", () => {
  console.log(`M.GH.AL Node API listening on :${port}`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}; shutting down M.GH.AL Node API`);
  server.close(async () => {
    await pool.end();
    process.exit(0);
  });
}

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
