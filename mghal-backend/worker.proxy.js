const DEFAULT_NODE_API_ORIGIN = "https://mghal-node-api-preview.onrender.com";
const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-length",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "host"
];

function resolveNodeApiOrigin(env) {
  const configured = typeof env?.NODE_API_ORIGIN === "string"
    ? env.NODE_API_ORIGIN
    : DEFAULT_NODE_API_ORIGIN;

  try {
    const parsed = new URL(configured);
    if (
      parsed.origin !== DEFAULT_NODE_API_ORIGIN ||
      parsed.pathname !== "/" ||
      parsed.search ||
      parsed.hash ||
      parsed.username ||
      parsed.password
    ) return null;
    return parsed.origin;
  } catch {
    return null;
  }
}

export default {
  async fetch(request, env = {}) {
    const upstreamOrigin = resolveNodeApiOrigin(env);
    if (!upstreamOrigin) {
      return Response.json(
        { error: { code: "UPSTREAM_NOT_CONFIGURED", message: "The M.GH.AL API upstream is not configured." } },
        { status: 503, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } }
      );
    }

    const incomingUrl = new URL(request.url);
    const target = new URL(incomingUrl.pathname + incomingUrl.search, upstreamOrigin);
    const headers = new Headers(request.headers);

    for (const name of HOP_BY_HOP_HEADERS) headers.delete(name);

    // Replace caller-supplied forwarding headers with Cloudflare's edge address.
    const clientIp = request.headers.get("CF-Connecting-IP") || "unknown";
    headers.set("x-forwarded-for", clientIp);
    headers.set("x-real-ip", clientIp);
    headers.set("x-forwarded-host", incomingUrl.host);
    headers.set("x-forwarded-proto", incomingUrl.protocol.slice(0, -1));

    const init = {
      method: request.method,
      headers,
      redirect: "manual"
    };

    if (!["GET", "HEAD"].includes(request.method)) {
      init.body = await request.arrayBuffer();
    }

    try {
      const upstream = await fetch(target, init);
      const responseHeaders = new Headers(upstream.headers);
      responseHeaders.set("cache-control", "no-store");
      responseHeaders.set("x-content-type-options", "nosniff");

      return new Response(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders
      });
    } catch {
      return Response.json(
        { error: { code: "UPSTREAM_UNAVAILABLE", message: "The M.GH.AL API is temporarily unavailable." } },
        { status: 502, headers: { "cache-control": "no-store", "x-content-type-options": "nosniff" } }
      );
    }
  }
};
