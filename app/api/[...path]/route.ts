import { handleMghalApiRequest } from '@/lib/mghal-api-runtime.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 15;

type RouteContext = { params: Promise<{ path: string[] }> };

async function dispatch(request: Request, context: RouteContext): Promise<Response> {
  const { path } = await context.params;
  return handleMghalApiRequest(request, { path });
}

export const GET = dispatch;
export const HEAD = dispatch;
export const POST = dispatch;
export const PATCH = dispatch;
export const DELETE = dispatch;
export const OPTIONS = dispatch;
