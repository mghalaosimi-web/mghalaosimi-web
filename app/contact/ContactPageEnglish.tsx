import { ArrowLeft, ArrowUpLeft, ArrowUpRight, BrainCircuit, Code2, Github, Instagram, Layers3, Linkedin, LockKeyhole, Mail, MessageSquareText, Microscope, Video } from 'lucide-react';
import ContactForm from '../../components/ContactForm';
import styles from './contact.module.css';

const channels = [
 {name:'LinkedIn',detail:'Professional networking and opportunities',value:'Mohammed Ghaleb Alaosimi',href:'https://www.linkedin.com/in/mohammed-alaosimi-038155443/',icon:Linkedin},
 {name:'GitHub',detail:'Projects and source code',value:'mghalaosimi-web',href:'https://github.com/mghalaosimi-web',icon:Github},
 {name:'Email',detail:'Inquiries and direct messages',value:'m.gh.alaosimi@gmail.com',href:'mailto:m.gh.alaosimi@gmail.com',icon:Mail},
 {name:'ORCID',detail:'Research identity and record',value:'0009-0000-6007-3170',href:'https://orcid.org/0009-0000-6007-3170',icon:Microscope},
 {name:'Credly',detail:'Verified digital badges and credentials',value:'View digital credentials',href:'https://www.credly.com/users/mohammed-ghaleb-al-aosimi',icon:Layers3},
 {name:'Instagram',detail:'Personal and professional updates',value:'@q_v94',href:'https://www.instagram.com/q_v94/',icon:Instagram},
 {name:'TikTok',detail:'Short-form technical and personal content',value:'@m.gh.al.2006',href:'https://www.tiktok.com/@m.gh.al.2006',icon:Video}
];

export default function ContactPageEnglish(){
 return <main className={styles.page} dir="ltr">
  <div className={styles.topline}><span>CONTACT / PROFESSIONAL NETWORK</span><span>M.GH.AL <i/></span></div>
  <section className={styles.hero}>
   <div className={styles.heroGrid} aria-hidden="true"/>
   <div className={styles.heroCopy}>
    <span className={styles.kicker}><span/> OPEN CHANNEL FOR PROFESSIONAL CONNECTION</span>
    <p className={styles.overline}>LET’S CONNECT</p>
    <h1>Let’s build<br/><em>useful systems.</em></h1>
    <p className={styles.intro}>I welcome conversations about software engineering, full-stack development, enterprise systems, applied AI, and meaningful project collaboration.</p>
    <div className={styles.heroActions}><a className={styles.primaryAction} href="#send-message">Send a message <ArrowUpLeft size={17}/></a><a className={styles.secondaryAction} href="mailto:m.gh.alaosimi@gmail.com">Contact via email <ArrowUpRight size={16}/></a></div>
   </div>
   <div className={styles.heroMark} aria-label="M.GH.AL identity mark"><div className={styles.orbit + ' ' + styles.orbitOne}/><div className={styles.orbit + ' ' + styles.orbitTwo}/><div className={styles.markCore}><span>M.GH.AL</span><small>CONNECT / 01</small></div><div className={styles.markFoot}>BUILDING SYSTEMS.<br/>ENGINEERING WITH PURPOSE.</div></div>
   <div className={styles.heroFooter}><span>SOFTWARE ENGINEERING</span><span>ENTERPRISE SYSTEMS</span><span>APPLIED AI</span><span>COLLABORATION</span></div>
  </section>
  <section className={styles.channelsSection} aria-labelledby="channels-title">
   <div className={styles.sectionHeading}><div><span className={styles.sectionIndex}>01 / PROFESSIONAL & SOCIAL CHANNELS</span><h2 id="channels-title">Choose your preferred channel</h2><p>Professional, research, and social profiles published by M.GH.AL.</p></div><span className={styles.headingCode}>CONNECT · 07</span></div>
   <div className={styles.channelGrid}>{channels.map((item,index)=>{const Icon=item.icon;return <a className={styles.channelCard} href={item.href} key={item.name} target={item.href.startsWith('mailto:')?'_self':'_blank'} rel={item.href.startsWith('mailto:')?undefined:'noopener noreferrer'}><div className={styles.cardTop}><span className={styles.cardNumber}>0{index+1}</span><span className={styles.cardIcon}><Icon size={19}/></span><ArrowUpRight className={styles.cardArrow} size={16}/></div><div className={styles.cardText}><h3>{item.name}</h3><p>{item.detail}</p><strong>{item.value}</strong></div></a>})}</div>
  </section>
  <section className={styles.messageSection} id="send-message">
   <div className={styles.messageIntro}><span className={styles.sectionIndex}>02 / SEND A MESSAGE</span><div className={styles.messageIcon}><MessageSquareText size={22}/></div><h2>Have an idea or<br/><em>something to discuss?</em></h2><p>Share the details of your message. Please clarify the topic and include only the information needed to respond.</p><div className={styles.privacyNote}><LockKeyhole size={17}/><span><b>Privacy & security</b><small>Google verification helps reduce spam. We do not request access to your email or files.</small></span></div><div className={styles.messageTopics}><span><Code2 size={14}/> Software Engineering</span><span><Layers3 size={14}/> Enterprise Systems</span><span><BrainCircuit size={14}/> Applied AI</span><span><Microscope size={14}/> Research</span></div></div>
   <div className={styles.formPanel}><div className={styles.formPanelHead}><span>CONTACT FORM</span><span><i/> VERIFIED SESSION</span></div><ContactForm locale="en"/></div>
  </section>
  <footer className={styles.footer}><span>M.GH.AL</span><span>Building Systems. Engineering with Purpose.</span><a href="/">Back to home <ArrowLeft size={14}/></a></footer>
 </main>;
}
