import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';
import {localizedAlternates} from '../../lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en
    ? { title: 'Digital Credentials | Mohammed Ghaleb Alaosimi', description: 'Eleven owner-verified Cisco badges, six Edraak certificates, and the OpenJS Node.js Application Developer credential.', alternates: localizedAlternates('/credentials','en') }
    : { title: 'الشهادات والاعتمادات | M.GH.AL', description: '11 شارة Cisco موثقة، و6 شهادات من إدراك، واعتماد JSNAD من OpenJS وThe Linux Foundation.', alternates: localizedAlternates('/credentials','ar') };
}

export default async function CredentialsPage() {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  redirect(en ? '/en/certificates.html' : '/certificates.html');
}
