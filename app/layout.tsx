import type { Metadata, Viewport } from 'next';
import {cookies} from 'next/headers';
import './globals.css';
import './mghal-portfolio.css';
import Script from 'next/script';
import SiteHeader from './components/SiteHeader';
import SiteExperience from './components/SiteExperience';
import {siteJsonLd} from '../lib/structured-data';

export const metadata: Metadata = {
  metadataBase: new URL('https://mghalaosimi-web.vercel.app'),
  title: { default: 'M.GH.AL | Mohammed Ghaleb Alaosimi', template: '%s | M.GH.AL' },
  description: 'الهوية الرقمية الرسمية لمحمد غالب العصيمي (M.GH.AL) — مطور Full-Stack وطالب تقنية معلومات، مع المشاريع والشهادات والسيرة الذاتية والروابط المهنية.',
  applicationName: 'M.GH.AL',
  manifest: '/manifest.json',
  keywords: ['محمد غالب العصيمي','Mohammed Ghaleb Alaosimi','M.GH.AL','Full-Stack Developer','Software Engineer','Information Technology','Yemen'],
  authors: [{ name: 'Mohammed Ghaleb Alaosimi', url: 'https://mghalaosimi-web.vercel.app' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ar_YE',
    url: 'https://mghalaosimi-web.vercel.app',
    siteName: 'M.GH.AL',
    title: 'M.GH.AL | Mohammed Ghaleb Alaosimi',
    description: 'الهوية الرقمية الرسمية لمحمد غالب العصيمي — Full-Stack Developer | Software Engineer | IT Student',
    images: ['/assets/og-image.svg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M.GH.AL | Mohammed Ghaleb Alaosimi',
    description: 'الهوية الرقمية الرسمية لمحمد غالب العصيمي.',
    images: ['/assets/og-image.svg']
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#172B4D'
};

export default async function RootLayout({children}:{children:React.ReactNode}) {
  const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';
  const isEn=locale==='en';
  const structuredData=JSON.stringify(siteJsonLd()).replace(/</g,'\\u003c');

  return (
    <html lang={locale} dir={isEn?'ltr':'rtl'} data-mghal-theme="dark">
      <head>
        <link rel="stylesheet" href="/assets/design-tokens.css"/>
        <link rel="stylesheet" href="/assets/social-engagement.css"/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:structuredData}}/>
      </head>
      <body>
        <a className="skip-link" href="#main">{isEn?'Skip to content':'تجاوز إلى المحتوى'}</a>
        <SiteExperience/>
        <SiteHeader isEn={isEn}/>
        {children}
        <footer className="mghal-footer">
          <a className="mghal-logo" href="/">M.GH.AL<span>.</span></a>
          <p>© {new Date().getFullYear()} Mohammed Ghaleb Alaosimi · {isEn?'All rights reserved':'جميع الحقوق محفوظة'}</p>
          <nav className="mghal-footer-nav">
            <a href="/about">{isEn?'About':'نبذة عني'}</a>
            <a href="/skills">{isEn?'Skills':'المهارات'}</a>
            <a href="/projects">{isEn?'Projects':'المشاريع'}</a>
            <a href="/labs">{isEn?'Labs':'المعامل'}</a>
            <a href="/research">{isEn?'Research':'الأبحاث'}</a>
            <a href="/credentials">{isEn?'Credentials':'الشهادات'}</a>
            <a href="/contact">{isEn?'Contact':'التواصل'}</a>
          </nav>
          <div>
            <a href="https://github.com/mghalaosimi-web" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer">ORCID</a>
            <a href="https://www.linkedin.com/in/mohammed-alaosimi-038155443/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="mailto:m.gh.alaosimi@gmail.com">Email</a>
          </div>
        </footer>
        <Script src="/assets/visitor-tracking.js" strategy="afterInteractive"/>
        <Script src="/assets/social-engagement.js" strategy="afterInteractive"/>
      </body>
    </html>
  );
}
