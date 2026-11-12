import type { NextConfig } from 'next';
const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: { unoptimized: true },
  async rewrites() {
    return [
      { source: '/admin', destination: '/admin/index.html' },
      { source: '/projects/:slug', destination: '/projects/:slug/index.html' },
      { source: '/en', destination: '/en/index.html' },
      { source: '/en/projects/:slug', destination: '/en/projects/:slug/index.html' }
    ];
  }
};
export default nextConfig;
