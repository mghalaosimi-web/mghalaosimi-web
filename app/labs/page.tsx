import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LabsExplorer from './LabsExplorer';
import LabsExplorerEnglish from './LabsExplorerEnglish';
import {localizedAlternates,localizedSocialMetadata} from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  const title=en?'Applied Engineering Labs':'المعامل الهندسية التطبيقية';
  const description=en
    ?'Explore structured engineering and learning labs. Security topics are presented as an additional area of interest and study, within isolated and authorized environments.'
    :'معامل ومسارات تعلم تطبيقية لفهم الأنظمة واختبار الضوابط وتحليل السلوك وتوثيق النتائج. موضوعات الأمن السيبراني مجال اهتمام وتعلم إضافي، وليست التخصص الأكاديمي للدرجة.';
  return {
    title,
    description,
    alternates:localizedAlternates('/labs',en?'en':'ar'),
    ...localizedSocialMetadata('/labs',en?'en':'ar',title,description),
  };
}

export default async function LabsPage() {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en ? <LabsExplorerEnglish /> : <LabsExplorer />;
}
