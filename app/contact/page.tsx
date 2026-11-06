import type {Metadata} from 'next';
import { cookies } from 'next/headers';
import ContactPageEnglish from './ContactPageEnglish';
import {localizedAlternates} from '../../lib/seo';
import {ArrowLeft,ArrowUpLeft,ArrowUpRight,BookOpen,Code2,ExternalLink,Github,GraduationCap,Linkedin,LockKeyhole,Mail,MessageCircle,MessageSquareText,Microscope,Send,ShieldCheck} from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import styles from './contact.module.css';

export async function generateMetadata(): Promise<Metadata> {
 const en = (await cookies()).get('portfolio-locale')?.value === 'en';
 return en
  ? { title:'Professional Contact | Mohammed Ghaleb Alaosimi', description:'Connect with Mohammed Ghaleb Alaosimi about cybersecurity engineering, security research, technical projects, and professional collaboration.', alternates:localizedAlternates('/contact','en') }
  : { title:'التواصل المهني | محمد غالب العصيمي', description:'تواصل مع محمد غالب العصيمي بشأن هندسة الأمن السيبراني والبحث الأمني والمشاريع التقنية والتعاون المهني.', alternates:localizedAlternates('/contact','ar') };
}

const channels=[
 {name:'LinkedIn',detail:'التواصل المهني والفرص',value:'Mohammed Ghaleb Alaosimi',href:'https://www.linkedin.com/in/mghalaosimi-web-399676409',icon:Linkedin,kind:'network'},
 {name:'GitHub',detail:'المشاريع والشيفرات البرمجية',value:'mghalaosimi-web',href:'https://github.com/mghalaosimi-web',icon:Github,kind:'code'},
 {name:'Email',detail:'للاستفسارات والرسائل المباشرة',value:'m.gh.alaosimi@gmail.com',href:'mailto:m.gh.alaosimi@gmail.com',icon:Mail,kind:'email'},
 {name:'ORCID',detail:'الهوية والسجل البحثي',value:'0009-0000-6007-3170',href:'https://orcid.org/0009-0000-6007-3170',icon:Microscope,kind:'research'},
 {name:'Credly',detail:'الشارات والاعتمادات المهنية',value:'عرض الشهادات الرقمية',href:'https://www.credly.com/users/mghalaosimi-web',icon:GraduationCap,kind:'credentials'},
 {name:'WhatsApp',detail:'تواصل مباشر عبر واتساب',value:'إرسال رسالة مباشرة',href:'https://wa.me/967772814959?text='+encodeURIComponent('مرحباً محمد غالب العصيمي، تواصلت معك عبر موقعك المهني.'),icon:MessageCircle,kind:'messaging'},
 {name:'Telegram',detail:'التواصل عبر تيليجرام',value:'@A_AB_ALK',href:'https://t.me/A_AB_ALK',icon:Send,kind:'messaging'}
];

function ContactPageArabic(){
 return <main className={styles.page}>
  <div className={styles.topline}><span>CONTACT / PROFESSIONAL NETWORK</span><span>M.GH.AL <i/></span></div>
  <section className={styles.hero}>
   <div className={styles.heroGrid} aria-hidden="true"/>
   <div className={styles.heroCopy}>
    <span className={styles.kicker}><span/> OPEN CHANNEL FOR PROFESSIONAL CONNECTION</span>
    <p className={styles.overline}>LET’S CONNECT</p>
    <h1>لنتواصل لبناء<br/><em>أثرٍ تقني آمن.</em></h1>
    <p className={styles.intro}>أرحّب بالتواصل حول هندسة الأمن السيبراني، والبحث الأمني، وتطوير البرمجيات، ومناقشة الأفكار والمشاريع التقنية ذات القيمة.</p>
    <div className={styles.heroActions}>
     <a className={styles.primaryAction} href="#send-message">أرسل رسالة <ArrowUpLeft size={17}/></a>
     <a className={styles.secondaryAction} href="mailto:m.gh.alaosimi@gmail.com">تواصل عبر البريد <ArrowUpRight size={16}/></a>
    </div>
   </div>
   <div className={styles.heroMark} aria-label="رمز الهوية AK">
    <div className={`${styles.orbit} ${styles.orbitOne}`}/><div className={`${styles.orbit} ${styles.orbitTwo}`}/>
    <div className={styles.markCore}><span>AK</span><small>CONNECT / 01</small></div>
    <div className={styles.markFoot}>BUILDING SYSTEMS.<br/>SECURING THE FUTURE.</div>
   </div>
   <div className={styles.heroFooter}><span>CYBERSECURITY</span><span>RESEARCH</span><span>SOFTWARE ENGINEERING</span><span>COLLABORATION</span></div>
  </section>

  <section className={styles.channelsSection} aria-labelledby="channels-title">
   <div className={styles.sectionHeading}><div><span className={styles.sectionIndex}>01 / PROFESSIONAL & DIRECT CHANNELS</span><h2 id="channels-title">اختر قناة التواصل المناسبة</h2><p>الشبكات المهنية والبحثية، إلى جانب قنوات التواصل المباشر.</p></div><span className={styles.headingCode}>SECURE CONNECTIONS · 07</span></div>
   <div className={styles.channelGrid}>
    {channels.map((item,index)=>{const Icon=item.icon;return <a className={styles.channelCard} href={item.href} key={item.name} target={item.href.startsWith('mailto:')?'_self':'_blank'} rel={item.href.startsWith('mailto:')?undefined:'noopener noreferrer'}>
      <div className={styles.cardTop}><span className={styles.cardNumber}>0{index+1}</span><span className={styles.cardIcon}><Icon size={19}/></span><ArrowUpRight className={styles.cardArrow} size={16}/></div>
      <div className={styles.cardText}><h3>{item.name}</h3><p>{item.detail}</p><strong>{item.value}</strong></div>
     </a>})}
   </div>
  </section>

  <section className={styles.messageSection} id="send-message">
   <div className={styles.messageIntro}>
    <span className={styles.sectionIndex}>02 / SEND A MESSAGE</span>
    <div className={styles.messageIcon}><MessageSquareText size={22}/></div>
    <h2>لديك فكرة أو<br/><em>موضوع للنقاش؟</em></h2>
    <p>اكتب تفاصيل رسالتك وسأطّلع عليها. يُرجى توضيح موضوع التواصل وإضافة المعلومات الضرورية فقط.</p>
    <div className={styles.privacyNote}><LockKeyhole size={17}/><span><b>خصوصية وأمان</b><small>يُستخدم التحقق من Google لتقليل الرسائل المزعجة. لا نطلب صلاحية الوصول إلى بريدك أو ملفاتك.</small></span></div>
    <div className={styles.messageTopics}><span><ShieldCheck size={14}/> Cybersecurity</span><span><Microscope size={14}/> Research</span><span><Code2 size={14}/> Development</span><span><BookOpen size={14}/> Academic</span></div>
   </div>
   <div className={styles.formPanel}><div className={styles.formPanelHead}><span>CONTACT FORM</span><span><i/> ENCRYPTED SESSION</span></div><ContactForm locale="ar"/></div>
  </section>

  <footer className={styles.footer}><span>M.GH.AL</span><span>Building Systems. Securing the Future.</span><a href="/ar">العودة إلى الرئيسية <ArrowLeft size={14}/></a></footer>
 </main>;
}


export default async function ContactPage(){
 const en = (await cookies()).get('portfolio-locale')?.value === 'en';
 return en ? <ContactPageEnglish /> : <ContactPageArabic />;
}
