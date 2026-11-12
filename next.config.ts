import type {NextConfig} from 'next';

const legacyRedirects=[
 {source:'/admin/index.html',destination:'/admin',permanent:true},
 {source:'/offline.html',destination:'/offline',permanent:true},
 {source:'/index.html',destination:'/',permanent:true},
 {source:'/profile.html',destination:'/about',permanent:true},
 {source:'/projects.html',destination:'/projects',permanent:true},
 {source:'/certificates.html',destination:'/credentials',permanent:true},
 {source:'/education.html',destination:'/education',permanent:true},
 {source:'/achievements.html',destination:'/achievements',permanent:true},
 {source:'/knowledge.html',destination:'/knowledge',permanent:true},
 {source:'/resume.html',destination:'/resume',permanent:true},
 {source:'/skills.html',destination:'/skills',permanent:true},
 {source:'/research.html',destination:'/research',permanent:true},
 {source:'/contact.html',destination:'/contact',permanent:true},
 {source:'/showcase.html',destination:'/projects',permanent:true},
 {source:'/en/index.html',destination:'/en',permanent:true},
 {source:'/en/profile.html',destination:'/en/about',permanent:true},
 {source:'/en/projects.html',destination:'/en/projects',permanent:true},
 {source:'/en/certificates.html',destination:'/en/credentials',permanent:true},
 {source:'/en/education.html',destination:'/en/education',permanent:true},
 {source:'/en/achievements.html',destination:'/en/achievements',permanent:true},
 {source:'/en/knowledge.html',destination:'/en/knowledge',permanent:true},
 {source:'/en/resume.html',destination:'/en/resume',permanent:true},
 {source:'/en/skills.html',destination:'/en/skills',permanent:true},
 {source:'/en/research.html',destination:'/en/research',permanent:true},
 {source:'/en/contact.html',destination:'/en/contact',permanent:true},
 {source:'/en/showcase.html',destination:'/en/projects',permanent:true},
 {source:'/projects/:slug/index.html',destination:'/projects/:slug',permanent:true},
 {source:'/en/projects/:slug/index.html',destination:'/en/projects/:slug',permanent:true}
];
const nextConfig:NextConfig={
 poweredByHeader:false,
 images:{unoptimized:true},
 async headers(){return [{source:'/:path*',headers:[
  {key:'Strict-Transport-Security',value:'max-age=31536000'},
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'X-Frame-Options',value:'DENY'},
  {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
  {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'}
 ]}]},
 async redirects(){return legacyRedirects},
};
export default nextConfig;
