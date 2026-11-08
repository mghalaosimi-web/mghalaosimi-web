import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = new Set(['ar', 'en']);

function getSafeDestination(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\\\')) return '/';

  try {
    const decoded = decodeURIComponent(value);
    if (!decoded.startsWith('/') || decoded.startsWith('//') || decoded.includes('\\\\')) return '/';
    return decoded;
  } catch {
    return '/';
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  if (!SUPPORTED_LOCALES.has(locale)) {
    return NextResponse.redirect(new URL('/', request.url), 303);
  }

  const destination = getSafeDestination(request.nextUrl.searchParams.get('next'));
  const response = NextResponse.redirect(new URL(destination, request.url), 303);

  response.cookies.set('portfolio-locale', locale, {
    httpOnly: true,
    sameSite: 'lax',
    secure: request.nextUrl.protocol === 'https:',
    path: '/',
    maxAge: 60 * 60 * 24 * 365
  });

  return response;
}
