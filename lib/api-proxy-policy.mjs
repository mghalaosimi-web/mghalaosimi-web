const DEFAULT_MGHAL_API_UPSTREAM = 'https://mghal-api.m-gh-alaosimi.workers.dev';
const PRODUCTION_API_HOST = new URL(DEFAULT_MGHAL_API_UPSTREAM).hostname;
const PRODUCTION_SITE_HOSTS = new Set([
  'mghalaosimi-web.vercel.app',
  'mghal.vercel.app',
  'mghal-static.onrender.com',
  'mghal-release.onrender.com',
  'mghal-release-current.onrender.com',
  'mghal-official.onrender.com'
]);

/**
 * Resolve an API origin without allowing an unrecognised preview host to inherit
 * the production Worker. Preview traffic requires a dedicated preview Worker.
 *
 * @param {string | URL} requestUrl
 * @param {Record<string, string | undefined>} [environment]
 * @returns {string | null}
 */
export function resolveMghalApiUpstream(requestUrl, environment = process.env) {
  let hostname;
  try {
    hostname = new URL(requestUrl).hostname.toLowerCase();
  } catch {
    return null;
  }

  const isProductionSite = PRODUCTION_SITE_HOSTS.has(hostname);
  const configured = isProductionSite
    ? (environment.MGHAL_API_BASE || DEFAULT_MGHAL_API_UPSTREAM)
    : environment.MGHAL_PREVIEW_API_BASE;

  if (typeof configured !== 'string' || !configured.trim()) return null;

  try {
    const target = new URL(configured);
    if (
      target.protocol !== 'https:' ||
      target.username ||
      target.password ||
      target.pathname !== '/' ||
      target.search ||
      target.hash
    ) return null;
    if (!isProductionSite && target.hostname.toLowerCase() === PRODUCTION_API_HOST) return null;
    return target.origin;
  } catch {
    return null;
  }
}

export { DEFAULT_MGHAL_API_UPSTREAM };
