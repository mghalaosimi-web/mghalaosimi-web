import {cache} from 'react';
import {getPublicProjectsForLocale} from './mghal-api-runtime.mjs';

export type PublicProjectRow={
  id:string;
  slug:string;
  name:string;
  locale:string;
  short_description:string|null;
  description:string|null;
  status:string;
  repository_url:string|null;
  live_url:string|null;
  cover_media_id:string|null;
  started_at:string|null;
  completed_at:string|null;
  sort_order:number;
  created_at:string;
  updated_at:string;
};

/**
 * Request-scoped public project read. null means the database is unavailable;
 * [] means it is available and no published project records exist.
 */
export const getPublishedProjectRows=cache(async(locale:'ar'|'en'):Promise<PublicProjectRow[]|null>=>{
  const rows=await getPublicProjectsForLocale(locale);
  return Array.isArray(rows)?rows as PublicProjectRow[]:null;
});
