import type {NextConfig} from 'next';

const nextConfig:NextConfig={
  poweredByHeader:false,
  images:{unoptimized:true},
  async headers(){
    return [{source:'/:path*',headers:[
      {key:'Strict-Transport-Security',value:'max-age=31536000'},
      {key:'X-Content-Type-Options',value:'nosniff'},
      {key:'X-Frame-Options',value:'DENY'},
      {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
      {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
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
      {source:'/en',destination:'/language/en?next=/',permanent:false},
      ...legacyPages.map(([source,destination])=>({source,destination,permanent:true})),
      ...legacyPages.map(([source,destination])=>({source:'/en'+source,destination:'/language/en?next='+encodeURIComponent(destination),permanent:true})),
      {source:'/en/projects/:slug/index.html',destination:'/language/en?next=/projects/:slug',permanent:true},
      {source:'/projects/:slug/index.html',destination:'/projects/:slug',permanent:true},
    ];
  },
  async rewrites(){
    return [{source:'/admin',destination:'/admin/index.html'}];
  }
};
export default nextConfig;
