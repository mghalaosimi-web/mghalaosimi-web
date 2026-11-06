import type { Metadata } from 'next';
import { ArrowLeft,ArrowUpLeft,ArrowUpRight,BookOpen,Code2,Github,GraduationCap,Linkedin,LockKeyhole,Mail,MessageCircle,MessageSquareText,Microscope,Send,ShieldCheck } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import styles from './contact.module.css';

export const metadata:Metadata={
 title:'Professional Contact | Mohammed Ghaleb Alaosimi',
 description:'Connect with Mohammed Ghaleb Alaosimi about cybersecurity engineering, security research, technical projects, and professional collaboration.',
 alternates:{canonical:'/en/contact'}
};

const channels=[
 {name:'LinkedIn',detail:'Professional networking and opportunities',value:'Mohammed Ghaleb Alaosimi',href:'https://www.linkedin.com/in/mghalaosimi-web-399676409',icon:Linkedin},
 {name:'GitHub',detail:'Projects and source code',value:'mghalaosimi-web',href:'https://github.com/mghalaosimi-web',icon:Github},
 {name:'Email',detail:'Inquiries and direct messages',value:'m.gh.alaosimi@gmail.com',href:'mailto:m.gh.alaosimi@gmail.com',icon:Mail},
 {name:'ORCID',detail:'Research identity and record',value:'0009-0000-6007-3170',href:'https://orcid.org/0009-0000-6007-3170',icon:Microscope},
 {name:'Credly',detail:'Digital badges and credentials',value:'View digital credentials',href:'https://www.credly.com/users/mghalaosimi-web',icon:GraduationCap},
 {name:'WhatsApp',detail:'Direct contact via WhatsApp',value:'Send a direct message',href:'https://wa.me/967772814959?text='+encodeURIComponent('Hello Arfat, I found your message through your professional website.'),icon:MessageCircle},
 {name:'Telegram',detail:'Connect via Telegram',value:'@A_AB_ALK',href:'https://t.me/A_AB_ALK',icon:Send}
];

export default function ContactPageEnglish(){
 return <main className={styles.page} dir="ltr">
  <div className={styles.topline}><span>CONTACT / PROFESSIONAL NETWORK</span><span>M.GH.AL <i/></span></div>
  <section className={styles.hero}>
   <div className={styles.heroGrid} aria-hidden="true"/>
   <div className={styles.heroCopy}>
    <span className={styles.kicker}><span/> OPEN CHANNEL FOR PROFESSIONAL CONNECTION</span>
    <p className={styles.overline}>LET’S CONNECT</p>
    <h1>Let’s connect to<br/><em>build a safer future.</em></h1>
    <p className={styles.intro}>I welcome conversations about cybersecurity engineering, security research, software development, and exchanging ideas on meaningful technical projects.</p>
    <div className={styles.heroActions}><a className={styles.primaryAction} href="#send-message">Send a message <ArrowUpLeft size={17}/></a><a className={styles.secondaryAction} href="mailto:m.gh.alaosimi@gmail.com">Contact via email <ArrowUpRight size={16}/></a></div>
   </div>
   <div className={styles.heroMark} aria-label="AK identity mark"><div className={`${styles.orbit} ${styles.orbitOne}`}/><div className={`${styles.orbit} ${styles.orbitTwo}`}/><div className={styles.markCore}><span>AK</span><small>CONNECT / 01</small></div><div className={styles.markFoot}>BUILDING SYSTEMS.<br/>SECURING THE FUTURE.</div></div>
   <div className={styles.heroFooter}><span>CYBERSECURITY</span><span>RESEARCH</span><span>SOFTWARE ENGINEERING</span><span>COLLABORATION</span></div>
  </section>
  <section className={styles.channelsSection} aria-labelledby="channels-title">
   <div className={styles.sectionHeading}><div><span className={styles.sectionIndex}>01 / PROFESSIONAL & DIRECT CHANNELS</span><h2 id="channels-title">Choose your preferred channel</h2><p>Professional and research networks, along with direct communication channels.</p></div><span className={styles.headingCode}>SECURE CONNECTIONS · 07</span></div>
   <div className={styles.channelGrid}>{channels.map((item,index)=>{const Icon=item.icon;return <a className={styles.channelCard} href={item.href} key={item.name} target={item.href.startsWith('mailto:')?'_self':'_blank'} rel={item.href.startsWith('mailto:')?undefined:'noopener noreferrer'}><div className={styles.cardTop}><span className={styles.cardNumber}>0{index+1}</span><span className={styles.cardIcon}><Icon size={19}/></span><ArrowUpRight className={styles.cardArrow} size={16}/></div><div className={styles.cardText}><h3>{item.name}</h3><p>{item.detail}</p><strong>{item.value}</strong></div></a>})}</div>
  </section>
  <section className={styles.messageSection} id="send-message">
   <div className={styles.messageIntro}><span className={styles.sectionIndex}>02 / SEND A MESSAGE</span><div className={styles.messageIcon}><MessageSquareText size={22}/></div><h2>Have an idea or<br/><em>something to discuss?</em></h2><p>Share the details of your message. Please clarify the topic and include only the information needed to respond.</p><div className={styles.privacyNote}><LockKeyhole size={17}/><span><b>Privacy & security</b><small>Google verification helps reduce spam. We do not request access to your email or files.</small></span></div><div className={styles.messageTopics}><span><ShieldCheck size={14}/> Cybersecurity</span><span><Microscope size={14}/> Research</span><span><Code2 size={14}/> Development</span><span><BookOpen size={14}/> Academic</span></div></div>
   <div className={styles.formPanel}><div className={styles.formPanelHead}><span>CONTACT FORM</span><span><i/> VERIFIED SESSION</span></div><ContactForm locale="en"/></div>
  </section>
  <footer className={styles.footer}><span>M.GH.AL</span><span>Building Systems. Securing the Future.</span><a href="/en">Back to home <ArrowLeft size={14}/></a></footer>
 </main>;
}
