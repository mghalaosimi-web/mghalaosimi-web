import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import AboutTabs from './AboutTabs';
import AboutTabsEnglish from './AboutTabsEnglish';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en?{title:'About Me',description:'Mohammed Ghaleb Alaosimi’s profile: academic journey, areas of interest, projects, student leadership, and professional direction.',alternates:localizedAlternates('/about','en'),openGraph:{images:[{url:'/assets/images/mghal-avatar.webp',width:640,height:640,alt:'Mohammed Ghaleb Alaosimi'}]}}:{title:'نبذة عني',description:'الملف الشخصي لمحمد غالب العصيمي: المسار الأكاديمي، مجالات الاهتمام، المشاريع، المسؤولية العلمية والرؤية المهنية.',alternates:localizedAlternates('/about','ar'),openGraph:{images:[{url:'/assets/images/mghal-avatar.webp',width:640,height:640,alt:'محمد غالب العصيمي'}]}};
}
export default async function AboutPage(){const locale=(await cookies()).get('portfolio-locale')?.value;return locale==='en'?<AboutTabsEnglish/>:<AboutTabs/>}
