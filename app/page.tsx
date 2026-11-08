import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {cookies} from 'next/headers';
import {
  ArrowUpLeft,
  ArrowUpRight,
  Award,
  BrainCircuit,
  Code2,
  Github,
  GraduationCap,
  Layers3,
  Linkedin,
  Mail,
  MapPin,
} from 'lucide-react';
import HomePageEnglish from './HomePageEnglish';
import './home.css';
import {projects} from '../data/projects';
import {localizedAlternates} from '../lib/seo';

export async function generateMetadata():Promise<Metadata>{
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  return en
    ? {
        title:'M.GH.AL | Full-Stack Developer & Software Engineer',
        description:'The professional digital identity of Mohammed Ghaleb Alaosimi — Full-Stack Developer, Software Engineer and Information Technology student.',
        alternates:localizedAlternates('/','en'),
      }
    : {
        title:'محمد غالب العصيمي | M.GH.AL',
        description:'الهوية الرقمية المهنية لمحمد غالب العصيمي — مطور Full-Stack ومهندس برمجيات وطالب تقنية معلومات في كلية المنار باليمن.',
        alternates:localizedAlternates('/','ar'),
      };
}

const disciplines=[
  {
    icon:Code2,
    number:'01',
    title:'هندسة البرمجيات',
    text:'تصميم تطبيقات واضحة البنية، قابلة للاختبار والصيانة والتوسع، من واجهات الاستخدام إلى الخدمات وقواعد البيانات.',
  },
  {
    icon:Layers3,
    number:'02',
    title:'الأنظمة المؤسسية',
    text:'بناء حلول ERP وإدارة البيانات والصلاحيات وسير العمل، وربط الوحدات والعمليات ضمن منظومات متكاملة.',
  },
  {
    icon:BrainCircuit,
    number:'03',
    title:'الذكاء الاصطناعي وتجربة المستخدم',
    text:'تطوير تطبيقات معرفية وتجارب عربية ثنائية اللغة، مع اهتمام بالذكاء الاصطناعي التطبيقي وواجهات RTL.',
  },
];

const skillGroups=[
  {
    title:'Software Engineering',
    detail:'Architecture · Full-Stack · API Design · Testing · TypeScript',
  },
  {
    title:'Web & Application Development',
    detail:'JavaScript · React · Next.js · Node.js · Flutter · Python · C#',
  },
  {
    title:'Data & Cloud Systems',
    detail:'PostgreSQL · SQLite · Prisma · Firebase · Supabase · Docker · Vercel · Render',
  },
];

function ProjectArtwork({slug,name,stack}:{slug:string;name:string;stack:string[]}){
  if(slug==='waynah'){
    return <div className="hv-art-academic">
      <MapPin size={48}/>
      <span>WAYNAH / YEMEN</span>
      <small>LOCAL DISCOVERY · OFFLINE-FIRST</small>
    </div>;
  }
  if(slug==='humanity-system'){
    return <div className="hv-art-code">
      <span>ENTERPRISE SYSTEM / 02</span>
      <b>RBAC</b>
      <small>DATA · WORKFLOW · ACCESS</small>
    </div>;
  }
  return <div className="hv-art-academic">
    <Layers3 size={48}/>
    <span>{name}</span>
    <small>{stack.slice(0,3).join(' · ')}</small>
  </div>;
}

function HomeArabic(){
  const featured=projects.filter(project=>project.featured).slice(0,3);
  return (
    <main id="main" className="home-v2">
      <section className="hv-hero" aria-labelledby="home-title">
        <div className="hv-hero-grid" aria-hidden="true"/>
        <div className="hv-hero-copy">
          <div className="hv-overline">
            <span className="hv-live-dot"/>
            OFFICIAL DIGITAL IDENTITY
            <span className="hv-overline-line"/>
          </div>
          <p className="hv-role">FULL-STACK DEVELOPMENT <i>×</i> SOFTWARE ENGINEERING</p>
          <h1 id="home-title">محمد غالب <span>العصيمي</span></h1>
          <a className="hv-hero-orcid" href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer">
            <span className="hv-orcid-mark">iD</span>
            <span>المعرّف الأكاديمي الدولي للباحث</span>
            <strong>0009-0000-6007-3170</strong>
            <ArrowUpRight size={14}/>
          </a>
          <h2>Building Systems.<br/><em>Engineering with Purpose.</em></h2>
          <p className="hv-intro">
            مطور برمجيات شامل وطالب بكالوريوس تقنية معلومات في كلية المنار للعلوم والتكنولوجيا باليمن. أعمل على بناء تطبيقات ويب وأنظمة مؤسسية ومنتجات رقمية، مع اهتمام بهندسة البرمجيات والذكاء الاصطناعي وقواعد البيانات وتجربة المستخدم.
          </p>
          <div className="hv-actions">
            <Link href="/projects" className="hv-button hv-button-primary">استكشف المشاريع <ArrowUpLeft size={17}/></Link>
            <Link href="/about" className="hv-button hv-button-ghost">اكتشف مساري <ArrowUpRight size={16}/></Link>
          </div>
          <div className="hv-hero-meta">
            <span>YEMEN</span><b/>
            <span>INFORMATION TECHNOLOGY</span><b/>
            <span>SOFTWARE ENGINEERING</span>
          </div>
        </div>

        <div className="hv-hero-visual hv-portrait-visual" aria-label="الصورة الشخصية لمحمد غالب العصيمي">
          <div className="hv-portrait-grid" aria-hidden="true"/>
          <Image
            src="/assets/images/mghal-avatar.webp"
            alt="محمد غالب العصيمي — M.GH.AL"
            fill
            priority
            sizes="(max-width: 640px) 90vw, 42vw"
            className="hv-portrait-image"
          />
          <div className="hv-portrait-shade"/>
          <div className="hv-visual-top"><span>M.GH.AL / 01</span><span>ENGINEERING PROFILE</span></div>
          <div className="hv-portrait-stamp"><Code2 size={18}/><span>DESIGN<br/>BUILD<br/>DELIVER</span></div>
          <div className="hv-visual-foot"><span>MOHAMMED GHALEB ALAOSIMI</span><span>YEMEN · 2026</span></div>
        </div>
        <div className="hv-scroll-cue"><span/> SCROLL TO EXPLORE</div>
      </section>

      <section className="hv-disciplines" aria-labelledby="disciplines-title">
        <div className="hv-section-top"><span>01 / PROFESSIONAL FOCUS</span><span>CORE DISCIPLINES</span></div>
        <div className="hv-section-intro">
          <div>
            <p className="hv-kicker">WHAT I BUILD</p>
            <h2 id="disciplines-title">ثلاثة مسارات،<br/><em>رؤية هندسية واحدة.</em></h2>
          </div>
          <p>أجمع بين هندسة البرمجيات والأنظمة المؤسسية وتجربة المستخدم لبناء حلول تقنية عملية، واضحة البنية، وقابلة للتطوير.</p>
        </div>
        <div className="hv-discipline-grid">
          {disciplines.map(item=>{
            const Icon=item.icon;
            return <article className="hv-discipline-card" key={item.number}>
              <div className="hv-card-head"><Icon size={23} strokeWidth={1.5}/><span>{item.number}</span></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <div className="hv-card-rule"/>
            </article>;
          })}
        </div>
      </section>

      <section className="hv-work" id="featured" aria-labelledby="work-title">
        <div className="hv-section-top"><span>02 / SELECTED WORK</span><span>M.GH.AL PROJECT ARCHIVE</span></div>
        <div className="hv-section-intro">
          <div>
            <p className="hv-kicker">BUILT WITH INTENT</p>
            <h2 id="work-title">من الفكرة<br/><em>إلى التنفيذ.</em></h2>
          </div>
          <div className="hv-work-aside">
            <p>نماذج مختارة من المشاريع الشخصية والأكاديمية والتعاونية. لكل مشروع نطاقه ودوره وحالته الحالية، دون الإيحاء بأن جميعها منشورة أو مكتملة.</p>
            <Link href="/projects">عرض جميع المشاريع <ArrowUpLeft size={16}/></Link>
          </div>
        </div>
        <div className="hv-project-grid">
          {featured.map((project,index)=>(
            <Link href={'/projects/'+project.slug} className={'hv-project-card home-project-card hv-project-'+(index+1)} data-project-slug={project.slug} key={project.slug}>
              <div className="hv-project-top"><span>0{index+1} / FEATURED</span><ArrowUpLeft size={18}/></div>
              <div className="hv-project-art">
                <ProjectArtwork slug={project.slug} name={project.name} stack={project.stack}/>
              </div>
              <div className="hv-project-copy">
                <span className="hv-project-label">{project.label}</span>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
              </div>
              <div className="hv-project-bottom">
                <span>{project.stack.slice(0,3).join(' / ')}</span>
                <b>EXPLORE <ArrowUpLeft size={14}/></b>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="hv-capabilities" aria-labelledby="capabilities-title">
        <div className="hv-section-top"><span>03 / TECHNICAL CAPABILITIES</span><span>TOOLS & METHODS</span></div>
        <div className="hv-cap-layout">
          <div>
            <p className="hv-kicker">TECHNICAL FOUNDATION</p>
            <h2 id="capabilities-title">معرفة تقنية<br/><em>تتحول إلى ممارسة.</em></h2>
            <p className="hv-cap-intro">مجالات وتقنيات أعمل على توظيفها في المشاريع والتطبيق العملي، مع تطوير مستمر للمهارات.</p>
            <Link href="/skills" className="hv-text-link">استعراض المهارات والتقنيات <ArrowUpLeft size={16}/></Link>
          </div>
          <div className="hv-skill-list">
            {skillGroups.map((group,index)=>(
              <div className="hv-skill-row" key={group.title}>
                <span>0{index+1}</span>
                <div><h3>{group.title}</h3><p>{group.detail}</p></div>
                <ArrowUpLeft size={17}/>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="hv-credentials" aria-labelledby="credentials-title">
        <div className="hv-credential-icon"><Award size={29}/></div>
        <div>
          <p className="hv-kicker">LEARNING / VALIDATION</p>
          <h2 id="credentials-title">التعلّم المستمر، <em>والتوثيق المهني.</em></h2>
          <p>السجل الأكاديمي والشهادات التقنية والاعتمادات المهنية، مع روابط التحقق المتاحة.</p>
        </div>
        <Link href="/credentials" className="hv-button hv-button-ghost">الشهادات والمؤهلات <ArrowUpLeft size={16}/></Link>
      </section>

      <section className="hv-contact" aria-labelledby="contact-title">
        <div className="hv-contact-orbit" aria-hidden="true"/>
        <div className="hv-contact-content">
          <p className="hv-kicker">04 / CONNECT & COLLABORATE</p>
          <h2 id="contact-title">لنبنِ شيئًا<br/><em>يستحق أن يُبنى.</em></h2>
          <p>للتواصل المهني، ومناقشة هندسة البرمجيات والأنظمة المؤسسية والذكاء الاصطناعي وفرص التعاون التقني.</p>
          <Link href="/contact" className="hv-button hv-button-primary">ابدأ التواصل <ArrowUpLeft size={17}/></Link>
        </div>
        <div className="hv-social-links">
          <a href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer">
            <span className="hv-orcid-mark">iD</span><span>ORCID</span><small>0009-0000-6007-3170</small><ArrowUpRight size={14}/>
          </a>
          <a href="https://github.com/mghalaosimi-web" target="_blank" rel="noopener noreferrer"><Github size={18}/> GitHub <ArrowUpRight size={14}/></a>
          <a href="https://www.linkedin.com/in/mohammed-alaosimi-038155443/" target="_blank" rel="noopener noreferrer"><Linkedin size={18}/> LinkedIn <ArrowUpRight size={14}/></a>
          <a href="https://www.credly.com/users/mohammed-ghaleb-al-aosimi" target="_blank" rel="noopener noreferrer"><GraduationCap size={18}/> Credly <ArrowUpRight size={14}/></a>
          <a href="mailto:m.gh.alaosimi@gmail.com"><Mail size={18}/> Email <ArrowUpRight size={14}/></a>
        </div>
        <div className="hv-contact-index">M.GH.AL<span> / 2026</span></div>
      </section>
    </main>
  );
}

export default async function Home(){
  const locale=(await cookies()).get('portfolio-locale')?.value;
  return locale==='en' ? <HomePageEnglish/> : <HomeArabic/>;
}
