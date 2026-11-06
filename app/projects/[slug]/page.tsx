import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import '../mghal-portfolio.css';
const items=[
{slug:'waynah',name:'WAYNAH | وَيْنَه؟',status:'In Progress',summary:'منصة استكشاف جغرافي محلية موثوقة لليمن، تعتمد PostgreSQL وPostGIS وتجربة منخفضة استهلاك البيانات.',stack:['Next.js','TypeScript','PostgreSQL','PostGIS'],url:'https://waynah.vercel.app'},
{slug:'humanity-system',name:'Humanity System',status:'Private / In Progress',summary:'منظومة لإدارة البيانات والعمليات المؤسسية. التفاصيل الفنية الحساسة تبقى ضمن المستودع الخاص.',stack:['Full-Stack','Database','RBAC']},
{slug:'focusflow',name:'FocusFlow',status:'Experimental',summary:'تطبيق إنتاجية لتنظيم المهام وجلسات التركيز والعادات اليومية؛ الوظائف والتوثيق قيد التطوير.',stack:['Flutter','Dart']},
{slug:'mghal-content-os',name:'M.GH.AL Content OS',status:'In Progress',summary:'نظام لإدارة دورة إنتاج المحتوى وتخطيطه ومراجعته عبر القنوات المدعومة.',stack:['Next.js','TypeScript','Prisma','PostgreSQL']},
{slug:'manar-schedule-system',name:'Manar Schedule System',status:'Collaborative',summary:'نظام تعاوني لتنظيم الجداول الأكاديمية وتدفقات العمل ذات الصلة.',stack:['React','Node.js','Prisma','PostgreSQL']},
{slug:'al-manar-schedule-system',name:'Al-Manar Schedule System',status:'In Progress',summary:'مشروع مستقل لتنظيم الجداول الأكاديمية الخاصة بكلية المنار، وليس نسخة من Manar Schedule System.',stack:['Web','Academic Systems']},
{slug:'yemen-ai-platform',name:'Yemen AI Platform',status:'Experimental',summary:'منصة معرفية ثنائية اللغة لاستكشاف تطبيقات الذكاء الاصطناعي والبحث في المستندات.',stack:['Python','AI','RAG']},
{slug:'ciphersphere',name:'CipherSphere',status:'Experimental',summary:'مختبر تعليمي لتجربة مفاهيم التشفير وتحليل الشفرات والتحقق من سلامة البيانات.',stack:['Cryptography','Web']},
{slug:'mghal-esdp',name:'M.GH.AL ESDP',status:'Private · Unpublished',summary:'مشروع تطبيق مكتبي خاص وغير منشور، ولا يتوفر رابط عام للتنزيل.',stack:['Desktop Software']},
{slug:'mghal-official-website',name:'M.GH.AL Official Website',status:'Active',summary:'مركز الهوية الرقمية المهنية ويجمع الملف الشخصي والمشاريع والشهادات والسيرة الذاتية والروابط.',stack:['Next.js','React','SEO']}
];
type Props={params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const p=items.find(x=>x.slug===slug);return p?{title:p.name,description:p.summary}:{title:'المشروع غير موجود'};}
export default async function ProjectDetail({params}:Props){const {slug}=await params;const p=items.find(x=>x.slug===slug);if(!p)notFound();return <main className="mghal-archive"><section className="mghal-archive-hero"><span className="mghal-eyebrow">M.GH.AL / PROJECT DETAIL</span><h1>{p.name}</h1><p>{p.summary}</p><span className="mghal-status">{p.status}</span></section><div className="mghal-section-head"><div><span className="mghal-eyebrow">TECHNICAL PROFILE</span><h2>التقنيات والنطاق</h2></div></div><section className="mghal-card"><div className="mghal-tags">{p.stack.map(s=><span key={s}>{s}</span>)}</div><p>تُعرض هذه الصفحة وفق المعلومات المتاحة حالياً. لا تُنسب مساهمات أو نتائج اختبار أو جاهزية إنتاجية غير موثقة.</p>{p.url&&<a href={p.url} target="_blank" rel="noreferrer">زيارة المشروع ↗</a>}</section><p style={{marginTop:28}}><Link href="/projects">← العودة إلى جميع المشاريع</Link></p></main>}
