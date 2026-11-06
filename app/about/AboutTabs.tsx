"use client";
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpLeft,ArrowLeft,ShieldCheck,Code2,Network,GraduationCap,BookOpen,Search,Workflow,Target,Compass,Layers,Terminal,FlaskConical,Users,FileCheck2,Lightbulb,Globe2,BriefcaseBusiness} from 'lucide-react';

const tabs=[
 {id:'overview',label:'نظرة عامة',en:'OVERVIEW',Icon:Compass},
 {id:'journey',label:'المسار الأكاديمي',en:'JOURNEY',Icon:GraduationCap},
 {id:'expertise',label:'مجالات الاهتمام',en:'FOCUS AREAS',Icon:Layers},
 {id:'work',label:'المشاريع والعمل',en:'BUILD & CREATE',Icon:Workflow},
 {id:'leadership',label:'المسؤولية والقيادة',en:'LEADERSHIP',Icon:Users},
 {id:'principles',label:'الرؤية والمنهجية',en:'PRINCIPLES',Icon:Target},
] as const;
type TabId=(typeof tabs)[number]['id'];

function Overview(){return <div className="ab-content-grid">
 <article className="ab-feature ab-feature-main"><span className="ab-index">01 / PROFILE</span><h2>أبني التقنية، وأتعلم كيف أحميها.</h2><p>أنا محمد غالب العصيمي، طالب أمن سيبراني وشبكات ومطوّر مشاريع تقنية مستقل من اليمن. أجمع في مساري بين فهم الأنظمة من الداخل، وتطوير البرمجيات، ودراسة طرق حمايتها واختبارها.</p><p>لا أتعامل مع الأمن السيبراني كأدوات منفصلة؛ بل كطريقة تفكير تبدأ بفهم النظام، ثم تحديد نقاط الضعف، والتحقق من المخاطر، وبناء حلول يمكن اختبارها وتطويرها.</p></article>
 <article className="ab-feature"><span className="ab-index">02 / IDENTITY</span><h3>هوية متعددة التخصصات</h3><p>الأمن السيبراني هو المجال المحوري، وتدعمه البرمجة والشبكات وهندسة الأنظمة والبحث التطبيقي.</p><div className="ab-tags"><span>Cybersecurity</span><span>Software</span><span>Research</span></div></article>
 <article className="ab-feature"><span className="ab-index">03 / DIRECTION</span><h3>ما الذي أعمل نحوه؟</h3><p>تطوير حلول أمنية وبرمجية ذات قيمة عملية، وتحويل المعرفة التقنية إلى أنظمة واضحة، قابلة للقياس والمراجعة.</p><Link href="/projects" className="ab-inline-link">شاهد المشاريع <ArrowUpLeft size={15}/></Link></article>
 </div>}
function Journey(){return <div className="ab-timeline">
 <div className="ab-timeline-item"><span className="ab-time">2024 — 2028</span><div><h3>بكالوريوس الأمن السيبراني والشبكات</h3><p>كلية المنار الجامعية للعلوم والتكنولوجيا. أدرس مسارًا يجمع أساسيات الحوسبة والبرمجة وقواعد البيانات والشبكات وأمن المعلومات.</p><small>الفترة الدراسية للبرنامج بحسب الخطة الأكاديمية</small></div></div>
 <div className="ab-timeline-item"><span className="ab-time">LEVEL 1–2</span><div><h3>بناء الأساس التقني</h3><p>تدرجت في البرمجة كائنية التوجه، قواعد البيانات، الشبكات، أنظمة التشغيل، الإحصاء، الرياضيات، ومعمارية الحاسوب.</p><small>التعلم النظري والتطبيق العملي</small></div></div>
 <div className="ab-timeline-item"><span className="ab-time">LEVEL 3</span><div><h3>التوسع نحو التخصص والتطبيق</h3><p>أركز على التشفير، أمن المعلومات والشبكات، تطوير الويب، أساسيات هندسة البرمجيات، والذكاء الاصطناعي للأمن السيبراني، إلى جانب مناهج البحث العلمي.</p><small>المرحلة الدراسية الحالية</small></div></div>
 <div className="ab-timeline-item"><span className="ab-time">NEXT</span><div><h3>هندسة الأمن والبحث التطبيقي</h3><p>توسيع الخبرة العملية، وبناء أنظمة قابلة للاختبار، وتطوير أعمال بحثية موثقة تستند إلى أدلة وتجارب قابلة لإعادة التحقق.</p><small>اتجاه مهني مستقبلي</small></div></div>
 </div>}
const areas=[
 {Icon:ShieldCheck,title:'البحث الأمني واكتشاف الثغرات',text:'تحليل التطبيقات والشيفرات والمكونات البرمجية، وفهم أسباب الضعف الأمني وتوثيق النتائج ضمن نطاق مصرح به.'},
 {Icon:Network,title:'الأمن الدفاعي والشبكات',text:'مفاهيم الرصد والكشف وتحليل حركة الشبكة، فهم التهديدات، ومبادئ الاستجابة للحوادث.'},
 {Icon:Code2,title:'هندسة وتطوير البرمجيات',text:'بناء تطبيقات وأدوات تقنية، والعمل مع واجهات الويب وقواعد البيانات والبرمجة متعددة المنصات.'},
 {Icon:Search,title:'التحليل الجنائي والاستجابة',text:'الاهتمام بجمع الأدلة الرقمية، تنظيم السجلات، تحليل المؤشرات، وربط الأحداث للوصول إلى تفسير مدعوم.'},
 {Icon:FlaskConical,title:'البحث والتجريب',text:'صياغة أسئلة تقنية، تصميم تجارب عملية، مقارنة النتائج، وتوثيق حدود العمل والنتائج.'},
 {Icon:Globe2,title:'الأنظمة والبنية التقنية',text:'فهم العلاقة بين البرمجيات والشبكات والأنظمة والخدمات، وكيفية تأثير كل طبقة في أمن المنظومة.'},
];
function Expertise(){return <><div className="ab-section-intro"><h2>مجالات أتعلمها وأطوّر نفسي فيها</h2><p>هذه مجالات اهتمام وممارسة تقنية ضمن مسار تعلّم مستمر، وليست ادعاءً باعتماد مهني أو خبرة وظيفية في كل مجال.</p></div><div className="ab-area-grid">{areas.map(({Icon,title,text},i)=><article className="ab-area" key={title}><span>0{i+1}</span><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></>}
function Work(){return <div className="ab-work-list">
 <article className="ab-work-card"><div className="ab-work-icon"><ShieldCheck/></div><div><span className="ab-index">ENGINEERING PROJECT</span><h3>AEGIS-TITAN</h3><p>مشروع منظومة دفاع سيبراني أعمل على تطويرها، يركز على تجميع قدرات التحليل والرصد وربط المؤشرات والأدلة الأمنية ضمن بيئة واحدة. الفكرة هي الانتقال من نتائج متفرقة إلى صورة أوضح تساعد على الفهم والتحقق.</p><div className="ab-tags"><span>Python</span><span>Defensive Security</span><span>Security Analytics</span></div><Link href="/aegis-titan" className="ab-inline-link">استكشف المشروع <ArrowUpLeft size={15}/></Link></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><Terminal/></div><div><span className="ab-index">SOFTWARE PROJECT</span><h3>المساعد الأكاديمي المحلي</h3><p>تطبيق أكاديمي شخصي يهدف إلى تنظيم المهام والمشاريع والمواعيد والمواد الدراسية، مع أدوات لمتابعة الأداء الأكاديمي والعمل دون اتصال بالإنترنت.</p><div className="ab-tags"><span>Offline-first</span><span>Productivity</span><span>App Development</span></div></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><BookOpen/></div><div><span className="ab-index">RESEARCH DIRECTION</span><h3>التكامل بين نتائج التحليل الأمني</h3><p>اهتمام بحثي في ربط نتائج أدوات ومصادر التحليل المختلفة، وتنظيم الأدلة، وإعطاء الأولوية للمخاطر في الأنظمة متعددة الطبقات. ما يزال هذا المسار قيد التطوير والتحقق العلمي.</p><div className="ab-tags"><span>Evidence Correlation</span><span>Risk Prioritization</span><span>Applied Research</span></div><Link href="/research" className="ab-inline-link">صفحة الأبحاث <ArrowUpLeft size={15}/></Link></div></article>
 </div>}
function Leadership(){return <div className="ab-leadership">
 <div className="ab-leadership-mark"><Users/><span>SCIENTIFIC COMMITTEE</span></div><div><span className="ab-index">STUDENT LEADERSHIP</span><h2>مسؤول اللجنة العلمية</h2><h3>قسما الأمن السيبراني وتقنية المعلومات — المستوى الثالث</h3><p>أتولى مسؤولية اللجنة العلمية ضمن الملتقى الطلابي، وأعمل على تنظيم المحتوى الأكاديمي وتنسيق نشر المحاضرات والمواد العلمية والإعلانات، وتسهيل التواصل والمتابعة بين ممثلي الأقسام والجهات ذات العلاقة.</p><p>أرى أن العمل التنظيمي الجيد لا يقتصر على نشر المعلومات؛ بل يتطلب وضوح المصدر، ودقة الصياغة، وانتظام التحديث، وسهولة وصول الطلاب إلى المادة المناسبة في الوقت المناسب.</p><Link href="https://t.me/USF_CS_manar_CYS_3" target="_blank" rel="noreferrer" className="ab-inline-link">القناة العلمية على تيليجرام <ArrowUpLeft size={15}/></Link></div></div>}
function Principles(){return <><div className="ab-section-intro"><h2>كيف أفكر وأعمل؟</h2><p>أفضّل بناء الفهم والتحقق من النتائج على الاكتفاء بالمظهر أو الادعاء.</p></div><div className="ab-principle-grid">
 {[
 [Target,'ابدأ بالمشكلة','أحدد السياق والهدف والنطاق قبل اختيار الأداة أو تصميم الحل.'],
 [FileCheck2,'الدليل قبل الاستنتاج','أبحث عن شواهد قابلة للفحص، وأميز بين ما تم التحقق منه وما يزال فرضية.'],
 [Workflow,'النظام قبل الجزء','أفهم ترابط المكونات والطبقات وتأثير كل جزء في بقية المنظومة.'],
 [Lightbulb,'التعلم بالتطبيق','أحوّل المفاهيم إلى تجارب ومشاريع، ثم أراجع النتائج وأتعلم من القيود.'],
 [ShieldCheck,'المسؤولية أولًا','ألتزم بالنطاق المصرح به، وأتعامل مع الأنظمة والبيانات والأدلة بمسؤولية.'],
 [BriefcaseBusiness,'قيمة قابلة للاستخدام','أهتم بأن يكون الناتج واضحًا وموثقًا وقابلًا للصيانة والتطوير.'],
 ].map(([Icon,title,text],i)=>{const I=Icon as typeof Target;return <article key={String(title)}><span>0{i+1}</span><I/><h3>{String(title)}</h3><p>{String(text)}</p></article>})}
 </div><div className="ab-vision"><span>LONG-TERM DIRECTION</span><h2>هندسة الأمن السيبراني · البحث والتطوير · بناء المنتجات التقنية</h2><p>أطمح إلى الجمع بين العمق التقني والقدرة على بناء حلول حقيقية، والمساهمة في تطوير أنظمة أكثر أمانًا وموثوقية.</p><b>Building Systems. Securing the Future.</b></div></>}
export default function AboutTabs(){const [active,setActive]=useState<TabId>('overview');const current=tabs.find(t=>t.id===active)!;return <main className="content-page about-page ab-page">
 <div className="ab-topline"><span>PERSONAL PROFILE / 2026</span><span>YEMEN <i/> INFORMATION TECHNOLOGY</span></div>
 <section className="ab-hero"><div className="ab-hero-copy"><span className="ab-kicker">ENGINEERING MINDSET · SECURITY RESEARCH · SOFTWARE</span><h1>محمد غالب العصيمي <em>الكاملي</em></h1><h2>طالب أمن سيبراني وشبكات · مطوّر مشاريع تقنية</h2><p>أبني فهمًا عميقًا للأنظمة، وأطوّر البرمجيات، وأبحث في كيفية جعل التقنية أكثر أمانًا وموثوقية.</p><div className="ab-hero-facts"><span><GraduationCap/> بكالوريوس — المستوى الثالث</span><span><Globe2/> اليمن</span><span><ShieldCheck/> تعلّم وتطبيق مستمر</span></div></div><div className="ab-hero-portrait"><div className="ab-portrait-frame"><Image src="/images/mghal-avatar.webp" alt="محمد غالب العصيمي" width={640} height={640} priority/><span>M.GH.AL</span></div><div className="ab-portrait-coordinate">PROFILE / 001<br/>CYBER × SOFTWARE</div></div><div className="ab-hero-watermark" aria-hidden="true">AK</div></section>
 <section className="ab-tab-shell" aria-label="تفاصيل النبذة الشخصية"><div className="ab-tab-head"><div><span>EXPLORE MY PROFILE</span><h2>تعرّف على مساري</h2></div><small>اختر قسمًا لعرض التفاصيل</small></div><div className="ab-tabs" role="tablist" aria-label="أقسام النبذة">{tabs.map(({id,label,en,Icon})=><button key={id} type="button" role="tab" aria-selected={active===id} aria-controls="about-tab-panel" id={'tab-'+id} className={active===id?'is-active':''} onClick={()=>setActive(id)}><Icon/><span>{label}</span><small>{en}</small></button>)}</div><div className="ab-tab-panel" id="about-tab-panel" role="tabpanel" aria-labelledby={'tab-'+active} key={active}>{active==='overview'?<Overview/>:active==='journey'?<Journey/>:active==='expertise'?<Expertise/>:active==='work'?<Work/>:active==='leadership'?<Leadership/>:<Principles/>}</div></section>
 <footer className="ab-signoff"><span>M.GH.AL</span><b>Building Systems. Securing the Future.</b><Link href="/contact">للتواصل المهني <ArrowLeft size={14}/></Link></footer>
 </main>}
