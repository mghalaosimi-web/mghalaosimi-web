'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import SiteSearch from './SiteSearch';

type SiteHeaderProps = { isEn: boolean };
const links = [
  { href: '/', ar: 'الرئيسية', en: 'Home' },
  { href: '/about', ar: 'نبذة عني', en: 'About' },
  { href: '/skills', ar: 'المهارات', en: 'Skills' },
  { href: '/projects', ar: 'المشاريع', en: 'Projects' },
  { href: '/labs', ar: 'المعامل', en: 'Labs' },
  { href: '/research', ar: 'الأبحاث', en: 'Research' },
  { href: '/credentials', ar: 'الشهادات', en: 'Credentials' },
  { href: '/education', ar: 'التعليم', en: 'Education' },
  { href: '/achievements', ar: 'الإنجازات', en: 'Achievements' },
  { href: '/knowledge', ar: 'المعرفة', en: 'Knowledge' },
  { href: '/resume', ar: 'السيرة الذاتية', en: 'Résumé' },
  { href: '/contact', ar: 'التواصل', en: 'Contact' },
];

export default function SiteHeader({ isEn }: SiteHeaderProps) {
  const pathname = usePathname() || '/';
  const router = useRouter();

  useEffect(() => {
    const activeLink = document.querySelector<HTMLElement>('.mghal-primary-nav a[aria-current="page"]');
    if (!activeLink) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    activeLink.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reducedMotion ? 'auto' : 'smooth' });
  }, [pathname]);

  useEffect(() => {
    // Page swipes are limited to top-level routes; nested project/detail pages keep their context.
    const currentIndex = links.findIndex((item) => pathname === item.href);
    if (currentIndex < 0) return;

    let startX = 0;
    let startY = 0;
    let startedAt = 0;
    let startTarget: EventTarget | null = null;

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) { startTarget = null; return; }
      const target = event.target as HTMLElement | null;
      if (!target || !target.closest('main, #main, [data-swipe-page]')) { startTarget = null; return; }
      if (target.closest('a,button,input,textarea,select,video,audio,canvas,img,dialog,[role="dialog"],[contenteditable="true"],[data-no-swipe],[data-horizontal-scroll],.mghal-primary-nav,.project-modal-backdrop,.project-modal,.portfolio-archive-filters,.portfolio-waynah-gallery')) {
        startTarget = null; return;
      }
      let ancestor: HTMLElement | null = target;
      while (ancestor && !ancestor.matches('main, #main, [data-swipe-page]')) {
        const style = window.getComputedStyle(ancestor);
        if ((style.overflowX === 'auto' || style.overflowX === 'scroll') && ancestor.scrollWidth > ancestor.clientWidth + 1) {
          startTarget = null;
          return;
        }
        ancestor = ancestor.parentElement;
      }
      const touch = event.touches[0];
      if (touch.clientX < 20 || touch.clientX > window.innerWidth - 20) { startTarget = null; return; }
      startX = touch.clientX;
      startY = touch.clientY;
      startedAt = Date.now();
      startTarget = target;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!startTarget || event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      const elapsed = Date.now() - startedAt;
      startTarget = null;
      if (elapsed > 700 || Math.abs(dx) < 72 || Math.abs(dx) < Math.abs(dy) * 1.35) return;

      const logicalNext = isEn ? dx < 0 : dx > 0;
      const nextIndex = currentIndex + (logicalNext ? 1 : -1);
      if (nextIndex < 0 || nextIndex >= links.length) return;
      router.push(links[nextIndex].href);
    };

    const onTouchCancel = () => { startTarget = null; };
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd, { passive: true });
    document.addEventListener('touchcancel', onTouchCancel, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [pathname, isEn, router]);

  return (
    <header className="mghal-header" data-site-header>
      <Link className="mghal-logo" href="/" aria-label="M.GH.AL home">M.GH.AL<span>.</span></Link>
      <nav className="mghal-primary-nav" aria-label={isEn ? 'Main navigation' : 'التنقل الرئيسي'} data-horizontal-scroll>
        {links.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
          return <Link key={item.href} href={item.href} aria-current={active ? 'page' : undefined}>{isEn ? item.en : item.ar}</Link>;
        })}
      </nav>
      <SiteSearch isEn={isEn}/>
      <div className="mghal-language" aria-label={isEn ? 'Language' : 'اللغة'}>
        <a href={`/language/ar?next=${encodeURIComponent(pathname)}`} aria-current={!isEn ? 'page' : undefined} lang="ar">AR</a>
        <span aria-hidden="true">/</span>
        <a href={`/language/en?next=${encodeURIComponent(pathname)}`} aria-current={isEn ? 'page' : undefined} lang="en">EN</a>
      </div>
      <a className="mghal-header-cta" href="https://github.com/mghalaosimi-web" target="_blank" rel="noreferrer">GitHub ↗</a>
    </header>
  );
}
