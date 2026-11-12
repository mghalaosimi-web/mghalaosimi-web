export const runtime = 'nodejs';
import {cookies} from 'next/headers';
import type {Metadata} from 'next';
import ProjectsPageArabic from './ProjectsPageArabic';
import ProjectsExplorerEnglish from './ProjectsExplorerEnglish';
import {localizedAlternates} from '../../lib/seo';
import {getPublishedProjectRows} from '../../lib/public-projects';
import {mergePublishedProjects} from '../../data/projects';

export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en
  ?{title:'M.GH.AL Engineering Projects',description:'Selected software engineering, enterprise systems, academic, and experimental projects by Mohammed Ghaleb Alaosimi.',alternates:localizedAlternates('/projects','en')}
  :{title:'مشاريع M.GH.AL الهندسية والتقنية',description:'أعمال محمد غالب العصيمي في تطوير البرمجيات والأنظمة المؤسسية والذكاء الاصطناعي والمشاريع الأكاديمية والتجريبية.',alternates:localizedAlternates('/projects','ar')};
}

export default async function ProjectsPage(){
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 const locale=en?'en':'ar';
 const rows=await getPublishedProjectRows(locale);
 const publishedProjects=mergePublishedProjects(rows,locale);
 return en
  ?<ProjectsExplorerEnglish projects={publishedProjects}/>
  :<ProjectsPageArabic projects={publishedProjects}/>;
}
