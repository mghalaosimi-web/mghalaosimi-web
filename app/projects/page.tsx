import {cookies} from 'next/headers';
import ProjectsPageArabic from './ProjectsPageArabic';
import ProjectsExplorerEnglish from './ProjectsExplorerEnglish';
import type {Metadata} from 'next';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{const en=(await cookies()).get('portfolio-locale')?.value==='en';return en?{title:'Engineering Projects',description:'Selected cybersecurity, software engineering, and academic projects with technical context, documented contributions, and available evidence.',alternates:localizedAlternates('/projects','en')}:{title:'المشاريع الهندسية والتقنية',description:'مجموعة من المشاريع الشخصية والأكاديمية والتعاونية في الأمن السيبراني وهندسة البرمجيات، مع توضيح التقنيات والمساهمات والأدلة المتاحة.',alternates:localizedAlternates('/projects','ar')}}
export default async function ProjectsPage(){const en=(await cookies()).get('portfolio-locale')?.value==='en';return en?<ProjectsExplorerEnglish/>:<ProjectsPageArabic/>}
