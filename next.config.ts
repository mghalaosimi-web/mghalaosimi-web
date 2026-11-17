import type { NextConfig } from 'next';

const legacyStaticProjectSlugs = ['waynah','yemen-ai','mghal-content-os','manar-schedule-system','ciphersphere','focusflow','mghal-official-website','almanar-schedule-system'];
const legacyStaticPageSlugs = ['achievements','education','knowledge','profile','resume','showcase'];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async redirects() {
    return [
      { source: '/certificates.html', destination: '/credentials', permanent: true },
      { source: '/en/certificates.html', destination: '/en/credentials', permanent: true },
      { source: '/certificates', destination: '/credentials', permanent: true },
      { source: '/en/certificates', destination: '/en/credentials', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/en/index.html', destination: '/en', permanent: true },
      { source: '/:path*/index.html', destination: '/:path*', permanent: true },
      { source: '/:path*.html', destination: '/:path*', permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/en', destination: '/en/index.html' },
      ...legacyStaticPageSlugs.flatMap((slug) => [
        { source: `/${slug}`, destination: `/${slug}.html` },
        { source: `/en/${slug}`, destination: `/en/${slug}.html` },
      ]),
      ...legacyStaticProjectSlugs.flatMap((slug) => [
        { source: `/projects/${slug}`, destination: `/projects/${slug}/index.html` },
        { source: `/en/projects/${slug}`, destination: `/en/projects/${slug}/index.html` },
      ])
    ];
  }
};

export default nextConfig;
