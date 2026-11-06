import type {Metadata} from 'next';
export type SiteLocale='ar'|'en';
export function localizedAlternates(path:string,locale:SiteLocale):Metadata['alternates']{const suffix=path==='/'?'':path.startsWith('/')?path:`/${path}`;return{canonical:suffix||'/',languages:{ar:suffix||'/',en:suffix||'/', 'x-default':suffix||'/'}}}
