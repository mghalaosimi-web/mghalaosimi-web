import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import SkillsExplorer from './SkillsExplorer';
export const metadata:Metadata={title:'المهارات والقدرات | Skills & Capabilities',description:'المهارات التقنية لمحمد غالب العصيمي في تطوير البرمجيات وهندسة الأنظمة والبيانات.'};
export default async function SkillsPage(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <SkillsExplorer locale={locale}/>}
