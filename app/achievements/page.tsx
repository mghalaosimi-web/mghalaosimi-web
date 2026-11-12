import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import ContentPages from '../content/ContentPages';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en?{title:"Achievements & Credentials | M.GH.AL",description:"Recorded professional and learning credentials, including Cisco, Edraak, and OpenJS.",alternates:localizedAlternates('/achievements','en')}:{title:"الإنجازات والمسار المهني | M.GH.AL",description:"الإنجازات والاعتمادات المسجلة من Cisco وإدراك وOpenJS.",alternates:localizedAlternates('/achievements','ar')};
}
export default async function Page(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <ContentPages kind="achievements" locale={locale}/>;}
