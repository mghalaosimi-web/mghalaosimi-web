const localizedRoutes = Object.freeze({
  '/': { ar: '/', en: '/en' },
  '/about': { ar: '/about', en: '/en/about' },
  '/projects': { ar: '/projects', en: '/en/projects' },
  '/skills': { ar: '/skills', en: '/en/skills' },
  '/research': { ar: '/research', en: '/en/research' },
  '/contact': { ar: '/contact', en: '/en/contact' },
  '/labs': { ar: '/labs', en: '/en/labs' },
  '/credentials': { ar: '/credentials', en: '/en/credentials' },
  '/photos': { ar: '/photos', en: '/en/photos' },
  '/achievements': { ar: '/achievements', en: '/en/achievements' },
  '/certificates': { ar: '/credentials', en: '/en/credentials' },
  '/education': { ar: '/education', en: '/en/education' },
  '/knowledge': { ar: '/knowledge', en: '/en/knowledge' },
  '/profile': { ar: '/profile', en: '/en/profile' },
  '/resume': { ar: '/resume', en: '/en/resume' },
  '/showcase': { ar: '/showcase', en: '/en/showcase' },
});
const legacyStaticProjectSlugs = ['waynah','yemen-ai','mghal-content-os','manar-schedule-system','ciphersphere','focusflow','mghal-official-website','almanar-schedule-system'];

/** Canonical and reciprocal language URLs for clean React and legacy static routes. */
export function resolveLocalizedAlternates(path, locale) {
  const rawPath = typeof path === 'string' ? path.trim() : '/';
  const withLeadingSlash = rawPath.startsWith('/') ? rawPath : '/' + rawPath;
  const pathname = (withLeadingSlash.split(/[?#]/, 1)[0] || '/')
    .replace(/\/{2,}/g, '/')
    .replace(/\/+$/, '') || '/';
  const projectMatch = pathname.match(/^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
  if (projectMatch) {
    const slug = projectMatch[1];
    const pair = { ar: '/projects/' + slug, en: '/en/projects/' + slug };
    return { canonical: pair[locale], languages: { ar: pair.ar, en: pair.en, 'x-default': pair.ar } };
  }
  const pair = localizedRoutes[pathname];
  if (!pair) return { canonical: locale === 'en' ? '/en' + (pathname === '/' ? '' : pathname) : pathname };
  return { canonical: pair[locale], languages: { ar: pair.ar, en: pair.en, 'x-default': pair.ar } };
}
