import {cookies} from 'next/headers';
import ProjectsPageArabic from './ProjectsPageArabic';
import ProjectsExplorerEnglish from './ProjectsExplorerEnglish';
import type {Metadata} from 'next';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  const title=en?'M.GH.AL Engineering Projects':'مشاريع M.GH.AL الهندسية والتقنية';
  const description=en
    ?'Selected software engineering, enterprise systems, academic, and experimental projects by Mohammed Ghaleb Alaosimi.'
    :'أعمال محمد غالب العصيمي في تطوير البرمجيات والأنظمة المؤسسية والذكاء الاصطناعي والمشاريع الأكاديمية والتجريبية.';
  const canonical=en?'/en/projects':'/projects';
  return {
    title,
    description,
    alternates:localizedAlternates('/projects',en?'en':'ar'),
    openGraph:{
      type:'website',
      locale:en?'en_US':'ar_YE',
      url:canonical,
      siteName:'M.GH.AL',
      title,
      description,
      images:[{url:'/assets/og-image.svg',alt:'M.GH.AL — Mohammed Ghaleb Alaosimi'}],
    },
    twitter:{
      card:'summary_large_image',
      title,
      description,
      images:['/assets/og-image.svg'],
    },
  };
}
export default async function ProjectsPage(){const en=(await cookies()).get('portfolio-locale')?.value==='en';return en?<ProjectsExplorerEnglish/>:<ProjectsPageArabic/>}
