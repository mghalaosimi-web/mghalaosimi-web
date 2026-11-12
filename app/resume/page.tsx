import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import ContentPages from '../content/ContentPages';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en?{title:"Resume | Mohammed Ghaleb Alaosimi",description:"Professional CV of Mohammed Ghaleb Alaosimi, Full-Stack Developer and Information Technology student.",alternates:localizedAlternates('/resume','en')}:{title:"السيرة الذاتية | محمد غالب العصيمي",description:"السيرة الذاتية المهنية لمحمد غالب العصيمي، مطور برمجيات وطالب تقنية معلومات.",alternates:localizedAlternates('/resume','ar')};
}
export default async function Page(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <ContentPages kind="resume" locale={locale}/>;}
