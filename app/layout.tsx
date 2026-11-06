import type { Metadata, Viewport } from 'next';
import {cookies} from 'next/headers';
import './globals.css';
import './mghal-portfolio.css';
import Script from 'next/script';
export const metadata: Metadata = {
 metadataBase: new URL('https://mghalaosimi-web.vercel.app'),
 title: { default: 'M.GH.AL | Mohammed Ghaleb Alaosimi', template: '%s | M.GH.AL' },
 description: 'الهوية الرقمية الرسمية لمحمد غالب العصيمي (M.GH.AL) — مطور Full-Stack وطالب تقنية معلومات، مع المشاريع والشهادات والسيرة الذاتية والروابط المهنية.',
 applicationName: 'M.GH.AL',
 keywords: ['محمد غالب العصيمي','Mohammed Ghaleb Alaosimi','M.GH.AL','Full-Stack Developer','Software Engineer','Information Technology','Yemen'],
 authors: [{ name: 'Mohammed Ghaleb Alaosimi', url: 'https://mghalaosimi-web.vercel.app' }],
 alternates: { canonical: '/' },
 openGraph: { type: 'website', locale: 'ar_YE', url: 'https://mghalaosimi-web.vercel.app', siteName: 'M.GH.AL', title: 'M.GH.AL | Mohammed Ghaleb Alaosimi', description: 'الهوية الرقمية الرسمية لمحمد غالب العصيمي — Full-Stack Developer | Software Engineer | IT Student', images: ['/assets/og-image.svg'] },
 twitter: { card: 'summary_large_image', title: 'M.GH.AL | Mohammed Ghaleb Alaosimi', description: 'الهوية الرقمية الرسمية لمحمد غالب العصيمي.', images: ['/assets/og-image.svg'] },
 robots: { index: true, follow: true }
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#172B4D' };
const nav = [{href:'/',ar:'الرئيسية',en:'Home'},{href:'/about',ar:'نبذة عني',en:'About'},{href:'/projects',ar:'المشاريع',en:'Projects'},{href:'/skills',ar:'المهارات',en:'Skills'},{href:'/labs',ar:'المعامل',en:'Labs'},{href:'/research',ar:'الأبحاث',en:'Research'},{href:'/credentials',ar:'الشهادات',en:'Credentials'},{href:'/contact',ar:'التواصل',en:'Contact'}];
export default async function RootLayout({children}:{children:React.ReactNode}) { const locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar'; const isEn=locale==='en'; return <html lang={locale} dir={isEn?'ltr':'rtl'}><head><link rel="stylesheet" href="/assets/social-engagement.css"/></head><body><a className="skip-link" href="#main">{isEn?"Skip to content":"تجاوز إلى المحتوى"}</a><header className="mghal-header"><a className="mghal-logo" href="/">M.GH.AL<span>.</span></a><nav aria-label="التنقل الرئيسي">{nav.map(item=><a key={item.href} href={item.href}>{isEn?item.en:item.ar}</a>)}</nav><div className="mghal-language"><a href="/language/en?next=/">EN</a><span>/</span><a href="/language/ar?next=/">AR</a></div><a className="mghal-header-cta" href="https://github.com/mghalaosimi-web" target="_blank" rel="noreferrer">GitHub ↗</a></header>{children}<footer className="mghal-footer"><a className="mghal-logo" href="/">M.GH.AL<span>.</span></a><p>© {new Date().getFullYear()} Mohammed Ghaleb Alaosimi · {isEn?'All rights reserved':'جميع الحقوق محفوظة'}</p><div><a href="https://orcid.org/0009-0000-6007-3170">ORCID</a><a href="https://www.linkedin.com/in/mohammed-alaosimi-038155443/">LinkedIn</a><a href="mailto:m.gh.alaosimi@gmail.com">Email</a></div></footer><Script src="/assets/visitor-tracking.js" strategy="afterInteractive"/><Script src="/assets/social-engagement.js" strategy="afterInteractive"/></body></html>; }
