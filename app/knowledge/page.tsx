import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import ContentPages from '../content/ContentPages';
import {localizedAlternates} from '../../lib/seo';
export async function generateMetadata():Promise<Metadata>{
 const en=(await cookies()).get('portfolio-locale')?.value==='en';
 return en?{title:"Knowledge & Articles | M.GH.AL",description:"Technical articles and notes published after writing and review.",alternates:localizedAlternates('/knowledge','en')}:{title:"المعرفة والمقالات | M.GH.AL",description:"مقالات وملاحظات تقنية بعد إعدادها ومراجعتها.",alternates:localizedAlternates('/knowledge','ar')};
}
export default async function Page(){const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';return <ContentPages kind="knowledge" locale={locale}/>;}
