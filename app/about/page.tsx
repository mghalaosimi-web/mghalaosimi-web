import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import AboutTabs from './AboutTabs';
import AboutTabsEnglish from './AboutTabsEnglish';
import {localizedAlternates,localizedSocialMetadata} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 const title=en?'About Me':'نبذة عني';
 const description=en
  ?'Mohammed Ghaleb Alaosimi’s profile: academic journey, areas of interest, projects, student leadership, and professional direction.'
  :'الملف الشخصي لمحمد غالب العصيمي: المسار الأكاديمي، مجالات الاهتمام، المشاريع، المسؤولية العلمية والرؤية المهنية.';
 return {
  title,
  description,
  alternates:localizedAlternates('/about',en?'en':'ar'),
  ...localizedSocialMetadata('/about',en?'en':'ar',title,description,'/assets/images/mghal-profile-primary.jpg',en?'Mohammed Ghaleb Alaosimi':'محمد غالب العصيمي'),
 };
}
export default async function AboutPage(){const locale=(await cookies()).get('portfolio-locale')?.value;return locale==='en'?<AboutTabsEnglish/>:<AboutTabs/>}
