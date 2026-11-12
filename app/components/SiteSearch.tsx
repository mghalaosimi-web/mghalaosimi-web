'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import Link from 'next/link';

type SearchRecord = {
  title: string;
  url: string;
  description?: string;
  keywords?: string[];
};

type SearchItem = {
  title: string;
  href: string;
  description: string;
  keywords: string[];
};

const routeMap: Record<string, string> = {
  '/': '/',
  '/en/': '/',
  '/profile.html': '/about',
  '/en/profile.html': '/about',
  '/projects.html': '/projects',
  '/en/projects.html': '/projects',
  '/certificates.html': '/credentials',
  '/en/certificates.html': '/credentials',
  '/skills.html': '/skills',
  '/en/skills.html': '/skills',
  '/education.html': '/about',
  '/en/education.html': '/about',
  '/contact.html': '/contact',
  '/en/contact.html': '/contact',
};

function projectHref(title: string): string | undefined {
  const value = normalize(title);
  if (value.includes('waynah') || value.includes('وينه')) return '/projects/waynah';
  if (value.includes('humanity system') || value.includes('الانسانية تجمعنا')) return '/projects/humanity-system';
  if (value.includes('yemen ai platform')) return '/projects/yemen-ai';
  if (value.includes('content studio') || value.includes('content os')) return '/projects/mghal-content-os';
  if (value.includes('ciphersphere')) return '/projects/ciphersphere';
  if (value.includes('focusflow')) return '/projects/focusflow';
  if (value.includes('mghal esdp')) return '/projects/mghal-esdp';
  return undefined;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\bm\s+gh\s+al\b/g, 'mghal')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function SiteSearch({ isEn }: { isEn: boolean }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState<SearchRecord[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const resultsRef = useRef<HTMLUListElement>(null);

  const items = useMemo<SearchItem[]>(() => {
    const extras: SearchItem[] = [
      {
        title: isEn ? 'About and professional profile' : 'نبذة عني والملف المهني',
        href: '/about',
        description: isEn ? 'Professional identity and academic background.' : 'الهوية المهنية والمسار الأكاديمي.',
        keywords: ['about', 'profile', 'identity', 'نبذة', 'الهوية', 'التعليم'],
      },
      {
        title: isEn ? 'Labs and interactive work' : 'المعامل والتجارب التفاعلية',
        href: '/labs',
        description: isEn ? 'Interactive engineering and learning experiences.' : 'تجارب هندسية وتعليمية تفاعلية.',
        keywords: ['labs', 'experiments', 'معامل', 'تجارب'],
      },
      {
        title: isEn ? 'Research and technical writing' : 'الأبحاث والكتابة التقنية',
        href: '/research',
        description: isEn ? 'Research topics and technical publications.' : 'موضوعات البحث والكتابة التقنية.',
        keywords: ['research', 'papers', 'أبحاث', 'بحث', 'نشر'],
      },
    ];
    const indexed: SearchItem[] = (index ?? []).flatMap((record) => {
      const href = projectHref(record.title) ?? routeMap[record.url];
      return href ? [{
        title: record.title,
        href,
        description: record.description ?? '',
        keywords: record.keywords ?? [],
      }] : [];
    });
    const seen = new Set<string>();
    return [...extras, ...indexed].filter((item) => {
      const key = item.href + '|' + normalize(item.title);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [index, isEn]);

  const results = useMemo(() => {
    const normalizedQuery = normalize(query);
    if (!normalizedQuery) return items.slice(0, 8);
    const terms = normalizedQuery.split(' ');
    return items
      .map((item) => {
        const title = normalize(item.title);
        const details = normalize([item.description, ...item.keywords].join(' '));
        let score = 0;
        for (const term of terms) {
          if (title.includes(term)) score += title === term ? 12 : 7;
          if (details.includes(term)) score += 2;
        }
        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((entry) => entry.item);
  }, [items, query]);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  useEffect(() => {
    if (!open || index !== null) return;
    let active = true;
    setLoading(true);
    fetch('/assets/search-index.json', { cache: 'force-cache' })
      .then((response) => {
        if (!response.ok) throw new Error('Search index unavailable');
        return response.json() as Promise<SearchRecord[]>;
      })
      .then((records) => {
        if (active && Array.isArray(records)) setIndex(records);
      })
      .catch(() => {
        if (active) {
          setIndex([]);
          setLoadError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [open, index]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const close = () => setOpen(false);

  const moveResultFocus = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLAnchorElement>('a[href]'));
    if (!links.length) return;
    event.preventDefault();
    const current = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === 'Home') links[0].focus();
    else if (event.key === 'End') links[links.length - 1].focus();
    else if (event.key === 'ArrowDown') links[Math.min(current + 1, links.length - 1)].focus();
    else links[Math.max(current <= 0 ? links.length : current, 1) - 1].focus();
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="mghal-search-trigger"
        aria-label={isEn ? 'Search M.GH.AL' : 'البحث في M.GH.AL'}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-keyshortcuts="Control+K Meta+K"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 5 5" />
        </svg>
        <span>{isEn ? 'Search' : 'بحث'}</span>
        <kbd>Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="mghal-search-dialog"
        dir={isEn ? 'ltr' : 'rtl'}
        aria-labelledby="mghal-search-title"
        aria-describedby="mghal-search-help"
        onCancel={close}
        onClose={() => {
          setOpen(false);
          setQuery('');
          requestAnimationFrame(() => triggerRef.current?.focus());
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) close();
        }}
      >
        <section className="mghal-search-panel">
          <header className="mghal-search-head">
            <div>
              <p className="mghal-search-eyebrow">M.GH.AL</p>
              <h2 id="mghal-search-title">{isEn ? 'Search the digital hub' : 'ابحث في الهوية الرقمية'}</h2>
            </div>
            <button type="button" className="mghal-search-close" onClick={close}>
              {isEn ? 'Close' : 'إغلاق'} <span aria-hidden="true">×</span>
            </button>
          </header>

          <label className="mghal-search-field">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 5 5" />
            </svg>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  resultsRef.current?.querySelector('a')?.focus();
                }
              }}
              autoComplete="off"
              placeholder={isEn ? 'Search projects, skills, credentials…' : 'ابحث عن المشاريع أو المهارات أو الشهادات…'}
              aria-label={isEn ? 'Search query' : 'عبارة البحث'}
            />
            <kbd>ESC</kbd>
          </label>

          <p id="mghal-search-help" className="mghal-search-help">
            {isEn ? 'Arabic and English · ↑ ↓ to navigate · Ctrl/⌘ K to open' : 'بحث بالعربية والإنجليزية · ↑ ↓ للتنقل · Ctrl/⌘ K للفتح'}
          </p>

          {loading && <p className="mghal-search-message" role="status">{isEn ? 'Loading search index…' : 'جارٍ تحميل فهرس البحث…'}</p>}
          {loadError && <p className="mghal-search-warning" role="status">{isEn ? 'Some indexed content is unavailable; section links remain available.' : 'تعذر تحميل بعض بيانات البحث؛ ما زالت روابط الأقسام متاحة.'}</p>}

          <ul ref={resultsRef} className="mghal-search-results" onKeyDown={moveResultFocus} aria-label={isEn ? 'Search results' : 'نتائج البحث'}>
            {results.map((item) => (
              <li key={item.href + item.title}>
                <Link href={item.href} onClick={close}>
                  <span className="mghal-search-result-title">{item.title}</span>
                  <span className="mghal-search-result-description">{item.description}</span>
                  <span className="mghal-search-result-arrow" aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>

          {!loading && results.length === 0 && (
            <p className="mghal-search-message" role="status">
              {isEn ? 'No matching results. Try an Arabic or English keyword.' : 'لا توجد نتائج مطابقة. جرّب كلمة بالعربية أو الإنجليزية.'}
            </p>
          )}
        </section>
      </dialog>
    </>
  );
}
