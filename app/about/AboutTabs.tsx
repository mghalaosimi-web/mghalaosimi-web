"use client";
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpLeft,ArrowLeft,ShieldCheck,Code2,Network,GraduationCap,BookOpen,Search,Workflow,Target,Compass,Layers,Terminal,FlaskConical,Users,FileCheck2,Lightbulb,Globe2,BriefcaseBusiness} from 'lucide-react';

const tabs=[
 {id:'overview',label:'نظرة عامة',en:'OVERVIEW',Icon:Compass},
 {id:'journey',label:'المسار الأكاديمي',en:'ACADEMIC PATH',Icon:GraduationCap},
 {id:'expertise',label:'مجالات الاهتمام',en:'FOCUS AREAS',Icon:Layers},
 {id:'work',label:'المشاريع والعمل',en:'PROJECTS',Icon:Workflow},
 {id:'learning',label:'التعلم والتطوير',en:'LEARNING',Icon:BookOpen},
 {id:'principles',label:'الرؤية والمنهجية',en:'PRINCIPLES',Icon:Target},
] as const;
type TabId=(typeof tabs)[number]['id'];

function Overview(){return <div className="ab-content-grid">
 <article className="ab-feature ab-feature-main"><span className="ab-index">01 / PROFILE</span><h2>أدرس تقنية المعلومات وأبني أنظمة برمجية.</h2><p>أنا محمد غالب العصيمي، طالب بكالوريوس تقنية المعلومات ومطوّر Full-Stack من اليمن. أعمل على تصميم وبناء تطبيقات ويب وأنظمة مؤسسية، مع اهتمام بهندسة البرمجيات والذكاء الاصطناعي التطبيقي وقواعد البيانات وتجربة المستخدم.</p><p>أتعامل مع التطوير بوصفه عملية هندسية تبدأ بفهم المتطلبات والنطاق، ثم تصميم البنية، وتنفيذ المكونات واختبارها وتوثيقها.</p></article>
 <article className="ab-feature"><span className="ab-index">02 / IDENTITY</span><h3>هوية تقنية متعددة المسارات</h3><p>محور عملي هو هندسة البرمجيات وتطوير الأنظمة المؤسسية. وتشمل اهتماماتي الذكاء الاصطناعي التطبيقي وتجربة المستخدم والأمن السيبراني بوصفه مجال تعلم واهتمام، لا تخصص الدرجة الأكاديمية.</p><div className="ab-tags"><span>Software Engineering</span><span>Enterprise Systems</span><span>Applied AI</span></div></article>
 <article className="ab-feature"><span className="ab-index">03 / DIRECTION</span><h3>ما الذي أعمل نحوه؟</h3><p>بناء منتجات رقمية موثوقة وقابلة للصيانة والتوسع، مع توثيق نطاق العمل والتمييز بين ما اكتمل وما يزال قيد التطوير.</p><Link href="/projects" className="ab-inline-link">شاهد المشاريع <ArrowUpLeft size={15}/></Link></article>
 </div>}
function Journey(){return <div className="ab-timeline">
 <div className="ab-timeline-item"><span className="ab-time">BACHELOR'S</span><div><h3>بكالوريوس تقنية المعلومات</h3><p>كلية المنار للعلوم والتكنولوجيا — اليمن. يركز المسار الأكاديمي على أسس تقنية المعلومات والحوسبة وتطوير الأنظمة.</p><small>المؤهل الأكاديمي الجاري</small></div></div>
 <div className="ab-timeline-item"><span className="ab-time">FOUNDATIONS</span><div><h3>بناء الأساس التقني</h3><p>دراسة أساسيات البرمجة، قواعد البيانات، الشبكات، أنظمة التشغيل، ومعمارية الحاسوب ضمن مسار تقنية المعلومات.</p><small>دراسة أكاديمية وتطبيق عملي</small></div></div>
 <div className="ab-timeline-item"><span className="ab-time">COURSEWORK</span><div><h3>مناهج البحث وتفاعل الإنسان والحاسوب</h3><p>درست مناهج البحث العلمي وتفاعل الإنسان والحاسوب (HCI)، إلى جانب تطوير المعرفة في هندسة البرمجيات وتصميم التجارب الرقمية.</p><small>مقررات أكاديمية مكتملة</small></div></div>
 <div className="ab-timeline-item"><span className="ab-time">NEXT</span><div><h3>هندسة الأنظمة والذكاء الاصطناعي التطبيقي</h3><p>توسيع الخبرة في بناء تطبيقات قابلة للتوسع، والأنظمة المؤسسية، وهندسة البرمجيات، وتطبيقات الذكاء الاصطناعي.</p><small>اتجاه تعلم وبحث قيد التطوير</small></div></div>
 </div>}
const areas=[
 {Icon:Code2,title:'هندسة البرمجيات والمعمارية',text:'تصميم مكونات واضحة الحدود، وبناء تطبيقات قابلة للاختبار والصيانة والتوسع.'},
 {Icon:Terminal,title:'تطوير Full-Stack',text:'تطوير واجهات الويب والخدمات وواجهات API باستخدام تقنيات JavaScript وTypeScript وReact وNext.js وNode.js.'},
 {Icon:Workflow,title:'الأنظمة المؤسسية وERP',text:'نمذجة العمليات وسير العمل وإدارة الصلاحيات والتكامل بين وحدات الأنظمة الإدارية.'},
 {Icon:Network,title:'قواعد البيانات والبيانات',text:'تصميم نماذج البيانات والعمل مع PostgreSQL وSQLite وPrisma وتقنيات تخزين البيانات.'},
 {Icon:FlaskConical,title:'الذكاء الاصطناعي التطبيقي',text:'استكشاف تطبيقات الذكاء الاصطناعي والأنظمة المعرفية واسترجاع المعلومات من المستندات.'},
 {Icon:Globe2,title:'تجربة المستخدم وواجهات RTL',text:'تصميم واجهات عربية وإنجليزية متجاوبة، مع اهتمام بالوضوح وإمكانية الوصول واتساق التفاعل.'},
];
function Expertise(){return <><div className="ab-section-intro"><h2>مجالات أتعلمها وأطوّر نفسي فيها</h2><p>هذه مجالات اهتمام وممارسة تقنية ضمن مسار تعلم مستمر. الأمن السيبراني اهتمام معرفي إضافي، وليس التخصص الأكاديمي لدرجة البكالوريوس.</p></div><div className="ab-area-grid">{areas.map(({Icon,title,text},i)=><article className="ab-area" key={title}><span>0{i+1}</span><Icon/><h3>{title}</h3><p>{text}</p></article>)}</div></>}
function Work(){return <div className="ab-work-list">
 <article className="ab-work-card"><div className="ab-work-icon"><Globe2/></div><div><span className="ab-index">COLLABORATIVE PROJECT · IN DEVELOPMENT</span><h3>WAYNAH | وَيْنَه؟</h3><p>منصة يمنية للاكتشاف الجغرافي المحلي والمعلومات الموثوقة، مع مراعاة الاتصال منخفض السرعة. مساهمتي تطويرية ضمن فريق المشروع، ولا أنسب ملكية المنصة أو كامل تنفيذها إلى نفسي.</p><div className="ab-tags"><span>Next.js</span><span>PostgreSQL</span><span>PostGIS</span><span>Offline-first</span></div><Link href="/projects/waynah" className="ab-inline-link">تفاصيل المشروع <ArrowUpLeft size={15}/></Link></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><Terminal/></div><div><span className="ab-index">SOFTWARE PROJECT · IN DEVELOPMENT</span><h3>M.GH.AL Content OS</h3><p>نظام أعمل على تصميمه وبنائه لإدارة دورة إنتاج المحتوى، وتخطيطه ومراجعته وتنظيم تدفقات النشر عبر القنوات المدعومة.</p><div className="ab-tags"><span>Next.js</span><span>TypeScript</span><span>Prisma</span></div><Link href="/projects/mghal-content-os" className="ab-inline-link">تفاصيل المشروع <ArrowUpLeft size={15}/></Link></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><Workflow/></div><div><span className="ab-index">PRIVATE PROJECT · IN DEVELOPMENT</span><h3>Humanity System</h3><p>منظومة مؤسسية خاصة لإدارة البيانات والعمليات وسير العمل. أعرض وصفها العام فقط دون كشف تفاصيل المستودع أو البنية الداخلية.</p><div className="ab-tags"><span>Full-Stack</span><span>Database</span><span>RBAC</span></div><Link href="/projects/humanity-system" className="ab-inline-link">تفاصيل المشروع <ArrowUpLeft size={15}/></Link></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><Layers/></div><div><span className="ab-index">PRIVATE · UNPUBLISHED</span><h3>M.GH.AL ESDP</h3><p>مشروع تطبيق مكتبي خاص وغير منشور، ولا تتوفر له نسخة عامة للتنزيل أو تفاصيل إضافية قابلة للنشر.</p><div className="ab-tags"><span>Desktop Software</span><span>Private Project</span></div><Link href="/projects/mghal-esdp" className="ab-inline-link">السجل العام للمشروع <ArrowUpLeft size={15}/></Link></div></article>
 </div>}
function Learning(){return <div className="ab-work-list">
 <article className="ab-work-card"><div className="ab-work-icon"><GraduationCap/></div><div><span className="ab-index">ACADEMIC STUDY</span><h3>بكالوريوس تقنية المعلومات</h3><p>الدراسة الجامعية في كلية المنار للعلوم والتكنولوجيا، مع تركيز أكاديمي على تقنية المعلومات وتطبيقاتها.</p><div className="ab-tags"><span>Information Technology</span><span>Software Engineering</span></div></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><BookOpen/></div><div><span className="ab-index">COMPLETED COURSEWORK</span><h3>مناهج البحث العلمي وتفاعل الإنسان والحاسوب</h3><p>مقرران دراسيان تم إنجازهما ضمن المسار الأكاديمي، ويدعمان مهارات البحث وتصميم التجارب وفهم تفاعل المستخدم مع الأنظمة.</p><div className="ab-tags"><span>Research Methods</span><span>HCI</span></div></div></article>
 <article className="ab-work-card"><div className="ab-work-icon"><ShieldCheck/></div><div><span className="ab-index">DOCUMENTED LEARNING</span><h3>الشهادات والاعتمادات</h3><p>سجل موثق يضم اعتمادات Cisco Networking Academy وEdraak وشهادة JSNAD، مع روابط التحقق المتاحة ومعرّفات الاعتماد عند عدم توفر صفحة تحقق عامة.</p><div className="ab-tags"><span>11 Cisco Badges</span><span>6 Edraak Certificates</span><span>JSNAD</span></div><Link href="/credentials" className="ab-inline-link">عرض سجل الشهادات <ArrowUpLeft size={15}/></Link></div></article>
 </div>}
function Principles(){return <><div className="ab-section-intro"><h2>كيف أفكر وأعمل؟</h2><p>أفضّل بناء الفهم والتحقق من النتائج على الاكتفاء بالمظهر أو الادعاء.</p></div><div className="ab-principle-grid">
 {[
 [Target,'ابدأ بالمشكلة','أحدد السياق والهدف والنطاق قبل اختيار الأداة أو تصميم الحل.'],
 [FileCheck2,'الدليل قبل الاستنتاج','أبحث عن شواهد قابلة للفحص، وأميز بين ما تم التحقق منه وما يزال فرضية.'],
 [Workflow,'النظام قبل الجزء','أفهم ترابط المكونات والطبقات وتأثير كل جزء في بقية المنظومة.'],
 [Lightbulb,'التعلم بالتطبيق','أحوّل المفاهيم إلى تجارب ومشاريع، ثم أراجع النتائج وأتعلم من القيود.'],
 [ShieldCheck,'المسؤولية أولًا','ألتزم بالنطاق المصرح به، وأتعامل مع الأنظمة والبيانات بمسؤولية.'],
 [BriefcaseBusiness,'قيمة قابلة للاستخدام','أهتم بأن يكون الناتج واضحًا وموثقًا وقابلًا للصيانة والتطوير.'],
 ].map(([Icon,title,text],i)=>{const I=Icon as typeof Target;return <article key={String(title)}><span>0{i+1}</span><I/><h3>{String(title)}</h3><p>{String(text)}</p></article>})}
 </div><div className="ab-vision"><span>LONG-TERM DIRECTION</span><h2>هندسة البرمجيات · الأنظمة المؤسسية · الذكاء الاصطناعي التطبيقي</h2><p>أطمح إلى الجمع بين العمق التقني والقدرة على بناء حلول حقيقية وموثوقة، وتطوير منتجات قابلة للاستخدام والصيانة.</p><b>Building Systems. Engineering with Purpose.</b></div></>}
export default function AboutTabs(){const [active,setActive]=useState<TabId>('overview');const current=tabs.find(t=>t.id===active)!;return <main className="content-page about-page ab-page">
 <div className="ab-topline"><span>PERSONAL PROFILE / 2026</span><span>YEMEN <i/> INFORMATION TECHNOLOGY</span></div>
 <section className="ab-hero"><div className="ab-hero-copy"><span className="ab-kicker">SOFTWARE ENGINEERING · FULL-STACK · ENTERPRISE SYSTEMS</span><h1>محمد غالب العصيمي</h1><h2>طالب تقنية معلومات · مطوّر Full-Stack · مهندس برمجيات</h2><p>أبني فهمًا عميقًا للأنظمة، وأطوّر البرمجيات، وأبحث في كيفية جعل التقنية أكثر أمانًا وموثوقية.</p><div className="ab-hero-facts"><span><GraduationCap/> بكالوريوس — تقنية المعلومات</span><span><Globe2/> اليمن</span><span><ShieldCheck/> تعلّم وتطبيق مستمر</span></div></div><div className="ab-hero-portrait"><div className="ab-portrait-frame"><Image src="/images/mghal-avatar.webp" alt="محمد غالب العصيمي" width={640} height={640} priority/><span>M.GH.AL</span></div><div className="ab-portrait-coordinate">PROFILE / 001<br/>SOFTWARE × SYSTEMS</div></div><div className="ab-hero-watermark" aria-hidden="true">MG</div></section>
 <section className="ab-tab-shell" aria-label="تفاصيل النبذة الشخصية"><div className="ab-tab-head"><div><span>EXPLORE MY PROFILE</span><h2>تعرّف على مساري</h2></div><small>اختر قسمًا لعرض التفاصيل</small></div><div className="ab-tabs" role="tablist" aria-label="أقسام النبذة">{tabs.map(({id,label,en,Icon})=><button key={id} type="button" role="tab" aria-selected={active===id} aria-controls="about-tab-panel" id={'tab-'+id} className={active===id?'is-active':''} onClick={()=>setActive(id)}><Icon/><span>{label}</span><small>{en}</small></button>)}</div><div className="ab-tab-panel" id="about-tab-panel" role="tabpanel" aria-labelledby={'tab-'+active} key={active}>{active==='overview'?<Overview/>:active==='journey'?<Journey/>:active==='expertise'?<Expertise/>:active==='work'?<Work/>:active==='learning'?<Learning/>:<Principles/>}</div></section>
 <footer className="ab-signoff"><span>M.GH.AL</span><b>Building Systems. Engineering with Purpose.</b><Link href="/contact">للتواصل المهني <ArrowLeft size={14}/></Link></footer>
 </main>}
