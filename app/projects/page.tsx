import {cookies} from 'next/headers';
import ProjectsPageArabic from './ProjectsPageArabic';
import ProjectsExplorerEnglish from './ProjectsExplorerEnglish';
import type {Metadata} from 'next';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{const en=(await cookies()).get('portfolio-locale')?.value==='en';return en?{title:'M.GH.AL Engineering Projects',description:'Selected software engineering, enterprise systems, academic, and experimental projects by Mohammed Ghaleb Alaosimi.',alternates:localizedAlternates('/projects','en')}:{title:'مشاريع M.GH.AL الهندسية والتقنية',description:'أعمال محمد غالب العصيمي في تطوير البرمجيات والأنظمة المؤسسية والذكاء الاصطناعي والمشاريع الأكاديمية والتجريبية.',alternates:localizedAlternates('/projects','ar')}}
export default async function ProjectsPage(){const en=(await cookies()).get('portfolio-locale')?.value==='en';return en?<ProjectsExplorerEnglish/>:<ProjectsPageArabic/>}
