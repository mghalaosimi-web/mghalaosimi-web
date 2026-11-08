'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {projects,Project,ProjectCategory} from '../../data/projects';
import {
  ArrowLeft,ArrowUpLeft,ArrowUpRight,Code2,FolderGit2,
  GraduationCap,Layers3,ShieldCheck,X,ExternalLink,Terminal,GitBranch,FileText,ArrowUpRight as ArrowRightIcon,Sparkles,MapPin,Database,WifiOff
} from 'lucide-react';
import './projects.css';

const filters:{id:'all'|ProjectCategory;label:string}[]=[
  {id:'all',label:'جميع المشاريع'},
  {id:'cyber-defense',label:'الأمن والتشفير'},
  {id:'software',label:'هندسة البرمجيات'},
  {id:'academic',label:'الأكاديمية والتعاونية'}
];

const categoryMeta={
  'cyber-defense':{label:'SECURITY & CRYPTOGRAPHY',name:'الأمن والتشفير',Icon:ShieldCheck},
  software:{label:'SOFTWARE ENGINEERING',name:'هندسة البرمجيات',Icon:Code2},
  academic:{label:'ACADEMIC / COLLABORATIVE',name:'أكاديمي وتعاوني',Icon:GraduationCap}
};

export default function ProjectsPage(){
  const [filter,setFilter]=useState<typeof filters[number]['id']>('all');
  const [selectedProject,setSelectedProject]=useState<Project|null>(null);
  useEffect(()=>{if(!selectedProject)return;const previous=document.body.style.overflow;document.body.style.overflow='hidden';const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape')setSelectedProject(null)};window.addEventListener('keydown',onKeyDown);return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',onKeyDown)}},[selectedProject]);
  
  const featured=projects.find(p=>p.slug==='waynah');
  const archive=projects.filter(p=>p.slug!=='waynah');
  const visible=useMemo(()=>archive.filter(p=>filter==='all'||p.category===filter),[filter]);
  const featuredVisible=!!featured&&(filter==='all'||featured.category===filter);
  
  const repositoryCount=projects.filter(p=>p.repository).length;
  const collaborativeCount=projects.filter(p=>p.slug==='waynah'||p.slug==='manar-schedule-system').length;

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
          <button type="button" onClick={()=>setSelectedProject(featured)}>استكشف المشروع <ArrowUpLeft size={17}/></button>
        </div>
      </div>
    </section>}

    {featuredVisible&&featured&&<section className="portfolio-aegis-gallery" aria-labelledby="waynah-gallery-title">
      <div className="portfolio-aegis-gallery-heading">
        <div><span>WAYNAH / SYSTEM OVERVIEW</span><h2 id="waynah-gallery-title">لمحة عن التصور الهندسي</h2><p>نظرة عالية المستوى على محاور المنتج: البيانات الجغرافية، تجربة الاستخدام في الاتصال المحدود، واستكشاف المعلومات المحلية الموثوقة.</p></div>
        <span className="portfolio-aegis-gallery-index">SYSTEM NOTES / 03</span>
      </div>
      <div className="portfolio-aegis-gallery-grid">
        <article className="portfolio-aegis-visual-card">
          <div className="portfolio-aegis-visual-frame"><div className="waynah-visual-art"><MapPin/><b>GEOGRAPHIC DATA</b><small>WGS84 · POSTGIS</small></div></div>
          <div><span>01 / SPATIAL FOUNDATION</span><h3>الأساس المكاني</h3><p>تمثيل المواقع والبيانات الجغرافية ضمن قاعدة بيانات مكانية.</p></div>
        </article>
        <article className="portfolio-aegis-visual-card">
          <div className="portfolio-aegis-visual-frame"><div className="waynah-visual-art"><WifiOff/><b>OFFLINE-FIRST</b><small>LOW CONNECTIVITY</small></div></div>
          <div><span>02 / RESILIENT EXPERIENCE</span><h3>تجربة تراعي الاتصال المحدود</h3><p>تصميم تدفقات استخدام تساعد على الوصول إلى المعلومات عند ضعف الشبكة.</p></div>
        </article>
        <article className="portfolio-aegis-visual-card">
          <div className="portfolio-aegis-visual-frame"><div className="waynah-visual-art"><Database/><b>TRUSTED DIRECTORY</b><small>LOCAL DISCOVERY</small></div></div>
          <div><span>03 / LOCAL INFORMATION</span><h3>دليل محلي موثوق</h3><p>تنظيم بيانات الأماكن والخدمات وإظهار المعلومات بحسب ما تم توثيقه.</p></div>
        </article>
      </div>
      <Link href="/projects/waynah" className="portfolio-aegis-gallery-link">استعراض ملف WAYNAH <ArrowUpLeft size={16}/></Link>
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
          const Icon=meta.Icon;
          return <button type="button" className="portfolio-project-card" onClick={()=>setSelectedProject(p)} key={p.slug} aria-haspopup="dialog" aria-label={'عرض تفاصيل '+p.name}>
            <div className="portfolio-project-card-top"><span className="portfolio-project-icon"><Icon size={19}/></span><span className="portfolio-project-number">{String(i+1).padStart(2,'0')} / {meta.label}</span><ArrowUpRight className="portfolio-project-open" size={17}/></div>
            <div className="portfolio-project-status"><i/>{p.status}</div>
            <h3>{p.name}</h3>
            <b className="portfolio-project-label">{p.label}</b>
            <p>{p.summary}</p>
            <div className="portfolio-project-stack">{p.stack.slice(0,4).map(x=><span key={x}>{x}</span>)}</div>
            <div className="portfolio-project-bottom"><span>{p.repository?'REPOSITORY LINKED':'PROJECT PROFILE'}</span><strong>التفاصيل <ArrowUpLeft size={15}/></strong></div>
          </button>;
        })}
      </div>
      {visible.length===0&&<div className="portfolio-archive-empty">لا توجد مشاريع ضمن هذا التصنيف حاليًا.</div>}
      <p className="portfolio-archive-disclaimer">تختلف مستويات التوثيق والتطوير من مشروع لآخر. وتُعرض المشاريع التعاونية بوصفها أعمالًا مشتركة، مع توضيح المساهمة الفردية وفق المعلومات المتاحة.</p>
    </section>

    <section className="portfolio-archive-closing">
      <span>BUILDING SYSTEMS. ENGINEERING WITH PURPOSE.</span>
      <p>كل مشروع خطوة في مسار هندسي يتطور بالتصميم والتجربة والتحسين.</p>
    </section>

    {selectedProject&&<div className="project-modal-backdrop" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)setSelectedProject(null)}}>
      <section className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title" dir="rtl">
        <header className="project-modal-header">
          <div className="project-modal-brand"><span className="project-modal-brand-icon"><Layers3 size={21}/></span><span><small>M.GH.AL / PROJECT PROFILE</small><b>ملف المشروع الهندسي</b></span></div>
          <button type="button" className="project-modal-close" onClick={()=>setSelectedProject(null)} aria-label="إغلاق النافذة"><X size={19}/></button>
        </header>
        <div className="project-modal-content">
          <div className="project-modal-hero">
            <div className="project-modal-symbol"><ShieldCheck size={37} strokeWidth={1.3}/><span>ENGINEERED<br/>PROJECT</span></div>
            <div className="project-modal-heading">
              <span className="project-modal-category">{categoryMeta[selectedProject.category].label}</span>
              <div className="project-modal-status"><i/>{selectedProject.status}</div>
              <h2 id="project-modal-title">{selectedProject.name}</h2>
              <h3>{selectedProject.label}</h3>
            </div>
          </div>
          <section className="project-modal-section">
            <div className="project-modal-section-title"><FileText size={16}/><h4>نبذة عن المشروع</h4><span>01 / OVERVIEW</span></div>
            <p className="project-modal-description">{selectedProject.summary}</p>
          </section>
          <div className="project-modal-detail-grid">
            <section className="project-modal-section project-modal-contribution">
              <div className="project-modal-section-title"><Terminal size={16}/><h4>المساهمة والدور الهندسي</h4><span>02 / ROLE</span></div>
              <p>{selectedProject.contribution}</p>
            </section>
            <section className="project-modal-section">
              <div className="project-modal-section-title"><Code2 size={16}/><h4>التقنيات والمكونات</h4><span>03 / STACK</span></div>
              <div className="project-modal-tech">{selectedProject.stack.map(item=><span key={item}>{item}</span>)}</div>
            </section>
          </div>
          <footer className="project-modal-footer">
            <span className="project-modal-reference"><GitBranch size={14}/> PROJECT REF / {selectedProject.slug.toUpperCase()}</span>
            <div className="project-modal-actions">
              {selectedProject.repository&&<a href={selectedProject.repository} target="_blank" rel="noreferrer"><FolderGit2 size={15}/> المستودع البرمجي <ExternalLink size={13}/></a>}
              <Link href={'/projects/'+selectedProject.slug}>صفحة المشروع <ArrowRightIcon size={15}/></Link>
              <button type="button" className="project-modal-done" onClick={()=>setSelectedProject(null)}>إغلاق الملف</button>
            </div>
          </footer>
        </div>
      </section>
    </div>}
  </main>;
}
