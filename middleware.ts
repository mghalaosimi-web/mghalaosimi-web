import {NextRequest,NextResponse} from 'next/server';

const NON_PAGE_PREFIXES=['/api/','/assets/','/_next/','/language/','/profile-gallery/'];
const NON_PAGE_PATHS=new Set(['/admin','/offline','/sw.js','/manifest.json','/robots.txt','/sitemap.xml','/favicon.svg']);
const LEGACY_STATIC_PROJECT_SLUGS=new Set([
  'waynah','yemen-ai','mghal-content-os','manar-schedule-system',
  'ciphersphere','focusflow','mghal-official-website','almanar-schedule-system',
]);
const LEGACY_STATIC_PAGE_SLUGS=new Set([
  'achievements','certificates','education','knowledge','profile','resume','showcase',
]);

function setEnglishLocale(response:NextResponse,request:NextRequest){
  response.cookies.set('portfolio-locale','en',{
    httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',
    path:'/',maxAge:60*60*24*365,
  });
  return response;
}

export function middleware(request:NextRequest){
  const pathname=request.nextUrl.pathname;
  const englishStaticProject=pathname.match(/^\/en\/projects\/([^/]+)\/?$/);
  const englishStaticPage=pathname.match(/^\/en\/([^/]+)\/?$/);

  // Preserve English static HTML routes so their own English document is served.
  if(englishStaticPage&&LEGACY_STATIC_PAGE_SLUGS.has(englishStaticPage[1])){
    return setEnglishLocale(NextResponse.next(),request);
  }

  // Legacy project detail pages are paired pre-rendered HTML documents.
  if(englishStaticProject&&LEGACY_STATIC_PROJECT_SLUGS.has(englishStaticProject[1])){
    return setEnglishLocale(NextResponse.next(),request);
  }

  if(pathname==='/en'||pathname==='/en/'||pathname.startsWith('/en/')){
    request.cookies.set('portfolio-locale','en');
    const requestHeaders=new Headers(request.headers);
    requestHeaders.set('cookie',request.cookies.toString());
    const destination=request.nextUrl.clone();
    destination.pathname=pathname==='/en'||pathname==='/en/'?'/':pathname.slice(3);
    return setEnglishLocale(
      NextResponse.rewrite(destination,{request:{headers:requestHeaders}}),
      request,
    );
  }

  const locale=request.cookies.get('portfolio-locale')?.value;
  const excluded=NON_PAGE_PATHS.has(pathname)||NON_PAGE_PREFIXES.some(prefix=>pathname.startsWith(prefix));
  if(locale==='en'&&!excluded){
    const destination=request.nextUrl.clone();
    destination.pathname='/en'+(pathname==='/'?'':pathname);
    return NextResponse.redirect(destination,308);
  }
  return NextResponse.next();
}

export const config={matcher:['/:path*']};
