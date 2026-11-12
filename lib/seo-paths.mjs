const localizedRoutes=Object.freeze({
 '/':{ar:'/',en:'/en'},
 '/about':{ar:'/about',en:'/en/about'},
 '/projects':{ar:'/projects',en:'/en/projects'},
 '/skills':{ar:'/skills',en:'/en/skills'},
 '/research':{ar:'/research',en:'/en/research'},
 '/contact':{ar:'/contact',en:'/en/contact'},
 '/credentials':{ar:'/credentials',en:'/en/credentials'},
 '/education':{ar:'/education',en:'/en/education'},
 '/achievements':{ar:'/achievements',en:'/en/achievements'},
 '/knowledge':{ar:'/knowledge',en:'/en/knowledge'},
 '/resume':{ar:'/resume',en:'/en/resume'},
 '/labs':{ar:'/labs',en:'/en/labs'}
});
export function resolveLocalizedAlternates(path,locale){
 const rawPath=typeof path==='string'?path.trim():'/';
 const pathname=(rawPath.split(/[?#]/,1)[0]||'/').replace(/\/{2,}/g,'/').replace(/\/+$/,'')||'/';
 const projectMatch=pathname.match(/^\/(en\/)?projects\/([a-z0-9]+(?:-[a-z0-9]+)*)$/i);
 const pair=projectMatch?{ar:'/projects/'+projectMatch[2],en:'/en/projects/'+projectMatch[2]}:localizedRoutes[pathname];
 if(!pair)return {canonical:pathname};
 return {canonical:pair[locale],languages:{ar:pair.ar,en:pair.en,'x-default':pair.ar}};
}
