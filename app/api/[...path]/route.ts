const UPSTREAM = 'https://mghal-api.m-gh-alaosimi.workers.dev';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type RouteContext = { params: Promise<{ path: string[] }> };

async function proxy(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  const route = path.join('/');
  let upstreamPath: string;

  if (route === 'health') upstreamPath = '/health';
  else if (route.startsWith('public/') || route.startsWith('admin/')) upstreamPath = '/api/' + route;
  else return Response.json({ error: { code: 'NOT_FOUND', message: 'Route not found' } }, { status: 404 });

  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  if (!['GET', 'HEAD', 'POST', 'PATCH', 'DELETE'].includes(request.method)) {
    return Response.json({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } }, { status: 405 });
  }

  const incoming = new URL(request.url);
  const target = new URL(upstreamPath + incoming.search, UPSTREAM);
  const headers = new Headers();
  for (const name of ['accept', 'content-type', 'authorization']) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: 'no-store',
    redirect: 'manual'
  };
  if (!['GET', 'HEAD'].includes(request.method)) init.body = await request.arrayBuffer();

  try {
    const upstream = await fetch(target, init);
    const responseHeaders = new Headers();
    const contentType = upstream.headers.get('content-type');
    if (contentType) responseHeaders.set('content-type', contentType);
    responseHeaders.set('cache-control', 'no-store');
    responseHeaders.set('x-content-type-options', 'nosniff');
    return new Response(upstream.body, {
      status: upstream.status,
      headers: responseHeaders
    });
  } catch {
    return Response.json(
      { error: { code: 'UPSTREAM_UNAVAILABLE', message: 'The M.GH.AL API is temporarily unavailable.' } },
      { status: 502, headers: { 'cache-control': 'no-store' } }
    );
  }
}

export const GET = proxy;
export const HEAD = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
