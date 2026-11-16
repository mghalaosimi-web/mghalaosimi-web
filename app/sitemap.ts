import type {MetadataRoute} from 'next';
import {projects} from '../data/projects';

const origin='https://mghalaosimi-web.vercel.app';
const updated=new Date('2026-11-14T00:00:00.000Z');

// Keep these public image URLs in sync with the gallery in app/photos/page.tsx.
const imagesByRoute:Record<string,string[]> = {
  '': [
    origin+'/assets/images/mghal-profile-primary.jpg',
  ],
  '/photos': [
    origin+'/profile-gallery/mghal-eid-portrait-2026.png',
    origin+'/profile-gallery/mghal-cultural-portrait-2026.png',
    origin+'/profile-gallery/mghal-with-companion-2026.jpg',
    origin+'/profile-gallery/mghal-professional-poster-01.png',
    origin+'/profile-gallery/mghal-professional-poster-02.png',
    origin+'/profile-gallery/mghal-brand-visual-01.png',
    origin+'/profile-gallery/mghal-brand-portrait-visual.png',
    origin+'/profile-gallery/mghal-brand-visual-02.png',
    origin+'/profile-gallery/mghal-reading-portrait-2026.jpg',
    origin+'/profile-gallery/mghal-photo-2026-07-22.jpg',
    origin+'/profile-gallery/mghal-photo-2026-07-28-a.jpg',
    origin+'/profile-gallery/mghal-photo-2026-07-28-b.jpg',
  ],
};

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
  const staticEntries=pages.flatMap(([ar,en,priority])=>{
    const languages={ar:origin+ar,en:origin+en,'x-default':origin+ar};
    const images=imagesByRoute[ar];
    const shared={
      lastModified:updated,
      changeFrequency:'monthly' as const,
      priority,
      alternates:{languages},
    };
    return [
      {url:origin+ar,...shared,...(images?{images}:{})},
      {url:origin+en,...shared,...(images?{images}:{})},
    ];
  });
  const projectEntries=projects.flatMap(project=>{
    const ar=origin+'/projects/'+project.slug;
    const en=origin+'/en/projects/'+project.slug;
    const languages={ar,en,'x-default':ar};
    const shared={
      lastModified:updated,
      changeFrequency:'monthly' as const,
      priority:0.7,
      alternates:{languages},
    };
    return [
      {url:ar,...shared},
      {url:en,...shared},
    ];
  });
  return [...staticEntries,...projectEntries];
}
