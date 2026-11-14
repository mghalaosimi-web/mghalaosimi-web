import {NextRequest,NextResponse} from 'next/server';

export function GET(request:NextRequest){
  const destination=new URL('/language/en?next=/',request.url);
  return NextResponse.redirect(destination,303);
}
