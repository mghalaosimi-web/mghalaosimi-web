"use client";

import {useMemo,useState} from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowUpLeft,
  ArrowUpRight,
  Braces,
  CheckCircle2,
  ChevronDown,
  Code2,
  Database,
  FileCheck2,
  Layers3,
  Network,
  Search,
  Server,
  Workflow,
} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {projects} from '../../data/projects';
import type {PublicSkillRow} from '../../lib/public-content';

type Locale='ar'|'en';
type SkillDomain={
  id:string;
  title:string;
  en:string;
  description:string;
  descriptionEn:string;
  Icon:LucideIcon;
  items:string[];
  note:string;
  noteEn:string;
  learning?:boolean;
};

const domains:SkillDomain[]=[
  {
    id:'engineering',
    title:'البرمجة وتطوير التطبيقات',
    en:'PROGRAMMING & APPLICATION DEVELOPMENT',
    description:'لغات وأطر العمل المستخدمة في بناء تطبيقات الويب والواجهات والمنطق البرمجي.',
    descriptionEn:'Languages and frameworks used to build web applications, interfaces, and application logic.',
    Icon:Code2,
    items:['JavaScript','TypeScript','Python','C#','Dart','React','Next.js','Node.js','Flutter','Tailwind CSS'],
    note:'تقنيات مدرجة في سجل المهارات دون تحديد مستوى إتقان.',
    noteEn:'Technologies listed in the skills directory; proficiency is not specified.',
  },
  {
    id:'data',
    title:'قواعد البيانات وإدارة البيانات',
    en:'DATABASES & DATA MANAGEMENT',
    description:'تقنيات تخزين البيانات ونمذجتها والاستعلام عنها وربطها بطبقات التطبيق.',
    descriptionEn:'Technologies for storing, modelling, querying, and integrating application data.',
    Icon:Database,
    items:['PostgreSQL','SQLite','Prisma','Firebase','Supabase','SQL'],
    note:'تقنيات بيانات مدرجة في سجل المهارات دون تحديد مستوى إتقان.',
    noteEn:'Data technologies listed in the skills directory; proficiency is not specified.',
  },
  {
    id:'systems',
    title:'هندسة الأنظمة وتجربة المستخدم',
    en:'SYSTEMS ENGINEERING & USER EXPERIENCE',
    description:'مفاهيم معمارية وتشغيلية لتنظيم الخدمات والصلاحيات وسير العمل والواجهات العربية.',
    descriptionEn:'Architecture and product practices for services, permissions, workflows, and Arabic interfaces.',
    Icon:Workflow,
    items:['REST APIs','RBAC','ERP Systems','Offline-First','Arabic RTL','System Design','UI/UX'],
    note:'مفاهيم مطبقة في تصميم الأنظمة والمنتجات الرقمية.',
    noteEn:'Concepts applied in the design of systems and digital products.',
  },
  {
    id:'tooling',
    title:'الأدوات والبنية التحتية',
    en:'TOOLING & INFRASTRUCTURE',
    description:'أدوات إدارة الشيفرة والتبعيات والحاويات وعمليات البناء والنشر.',
    descriptionEn:'Tools for source control, dependencies, containers, builds, and deployment.',
    Icon:Server,
    items:['Git','GitHub','Docker Compose','pnpm','Turborepo','Vercel'],
    note:'أدوات مدرجة في سجل المهارات دون تحديد مستوى إتقان.',
    noteEn:'Tools listed in the skills directory; proficiency is not specified.',
  },
  {
    id:'interests',
    title:'مجالات الاهتمام والتوسع',
    en:'AREAS OF INTEREST & CONTINUOUS LEARNING',
    description:'مجالات أواصل دراستها وتوسيع تطبيقاتها من خلال التجارب والمشاريع.',
    descriptionEn:'Areas whose concepts and applications I continue to explore through study and projects.',
    Icon:Activity,
    items:['Applied AI','RAG','Cybersecurity Fundamentals','Software Testing','Secure Development'],
    note:'مجالات اهتمام وتعلّم؛ لا تعني ادعاء تخصص أو اعتماد مهني.',
    noteEn:'Areas of interest and learning, not claims of specialist or certified status.',
    learning:true,
  },
];

const filters=[
  {id:'all',ar:'كل المجالات',en:'All domains'},
  {id:'engineering',ar:'البرمجة',en:'Development'},
  {id:'data',ar:'قواعد البيانات',en:'Data'},
  {id:'systems',ar:'هندسة الأنظمة',en:'Systems'},
  {id:'tooling',ar:'الأدوات والبنية',en:'Tooling'},
  {id:'interests',ar:'الاهتمامات',en:'Interests'},
  {id:'other',ar:'مهارات أخرى',en:'Other skills'},
];

const pathways=[
  {Icon:Braces,title:'BUILD',ar:'البناء والتطوير',en:'Build & develop',detail:'تصميم البرمجيات، كتابة الشيفرات، بناء الواجهات وربط البيانات.',detailEn:'Design software, implement application logic, build interfaces, and connect data.',tools:'TypeScript · React · Next.js · Node.js'},
  {Icon:Layers3,title:'INTEGRATE',ar:'التكامل والأنظمة',en:'Integrate systems',detail:'ربط الخدمات وقواعد البيانات والصلاحيات وتدفقات العمل المؤسسية.',detailEn:'Connect services, databases, access control, and enterprise workflows.',tools:'PostgreSQL · Prisma · REST APIs · RBAC'},
  {Icon:CheckCircle2,title:'DELIVER',ar:'التحقق والتسليم',en:'Validate & deliver',detail:'اختبار الحلول، تنظيم الإصدارات، وتجهيز التطبيقات للنشر والتشغيل.',detailEn:'Test solutions, manage releases, and prepare applications for deployment.',tools:'Git · Docker · Vercel'},
];

const workflow=[
  {Icon:Network,t:'Understand',ar:'فهم المتطلبات والسياق',en:'Understand requirements'},
  {Icon:Layers3,t:'Design',ar:'تصميم البنية والتدفق',en:'Design architecture'},
  {Icon:Code2,t:'Build',ar:'التطوير والتكامل',en:'Build & integrate'},
  {Icon:FileCheck2,t:'Validate',ar:'الاختبار والتحقق',en:'Test & validate'},
];

function mergeSkillDomains(rows:PublicSkillRow[]|null):SkillDomain[]{
 if(rows===null)return domains;
 const groups:Record<string,Set<string>>={
  engineering:new Set(['Frontend','Backend','Programming','Mobile']),
  data:new Set(['Database']),
  tooling:new Set(['Deployment','DevOps','Tools'])
 };
 const names:Record<string,string[]>={engineering:[],data:[],tooling:[]};
 const unknown:string[]=[];
 for(const row of rows){
  const target=Object.entries(groups).find(([,categories])=>categories.has(row.category))?.[0];
  if(target)names[target].push(row.name);
  else unknown.push(row.name);
 }
 const merged=domains.map(domain=>{
  if(!(domain.id in names))return domain;
  return {...domain,items:[...new Set(names[domain.id])]};
 });
 if(unknown.length)merged.push({
  id:'other',title:'مهارات أخرى',en:'OTHER SKILLS',
  description:'مهارات منشورة في قاعدة البيانات ولا تنتمي إلى تصنيف تقني معروف في الدليل الحالي.',
  descriptionEn:'Published database skills without a recognized category in the current directory.',
  Icon:Layers3,items:[...new Set(unknown)],
  note:'تصنيف غير محدد في سجل المهارة.',
  noteEn:'The skill record does not specify a recognized category.'
 });
 return merged;
}

export default function SkillsExplorer({locale='ar',skills=null}:{locale?:Locale;skills?:PublicSkillRow[]|null}){
  const en=locale==='en';
  const [active,setActive]=useState('all');
  const [query,setQuery]=useState('');
  const [expanded,setExpanded]=useState<string[]>(['engineering','systems']);
  const activeDomains=useMemo(()=>mergeSkillDomains(skills),[skills]);
  const visible=useMemo(()=>{
    const term=query.trim().toLowerCase();
    return activeDomains
      .filter(domain=>active==='all'||domain.id===active)
      .map(domain=>({...domain,items:domain.items.filter(item=>!term||[
        item,domain.title,domain.en,domain.description,domain.descriptionEn,
      ].join(' ').toLowerCase().includes(term))}))
      .filter(domain=>domain.items.length>0);
  },[active,activeDomains,query]);
  const total=activeDomains.reduce((sum,domain)=>sum+domain.items.length,0);
  const toggle=(id:string)=>setExpanded(previous=>previous.includes(id)?previous.filter(value=>value!==id):[...previous,id]);
  const featured=projects.filter(project=>project.featured).slice(0,3);

  return <main className="content-page skills-page sk-page">
    <div className="sk-topline">
      <span>CAPABILITY MAP / 2026</span>
      <span>M.GH.AL <i/> TECHNICAL PROFILE</span>
    </div>

    <section className="sk-hero">
      <div className="sk-hero-copy">
        <span className="sk-kicker">SOFTWARE ENGINEERING · ENTERPRISE SYSTEMS · APPLIED AI</span>
        <h1>{en?<>Skills &amp; <em>capabilities</em></>:<>المهارات <em>والقدرات</em></>}</h1>
        <p>{en
          ?'A practical map of the technologies and engineering practices I use across full-stack development, enterprise-oriented systems, data, and digital products. Listing a technology does not imply expert-level proficiency.'
          :'خريطة عملية للتقنيات والممارسات الهندسية التي أستخدمها في تطوير Full-Stack والأنظمة المؤسسية والبيانات والمنتجات الرقمية. إدراج التقنية لا يعني ادعاء مستوى خبير فيها.'}</p>
        <div className="sk-hero-tags">
          <span><Code2/> Software Engineering</span>
          <span><Layers3/> Enterprise Systems</span>
          <span><Activity/> Applied AI</span>
        </div>
      </div>
      <div className="sk-hero-aside">
        <div className="sk-orbit">
          <div className="sk-orbit-core"><Code2/><b>MG</b><small>ENGINEERING</small></div>
          <i/><i/><i/>
        </div>
        <span>DESIGN / BUILD / DELIVER</span>
      </div>
    </section>

    <section className="sk-snapshot" aria-label={en?'Skills summary':'ملخص المهارات'}>
      <article><b>{total}</b><span>{en?'Technologies & practices':'تقنية وممارسة موثقة'}</span></article>
      <article><b>{activeDomains.length}</b><span>{en?'Technical domains':'مجالات تقنية'}</span></article>
      <article><b>03</b><span>{en?'Engineering pathways':'مسارات هندسية'}</span></article>
      <article><b>AR / EN</b><span>{en?'Bilingual product work':'تطوير ثنائي اللغة'}</span></article>
    </section>

    <section className="sk-pathways">
      <div className="sk-extra-heading">
        <span>01 / ENGINEERING PILLARS</span>
        <h2>{en?'Three connected engineering pillars':'ثلاثة مسارات مترابطة في العمل الهندسي'}</h2>
        <p>{en?'The work moves from building software, through integrating systems, to validating and delivering reliable products.':'يمتد العمل من بناء البرمجيات، إلى تكامل الأنظمة، ثم التحقق من الحلول وتسليم منتجات قابلة للاستخدام والتطوير.'}</p>
      </div>
      <div className="sk-pathway-grid">
        {pathways.map(({Icon,title,ar,en:english,detail,detailEn,tools},index)=>(
          <article key={title}>
            <span className="sk-pathway-index">0{index+1} / {title}</span>
            <Icon/>
            <h3>{en?english:ar}</h3>
            <p>{en?detailEn:detail}</p>
            <small>{tools}</small>
          </article>
        ))}
      </div>
    </section>

    <section className="sk-section-head">
      <div>
        <span>02 / CAPABILITY DIRECTORY</span>
        <h2>{en?'Technical skills directory':'دليل المهارات والتقنيات'}</h2>
        <p>{en?'Search for a technology or select a domain. Expand any group to review its skills and the context in which they are used.':'ابحث باسم التقنية أو اختر مجالاً محدداً. افتح أي مجموعة لمراجعة المهارات والسياق العام لاستخدامها.'}</p>
      </div>
      <label className="sk-search">
        <Search/>
        <input value={query} onChange={event=>setQuery(event.target.value)} placeholder={en?'Search technologies or domains...':'ابحث عن تقنية أو مجال...'} aria-label={en?'Search skills':'ابحث عن مهارة أو أداة'}/>
      </label>
    </section>

    <div className="sk-filters" role="group" aria-label={en?'Filter skill domains':'تصفية مجالات المهارات'}>
      {filters.map(filter=>(
        <button key={filter.id} type="button" className={active===filter.id?'active':''} aria-pressed={active===filter.id} onClick={()=>setActive(filter.id)}>
          {en?filter.en:filter.ar}
        </button>
      ))}
    </div>

    <section className="sk-domain-list">
      {visible.map((domain,index)=>{
        const Icon=domain.Icon;
        const isOpen=expanded.includes(domain.id)||query.length>0;
        return <article className="sk-domain" key={domain.id}>
          <button className="sk-domain-toggle" type="button" aria-expanded={isOpen} onClick={()=>toggle(domain.id)}>
            <span className="sk-domain-icon"><Icon/></span>
            <span className="sk-domain-title">
              <small>{String(index+1).padStart(2,'0')} / {domain.en}</small>
              <b>{en?domain.en:domain.title}</b>
              <em>{en?domain.descriptionEn:domain.description}</em>
            </span>
            <span className="sk-domain-count">{domain.items.length} {en?'skills':'مهارة'}</span>
            <ChevronDown className={isOpen?'rotated':''}/>
          </button>
          {isOpen&&<div className="sk-skill-grid">
            {domain.items.map(skill=>(
              <div className="sk-skill" key={skill}>
                <div>
                  <b>{skill}</b>
                  <span className={'sk-level '+(domain.learning?'is-learning':'is-practical')}>{domain.learning?(en?'Learning focus':'مجال تعلّم'):domain.id==='systems'?(en?'Engineering practice':'ممارسة هندسية'):(en?'Listed technology':'تقنية مدرجة')}</span>
                </div>
                <small>{en?domain.noteEn:domain.note}</small>
              </div>
            ))}
          </div>}
        </article>;
      })}
      {visible.length===0&&<div className="sk-empty">{en?'No matching skills. Try another search or select all domains.':'لا توجد نتائج مطابقة. جرّب كلمة بحث أخرى أو اختر كل المجالات.'}</div>}
    </section>

    <section className="sk-method">
      <div>
        <span>03 / ENGINEERING WORKFLOW</span>
        <h2>{en?'A workflow before choosing a tool.':'منهجية العمل قبل اختيار الأداة.'}</h2>
        <p>{en?'The process starts with understanding the problem and constraints, then designing the system, implementing the solution, and validating the result.':'تبدأ العملية بفهم المشكلة والقيود، ثم تصميم النظام، وتنفيذ الحل، وأخيراً اختبار النتائج والتحقق منها.'}</p>
        <Link href="/research" className="sk-inline-link">{en?'Research & engineering directions':'مسارات البحث والتطوير'} <ArrowUpLeft/></Link>
      </div>
      <div className="sk-method-flow">
        {workflow.map(({Icon,t,ar,en:english},index)=>(
          <article key={t}><span>0{index+1}</span><Icon/><b>{t}</b><small>{en?english:ar}</small></article>
        ))}
      </div>
    </section>

    <section className="sk-projects">
      <div className="sk-project-head">
        <div>
          <span>04 / SKILLS IN PRACTICE</span>
          <h2>{en?'Skills across projects':'المهارات داخل المشاريع'}</h2>
          <p>{en?'Projects provide context for the technologies and practices listed above. Each project is presented with its current scope and status.':'المشاريع هي السياق العملي للتقنيات والممارسات المذكورة، ويُعرض كل مشروع وفق نطاقه وحالته الحالية.'}</p>
        </div>
        <Link href="/projects">{en?'Browse all projects':'استعراض جميع المشاريع'} <ArrowUpLeft/></Link>
      </div>
      <div className="sk-project-grid">
        {featured.map(project=>(
          <Link href={'/projects/'+project.slug} className="sk-project-card" key={project.slug}>
            <span>ENGINEERING PROJECT</span>
            <b>{project.name}</b>
            <small>{project.summary}</small>
            <em>{en?'Project details':'تفاصيل المشروع'} <ArrowUpRight/></em>
          </Link>
        ))}
      </div>
    </section>

    <section className="sk-proof">
      <div><CheckCircle2/><div>
        <span>05 / VERIFIABLE LEARNING</span>
        <h2>{en?'Learning and verifiable credentials':'التعلّم والشهادات القابلة للتحقق'}</h2>
        <p>{en?'Credentials document completed learning. Projects remain separate evidence of practical implementation.':'توثّق الشهادات مسارات التعلّم المكتملة، بينما تظل المشاريع دليلاً مستقلاً على التطبيق العملي.'}</p>
      </div></div>
      <Link href="/credentials">{en?'View credentials':'عرض الشهادات والاعتمادات'} <ArrowUpLeft/></Link>
    </section>

    <aside className="sk-note">
      <CheckCircle2/>
      <p><b>{en?'Professional transparency:':'الشفافية المهنية:'}</b> {en
        ?'Skill labels describe technologies and areas of practice, not proficiency percentages or professional certifications. Practical depth varies by project and continues to evolve.'
        :'أسماء المهارات تصف التقنيات ومجالات الممارسة، ولا تمثل نسب إتقان أو شهادات مهنية. يختلف مستوى التطبيق بحسب المشروع ويتطور باستمرار.'}</p>
    </aside>

    <footer className="sk-footer">
      <span>M.GH.AL / SKILLS DIRECTORY</span>
      <b>Building Systems. Engineering with Purpose.</b>
      <Link href="/contact">{en?'Professional contact':'تواصل مهني'} <ArrowUpLeft/></Link>
    </footer>
  </main>;
}
