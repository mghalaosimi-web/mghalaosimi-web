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
});

/**
 * Build canonical and hreflang URLs for the parallel Arabic and English
 * React route trees. Legacy .html paths are redirected before rendering.
 *
 * @param {string} path
 * @param {'ar'|'en'} locale
 */
export function resolveLocalizedAlternates(path, locale) {
  const rawPath = typeof path === 'string' ? path.trim() : '/';
  const withLeadingSlash = rawPath.startsWith('/') ? rawPath : '/'+rawPath;
  const pathname = (withLeadingSlash.split(/[?#]/, 1)[0] || '/')
    .replace(/\/{2,}/g, '/')
    .replace(/\/+$/, '') || '/';
  const projectMatch = pathname.match(/^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
  const pair = projectMatch
    ? {ar:'/projects/'+projectMatch[1],en:'/en/projects/'+projectMatch[1]}
    : localizedRoutes[pathname];
  if (!pair) return {canonical:locale==='en'?'/en'+pathname:pathname};
  return {
    canonical:pair[locale],
    languages:{ar:pair.ar,en:pair.en,'x-default':pair.ar}
  };
}
