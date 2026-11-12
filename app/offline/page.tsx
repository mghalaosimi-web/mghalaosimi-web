import type {Metadata} from 'next';
import Link from 'next/link';
import './offline.css';
export const metadata:Metadata={title:'أنت غير متصل — M.GH.AL',description:'صفحة توضح أن الموقع غير متصل بالإنترنت.',robots:{index:false,follow:false}};
export default function OfflinePage(){return <main className="offline-page" dir="rtl"><section className="offline-card" id="main-content" tabIndex={-1}><div className="offline-brand">M.GH.AL</div><h1>أنت غير متصل بالإنترنت</h1><p>تعذر الوصول إلى الصفحة المطلوبة حالياً. يمكنك العودة إلى الصفحة الرئيسية أو إعادة المحاولة عندما يتوفر الاتصال.</p><div className="offline-actions"><Link href="/">العودة إلى الصفحة الرئيسية</Link><button type="button" onClick={()=>window.location.reload()}>إعادة المحاولة</button></div></section></main>}