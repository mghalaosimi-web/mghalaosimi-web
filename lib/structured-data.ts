const siteUrl='https://mghalaosimi-web.vercel.app';
const person={'@type':'Person',name:'Mohammed Ghaleb Alaosimi',alternateName:'محمد غالب العصيمي',url:siteUrl,sameAs:['https://github.com/mghalaosimi-web','https://www.linkedin.com/in/mohammed-alaosimi-038155443/','https://orcid.org/0009-0000-6007-3170']};
export function credentialsJsonLd(){return{'@context':'https://schema.org',...person,hasCredential:[]}}
export function projectJsonLd(project:{slug:string;name:string;summary:string;stack:string[];repository?:string}){return{'@context':'https://schema.org','@type':'SoftwareSourceCode',name:project.name,description:project.summary,url:`${siteUrl}/projects/${project.slug}`,author:person,programmingLanguage:project.stack,...(project.repository?{codeRepository:project.repository}:{})}}
