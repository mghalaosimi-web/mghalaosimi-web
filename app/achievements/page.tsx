import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import ContentPages from '../content/ContentPages';
import {localizedAlternates} from '../../lib/seo';
import {getPublishedCertificates} from '../../lib/public-content';
export const runtime = 'nodejs';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en?{title:"Achievements & Credentials | M.GH.AL",description:"Recorded professional and learning credentials, including Cisco, Edraak, and OpenJS.",alternates:localizedAlternates('/achievements','en')}:{title:"الإنجازات والمسار المهني | M.GH.AL",description:"الإنجازات والاعتمادات المسجلة من Cisco وإدراك وOpenJS.",alternates:localizedAlternates('/achievements','ar')};
}
export default async function Page(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';const credentialRows=await getPublishedCertificates();return <ContentPages kind="achievements" locale={locale} credentialRows={credentialRows}/>;}
