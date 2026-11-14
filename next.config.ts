import type {NextConfig} from 'next';

const nextConfig:NextConfig={
  poweredByHeader:false,
  experimental:{cpus:2},
  images:{unoptimized:true},
  async headers(){
    return [{source:'/:path*',headers:[
      {key: 'Strict-Transport-Security',value: 'max-age=31536000'},
      {key: 'X-Content-Type-Options',value: 'nosniff'},
      {key: 'X-Frame-Options',value: 'DENY'},
      {key: 'Referrer-Policy',value: 'strict-origin-when-cross-origin'},
      {key: 'Permissions-Policy',value: 'camera=(), microphone=(), geolocation=()'},
    ]}];
  },
  async redirects(){
    const legacyPages=[
      ['/profile.html','/about'],['/projects.html','/projects'],
      ['/certificates.html','/credentials'],['/certificate.html','/credentials'],
      ['/skills.html','/skills'],['/education.html','/about'],
      ['/achievements.html','/credentials'],['/knowledge.html','/labs'],
      ['/contact.html','/contact'],['/showcase.html','/projects'],
      ['/resume.html','/about'],['/research.html','/research'],
      ['/article.html','/labs'],
    ];
    return [
      {source:'/index.html',destination:'/',permanent:true},
      {source:'/en/index.html',destination:'/en',permanent:true},
      {source:'/admin/index.html',destination:'/admin',permanent:true},
      {source:'/offline.html',destination:'/offline',permanent:true},
      ...legacyPages.map(([source,destination])=>({source,destination,permanent:true})),
      ...legacyPages.map(([source,destination])=>({source:'/en'+source,destination:'/en'+destination,permanent:true})),
      {source:'/en/projects/:slug/index.html',destination:'/en/projects/:slug',permanent:true},
      {source:'/projects/:slug/index.html',destination:'/projects/:slug',permanent:true},
    ];
  }
};
export default nextConfig;
