import type {Metadata} from 'next';

export type SiteLocale='ar'|'en';

const localizedRoutes:Record<string,{ar:string;en:string}>={
 '/':{ar:'/',en:'/en/'},
 '/about':{ar:'/about',en:'/en/profile.html'},
 '/projects':{ar:'/projects',en:'/en/projects.html'},
 '/skills':{ar:'/skills',en:'/en/skills.html'},
 '/research':{ar:'/research',en:'/en/research.html'},
 '/contact':{ar:'/contact',en:'/en/contact.html'},
 '/credentials':{ar:'/certificates.html',en:'/en/certificates.html'}
};

export function localizedAlternates(path:string,locale:SiteLocale):Metadata['alternates']{
 const raw=typeof path==='string'?path.trim():'/';
 const pathname=raw.split(/[?#]/,1)[0]||'/';
 const normalized=(pathname.startsWith('/')?pathname:'/'+pathname).replace(/\/{2,}/g,'/').replace(/\/+$/,'')||'/';
 const projectMatch=normalized.match(/^\/projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
 const pair=projectMatch
  ? {ar:'/projects/'+projectMatch[1]+'/',en:'/en/projects/'+projectMatch[1]+'/'}
  : localizedRoutes[normalized];

 if(!pair)return {canonical:normalized};
 return {canonical:pair[locale],languages:{ar:pair.ar,en:pair.en,'x-default':pair.ar}};
}
