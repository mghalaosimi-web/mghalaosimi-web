import Link from 'next/link';

export const metadata={title:'Offline | M.GH.AL',robots:{index:false,follow:false}};

export default function OfflinePage(){
  return <main id="main" style={{minHeight:'70vh',display:'grid',placeItems:'center',padding:24,background:'#f3f5f7',color:'#172b4d',textAlign:'center'}}>
    <section style={{maxWidth:560}}>
      <p style={{fontSize:12,letterSpacing:'.16em',fontWeight:700,color:'#b69a62'}}>M.GH.AL / OFFLINE</p>
      <h1 style={{fontSize:'clamp(32px,7vw,52px)'}}>أنت غير متصل بالإنترنت</h1>
      <p style={{lineHeight:1.9,color:'#526176'}}>تعذر تحميل الصفحة الآن. تحقق من اتصالك بالإنترنت ثم أعد المحاولة. يمكنك العودة إلى الصفحة الرئيسية عند استعادة الاتصال.</p>
      <Link href="/" style={{display:'inline-block',marginTop:16,padding:'11px 18px',borderRadius:8,background:'#172b4d',color:'#fff',textDecoration:'none'}}>العودة إلى الرئيسية</Link>
    </section>
  </main>;
}
