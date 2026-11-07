const localizedRoutes = Object.freeze({
  '/': { ar: '/', en: '/en/' },
  '/about': { ar: '/about', en: '/en/profile.html' },
  '/projects': { ar: '/projects', en: '/en/projects.html' },
  '/skills': { ar: '/skills', en: '/en/skills.html' },
  '/research': { ar: '/research', en: '/en/research.html' },
  '/contact': { ar: '/contact', en: '/en/contact.html' },
  '/credentials': { ar: '/certificates.html', en: '/en/certificates.html' }
});

/**
 * Return canonical and hreflang URLs only when distinct public locale URLs exist.
 * Cookie-switched routes without a separate public counterpart get a canonical
 * URL but no false ar/en hreflang pair.
 *
 * @param {string} path
 * @param {'ar'|'en'} locale
 * @returns {{canonical:string, languages?:{ar:string,en:string,'x-default':string}}}
 */
export function resolveLocalizedAlternates(path, locale) {
  const rawPath = typeof path === 'string' ? path.trim() : '/';
  const pathname = rawPath.split(/[?#]/, 1)[0] || '/';
  const normalized = (pathname.startsWith('/') ? pathname : '/' + pathname)
    .replace(/\/{2,}/g, '/')
    .replace(/\/+$/, '') || '/';

  const projectMatch = normalized.match(/^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
  const projectPair = projectMatch
    ? {
        ar: '/projects/' + projectMatch[1] + '/',
        en: '/en/projects/' + projectMatch[1] + '/'
      }
    : null;
  const pair = projectPair || localizedRoutes[normalized];

  if (!pair) return { canonical: normalized };
  return {
    canonical: pair[locale],
    languages: {
      ar: pair.ar,
      en: pair.en,
      'x-default': pair.ar
    }
  };
}
