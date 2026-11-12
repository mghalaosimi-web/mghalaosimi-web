import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import ContentPages from '../content/ContentPages';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en?{title:"Education | M.GH.AL",description:"Academic background in Information Technology at Al-Manar College for Science and Technology, Yemen.",alternates:localizedAlternates('/education','en')}:{title:"المسيرة التعليمية | M.GH.AL",description:"المسيرة الأكاديمية في تخصص تقنية المعلومات بكلية المنار للعلوم والتكنولوجيا في اليمن.",alternates:localizedAlternates('/education','ar')};
}
export default async function Page(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <ContentPages kind="education" locale={locale}/>;}
