export const runtime = 'nodejs';
import type {Metadata} from 'next';
import type {CSSProperties,ReactNode} from 'react';
import Link from 'next/link';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';
import catalog from '../../../public/assets/projects/catalog.json';
import '../../mghal-portfolio.css';
import '../projects.css';
import {localizedAlternates} from '../../../lib/seo';
import {getPublishedProjectRows,type PublicProjectRow} from '../../../lib/public-projects';
import {safeRepositoryUrl,safeLiveUrl} from '../../../data/projects';

type Locale='ar'|'en';
type Localized=Record<Locale,string>;
type GalleryItem={src:string;alt:Localized;caption:Localized};
type ProjectRecord={
  id:string;slug:string;title:Localized;summary:Localized;problem:Localized;goal:Localized;
  audience:Localized;value:Localized;category:Localized;categoryKey:string;status:Localized;
  statusKey:string;visibility:Localized;repository:string|null;relatedRepositories:string[];
  cover:string;coverAlt:Localized;brand:{logo:string;primary:string;secondary:string;accent:string};
  technologies:string[];features:Localized[];architecture:Localized;gallery:GalleryItem[];
  docs?:string;deploymentReference?:{url:string;label:Localized};evidence:{ar:string[];en:string[]};
  notes?:{ar:string[];en:string[]};operatingSystem?:string;contribution:Localized;contentSource?:'database'|'catalog';liveUrl?:string;coverMediaId?:string;databaseDescription?:string;
};
const projects=catalog.projects as ProjectRecord[];
const text=(value:Localized|undefined,locale:Locale)=>value?.[locale]??'';
const defaultBrand={logo:'/assets/projects/logos/mghal-default.svg',primary:'#315A85',secondary:'#DCE7F2',accent:'#B69A62'};
const statusLabels:Record<string,Localized>={
 'Completed':{ar:'مكتمل',en:'Completed'},
 'In Progress':{ar:'قيد التطوير',en:'In progress'},
 'Experimental':{ar:'تجريبي',en:'Experimental'},
 'Incomplete':{ar:'غير مكتمل',en:'Incomplete'},
 'Paused':{ar:'متوقف مؤقتاً',en:'Paused'},
 'Planned':{ar:'مخطط له',en:'Planned'},
 'Archived':{ar:'مؤرشف',en:'Archived'}
};
const localizedStatus=(status:string,locale:Locale)=>statusLabels[status]?.[locale]??status;
function fromDatabaseRow(row:PublicProjectRow,locale:Locale):ProjectRecord{
 const missing:Localized={ar:'لم يتم توثيق هذه التفاصيل في سجل المشروع حتى الآن.',en:'These details have not yet been documented in the project record.'};
 const summary=row.short_description||missing[locale];
 const cover=row.cover_media_id?'/api/public/media/'+encodeURIComponent(row.cover_media_id):'/assets/projects/default-project.svg';
 return {
  id:row.id,slug:row.slug,title:{ar:locale==='ar'?row.name:missing.ar,en:locale==='en'?row.name:missing.en},summary:{ar:locale==='ar'?summary:missing.ar,en:locale==='en'?summary:missing.en},
  problem:missing,goal:missing,audience:missing,value:missing,
  category:{ar:'مشروع غير مصنف',en:'Unclassified project'},categoryKey:'other',
  status:{ar:localizedStatus(row.status,'ar'),en:localizedStatus(row.status,'en')},statusKey:row.status,
  visibility:{ar:'سجل منشور من لوحة الإدارة',en:'Published administration record'},
  repository:safeRepositoryUrl(row.repository_url)??null,relatedRepositories:[],cover,
  coverAlt:{ar:'غلاف تعريفي عام لسجل المشروع، وليس لقطة شاشة للتطبيق.',en:'Generic project-record artwork, not an application screenshot.'},
  brand:defaultBrand,technologies:[],features:[],architecture:{ar:row.description||missing.ar,en:row.description||missing.en},
  gallery:[],evidence:{ar:['تم جلب هذا السجل من المشاريع المنشورة في قاعدة البيانات.','لم تُضف بعد بيانات تفصيلية موثقة لهذا المشروع.'],en:['This record was read from the published database projects.','Detailed verified project information has not yet been added.']},
  notes:{ar:['هذا سجل منشور من لوحة الإدارة؛ أضف التصنيف والتقنيات والميزات والمساهمة قبل اعتباره ملفاً هندسياً مكتملاً.'],en:['This is a published administration record; add its category, stack, features and contribution before treating it as a complete engineering profile.']},
  contribution:missing,contentSource:'database',liveUrl:safeLiveUrl(row.live_url),coverMediaId:row.cover_media_id||undefined,databaseDescription:row.description||undefined
 };
}
async function resolveProject(slug:string,locale:Locale):Promise<ProjectRecord|null>{
 const base=projects.find(item=>item.slug===slug);
 const rows=await getPublishedProjectRows(locale);
 if(rows===null)return base??null;
 const row=rows.find(item=>item.slug===slug);
 if(!base)return row?fromDatabaseRow(row,locale):null;
 if(base.contentSource==='database'&&!row)return null;
 if(!row)return base;
 return {
  ...base,
  title:{...base.title,[locale]:row.name||base.title[locale]},
  summary:{...base.summary,[locale]:row.short_description||base.summary[locale]},
  status:{...base.status,[locale]:localizedStatus(row.status,locale)},
  repository:safeRepositoryUrl(row.repository_url)??null,
  liveUrl:safeLiveUrl(row.live_url),
  coverMediaId:row.cover_media_id||undefined,
  ...(row.cover_media_id?{cover:'/api/public/media/'+encodeURIComponent(row.cover_media_id)}:{})
 };
}
const labels={
 ar:{back:'العودة إلى المشاريع',eyebrow:'M.GH.AL / ملف المشروع',category:'التصنيف',status:'حالة التطوير',visibility:'إتاحة المصدر',summary:'نبذة احترافية',problem:'المشكلة التي يعالجها',goal:'الهدف الهندسي',audience:'الفئة المستهدفة',value:'القيمة المقدمة',features:'الميزات المثبتة في التوثيق',stack:'التقنيات المستخدمة',architecture:'المعمارية التقنية',contribution:'الدور والمساهمة',gallery:'صور ولقطات من المستودع',evidence:'مصادر التحقق',repository:'مستودع GitHub',docs:'توثيق المشروع',related:'مستودعات مرتبطة',notes:'ملاحظات التحقق',emptyGallery:'لا تتوفر حالياً لقطات فعلية منشورة يمكن عرضها لهذا المشروع.',notClaimed:'لا تُعرض وظائف أو نتائج غير مدعومة بأدلة المستودع.',live:'فتح النسخة المنشورة',databaseDescription:'الوصف المنشور من لوحة الإدارة'},
 en:{back:'Back to projects',eyebrow:'M.GH.AL / PROJECT PROFILE',category:'Category',status:'Development status',visibility:'Source visibility',summary:'Professional overview',problem:'Problem addressed',goal:'Engineering objective',audience:'Target audience',value:'Value proposition',features:'Documented capabilities',stack:'Verified technology stack',architecture:'Technical architecture',contribution:'Role and contribution',gallery:'Repository visuals',evidence:'Verification sources',repository:'GitHub repository',docs:'Project documentation',related:'Related repositories',notes:'Verification notes',emptyGallery:'No actual repository screenshots are currently available for this project.',notClaimed:'No feature or outcome is presented without supporting repository evidence.',live:'Open published version',databaseDescription:'Published administration description'}
};
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
 const {slug}=await params;
 const locale:Locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';
 const project=await resolveProject(slug,locale);
 if(!project)return {title:'Project not found',robots:{index:false,follow:false}};
 return {title:text(project.title,locale),description:text(project.summary,locale),alternates:localizedAlternates(`/projects/${slug}`,locale)};
}
export default async function ProjectDetail({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;
 const locale:Locale=(await cookies()).get('portfolio-locale')?.value==='en'?'en':'ar';
 const project=await resolveProject(slug,locale);
 if(!project)notFound();
 const t=labels[locale],rtl=locale==='ar';
 const section=(key:string,title:string,content:ReactNode)=> <section className="project-detail-section" key={key}><div className="project-detail-section-heading"><span>{String(project.id).toUpperCase()}</span><h2>{title}</h2></div>{content}</section>;
 return <main className="project-detail" dir={rtl?'rtl':'ltr'} style={{'--project-primary':project.brand.primary,'--project-secondary':project.brand.secondary,'--project-accent':project.brand.accent} as CSSProperties}>
  <nav className="project-detail-breadcrumb"><Link href="/projects">← {t.back}</Link><span>{t.eyebrow}</span></nav>
  <header className="project-detail-hero">
   <div className="project-detail-brand"><img src={project.brand.logo} width="92" height="92" alt={`${text(project.title,locale)} logo`} /><div><span className="project-detail-kicker">PROJECT / {project.id.toUpperCase()}</span><h1>{text(project.title,locale)}</h1><p>{text(project.summary,locale)}</p></div></div>
   <div className="project-detail-meta"><span>{t.category}: {text(project.category,locale)}</span><span>{t.status}: {text(project.status,locale)}</span><span>{t.visibility}: {text(project.visibility,locale)}</span></div>
   <div className="project-detail-actions">{project.repository&&<a href={project.repository} target="_blank" rel="noreferrer">{t.repository} ↗</a>}{project.docs&&<a href={project.docs} target="_blank" rel="noreferrer">{t.docs} ↗</a>}{project.liveUrl&&<a href={project.liveUrl} target="_blank" rel="noreferrer">{t.live} ↗</a>}</div>
  </header>
  <div className="project-detail-cover"><img src={project.cover} alt={text(project.coverAlt,locale)} loading="eager" /></div>
  <div className="project-detail-body">
   {section('overview',t.summary,<p className="project-detail-lead">{text(project.summary,locale)}</p>)}
   {project.databaseDescription?section('database-description',t.databaseDescription,<p>{project.databaseDescription}</p>):null}
   {section('problem',t.problem,<p>{text(project.problem,locale)}</p>)}
   {section('goal',t.goal,<p>{text(project.goal,locale)}</p>)}
   {section('audience',t.audience,<p>{text(project.audience,locale)}</p>)}
   {section('value',t.value,<p>{text(project.value,locale)}</p>)}
   {section('features',t.features,<ul className="project-detail-feature-list">{project.features.map((feature,index)=><li key={index}>{text(feature,locale)}</li>)}</ul>)}
   {section('stack',t.stack,<div className="project-detail-tags">{project.technologies.map(item=><span key={item}>{item}</span>)}</div>)}
   {section('architecture',t.architecture,<p>{text(project.architecture,locale)}</p>)}
   {section('contribution',t.contribution,<p>{text(project.contribution,locale)}</p>)}
   {section('gallery',t.gallery,project.gallery.length?<div className="project-detail-gallery">{project.gallery.map((item,index)=><figure key={item.src}><a href={item.src} target="_blank" rel="noreferrer"><img src={item.src} alt={text(item.alt,locale)} loading="lazy" /></a><figcaption>{text(item.caption,locale)}</figcaption></figure>)}</div>:<p className="project-detail-muted">{t.emptyGallery}</p>)}
   {section('evidence',t.evidence,<ul className="project-detail-evidence">{project.evidence[locale].map((item,index)=><li key={index}>{item}</li>)}</ul>)}
   {project.relatedRepositories.length>0&&section('related',t.related,<ul className="project-detail-evidence">{project.relatedRepositories.map(url=><li key={url}><a href={url} target="_blank" rel="noreferrer">{url}</a></li>)}</ul>)}
   {project.notes?.[locale]?.length?section('notes',t.notes,<ul className="project-detail-evidence">{project.notes[locale].map((item,index)=><li key={index}>{item}</li>)}</ul>):null}
   <p className="project-detail-disclaimer">{t.notClaimed}</p>
  </div>
  <footer className="project-detail-footer"><Link href="/projects">← {t.back}</Link></footer>
 </main>;
}
