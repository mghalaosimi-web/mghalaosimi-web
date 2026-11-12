import catalog from '../public/assets/projects/catalog.json';
export type ProjectCategory='web'|'enterprise'|'ai'|'cybersecurity'|'academic'|'mobile'|'desktop';
export type Project={
 slug:string;name:string;nameEn:string;category:ProjectCategory;label:string;labelEn:string;
 summary:string;summaryEn:string;stack:string[];status:string;statusEn:string;
 contribution:string;contributionEn:string;repository?:string;featured?:boolean;collaborative?:boolean;
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
 brand:project.brand
}));
