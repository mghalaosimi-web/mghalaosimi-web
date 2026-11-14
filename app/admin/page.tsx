import type {Metadata} from 'next';
import Script from 'next/script';

export const metadata:Metadata={
  title:'إدارة M.GH.AL',
  description:'لوحة الإدارة الآمنة لمنصة M.GH.AL.',
  robots:{index:false,follow:false,noarchive:true}
};

const sections=[
  ['dashboard','نظرة عامة'],['identity','الهوية الشخصية'],['projects','المشاريع'],
  ['certificates','الشهادات'],['articles','المقالات'],['technologies','التقنيات'],
  ['skills','المهارات'],['education','التعليم'],['achievements','الإنجازات'],
  ['followers','المتابعون'],['comments','التعليقات'],['analytics','التحليلات'],
  ['media','مكتبة الوسائط'],['users','المستخدمون والصلاحيات']
] as const;

export default function AdminPage(){
  return <>
    <link rel="stylesheet" href="/assets/design-tokens.css"/>
    <link rel="stylesheet" href="/assets/admin.css"/>
    <div className="admin-shell" dir="rtl">
      <aside className="sidebar" id="sidebar">
        <a className="brand" href="/" aria-label="M.GH.AL">M.GH.AL <small>CONTROL CENTER</small></a>
        <div className="side-label">مساحة الإدارة</div>
        <nav id="nav" aria-label="التنقل الإداري">
          {sections.map(([view,label],index)=><button key={view} className={index===0?'nav-item active':'nav-item'} data-view={view}>{label}</button>)}
        </nav>
        <div className="sidebar-foot"><span className="status-dot"/> اتصال المنصة <strong id="api-status">جارٍ الفحص</strong></div>
      </aside>
      <a className="skip-link" href="#main-content">تجاوز إلى المحتوى</a>
      <main id="main-content" className="main">
        <header className="topbar">
          <button id="menu" className="icon-btn" aria-label="فتح القائمة" aria-controls="sidebar" aria-expanded="false">☰</button>
          <div><span className="eyebrow">M.GH.AL / ADMINISTRATION</span><h1 id="page-title">نظرة عامة</h1></div>
          <div className="top-actions"><a href="/" target="_blank" rel="noopener noreferrer">عرض الموقع ↗</a><button id="logout" className="btn btn-light hidden">تسجيل الخروج</button></div>
        </header>
        <section id="auth-panel" className="auth-wrap">
          <div className="auth-card">
            <div className="auth-mark">M.GH.AL</div><span className="eyebrow">SECURE ACCESS</span>
            <h2 id="auth-title">تسجيل دخول الإدارة</h2><p id="auth-copy">استخدم حساب الإدارة المعتمد للوصول إلى لوحة التحكم.</p>
            <form id="login-form">
              <label>البريد الإلكتروني<input name="email" type="email" autoComplete="username" required maxLength={254}/></label>
              <label>كلمة المرور<input name="password" type="password" autoComplete="current-password" required minLength={12}/></label>
              <button className="btn btn-primary" type="submit">دخول آمن</button>
            </form>
            <form id="bootstrap-rotate-form" className="hidden">
              <label>رمز التهيئة الجديد الذي أعددته في إعدادات Vercel<input name="token" type="password" autoComplete="off" required minLength={32}/></label>
              <p className="api-state">أدخل الرمز الذي حفظته كسر Worker باسم OWNER_BOOTSTRAP_TOKEN. لا ترسله في المحادثة أو عبر رابط.</p>
              <button className="btn btn-primary" type="submit">تدوير الرمز وتجهيز التهيئة</button>
            </form>
            <form id="bootstrap-form" className="hidden">
              <label>رمز التهيئة لمرة واحدة<input name="token" type="password" autoComplete="off" required/></label>
              <label>اسم مالك المنصة<input name="displayName" required maxLength={120}/></label>
              <label>البريد الإلكتروني<input name="email" type="email" required maxLength={254}/></label>
              <label>كلمة مرور (12 حرفاً على الأقل)<input name="password" type="password" required minLength={12} autoComplete="new-password"/></label>
              <button className="btn btn-primary" type="submit">إنشاء حساب المالك</button>
            </form>
            <div id="auth-message" className="message" role="status"/>
          </div>
        </section>
        <section id="app-panel" className="content hidden"><div id="notice" className="notice hidden" role="status"/><div id="view"/></section>
      </main>
    </div>
    <dialog id="editor">
      <form method="dialog" className="editor-card" id="editor-form">
        <div className="editor-head"><div><span className="eyebrow">CONTENT WORKSPACE</span><h2 id="editor-title">تحرير سجل</h2></div><button className="icon-btn" value="cancel" aria-label="إغلاق">×</button></div>
        <div id="editor-fields" className="form-grid"/>
        <div className="editor-actions"><button className="btn btn-light" value="cancel">إلغاء</button><button className="btn btn-primary" id="save-record" value="default">حفظ التغييرات</button></div>
        <p id="editor-message" className="message" role="status"/>
      </form>
    </dialog>
    <Script src="/assets/admin.js" strategy="afterInteractive"/>
  </>;
}
