import test from "node:test";
import assert from "node:assert/strict";
import worker from "../../worker.proxy.js";

test("proxy preserves API path, query, origin, visitor token and Cloudflare client IP", async () => {
  const originalFetch = globalThis.fetch;
  let captured;

  globalThis.fetch = async (input, init) => {
    captured = { url: new URL(input), init };
    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "content-type": "application/json", "x-upstream": "node-neon" }
    });
  };

  try {
    const request = new Request(
      "https://mghal-api.m-gh-alaosimi.workers.dev/api/public/reactions?targetType=project&targetId=waynah",
      {
        method: "GET",
        headers: {
          Origin: "https://mghalaosimi-web.vercel.app",
          "CF-Connecting-IP": "203.0.113.10",
          "X-Visitor-Token": "visitor-token-value"
        }
      }
    );

    const response = await worker.fetch(request, {
      NODE_API_ORIGIN: "https://mghal-node-api-preview.onrender.com"
    });

    assert.equal(captured.url.origin, "https://mghal-node-api-preview.onrender.com");
    assert.equal(captured.url.pathname, "/api/public/reactions");
    assert.equal(captured.url.search, "?targetType=project&targetId=waynah");
    assert.equal(captured.init.headers.get("origin"), "https://mghalaosimi-web.vercel.app");
    assert.equal(captured.init.headers.get("x-visitor-token"), "visitor-token-value");
    assert.equal(captured.init.headers.get("x-forwarded-for"), "203.0.113.10");
    assert.equal(captured.init.headers.get("x-real-ip"), "203.0.113.10");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("x-upstream"), "node-neon");
    assert.deepEqual(await response.json(), { status: "ok" });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("proxy forwards POST bodies and preserves upstream status", async () => {
  const originalFetch = globalThis.fetch;
  let capturedBody;

  globalThis.fetch = async (_input, init) => {
    capturedBody = JSON.parse(new TextDecoder().decode(init.body));
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { "content-type": "application/json" }
    });
  };

  try {
    const request = new Request("https://mghal-api.m-gh-alaosimi.workers.dev/api/public/visitors", {
      method: "POST",
      headers: { "content-type": "application/json", "CF-Connecting-IP": "203.0.113.11" },
      body: JSON.stringify({ path: "/" })
    });

    const response = await worker.fetch(request, {});
    assert.deepEqual(capturedBody, { path: "/" });
    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), { success: true });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("proxy fails closed when the upstream origin is changed", async () => {
  const response = await worker.fetch(
    new Request("https://mghal-api.m-gh-alaosimi.workers.dev/health"),
    { NODE_API_ORIGIN: "https://attacker.example" }
  );

  assert.equal(response.status, 503);
  assert.equal((await response.json()).error.code, "UPSTREAM_NOT_CONFIGURED");
});

test("proxy returns a safe 502 response when Node API is unavailable", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => { throw new Error("upstream unavailable"); };

  try {
    const response = await worker.fetch(
      new Request("https://mghal-api.m-gh-alaosimi.workers.dev/health"),
      {}
    );
    assert.equal(response.status, 502);
    assert.equal((await response.json()).error.code, "UPSTREAM_UNAVAILABLE");
  } finally {
    globalThis.fetch = originalFetch;
  }
});
