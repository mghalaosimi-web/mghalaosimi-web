import {NextRequest,NextResponse} from 'next/server';

export function middleware(request:NextRequest){
  const response=NextResponse.next();
  if(request.nextUrl.pathname==='/en'||request.nextUrl.pathname.startsWith('/en/')){
    response.cookies.set('portfolio-locale','en',{
      httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',
      path:'/',maxAge:60*60*24*365
    });
  }
  return response;
}

export const config={matcher:['/en/:path*']};
