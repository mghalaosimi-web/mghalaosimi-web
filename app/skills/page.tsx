import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import SkillsExplorer from './SkillsExplorer';
import {getPublishedSkills} from '../../lib/public-content';
export const runtime = 'nodejs';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en
  ? {title:'Skills & Capabilities | M.GH.AL',description:'Mohammed Ghaleb Alaosimi’s skills in software development, systems engineering, data and application platforms.',alternates:localizedAlternates('/skills','en')}
  : {title:'المهارات والقدرات | M.GH.AL',description:'المهارات التقنية لمحمد غالب العصيمي في تطوير البرمجيات وهندسة الأنظمة والبيانات.',alternates:localizedAlternates('/skills','ar')};
}
export default async function SkillsPage(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <SkillsExplorer locale={locale}/>}
