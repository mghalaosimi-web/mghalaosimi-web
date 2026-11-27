import type {Metadata} from 'next';
import {resolveLocalizedAlternates} from './seo-paths.mjs';

export type SiteLocale='ar'|'en';

export function localizedAlternates(path:string,locale:SiteLocale):Metadata['alternates']{
 return resolveLocalizedAlternates(path,locale);
}

export function localizedSocialMetadata(
 path:string,
 locale:SiteLocale,
 title:string,
 description:string,
 image='/assets/images/mghal-profile-primary.jpg',
 imageAlt='Mohammed Ghaleb Alaosimi — M.GH.AL',
):Pick<Metadata,'openGraph'|'twitter'>{
 const localizedPath=locale==='en'?(path==='/'?'/en':`/en${path}`):path;
 const url=`https://mghalaosimi-web.vercel.app${localizedPath}`;
 return {
  openGraph:{
   type:'website',
   locale:locale==='en'?'en_US':'ar_YE',
   url,
   siteName:'M.GH.AL',
   title,
   description,
   images:[{url:image,alt:imageAlt}],
  },
  twitter:{
   card:'summary_large_image',
   title,
   description,
   images:[image],
  },
 };
}
