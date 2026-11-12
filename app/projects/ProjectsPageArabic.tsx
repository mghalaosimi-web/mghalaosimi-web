'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {projects} from '../../data/projects';
import type {ProjectCategory} from '../../data/projects';
import {
  ArrowLeft,ArrowUpLeft,ArrowUpRight,Code2,FolderGit2,
  GraduationCap,Layers3,ShieldCheck,Sparkles,MapPin,Database,WifiOff
} from 'lucide-react';
import './projects.css';

const filters:{id:'all'|ProjectCategory;label:string}[]=[
  {id:'all',label:'جميع المشاريع'},{id:'web',label:'منصات الويب'},
  {id:'enterprise',label:'الأنظمة المؤسسية'},{id:'ai',label:'الذكاء الاصطناعي'},
  {id:'cybersecurity',label:'الأمن السيبراني والتشفير'},{id:'academic',label:'المشاريع الأكاديمية'},
  {id:'mobile',label:'تطبيقات الجوال'},{id:'desktop',label:'تطبيقات سطح المكتب'}
];

const categoryMeta={
  web:{label:'WEB PLATFORMS',name:'منصات الويب'},
  enterprise:{label:'ENTERPRISE SYSTEMS',name:'الأنظمة المؤسسية'},
  ai:{label:'ARTIFICIAL INTELLIGENCE',name:'الذكاء الاصطناعي'},
  cybersecurity:{label:'CYBERSECURITY',name:'الأمن السيبراني والتشفير'},
  academic:{label:'ACADEMIC SYSTEMS',name:'المشاريع الأكاديمية'},
  mobile:{label:'MOBILE APPLICATIONS',name:'تطبيقات الجوال'},
  desktop:{label:'DESKTOP SOFTWARE',name:'تطبيقات سطح المكتب'}
};

export default function ProjectsPage(){
  const [filter,setFilter]=useState<typeof filters[number]['id']>('all');
  
  const featured=projects.find(p=>p.slug==='waynah');
  const archive=projects.filter(p=>p.slug!=='waynah');
  const visible=useMemo(()=>archive.filter(p=>filter==='all'||p.category===filter),[filter]);
  const featuredVisible=!!featured&&(filter==='all'||featured.category===filter);
  
  const repositoryCount=projects.filter(p=>p.repository).length;
  const collaborativeCount=projects.filter(p=>p.collaborative).length;

  return <main className="content-page projects-page portfolio-archive">
    <section className="portfolio-archive-hero">
      <div className="portfolio-archive-hero-copy">
        <span className="portfolio-archive-eyebrow"><span/> ENGINEERING PORTFOLIO <i/> PROJECT ARCHIVE</span>
        <h1>هندسة الأفكار.<br/><em>بناء الأنظمة.</em></h1>
        <p>مساحة تجمع أعمالاً في هندسة البرمجيات والأنظمة المؤسسية والذكاء الاصطناعي التطبيقي، إلى جانب تجارب تقنية موثقة.</p>
        <a className="portfolio-archive-explore" href="#project-collection">استكشف المشاريع <ArrowLeft size={16}/></a>
      </div>
      <div className="portfolio-archive-hero-mark" aria-hidden="true">
        <div className="portfolio-archive-mark-orbit orbit-a"/>
        <div className="portfolio-archive-mark-orbit orbit-b"/>
        <div className="portfolio-archive-mark-core"><Layers3 size={42}/><b>BUILD</b><small>ENGINEERED SYSTEMS</small></div>
        <span className="portfolio-archive-mark-code">PA / 01</span>
      </div>
      <div className="portfolio-archive-hero-foot"><span>DESIGN / ENGINEERING / SYSTEMS</span><span>BUILDING SYSTEMS. ENGINEERING WITH PURPOSE.</span></div>
    </section>

    <section className="portfolio-archive-metrics" aria-label="ملخص المشاريع">
      <div><span className="portfolio-archive-metric-icon"><FolderGit2 size={18}/></span><strong>{projects.length.toString().padStart(2,'0')}</strong><small>مشروع في الأرشيف</small></div>
      <div><span className="portfolio-archive-metric-icon"><Code2 size={18}/></span><strong>{repositoryCount.toString().padStart(2,'0')}</strong><small>مستودع مرتبط</small></div>
      <div><span className="portfolio-archive-metric-icon"><GraduationCap size={18}/></span><strong>{collaborativeCount.toString().padStart(2,'0')}</strong><small>مشاريع تعاونية</small></div>
      <div><span className="portfolio-archive-metric-icon"><ShieldCheck size={18}/></span><strong>03</strong><small>مجالات عمل رئيسية</small></div>
    </section>

    {featuredVisible&&featured&&<section className="portfolio-featured-project">
      <div className="portfolio-featured-visual">
        <div className="portfolio-featured-visual-grid"/>
        <div className="portfolio-featured-orbit featured-orbit-one"/>
        <div className="portfolio-featured-orbit featured-orbit-two"/>
        <div className="portfolio-featured-shield"><MapPin size={72} strokeWidth={1}/><span>WAYNAH</span><small>LOCAL DISCOVERY</small></div>
        <span className="portfolio-featured-visual-index">WY / 01</span>
        <span className="portfolio-featured-visual-caption">YEMEN · WGS84 · POSTGIS</span>
      </div>
      <div className="portfolio-featured-copy">
        <div className="portfolio-featured-overline"><Sparkles size={14}/> FEATURED ENGINEERING PROJECT <span>01 / 01</span></div>
        <div className="portfolio-featured-status"><i/>{featured.status}</div>
        <h2>{featured.name}</h2>
        <h3>{featured.label}</h3>
        <p>{featured.summary}</p>
        <div className="portfolio-featured-tags">{featured.stack.slice(0,4).map(item=><span key={item}>{item}</span>)}</div>
        <div className="portfolio-featured-footer">
          <span>PROJECT CONTRIBUTION<br/><b>M.GH.AL / TEAM CONTRIBUTOR</b></span>
          <Link href="/projects/waynah" className="portfolio-archive-explore">استكشف المشروع <ArrowUpLeft size={17}/></Link>
        </div>
      </div>
    </section>}

    {featuredVisible&&featured&&<section className="portfolio-waynah-gallery" aria-labelledby="waynah-gallery-title">
      <div className="portfolio-waynah-gallery-heading">
        <div><span>WAYNAH / SYSTEM OVERVIEW</span><h2 id="waynah-gallery-title">لمحة عن التصور الهندسي</h2><p>نظرة عالية المستوى على محاور المنتج: البيانات الجغرافية، تجربة الاستخدام في الاتصال المحدود، واستكشاف المعلومات المحلية الموثوقة.</p></div>
        <span className="portfolio-waynah-gallery-index">SYSTEM NOTES / 03</span>
      </div>
      <div className="portfolio-waynah-gallery-grid">
        <article className="portfolio-waynah-visual-card">
          <div className="portfolio-waynah-visual-frame"><div className="waynah-visual-art"><MapPin/><b>GEOGRAPHIC DATA</b><small>WGS84 · POSTGIS</small></div></div>
          <div><span>01 / SPATIAL FOUNDATION</span><h3>الأساس المكاني</h3><p>تمثيل المواقع والبيانات الجغرافية ضمن قاعدة بيانات مكانية.</p></div>
        </article>
        <article className="portfolio-waynah-visual-card">
          <div className="portfolio-waynah-visual-frame"><div className="waynah-visual-art"><WifiOff/><b>OFFLINE-FIRST</b><small>LOW CONNECTIVITY</small></div></div>
          <div><span>02 / RESILIENT EXPERIENCE</span><h3>تجربة تراعي الاتصال المحدود</h3><p>تصميم تدفقات استخدام تساعد على الوصول إلى المعلومات عند ضعف الشبكة.</p></div>
        </article>
        <article className="portfolio-waynah-visual-card">
          <div className="portfolio-waynah-visual-frame"><div className="waynah-visual-art"><Database/><b>TRUSTED DIRECTORY</b><small>LOCAL DISCOVERY</small></div></div>
          <div><span>03 / LOCAL INFORMATION</span><h3>دليل محلي موثوق</h3><p>تنظيم بيانات الأماكن والخدمات وإظهار المعلومات بحسب ما تم توثيقه.</p></div>
        </article>
      </div>
      <Link href="/projects/waynah" className="portfolio-waynah-gallery-link">استعراض ملف WAYNAH <ArrowUpLeft size={16}/></Link>
    </section>}

    <section className="portfolio-archive-collection" id="project-collection">
      <div className="portfolio-archive-section-heading">
        <div><span>THE WORK / SELECTED PROJECTS</span><h2>المشاريع والأعمال الهندسية</h2><p>استعرض الأعمال بحسب المجال، مع توضيح طبيعة كل مشروع وحالته ومصادره المتاحة.</p></div>
        <div className="portfolio-archive-count"><strong>{(visible.length+(featuredVisible?1:0)).toString().padStart(2,'0')}</strong><small>PROJECTS</small></div>
      </div>
      <div className="portfolio-archive-filters" role="group" aria-label="تصفية المشاريع">
        {filters.map(f=><button key={f.id} onClick={()=>setFilter(f.id)} className={filter===f.id?'selected':''} aria-pressed={filter===f.id}>{f.label}<span>{f.id==='all'?projects.length:archive.filter(p=>p.category===f.id).length+(featured&&featured.category===f.id?1:0)}</span></button>)}
      </div>
      <div className="portfolio-archive-grid">
        {visible.map((p,i)=>{
          const meta=categoryMeta[p.category];
          return <Link href={'/projects/'+p.slug} className="portfolio-project-card" key={p.slug} aria-label={'عرض تفاصيل '+p.name} style={{'--project-primary':p.brand.primary} as React.CSSProperties}>
            <div className="portfolio-project-card-top"><span className="portfolio-project-icon"><img src={p.brand.logo} alt="" loading="lazy"/></span><span className="portfolio-project-number">{String(i+1).padStart(2,'0')} / {meta.label}</span><ArrowUpRight className="portfolio-project-open" size={17}/></div>
            <div className="portfolio-project-status"><i/>{p.status}</div>
            <h3>{p.name}</h3>
            <b className="portfolio-project-label">{p.label}</b>
            <p>{p.summary}</p>
            <div className="portfolio-project-stack">{p.stack.slice(0,4).map(x=><span key={x}>{x}</span>)}</div>
            <div className="portfolio-project-bottom"><span>{p.repository?'REPOSITORY LINKED':'PROJECT PROFILE'}</span><strong>التفاصيل <ArrowUpLeft size={15}/></strong></div>
          </Link>;
        })}
      </div>
      {visible.length===0&&<div className="portfolio-archive-empty">لا توجد مشاريع ضمن هذا التصنيف حاليًا.</div>}
      <p className="portfolio-archive-disclaimer">تختلف مستويات التوثيق والتطوير من مشروع لآخر. وتُعرض المشاريع التعاونية بوصفها أعمالًا مشتركة، مع توضيح المساهمة الفردية وفق المعلومات المتاحة.</p>
    </section>

    <section className="portfolio-archive-closing">
      <span>BUILDING SYSTEMS. ENGINEERING WITH PURPOSE.</span>
      <p>كل مشروع خطوة في مسار هندسي يتطور بالتصميم والتجربة والتحسين.</p>
    </section>


  </main>;
}
