import {NextRequest,NextResponse} from 'next/server';

const NON_PAGE_PREFIXES=['/api/','/assets/','/_next/','/language/'];
const NON_PAGE_PATHS=new Set(['/admin','/offline','/sw.js','/manifest.json','/robots.txt','/sitemap.xml','/favicon.svg']);

export function middleware(request:NextRequest){
  const pathname=request.nextUrl.pathname;
  if(pathname==='/en'||pathname.startsWith('/en/')){
    request.cookies.set('portfolio-locale','en');
    const requestHeaders=new Headers(request.headers);
    requestHeaders.set('cookie',request.cookies.toString());
    const response=NextResponse.next({request:{headers:requestHeaders}});
    response.cookies.set('portfolio-locale','en',{
      httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',
      path:'/',maxAge:60*60*24*365
    });
    return response;
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
