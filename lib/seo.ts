import type {Metadata} from 'next';
import {resolveLocalizedAlternates} from './seo-paths.mjs';

export type SiteLocale='ar'|'en';

export function localizedAlternates(path:string,locale:SiteLocale):Metadata['alternates']{
 return resolveLocalizedAlternates(path,locale);
}
