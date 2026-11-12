import {NextRequest,NextResponse} from 'next/server';

export function middleware(request:NextRequest){
 const pathname=request.nextUrl.pathname;
 const englishPath=pathname==='/en'||pathname.startsWith('/en/');
 const requestHeaders=new Headers(request.headers);
 if(englishPath){
  const cookieHeader=requestHeaders.get('cookie')??'';
  const withoutLocale=cookieHeader.replace(/(?:^|;\s*)portfolio-locale=(?:ar|en)(?=;|$)/g,'').replace(/^;\s*|;\s*$/g,'');
  requestHeaders.set('cookie',[withoutLocale,'portfolio-locale=en'].filter(Boolean).join('; '));
  const response=NextResponse.next({request:{headers:requestHeaders}});
  response.cookies.set('portfolio-locale','en',{httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',path:'/',maxAge:60*60*24*365});
  return response;
 }
 if(request.cookies.get('portfolio-locale')?.value==='en'){
  const destination=request.nextUrl.clone();
  destination.pathname=pathname==='/'?'/en':'/en'+pathname;
  return NextResponse.redirect(destination,308);
 }
 return NextResponse.next();
}
export const config={matcher:['/((?!api|_next/static|_next/image|assets|favicon\\.svg|favicon\\.ico|manifest\\.json|robots\\.txt|sitemap\\.xml|sw\\.js|offline\\.html|admin|language).*)']};
