import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import SkillsExplorer from './SkillsExplorer';
import {localizedAlternates,localizedSocialMetadata} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 const title=en?'Skills & Capabilities':'المهارات والقدرات';
 const description=en
  ?'Mohammed Ghaleb Alaosimi’s skills in software development, systems engineering, data and application platforms.'
  :'المهارات التقنية لمحمد غالب العصيمي في تطوير البرمجيات وهندسة الأنظمة والبيانات.';
 return {
  title,
  description,
  alternates:localizedAlternates('/skills',en?'en':'ar'),
  ...localizedSocialMetadata('/skills',en?'en':'ar',title,description),
 };
}
export default async function SkillsPage(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <SkillsExplorer locale={locale}/>}
