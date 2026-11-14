import type {MetadataRoute} from 'next';
import {projects} from '../data/projects';

const origin='https://mghalaosimi-web.vercel.app';
const updated=new Date('2026-11-14T00:00:00.000Z');
const pages=[
  ['','/en',1],
  ['/about','/en/about',0.8],
  ['/projects','/en/projects',0.9],
  ['/skills','/en/skills',0.7],
  ['/credentials','/en/credentials',0.8],
  ['/labs','/en/labs',0.6],
  ['/research','/en/research',0.6],
  ['/contact','/en/contact',0.6],
  ['/photos','/en/photos',0.5],
] as const;

export default function sitemap():MetadataRoute.Sitemap{
  const staticEntries=pages.flatMap(([ar,en,priority])=>[
    {url:origin+ar,lastModified:updated,changeFrequency:'monthly' as const,priority,alternates:{languages:{ar:origin+ar,en:origin+en}}},
    {url:origin+en,lastModified:updated,changeFrequency:'monthly' as const,priority,alternates:{languages:{ar:origin+ar,en:origin+en}}},
  ]);
  const projectEntries=projects.flatMap(project=>{
    const ar=origin+'/projects/'+project.slug;
    const en=origin+'/en/projects/'+project.slug;
    return [
      {url:ar,lastModified:updated,changeFrequency:'monthly' as const,priority:0.7,alternates:{languages:{ar,en}}},
      {url:en,lastModified:updated,changeFrequency:'monthly' as const,priority:0.7,alternates:{languages:{ar,en}}},
    ];
  });
  return [...staticEntries,...projectEntries];
}
