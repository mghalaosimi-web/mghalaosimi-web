import {NextRequest,NextResponse} from 'next/server';
import {projects} from '../../../../data/projects';

export async function GET(request:NextRequest,{params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 if(!projects.some(project=>project.slug===slug))return NextResponse.redirect(new URL('/projects',request.url),303);
 const destination=new URL('/projects/'+encodeURIComponent(slug),request.url);
 const response=NextResponse.redirect(destination,303);
 response.cookies.set('portfolio-locale','en',{httpOnly:true,sameSite:'lax',secure:request.nextUrl.protocol==='https:',path:'/',maxAge:60*60*24*365});
 return response;
}
