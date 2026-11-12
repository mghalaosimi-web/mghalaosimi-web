import {NextRequest,NextResponse} from 'next/server';

export function middleware(request:NextRequest){
  const requestHeaders=new Headers(request.headers);
  const cookieHeader=requestHeaders.get('cookie')??'';
  const withoutLocale=cookieHeader.replace(/(?:^|;\\s*)portfolio-locale=(?:ar|en)(?=;|$)/g,'').replace(/^;\\s*|;\\s*$/g,'');
  requestHeaders.set('cookie',[withoutLocale,'portfolio-locale=en'].filter(Boolean).join('; '));
  const response=NextResponse.next({request:{headers:requestHeaders}});
  response.cookies.set('portfolio-locale','en',{
    httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',path:'/',maxAge:60*60*24*365
  });
  return response;
}
export const config={matcher:['/en','/en/:path*']};
