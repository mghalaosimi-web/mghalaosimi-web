import assert from 'node:assert/strict';

const origin = new URL(process.env.SITE_ORIGIN || 'https://mghalaosimi-web.vercel.app');
const userAgent = 'M.GH.AL-Phase1-Live-Verification/1.0';
const timeoutMs = 20000;
const failures = [];

function record(condition, message) {
  if (!condition) failures.push(message);
}

function normalizePath(path) {
  const value = path.replace(/\/+$/, '');
  return value || '/';
}

async function request(path, options = {}) {
  const headers = options.headers || {};
  const rest = { ...options };
  delete rest.headers;
  return fetch(new URL(path, origin), {
    redirect: 'manual',
    signal: AbortSignal.timeout(timeoutMs),
    headers: { 'user-agent': userAgent, ...headers },
    ...rest,
  });
}

function tags(html, tagName) {
  return [...html.matchAll(new RegExp('<' + tagName + '\\b[^>]*>', 'gi'))].map((match) => match[0]);
}

function attribute(tag, name) {
  const match = tag.match(new RegExp('\\b' + name + '\\s*=\\s*(["\\x27])(.*?)\\1', 'i'));
  return match ? match[2] : null;
}

function pageMetadata(html, path) {
  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] || '';
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]
    ?.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim() || '';
  const metaDescription = tags(html, 'meta').find((tag) => (attribute(tag, 'name') || '').toLowerCase() === 'description');
  const robots = tags(html, 'meta').find((tag) => (attribute(tag, 'name') || '').toLowerCase() === 'robots');
  const canonicals = tags(html, 'link').filter((tag) => (attribute(tag, 'rel') || '').toLowerCase() === 'canonical');
  const alternates = tags(html, 'link').filter((tag) => (attribute(tag, 'rel') || '').toLowerCase() === 'alternate');
  return {
    path,
    lang: attribute(htmlTag, 'lang'),
    title,
    description: attribute(metaDescription || '', 'content') || '',
    robots: attribute(robots || '', 'content') || '',
    canonicals,
    alternates,
    h1: /<h1\b[^>]*>[\s\S]*?\S[\s\S]*?<\/h1>/i.test(html),
    images: tags(html, 'img'),
  };
}

async function verifyRedirects() {
  const cases = [
    ['/index.html', '/'],
    ['/en/index.html', '/en'],
    ['/certificates.html', '/credentials'],
    ['/en/certificates.html', '/en/credentials'],
    ['/certificates', '/credentials'],
    ['/en/certificates', '/en/credentials'],
    ['/achievements.html', '/achievements'],
    ['/en/achievements.html', '/en/achievements'],
    ['/projects/waynah/index.html', '/projects/waynah'],
    ['/en/projects/waynah/index.html', '/en/projects/waynah'],
    ['/projects/waynah.html', '/projects/waynah'],
    ['/en/projects/waynah.html', '/en/projects/waynah'],
  ];

  for (const [source, expectedPath] of cases) {
    try {
      const response = await request(source);
      record(response.status === 301, source + ': expected HTTP 301, received ' + response.status);
      const location = response.headers.get('location');
      record(Boolean(location), source + ': missing Location header');
      if (!location) continue;

      const destination = new URL(location, origin);
      record(destination.origin === origin.origin, source + ': redirect left the official host');
      record(normalizePath(destination.pathname) === normalizePath(expectedPath),
        source + ': expected ' + expectedPath + ', received ' + destination.pathname);

      const finalResponse = await request(destination.pathname + destination.search);
      record(finalResponse.status === 200,
        source + ': destination ' + destination.pathname + ' returned ' + finalResponse.status + ', expected 200');
    } catch (error) {
      failures.push(source + ': ' + error.message);
    }
  }

  const querySource = '/certificates.html?utm_source=phase1-live-test';
  try {
    const response = await request(querySource);
    const location = response.headers.get('location');
    record(response.status === 301, querySource + ': expected HTTP 301, received ' + response.status);
    record(Boolean(location), querySource + ': missing Location header');
    if (location) {
      const destination = new URL(location, origin);
      record(destination.pathname === '/credentials', querySource + ': incorrect redirect destination');
      record(destination.searchParams.get('utm_source') === 'phase1-live-test',
        querySource + ': query parameter was not preserved');
    }
  } catch (error) {
    failures.push(querySource + ': ' + error.message);
  }

  console.log('Redirect checks: ' + (cases.length + 1) + ' legacy variants inspected.');
}

async function verifySitemapAndRobots() {
  const sitemapResponse = await request('/sitemap.xml');
  record(sitemapResponse.status === 200, '/sitemap.xml: expected 200, received ' + sitemapResponse.status);
  record(/xml/i.test(sitemapResponse.headers.get('content-type') || ''),
    '/sitemap.xml: response Content-Type is not XML');

  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const unique = new Set(urls);
  const imageLocations = [...xml.matchAll(/<image:loc>([^<]+)<\/image:loc>/g)].map((match) => match[1]);
  const hreflangCount = (xml.match(/<xhtml:link\b/g) || []).length;

  record(xml.startsWith('<?xml'), '/sitemap.xml: missing XML declaration');
  record(xml.includes('</urlset>'), '/sitemap.xml: missing closing urlset');
  record(urls.length === 68, '/sitemap.xml: expected 68 URLs, received ' + urls.length);
  record(unique.size === urls.length, '/sitemap.xml: found ' + (urls.length - unique.size) + ' duplicate URLs');
  record(urls.every((value) => value.startsWith(origin.origin + '/')),
    '/sitemap.xml: one or more URLs do not use the official host');
  record(urls.every((value) => !/\.html(?:$|[?#])/i.test(value)),
    '/sitemap.xml: legacy .html URL found');
  record(!xml.includes('mghal.vercel.app'), '/sitemap.xml: legacy host found');
  record(hreflangCount === 204, '/sitemap.xml: expected 204 hreflang entries, received ' + hreflangCount);
  record(imageLocations.length === 25,
    '/sitemap.xml: expected 25 image locations, received ' + imageLocations.length);
  record(imageLocations.every((value) => value.startsWith(origin.origin + '/')),
    '/sitemap.xml: image location does not use the official host');

  const lastmods = {};
  for (const block of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
    const date = block[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || 'MISSING';
    lastmods[date] = (lastmods[date] || 0) + 1;
  }

  const robotsResponse = await request('/robots.txt');
  record(robotsResponse.status === 200, '/robots.txt: expected 200, received ' + robotsResponse.status);
  record(/text\/plain/i.test(robotsResponse.headers.get('content-type') || ''),
    '/robots.txt: response Content-Type is not text/plain');
  const robots = await robotsResponse.text();
  record(robots.includes('Sitemap: ' + origin.origin + '/sitemap.xml'),
    '/robots.txt: official sitemap declaration is missing');
  record(/User-agent:\s*\*/i.test(robots), '/robots.txt: wildcard user-agent is missing');
  record(/Allow:\s*\//i.test(robots), '/robots.txt: public crawling is not explicitly allowed');

  console.log('Sitemap checks: ' + urls.length + ' URLs, ' + unique.size + ' unique, ' + hreflangCount +
    ' hreflang links, ' + imageLocations.length + ' image locations; lastmod=' + JSON.stringify(lastmods) + '.');
}

async function verifyPublicRoutes() {
  const sitemapResponse = await request('/sitemap.xml');
  const xml = await sitemapResponse.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const queue = [...urls];
  const titles = new Map();
  const descriptions = new Map();
  let checked = 0;

  async function worker() {
    while (queue.length) {
      const raw = queue.shift();
      const url = new URL(raw);
      const path = url.pathname;
      try {
        const response = await request(path);
        record(response.status === 200, path + ': expected HTTP 200, received ' + response.status);
        record(/text\/html/i.test(response.headers.get('content-type') || ''),
          path + ': response is not HTML');
        if (response.status !== 200) continue;

        const html = await response.text();
        const meta = pageMetadata(html, path);
        const expectedLocale = path === '/en' || path.startsWith('/en/') ? 'en' : 'ar';
        record(meta.lang === expectedLocale,
          path + ': expected html lang=' + expectedLocale + ', received ' + meta.lang);
        record(meta.title.length > 0, path + ': missing title');
        record(meta.description.length >= 30, path + ': missing or too-short meta description');
        record(!/noindex/i.test(meta.robots), path + ': indexable sitemap URL has noindex');
        record(meta.canonicals.length === 1, path + ': expected exactly one canonical, received ' + meta.canonicals.length);
        record(meta.h1, path + ': missing server-rendered H1');

        if (meta.canonicals.length === 1) {
          const canonical = attribute(meta.canonicals[0], 'href');
          try {
            const canonicalUrl = new URL(canonical);
            record(canonicalUrl.origin === origin.origin, path + ': canonical uses a non-official host');
            record(normalizePath(canonicalUrl.pathname) === normalizePath(path),
              path + ': canonical points to ' + canonicalUrl.pathname);
          } catch {
            record(false, path + ': canonical is not an absolute valid URL');
          }
        }

        const languages = new Set(meta.alternates.map((tag) => attribute(tag, 'hreflang')));
        for (const language of ['ar', 'en', 'x-default']) {
          record(languages.has(language), path + ': missing ' + language + ' hreflang');
        }
        for (const tag of meta.alternates) {
          const href = attribute(tag, 'href');
          if (href) {
            try {
              record(new URL(href).origin === origin.origin, path + ': hreflang points outside official host');
            } catch {
              record(false, path + ': invalid hreflang URL');
            }
          }
        }

        for (const image of meta.images) {
          record(attribute(image, 'alt') !== null, path + ': image is missing its alt attribute');
        }

        const titleKey = expectedLocale + ':' + meta.title.toLocaleLowerCase();
        const descriptionKey = expectedLocale + ':' + meta.description.toLocaleLowerCase();
        if (titles.has(titleKey)) failures.push(path + ': duplicate ' + expectedLocale + ' title also used by ' + titles.get(titleKey));
        else titles.set(titleKey, path);
        if (descriptions.has(descriptionKey)) failures.push(path + ': duplicate ' + expectedLocale + ' description also used by ' + descriptions.get(descriptionKey));
        else descriptions.set(descriptionKey, path);
        checked += 1;
      } catch (error) {
        failures.push(path + ': ' + error.message);
      }
    }
  }

  await Promise.all(Array.from({ length: 5 }, () => worker()));
  console.log('Public route checks: ' + checked + '/' + urls.length + ' routes fetched; ' +
    titles.size + ' locale-specific titles and ' + descriptions.size + ' locale-specific descriptions inspected.');
}

async function verifySecurityAndDatabase() {
  const home = await request('/');
  record(home.status === 200, '/: expected HTTP 200, received ' + home.status);
  const requiredHeaders = [
    ['strict-transport-security', 'max-age=31536000'],
    ['x-content-type-options', 'nosniff'],
    ['x-frame-options', 'DENY'],
    ['referrer-policy', 'strict-origin-when-cross-origin'],
  ];
  for (const [name, expected] of requiredHeaders) {
    record((home.headers.get(name) || '').includes(expected), '/: missing or incorrect ' + name);
  }

  const adminPage = await request('/admin');
  record(adminPage.status === 200, '/admin: expected login shell 200, received ' + adminPage.status);
  const adminHtml = await adminPage.text();
  record(/name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(adminHtml),
    '/admin: missing noindex directive');

  const adminApi = await request('/api/admin/dashboard');
  record(adminApi.status === 401, '/api/admin/dashboard: expected unauthenticated 401, received ' + adminApi.status);

  const readiness = await request('/api/ready');
  record(readiness.status === 200, '/api/ready: expected 200, received ' + readiness.status);
  if (readiness.status === 200) {
    const body = await readiness.json();
    record(body.status === 'ready' && body.database === 'connected',
      '/api/ready: unexpected readiness response ' + JSON.stringify(body));
  }

  const cors = await request('/api/public/followers/count', {
    headers: { origin: 'https://unauthorized-origin.invalid' },
  });
  record(cors.status === 403, '/api/public/followers/count: expected foreign Origin 403, received ' + cors.status);

  console.log('Security/API checks: security headers, admin noindex, unauthenticated admin denial, Neon readiness and CORS denial inspected.');
}

await verifyRedirects();
await verifySitemapAndRobots();
await verifyPublicRoutes();
await verifySecurityAndDatabase();

if (failures.length) {
  console.error('\nLIVE VERIFICATION FAILED: ' + failures.length + ' issue(s).');
  for (const failure of failures) console.error('- ' + failure);
  process.exitCode = 1;
} else {
  console.log('\nLIVE VERIFICATION PASSED: all production HTTP, SEO, sitemap, security and Neon readiness checks succeeded.');
}
