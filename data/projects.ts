import catalog from '../public/assets/projects/catalog.json';
import type {PublicProjectRow} from '../lib/public-projects';

export type ProjectCategory='web'|'enterprise'|'ai'|'cybersecurity'|'academic'|'mobile'|'desktop'|'other';
export type Project={
 slug:string;name:string;nameEn:string;category:ProjectCategory;label:string;labelEn:string;
 summary:string;summaryEn:string;stack:string[];status:string;statusEn:string;
 contribution:string;contributionEn:string;repository?:string;featured?:boolean;collaborative?:boolean;
 source:'database'|'catalog';databaseDescription?:string;liveUrl?:string;coverMediaId?:string;
 brand:{logo:string;primary:string;secondary:string;accent:string};
};

export const projects:Project[]=catalog.projects.map(project=>({
 slug:project.slug,
 name:project.title.ar,
 nameEn:project.title.en,
 category:project.categoryKey as ProjectCategory,
 label:project.category.ar,
 labelEn:project.category.en,
 summary:project.summary.ar,
 summaryEn:project.summary.en,
 stack:project.technologies,
 status:project.status.ar,
 statusEn:project.status.en,
 contribution:project.contribution.ar,
 contributionEn:project.contribution.en,
 ...(project.repository?{repository:project.repository}:{}),
 ...(project.slug==='waynah'?{featured:true}:{}),
 ...(project.collaborative?{collaborative:true}:{}),
 source:project.contentSource==='database'?'database':'catalog',
 brand:project.brand
}));

const statusLabels:Record<string,{ar:string;en:string}>={
 'Completed':{ar:'مكتمل',en:'Completed'},
 'In Progress':{ar:'قيد التطوير',en:'In progress'},
 'Experimental':{ar:'تجريبي',en:'Experimental'},
 'Incomplete':{ar:'غير مكتمل',en:'Incomplete'},
 'Paused':{ar:'متوقف مؤقتاً',en:'Paused'},
 'Planned':{ar:'مخطط له',en:'Planned'},
 'Archived':{ar:'مؤرشف',en:'Archived'}
};
const localizedStatus=(status:string,locale:'ar'|'en')=>statusLabels[status]?.[locale]??status;

const defaultBrand={logo:'/assets/projects/logos/mghal-default.svg',primary:'#315A85',secondary:'#DCE7F2',accent:'#B69A62'};

export function safeRepositoryUrl(value:string|null|undefined):string|undefined{
 if(!value)return undefined;
 try{const url=new URL(value);if(url.protocol!=='https:'||url.hostname!=='github.com'||url.username||url.password)return undefined;return url.toString();}catch{return undefined;}
}
export function safeLiveUrl(value:string|null|undefined):string|undefined{
 if(!value)return undefined;
 try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password)return undefined;return url.toString();}catch{return undefined;}
}

/**
 * Merge only the public projection from Neon into the curated project catalogue.
 * If Neon is unavailable, preserve the complete Git-managed catalogue.
 * Database-managed catalogue records follow the database publication set;
 * curated-only projects remain available independently of the database.
 */
export function mergePublishedProjects(rows:PublicProjectRow[]|null,locale:'ar'|'en'):Project[]{
 if(rows===null)return projects;
 const bySlug=new Map(rows.map(row=>[row.slug,row]));
 const curatedSlugs=new Set(projects.map(project=>project.slug));
 const merged=projects
  .filter(project=>project.source!=='database'||bySlug.has(project.slug))
  .map(project=>{
   const row=bySlug.get(project.slug);
   if(!row)return project;
   const name=row.name|| (locale==='ar'?project.name:project.nameEn);
   const summary=row.short_description|| (locale==='ar'?project.summary:project.summaryEn);
   const status=localizedStatus(row.status,locale);
   return {
    ...project,
    ...(locale==='ar'?{name,summary,status}:{nameEn:name,summaryEn:summary,statusEn:status}),
    repository:safeRepositoryUrl(row.repository_url),
    liveUrl:safeLiveUrl(row.live_url),
    databaseDescription:row.description||undefined,
    coverMediaId:row.cover_media_id||undefined
   };
  });
 const additions=rows.filter(row=>!curatedSlugs.has(row.slug)).map(row=>{
  const name=row.name||row.slug;
  const summary=row.short_description|| (locale==='ar'?'لم يضف وصف لهذا المشروع بعد.':'No project summary has been added yet.');
  const contribution=locale==='ar'?'لم تُوثّق المساهمة الفردية في سجل المشروع.':'Individual contribution has not been documented in the project record.';
  const status=localizedStatus(row.status,locale);
  return {
   slug:row.slug,name,nameEn:name,category:'other' as const,
   label:locale==='ar'?'غير مصنف':'Unclassified',labelEn:'Unclassified',
   summary,summaryEn:summary,stack:[],status,statusEn:status,
   contribution,contributionEn:contribution,repository:safeRepositoryUrl(row.repository_url),
   source:'database' as const,databaseDescription:row.description||undefined,
   liveUrl:safeLiveUrl(row.live_url),coverMediaId:row.cover_media_id||undefined,
   brand:defaultBrand
  };
 });
 return [...merged,...additions];
}
