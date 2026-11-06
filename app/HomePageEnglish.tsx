import Link from 'next/link';
import Image from 'next/image';
import {ArrowUpLeft,ArrowUpRight,ShieldCheck,GraduationCap,Layers3, Github,Linkedin,Award} from 'lucide-react';
import {projects} from '../data/projects';

const projectCopy:Record<string,{label:string;summary:string}>={
 'aegis-titan':{label:'Cybersecurity Defense Engineering',summary:'A personal cybersecurity defense system developed around security monitoring, analysis, detection workflows, controlled response, deception concepts, and digital forensics. Internal engineering details are available on request.'},
 'cryptolab-pro':{label:'Educational Cryptography & Analysis Platform',summary:'A responsive cryptography learning lab featuring classical ciphers, AES-256-GCM text and binary-file encryption, SHA-256 hashing, and HMAC-SHA-256 integrity verification.'},
 'academic-os':{label:'Cross-platform Academic Assistant',summary:'A personal student-focused application designed around an offline-first approach, clean architecture, and local data storage.'}
};
const disciplines=[
 {number:'01',title:'Security Research',text:'Reviewing application security, studying vulnerabilities, analyzing behavior, and documenting technical findings that can be independently verified.'},
 {number:'02',title:'Defensive Security & Networks',text:'Monitoring and analysis concepts, incident response, network security, and digital forensics.'},
 {number:'03',title:'Software Engineering',text:'Building practical applications and technical tools, designing solutions, and turning ideas into maintainable software.'}
];
const skillGroups=[
 {title:'Cybersecurity',detail:'Defensive Security · Security Research · DFIR · Network Security'},
 {title:'Development',detail:'Python · C# · Dart / Flutter · JavaScript · SQL'},
 {title:'Systems & Tools',detail:'Linux · Kali Linux · Wireshark · Cisco · Git & GitHub'}
];
export default function HomePageEnglish(){
 const featured=projects.filter(project=>project.featured).slice(0,3);
 return <main className="home-v2" dir="ltr">
  <section className="hv-hero" aria-labelledby="home-title">
   <div className="hv-hero-grid" aria-hidden="true"/>
   <div className="hv-hero-copy">
    <div className="hv-overline"><span className="hv-live-dot"/> INDEPENDENT TECHNOLOGY PORTFOLIO <span className="hv-overline-line"/></div>
    <p className="hv-role">FULL-STACK DEVELOPMENT <i>×</i> SOFTWARE ENGINEERING</p>
    <h1 id="home-title">Mohammed Ghaleb <span>Alaosimi</span></h1>
    <a className="hv-hero-orcid" href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer"><span className="hv-orcid-mark">iD</span><span>ORCID researcher identifier</span><strong>0009-0000-6007-3170</strong><ArrowUpRight size={14}/></a>
    <h2>Building Systems.<br/><em>Engineering with Purpose.</em></h2>
    <p className="hv-intro">Information Technology bachelor’s student at Al-Manar University College, Yemen, and Full-Stack Developer. I build web applications and enterprise-oriented systems, with interests in software architecture, databases, applied AI, user experience, and cybersecurity.</p>
    <div className="hv-actions">
     <Link href="/projects" className="hv-button hv-button-primary">Explore Projects <ArrowUpRight size={17}/></Link>
     <Link href="/about" className="hv-button hv-button-ghost">About My Journey <ArrowUpRight size={16}/></Link>
    </div>
    <div className="hv-hero-meta"><span>YEMEN</span><b/><span>INFORMATION TECHNOLOGY</span><b/><span>SOFTWARE ENGINEERING</span></div>
   </div>
   <div className="hv-hero-visual hv-portrait-visual" aria-label="Portrait of Mohammed Ghaleb Alaosimi">
    <div className="hv-portrait-grid" aria-hidden="true"/>
    <Image src="/images/mghal-avatar.webp" alt="Mohammed Ghaleb Alaosimi" fill priority sizes="(max-width: 640px) 90vw, 42vw" className="hv-portrait-image"/>
    <div className="hv-portrait-shade"/>
    <div className="hv-visual-top"><span>M.GH.AL / 01</span><span>ENGINEERING PROFILE</span></div>
    <div className="hv-portrait-stamp"><ShieldCheck size={18}/><span>RESEARCH<br/>BUILD<br/>DEFEND</span></div>
    <div className="hv-visual-foot"><span>M.GH.AL</span><span>YEMEN · 2026</span></div>
   </div>
   <div className="hv-scroll-cue"><span/> SCROLL TO EXPLORE</div>
  </section>
  <section className="hv-disciplines" aria-labelledby="disciplines-title">
   <div className="hv-section-top"><span>01 / AREAS OF FOCUS</span><span>CORE DISCIPLINES</span></div>
   <div className="hv-section-intro"><div><p className="hv-kicker">WHAT I WORK ON</p><h2 id="disciplines-title">Three disciplines.<br/><em>One engineering mindset.</em></h2></div><p>I bring together systems thinking, security-focused analysis, and software development to build considered technical solutions.</p></div>
   <div className="hv-discipline-grid">{disciplines.map(item=><article className="hv-discipline-card" key={item.number}><div className="hv-card-head"><ShieldCheck size={23} strokeWidth={1.5}/><span>{item.number}</span></div><h3>{item.title}</h3><p>{item.text}</p><div className="hv-card-rule"/></article>)}</div>
  </section>
  <section className="hv-work" id="featured" aria-labelledby="work-title">
   <div className="hv-section-top"><span>02 / SELECTED WORK</span><span>ENGINEERING ARCHIVE</span></div>
   <div className="hv-section-intro"><div><p className="hv-kicker">BUILT WITH INTENT</p><h2 id="work-title">From concept<br/><em>to implementation.</em></h2></div><div className="hv-work-aside"><p>A selection of personal and academic projects. Each project has a defined scope, role, and supporting documentation.</p><Link href="/projects">Browse all projects <ArrowUpRight size={16}/></Link></div></div>
   <div className="hv-project-grid">{featured.map((project,index)=><Link href={'/en/projects/'+project.slug} className={'hv-project-card hv-project-'+(index+1)} key={project.slug}>
    <div className="hv-project-top"><span>0{index+1} / FEATURED</span><ArrowUpRight size={18}/></div>
    <div className="hv-project-art">{project.slug==='aegis-titan'?<Image src="/images/aegis/defensive-command-environment.svg" alt="Defensive command environment concept" fill sizes="(max-width: 640px) 90vw, 30vw"/>:project.slug==='cryptolab-pro'?<div className="hv-art-code"><span>CRYPTO LAB / 01</span><b>AES<span>256</span></b><small>ENCRYPT · HASH · VERIFY</small></div>:<div className="hv-art-academic"><Layers3 size={48}/><span>ACADEMIC OS</span><small>OFFLINE · ORGANIZED · PRIVATE</small></div>}</div>
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
   <div><p className="hv-kicker">LEARNING / VALIDATION</p><h2>Continuous learning,<em> documented progress.</em></h2><p>Academic study in cybersecurity and networks, supported by technical credentials and verified learning.</p></div>
   <Link href="/credentials" className="hv-button hv-button-ghost">Credentials & Education <ArrowUpRight size={16}/></Link>
  </section>
  <section className="hv-contact">
   <div className="hv-contact-orbit" aria-hidden="true"/>
   <div className="hv-contact-content"><p className="hv-kicker">04 / CONNECT & COLLABORATE</p><h2>Let’s build something<br/><em>worth securing.</em></h2><p>For professional connections, technical project discussions, security research, and collaboration opportunities.</p><Link href="/contact" className="hv-button hv-button-primary">Get in Touch <ArrowUpRight size={17}/></Link></div>
   <div className="hv-social-links"><a href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer"><span className="hv-orcid-mark">iD</span><span>ORCID</span><small>0009-0000-6007-3170</small><ArrowUpRight size={14}/></a><a href="https://github.com/mghalaosimi-web" target="_blank" rel="noopener noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={14}/></a><a href="https://www.linkedin.com/in/mghalaosimi-web-399676409" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/> LinkedIn <ArrowUpRight size={14}/></a><a href="https://www.credly.com/users/mghalaosimi-web" target="_blank" rel="noopener noreferrer"><GraduationCap size={18}/> Credly <ArrowUpRight size={14}/></a></div>
   <div className="hv-contact-index">AK<span> / 2026</span></div>
  </section>
 </main>;
}
