'use client';
import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

type SiteHeaderProps = { isEn: boolean };
const links = [
  { href: '/', ar: 'الرئيسية', en: 'Home' },
  { href: '/about', ar: 'نبذة عني', en: 'About' },
  { href: '/projects', ar: 'المشاريع', en: 'Projects' },
  { href: '/skills', ar: 'المهارات', en: 'Skills' },
  { href: '/labs', ar: 'المعامل', en: 'Labs' },
  { href: '/research', ar: 'الأبحاث', en: 'Research' },
  { href: '/credentials', ar: 'الشهادات', en: 'Credentials' },
  { href: '/contact', ar: 'التواصل', en: 'Contact' },
];

export default function SiteHeader({ isEn }: SiteHeaderProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || '/';
  const navId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButtonRef.current?.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);
  const closeMenu = () => setOpen(false);
  return (
    <header className={`mghal-header${open ? ' is-menu-open' : ''}`}>
      <Link className="mghal-logo" href="/" aria-label="M.GH.AL home">M.GH.AL<span>.</span></Link>
      <button ref={menuButtonRef} type="button" className="mghal-menu-toggle" aria-controls={navId} aria-expanded={open}
        aria-label={open ? (isEn ? 'Close navigation menu' : 'إغلاق قائمة التنقل') : (isEn ? 'Open navigation menu' : 'فتح قائمة التنقل')}
        onClick={() => setOpen((value) => !value)}>
        {open ? <X size={21} aria-hidden="true" /> : <Menu size={21} aria-hidden="true" />}
      </button>
      <nav id={navId} className="mghal-primary-nav" aria-label={isEn ? 'Main navigation' : 'التنقل الرئيسي'}>
        {links.map((item) => {
          const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));
          return <Link key={item.href} href={item.href} onClick={closeMenu} aria-current={active ? 'page' : undefined}>{isEn ? item.en : item.ar}</Link>;
        })}
      </nav>
      <div className="mghal-language" aria-label={isEn ? 'Language' : 'اللغة'}>
        <Link href={`/language/en?next=${encodeURIComponent(pathname)}`} onClick={closeMenu} aria-current={isEn ? 'page' : undefined}>EN</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/language/ar?next=${encodeURIComponent(pathname)}`} onClick={closeMenu} aria-current={!isEn ? 'page' : undefined}>AR</Link>
      </div>
      <a className="mghal-header-cta" href="https://github.com/mghalaosimi-web" target="_blank" rel="noreferrer">GitHub ↗</a>
    </header>
  );
}
