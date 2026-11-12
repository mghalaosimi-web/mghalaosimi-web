import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LabsExplorer from './LabsExplorer';
import LabsExplorerEnglish from './LabsExplorerEnglish';
import {localizedAlternates} from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en
    ? {
        title: 'Applied Engineering Labs',
        alternates: localizedAlternates('/labs','en'),
        description: 'Explore structured engineering and learning labs. Security topics are presented as an additional area of interest and study, within isolated and authorized environments.',
      }
    : {
        title: 'المعامل الهندسية التطبيقية',
        alternates: localizedAlternates('/labs','ar'),
        description: 'معامل ومسارات تعلم تطبيقية لفهم الأنظمة واختبار الضوابط وتحليل السلوك وتوثيق النتائج. موضوعات الأمن السيبراني مجال اهتمام وتعلم إضافي، وليست التخصص الأكاديمي للدرجة.',
      };
}

export default async function LabsPage() {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en ? <LabsExplorerEnglish /> : <LabsExplorer />;
}
