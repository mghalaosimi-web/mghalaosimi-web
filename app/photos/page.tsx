import type {Metadata} from 'next';
import Image from 'next/image';
import Link from 'next/link';

const site='https://mghalaosimi-web.vercel.app';
const photos=[
 {src:'/profile-gallery/mghal-eid-portrait-2026.png',alt:"صورة شخصية لمحمد غالب العصيمي في مناسبة اجتماعية",
 {src:'/profile-gallery/mghal-cultural-portrait-2026.png',alt:"صورة شخصية لمحمد غالب العصيمي ضمن جلسة تصوير بطابع تراثي",
 {src:'/profile-gallery/mghal-with-companion-2026.jpg',alt:"صورة لمحمد غالب العصيمي برفقة شخص آخر في مناسبة",
 {src:'/profile-gallery/mghal-professional-poster-01.png',alt:"تصميم تعريفي بصري لهوية M.GH.AL وصورة محمد غالب العصيمي",
 {src:'/profile-gallery/mghal-professional-poster-02.png',alt:"تصميم بصري إضافي ضمن أرشيف هوية M.GH.AL",
 {src:'/profile-gallery/mghal-brand-visual-01.png',alt:"تصميم تعريفي بصري لهوية M.GH.AL",
 {src:'/profile-gallery/mghal-brand-portrait-visual.png',alt:"صورة بورتريه فنية لهوية M.GH.AL",
 {src:'/profile-gallery/mghal-brand-visual-02.png',alt:"تصميم بصري إضافي لهوية M.GH.AL",
 {src:'/profile-gallery/mghal-reading-portrait-2026.jpg',alt:"محمد غالب العصيمي أثناء القراءة",
 {src:'/profile-gallery/mghal-photo-2026-07-22.jpg',alt:"صورة شخصية من أرشيف يوليو 2026",
 {src:'/profile-gallery/mghal-photo-2026-07-28-a.jpg',alt:"صورة شخصية من أرشيف يوليو 2026",
 {src:'/profile-gallery/mghal-photo-2026-07-28-b.jpg',alt:"صورة شخصية من أرشيف يوليو 2026",
];
export const metadata:Metadata={title:'معرض صور محمد غالب العصيمي | M.GH.AL',description:'معرض الصور الشخصية والتصاميم التعريفية المنشورة ضمن الهوية الرقمية الرسمية لمحمد غالب العصيمي M.GH.AL.',alternates:{canonical:'/photos'},openGraph:{type:'website',title:'معرض صور محمد غالب العصيمي | M.GH.AL',description:'الصور الشخصية والتصاميم التعريفية المرتبطة بالهوية الرقمية M.GH.AL.',url:site+'/photos',images:[{url:site+'/assets/images/mghal-profile-primary.jpg',alt:'محمد غالب العصيمي — M.GH.AL'}]}};
const jsonLd={'@context':'https://schema.org','@type':'ImageGallery','name':'معرض صور محمد غالب العصيمي — M.GH.AL','url':site+'/photos','about':{'@type':'Person','name':'Mohammed Ghaleb Alaosimi','alternateName':['محمد غالب العصيمي','محمد غالب ناصر العصيمي','M.GH.AL'],'url':site},'image':photos.map(p=>site+p.src)};
export default function PhotosPage(){return <main dir="rtl" style={{maxWidth:1120,margin:'0 auto',padding:'clamp(20px,5vw,56px) 18px',color:'var(--foreground,#172b4d)'}}><header style={{marginBottom:28}}><p style={{letterSpacing:'.12em',fontSize:12,fontWeight:700,color:'#b69a62'}}>M.GH.AL · OFFICIAL IMAGE ARCHIVE</p><h1 style={{fontSize:'clamp(28px,5vw,44px)',lineHeight:1.3,margin:'8px 0'}}>معرض صور محمد غالب العصيمي</h1><p style={{maxWidth:760,lineHeight:1.9,opacity:.8}}>أرشيف الصور الشخصية والتصاميم التعريفية المرتبطة بالهوية الرقمية المهنية M.GH.AL. تُعرض الصور كما رُفعت إلى مكتبة الهوية، مع تمييز الصور الفوتوغرافية عن التصاميم البصرية.</p><Link href="/" style={{display:'inline-block',marginTop:8,color:'#315a85'}}>العودة إلى الصفحة الرئيسية ←</Link></header><section aria-label="معرض الصور" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,250px),1fr))',gap:18}}>{photos.map((photo,i)=><figure key={photo.src} style={{margin:0,border:'1px solid rgba(49,90,133,.18)',borderRadius:16,overflow:'hidden',background:'rgba(127,127,127,.04)'}}><a href={photo.src} target="_blank" rel="noreferrer" aria-label={'فتح الصورة '+(i+1)} style={{display:'block',position:'relative',aspectRatio:'4 / 5'}}><Image src={photo.src} alt={photo.alt} fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" style={{objectFit:'contain'}} priority={i<2}/></a><figcaption style={{padding:'12px 14px',fontSize:14,lineHeight:1.8}}>{photo.alt}</figcaption></figure>)}</section><p style={{marginTop:28,fontSize:12,lineHeight:1.8,opacity:.65}}>بعض عناصر هذا الأرشيف تصاميم تعريفية أو صور مركّبة، وليست كلها صورًا فوتوغرافية أصلية. حقوق الصور لأصحابها.</p><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd).replace(/</g,'\\u003c')}} /></main>}
