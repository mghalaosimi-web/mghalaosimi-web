import type {MetadataRoute} from 'next';
import catalog from '../public/assets/projects/catalog.json';

const origin=catalog.siteOrigin.replace(/\\/$/,'');
const routes=['/','/about','/projects','/skills','/labs','/research','/credentials','/education','/achievements','/knowledge','/resume','/contact'];
export default function sitemap():MetadataRoute.Sitemap{
 const lastModified=new Date(catalog.reviewedAt);
 const pages:MetadataRoute.Sitemap=[];
 for(const path of routes){
  const ar=origin+(path==='/'?'/':path);
  const en=origin+(path==='/'?'/en':'/en'+path);
  pages.push({url:ar,lastModified,changeFrequency:'monthly',priority:path==='/'?1:path==='/projects'?0.9:0.7,alternates:{languages:{ar,en,'x-default':ar}}});
  pages.push({url:en,lastModified,changeFrequency:'monthly',priority:path==='/'?1:path==='/projects'?0.9:0.7,alternates:{languages:{ar,en,'x-default':ar}}});
 }
 for(const project of catalog.projects){
  const ar=origin+'/projects/'+project.slug;
  const en=origin+'/en/projects/'+project.slug;
  pages.push({url:ar,lastModified,changeFrequency:'monthly',priority:0.75,alternates:{languages:{ar,en,'x-default':ar}}});
  pages.push({url:en,lastModified,changeFrequency:'monthly',priority:0.75,alternates:{languages:{ar,en,'x-default':ar}}});
 }
 return pages;
}
