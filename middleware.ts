import {NextRequest,NextResponse} from 'next/server';

export function middleware(request:NextRequest){
  if(request.nextUrl.pathname==='/en'||request.nextUrl.pathname.startsWith('/en/')){
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
  return NextResponse.next();
}

export const config={matcher:['/en/:path*']};
