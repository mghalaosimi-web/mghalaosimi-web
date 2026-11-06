import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import LabsExplorer from './LabsExplorer';
import LabsExplorerEnglish from './LabsExplorerEnglish';
import {localizedAlternates} from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en
    ? {
        title: 'Applied Security Labs',
        alternates: localizedAlternates('/labs','en'),
        description: 'Explore structured cybersecurity lab tracks for network defense, penetration testing, digital forensics, malware analysis, application security, cryptography, cloud security, and AI security.',
      }
    : {
        title: 'المعامل التطبيقية',
        alternates: localizedAlternates('/labs','ar'),
        description: 'معامل الأمن السيبراني التطبيقية: اختبار أمن الويب، Active Directory، تحليل حركة الشبكة، أمن الشبكات اللاسلكية، وتحليل البرمجيات الخبيثة ضمن بيئات معزولة ومصرح بها.',
      };
}

export default async function LabsPage() {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en ? <LabsExplorerEnglish /> : <LabsExplorer />;
}
