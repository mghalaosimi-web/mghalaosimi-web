import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpRight,Code2,GraduationCap,Layers3,Github,Linkedin,Award} from 'lucide-react';
import {projects} from '../data/projects';

const projectCopy:Record<string,{label:string;summary:string}>={
'waynah':{label:'Local Geographic Discovery',summary:'A Yemen-focused platform for trusted local geographic information and discovery.'},
'mghal-content-os':{label:'Content Operations',summary:'A system for content planning, review, and supported publishing workflows.'},
'humanity-system':{label:'Enterprise Systems',summary:'An Arabic-first institutional system for managing records, workflows, and role-based access.'},
'manar-schedule-system':{label:'Academic Systems',summary:'A collaborative application for academic scheduling workflows.'}
};
const disciplines=[
 {number:'01',title:'Software Engineering',text:'Designing and building maintainable applications with clear architecture, reliable APIs, and attention to code quality.'},
 {number:'02',title:'Enterprise Systems',text:'Connecting interfaces, services, databases, and role-based permissions into practical administrative and business workflows.'},
 {number:'03',title:'User Experience & RTL',text:'Creating clear, responsive Arabic and English interfaces with consistent interaction patterns and accessibility in mind.'}
];
const skillGroups=[
 {title:'Software Engineering',detail:'Architecture · Full-Stack · API Design · Testing'},
 {title:'Web Development',detail:'JavaScript · TypeScript · React · Next.js · Node.js'},
 {title:'Data & Systems',detail:'PostgreSQL · SQLite · Prisma · Firebase · Supabase · Docker'}
];
export default function HomePageEnglish(){
 const featured=projects.filter(project=>project.featured).slice(0,3);
 return <main id="main" className="home-v2" dir="ltr">
  <section className="hv-hero" aria-labelledby="home-title">
   <div className="hv-hero-grid" aria-hidden="true"/>
   <div className="hv-hero-copy">
    <div className="hv-overline"><span className="hv-live-dot"/> INDEPENDENT TECHNOLOGY PORTFOLIO <span className="hv-overline-line"/></div>
    <p className="hv-role">FULL-STACK DEVELOPMENT <i>×</i> SOFTWARE ENGINEERING</p>
    <h1 id="home-title">Mohammed Ghaleb <span>Alaosimi</span></h1>
    <a className="hv-hero-orcid" href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer"><span className="hv-orcid-mark">iD</span><span>ORCID researcher identifier</span><strong>0009-0000-6007-3170</strong><ArrowUpRight size={14}/></a>
    <h2>Building Systems.<br/><em>Engineering with Purpose.</em></h2>
    <p className="hv-intro">Information Technology bachelor’s student at Al-Manar College for Science and Technology, Yemen, and Full-Stack Developer. I build web applications and enterprise-oriented systems, with interests in software architecture, databases, applied AI, user experience, and cybersecurity.</p>
    <div className="hv-actions">
     <Link href="/projects" className="hv-button hv-button-primary">Explore Projects <ArrowUpRight size={17}/></Link>
     <Link href="/about" className="hv-button hv-button-ghost">About My Journey <ArrowUpRight size={16}/></Link>
    </div>
    <div className="hv-hero-meta"><span>YEMEN</span><b/><span>INFORMATION TECHNOLOGY</span><b/><span>SOFTWARE ENGINEERING</span></div>
   </div>
   <div className="hv-hero-visual hv-portrait-visual" aria-label="Portrait of Mohammed Ghaleb Alaosimi">
    <div className="hv-portrait-grid" aria-hidden="true"/>
    <Image src="/assets/images/mghal-avatar.webp" alt="Mohammed Ghaleb Alaosimi" fill priority sizes="(max-width: 640px) 90vw, 42vw" className="hv-portrait-image"/>
    <div className="hv-portrait-shade"/>
    <div className="hv-visual-top"><span>M.GH.AL / 01</span><span>ENGINEERING PROFILE</span></div>
    <div className="hv-portrait-stamp"><Code2 size={18}/><span>DESIGN<br/>BUILD<br/>DELIVER</span></div>
    <div className="hv-visual-foot"><span>M.GH.AL</span><span>YEMEN · 2026</span></div>
   </div>
   <div className="hv-scroll-cue"><span/> SCROLL TO EXPLORE</div>
  </section>
  <section className="hv-disciplines" aria-labelledby="disciplines-title">
   <div className="hv-section-top"><span>01 / AREAS OF FOCUS</span><span>CORE DISCIPLINES</span></div>
   <div className="hv-section-intro"><div><p className="hv-kicker">WHAT I WORK ON</p><h2 id="disciplines-title">Three disciplines.<br/><em>One engineering mindset.</em></h2></div><p>I bring together software engineering, enterprise systems, and user experience to build practical, maintainable technical solutions.</p></div>
   <div className="hv-discipline-grid">{disciplines.map(item=><article className="hv-discipline-card" key={item.number}><div className="hv-card-head"><Code2 size={23} strokeWidth={1.5}/><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.text}</p><div className="hv-card-rule"/></article>)}</div>
  </section>
  <section className="hv-work" id="featured" aria-labelledby="work-title">
   <div className="hv-section-top"><span>02 / SELECTED WORK</span><span>ENGINEERING ARCHIVE</span></div>
   <div className="hv-section-intro"><div><p className="hv-kicker">BUILT WITH INTENT</p><h2 id="work-title">From concept<br/><em>to implementation.</em></h2></div><div className="hv-work-aside"><p>A selection of personal and academic projects. Each project has a defined scope, role, and supporting documentation.</p><Link href="/projects">Browse all projects <ArrowUpRight size={16}/></Link></div></div>
   <div className="hv-project-grid">{featured.map((project,index)=><Link href={'/en/projects/'+project.slug} className={'hv-project-card hv-project-'+(index+1)} key={project.slug}>
    <div className="hv-project-top"><span>0{index+1} / FEATURED</span><ArrowUpRight size={18}/></div>
    <div className="hv-project-art"><div className="hv-art-academic"><Layers3 size={48}/><span>{project.name}</span><small>{project.stack.slice(0,3).join(' · ')}</small></div></div>
    <div className="hv-project-copy"><span className="hv-project-label">{projectCopy[project.slug]?.label||'Personal & Academic Project'}</span><h3>{project.name}</h3><p>{projectCopy[project.slug]?.summary||'A technical project documented with its current scope and available evidence.'}</p></div>
    <div className="hv-project-bottom"><span>{project.stack.slice(0,3).join(' / ')}</span><b>EXPLORE <ArrowUpRight size={14}/></b></div>
   </Link>)}</div>
  </section>
  <section className="hv-capabilities" aria-labelledby="capabilities-title">
   <div className="hv-section-top"><span>03 / TECHNICAL CAPABILITIES</span><span>TOOLS & METHODS</span></div>
   <div className="hv-cap-layout"><div><p className="hv-kicker">TECHNICAL FOUNDATION</p><h2 id="capabilities-title">Technical knowledge<br/><em>put into practice.</em></h2><p className="hv-cap-intro">Areas and tools I apply in projects and practical work, while continuously developing my skills.</p><Link href="/skills" className="hv-text-link">Explore skills & technologies <ArrowUpRight size={16}/></Link></div>
    <div className="hv-skill-list">{skillGroups.map((group,index)=><div className="hv-skill-row" key={group.title}><span>0{index+1}</span><div><h3>{group.title}</h3><p>{group.detail}</p></div><ArrowUpRight size={17}/></div>)}</div>
   </div>
  </section>
  <section className="hv-credentials">
   <div className="hv-credential-icon"><Award size={29}/></div>
   <div><p className="hv-kicker">LEARNING / VALIDATION</p><h2>Continuous learning,<em> documented progress.</em></h2><p>Information Technology studies, supported by technical credentials and continuous learning.</p></div>
   <Link href="/credentials" className="hv-button hv-button-ghost">Credentials & Education <ArrowUpRight size={16}/></Link>
  </section>
  <section className="hv-contact">
   <div className="hv-contact-orbit" aria-hidden="true"/>
   <div className="hv-contact-content"><p className="hv-kicker">04 / CONNECT & COLLABORATE</p><h2>Let’s build something<br/><em>worth building.</em></h2><p>For professional connections, software engineering discussions, project collaboration, and technical opportunities.</p><Link href="/contact" className="hv-button hv-button-primary">Get in Touch <ArrowUpRight size={17}/></Link></div>
   <div className="hv-social-links"><a href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer"><span className="hv-orcid-mark">iD</span><span>ORCID</span><small>0009-0000-6007-3170</small><ArrowUpRight size={14}/></a><a href="https://github.com/mghalaosimi-web" target="_blank" rel="noopener noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/in/mohammed-alaosimi-038155443/" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/> LinkedIn <ArrowUpRight size={14}/></a><a href="https://www.credly.com/users/mohammed-ghaleb-al-aosimi" target="_blank" rel="noopener noreferrer"><GraduationCap size={18}/> Credly <ArrowUpRight size={14}/></a></div>
   <div className="hv-contact-index">M.GH.AL<span> / 2026</span></div>
  </section>
 </main>;
}
