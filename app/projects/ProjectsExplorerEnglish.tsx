'use client';
import {useMemo,useState} from 'react';
import Link from 'next/link';
import {projects} from '../../data/projects';
import type {Project,ProjectCategory} from '../../data/projects';
import {ArrowUpRight,FolderGit2,GraduationCap,Layers3,ShieldCheck,Sparkles,MapPin,Database,WifiOff} from 'lucide-react';
import './projects.css';
const filters:{id:'all'|ProjectCategory;label:string}[]=[
 {id:'all',label:'All projects'},{id:'web',label:'Web platforms'},
 {id:'enterprise',label:'Enterprise systems'},{id:'ai',label:'Artificial intelligence'},
 {id:'cybersecurity',label:'Cybersecurity'},{id:'academic',label:'Academic projects'},
 {id:'mobile',label:'Mobile apps'},{id:'desktop',label:'Desktop apps'}
];
const categoryMeta={
 web:{label:'WEB PLATFORMS',name:'Web platforms'},
 enterprise:{label:'ENTERPRISE SYSTEMS',name:'Enterprise systems'},
 ai:{label:'ARTIFICIAL INTELLIGENCE',name:'Artificial intelligence'},
 cybersecurity:{label:'CYBERSECURITY',name:'Cybersecurity & cryptography'},
 academic:{label:'ACADEMIC SYSTEMS',name:'Academic projects'},
 mobile:{label:'MOBILE APPLICATIONS',name:'Mobile applications'},
 desktop:{label:'DESKTOP SOFTWARE',name:'Desktop software'}
};
export default function ProjectsExplorerEnglish(){
 const [filter,setFilter]=useState<typeof filters[number]['id']>('all');
 const featured=projects.find(p=>p.slug==='waynah');
 const archive=projects.filter(p=>p.slug!=='waynah');
 const visible=useMemo(()=>archive.filter(p=>filter==='all'||p.category===filter),[filter]);
 const featuredVisible=!!featured&&(filter==='all'||featured.category===filter);
 
 const repoCount=projects.filter(p=>p.repository).length,collabCount=projects.filter(p=>p.collaborative).length;
 const info=(p:Project)=>({name:p.nameEn,label:p.labelEn,summary:p.summaryEn,status:p.statusEn,contribution:p.contributionEn});
 const featuredInfo=featured?info(featured):null;
 return <main className="content-page projects-page portfolio-archive" dir="ltr">
  <section className="portfolio-archive-hero"><div className="portfolio-archive-hero-copy"><span className="portfolio-archive-eyebrow"><span/> ENGINEERING PORTFOLIO <i/> PROJECT ARCHIVE</span><h1>Engineering ideas.<br/><em>Building systems.</em></h1><p>A collection of practical work across software engineering, enterprise systems, applied AI, and documented technical experiments—from architecture and implementation to verification.</p><a className="portfolio-archive-explore" href="#project-collection">Explore projects <ArrowUpRight size={16}/></a></div><div className="portfolio-archive-hero-mark" aria-hidden="true"><div className="portfolio-archive-mark-orbit orbit-a"/><div className="portfolio-archive-mark-orbit orbit-b"/><div className="portfolio-archive-mark-core"><Layers3 size={42}/><b>BUILD</b><small>ENGINEERED SYSTEMS</small></div><span className="portfolio-archive-mark-code">PA / 01</span></div><div className="portfolio-archive-hero-foot"><span>DESIGN / ENGINEERING / SYSTEMS</span><span>BUILDING SYSTEMS. ENGINEERING WITH PURPOSE.</span></div></section>
  <section className="portfolio-archive-metrics" aria-label="Project summary"><div><span className="portfolio-archive-metric-icon"><FolderGit2 size={18}/></span><strong>{projects.length.toString().padStart(2,'0')}</strong><small>Projects in archive</small></div><div><span className="portfolio-archive-metric-icon"><Code2 size={18}/></span><strong>{repoCount.toString().padStart(2,'0')}</strong><small>Linked repositories</small></div><div><span className="portfolio-archive-metric-icon"><GraduationCap size={18}/></span><strong>{collabCount.toString().padStart(2,'0')}</strong><small>Collaborative projects</small></div><div><span className="portfolio-archive-metric-icon"><ShieldCheck size={18}/></span><strong>03</strong><small>Core work areas</small></div></section>
  {featuredVisible&&featured&&featuredInfo&&<section className="portfolio-featured-project">
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
    <div className="portfolio-featured-status"><i/>{featuredInfo.status}</div>
    <h2>{featured.nameEn}</h2>
    <h3>{featuredInfo.label}</h3>
    <p>{featuredInfo.summary}</p>
    <div className="portfolio-featured-tags">{featured.stack.slice(0,4).map(item=><span key={item}>{item}</span>)}</div>
    <div className="portfolio-featured-footer">
     <span>PROJECT CONTRIBUTION<br/><b>M.GH.AL / TEAM CONTRIBUTOR</b></span>
     <Link href="/en/projects/waynah" className="portfolio-archive-explore">Explore project <ArrowUpRight size={17}/></Link>
    </div>
   </div>
  </section>}
  {featuredVisible&&featured&&<section className="portfolio-waynah-gallery" aria-labelledby="waynah-gallery-title">
   <div className="portfolio-waynah-gallery-heading">
    <div><span>WAYNAH / SYSTEM OVERVIEW</span><h2 id="waynah-gallery-title">A look at the engineering concept</h2><p>A high-level view of the product’s focus: spatial data, resilient access under limited connectivity, and trusted local discovery.</p></div>
    <span className="portfolio-waynah-gallery-index">SYSTEM NOTES / 03</span>
   </div>
   <div className="portfolio-waynah-gallery-grid">
    <article className="portfolio-waynah-visual-card"><div className="portfolio-waynah-visual-frame"><div className="waynah-visual-art"><MapPin/><b>GEOGRAPHIC DATA</b><small>WGS84 · POSTGIS</small></div></div><div><span>01 / SPATIAL FOUNDATION</span><h3>Spatial foundation</h3><p>Representing places and geographic data through a spatial database.</p></div></article>
    <article className="portfolio-waynah-visual-card"><div className="portfolio-waynah-visual-frame"><div className="waynah-visual-art"><WifiOff/><b>OFFLINE-FIRST</b><small>LOW CONNECTIVITY</small></div></div><div><span>02 / RESILIENT EXPERIENCE</span><h3>Resilient user experience</h3><p>Designing access flows that account for weak or intermittent connectivity.</p></div></article>
    <article className="portfolio-waynah-visual-card"><div className="portfolio-waynah-visual-frame"><div className="waynah-visual-art"><Database/><b>TRUSTED DIRECTORY</b><small>LOCAL DISCOVERY</small></div></div><div><span>03 / LOCAL INFORMATION</span><h3>Trusted local directory</h3><p>Organizing place and service information according to documented evidence.</p></div></article>
   </div>
   <Link href="/en/projects/waynah" className="portfolio-waynah-gallery-link">Explore the WAYNAH project profile <ArrowUpRight size={16}/></Link>
  </section>}
  <section className="portfolio-archive-collection" id="project-collection"><div className="portfolio-archive-section-heading"><div><span>THE WORK / SELECTED PROJECTS</span><h2>Projects & engineering work</h2><p>Browse by domain, with each project’s nature, current status, and available references clearly identified.</p></div><div className="portfolio-archive-count"><strong>{(visible.length+(featuredVisible?1:0)).toString().padStart(2,'0')}</strong><small>PROJECTS</small></div></div>
  <div className="portfolio-archive-filters" role="group" aria-label="Filter projects">{filters.map(f=><button key={f.id} onClick={()=>setFilter(f.id)} className={filter===f.id?'selected':''} aria-pressed={filter===f.id}>{f.label}<span>{f.id==='all'?projects.length:archive.filter(p=>p.category===f.id).length+(featured&&featured.category===f.id?1:0)}</span></button>)}</div>
  <div className="portfolio-archive-grid">{visible.map((p,i)=>{const meta=categoryMeta[p.category],details=info(p);return <Link href={'/en/projects/'+p.slug} className="portfolio-project-card" key={p.slug} aria-label={'View details for '+p.nameEn} style={{'--project-primary':p.brand.primary} as React.CSSProperties}><div className="portfolio-project-card-top"><span className="portfolio-project-icon"><img src={p.brand.logo} alt="" loading="lazy"/></span><span className="portfolio-project-number">{String(i+1).padStart(2,'0')} / {meta.label}</span><ArrowUpRight className="portfolio-project-open" size={17}/></div><div className="portfolio-project-status"><i/>{details.status}</div><h3>{details.name||p.name}</h3><b className="portfolio-project-label">{details.label}</b><p>{details.summary}</p><div className="portfolio-project-stack">{p.stack.slice(0,4).map(x=><span key={x}>{x}</span>)}</div><div className="portfolio-project-bottom"><span>{p.repository?'REPOSITORY LINKED':'PROJECT PROFILE'}</span><strong>Details <ArrowUpRight size={15}/></strong></div></Link>})}</div>
  {visible.length===0&&<div className="portfolio-archive-empty">No projects currently match this category.</div>}<p className="portfolio-archive-disclaimer">Documentation and development maturity vary by project. Collaborative work is presented as shared work, with individual contributions described only where supported by available information.</p></section>
  <section className="portfolio-archive-closing"><span>BUILDING SYSTEMS. ENGINEERING WITH PURPOSE.</span><p>Each project is a step in an engineering process shaped by design, experimentation, and improvement.</p></section>

 </main>;
}
