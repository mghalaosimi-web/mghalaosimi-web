import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
const root=process.cwd();
const catalog=JSON.parse(readFileSync(path.join(root,"assets/projects/catalog.json"),"utf8"));
const origin=catalog.siteOrigin.replace(/\/$/,"");
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const tx=(v,l)=>typeof v==="string"?v:(v?.[l]??"");
const url=(p,l)=>origin+"/"+(l==="en"?"en/":"")+"projects/"+p.slug+"/";
function render(p,l){
 const ar=l==="ar", title=tx(p.title,l), summary=tx(p.summary,l), canonical=url(p,l);
 const features=p.features.map(x=>"<li>"+esc(tx(x,l))+"</li>").join("");
 const tech=p.technologies.map(x=>"<li>"+esc(x)+"</li>").join("");
 const evidence=(p.evidence?.[l]??[]).map(x=>"<li>"+esc(x)+"</li>").join("");
 const notes=(p.notes?.[l]??[]).map(x=>"<li>"+esc(x)+"</li>").join("");
 const gallery=(p.gallery??[]).length?( "<div class='gallery-grid'>"+p.gallery.map(x=>"<figure><a href='"+esc(x.src)+"' target='_blank' rel='noopener noreferrer'><img src='"+esc(x.src)+"' alt='"+esc(tx(x.alt,l))+"' loading='lazy' decoding='async'></a><figcaption>"+esc(tx(x.caption,l))+"</figcaption></figure>").join("")+"</div>"):"<div class='empty-gallery'><p>"+(ar?"لا تتوفر لقطات شاشة عامة موثقة لهذا المشروع حتى تاريخ المراجعة.":"No verified public application screenshots were available at the review date.")+"</p><p>"+(ar?"الغلاف أعلاه Artwork توضيحي، وليس صورة من واجهة التطبيق.":"The cover above is illustrative artwork, not an application interface image.")+"</p></div>";
 const links=[];
 if(p.repository) links.push("<a class='action primary' href='"+esc(p.repository)+"' target='_blank' rel='noopener noreferrer'>"+(ar?"مستودع GitHub العام ↗":"Public GitHub repository ↗")+"</a>");
 else if(p.visibility?.ar?.includes("خاص")) links.push("<span class='action muted-action'>"+(ar?"المصدر خاص — الرابط غير منشور":"Private source — link not published")+"</span>");
 for(const r of p.relatedRepositories??[])links.push("<a class='action' href='"+esc(r)+"' target='_blank' rel='noopener noreferrer'>"+(ar?"مستودع مرتبط ↗":"Related repository ↗")+"</a>");
 if(p.docs)links.push("<a class='action' href='"+esc(p.docs)+"' target='_blank' rel='noopener noreferrer'>"+(ar?"README والتوثيق ↗":"README & documentation ↗")+"</a>");
 if(p.deploymentReference)links.push("<a class='action' href='"+esc(p.deploymentReference.url)+"' target='_blank' rel='noopener noreferrer'>"+esc(tx(p.deploymentReference.label,l))+" ↗</a>");
 if(!links.length)links.push("<span class='action muted-action'>"+(ar?"لا يوجد رابط عام متحقق منه":"No verified public link available")+"</span>");
 const jsonld=[
  {"@context":"https://schema.org","@type":p.slug==="mghal-official-website"?"WebSite":"SoftwareApplication","name":title,"alternateName":tx(p.title,ar?"en":"ar"),"description":summary,"applicationCategory":tx(p.category,l),"operatingSystem":p.operatingSystem,"image":origin+p.cover,"url":canonical,"author":{"@type":"Person","name":"Mohammed Ghaleb Alaosimi","alternateName":"محمد غالب العصيمي","url":origin+"/"}},
  {"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":ar?"الرئيسية":"Home","item":origin+(ar?"/":"/en/")},{"@type":"ListItem","position":2,"name":ar?"المشاريع":"Projects","item":origin+(ar?"/projects.html":"/en/projects.html")},{"@type":"ListItem","position":3,"name":title,"item":canonical}]}
 ];
 const mt=title+" | "+(ar?"مشروع برمجي":"Software project")+" — M.GH.AL";
 const md=summary.length>155?summary.slice(0,152).trimEnd()+"…":summary;
 const heading=(n,arText,enText)=>"<p class='section-kicker'>"+(ar?n+" — "+arText:n+" — "+enText.toUpperCase())+"</p>";
 const info=(id,arText,enText,body)=>"<section class='detail-section' aria-labelledby='"+id+"'>"+heading(id.startsWith("overview")?"01":id.startsWith("features")?"02":id.startsWith("stack")?"03":"04",arText,enText)+"<h2 id='"+id+"'>"+(ar?arText:enText)+"</h2>"+body+"</section>";
 return "<!doctype html>\n<html lang='"+l+"' dir='"+(ar?"rtl":"ltr")+"'>\n<head>\n"+
 "<meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1'><meta name='theme-color' content='#172B4D'><meta name='author' content='Mohammed Ghaleb Alaosimi'>"+
 "<meta name='description' content='"+esc(md)+"'><meta name='robots' content='index,follow,max-image-preview:large'>"+
 "<link rel='canonical' href='"+canonical+"'><link rel='alternate' hreflang='ar' href='"+url(p,"ar")+"'><link rel='alternate' hreflang='en' href='"+url(p,"en")+"'><link rel='alternate' hreflang='x-default' href='"+url(p,"ar")+"'>"+
 "<link rel='icon' type='image/svg+xml' href='/favicon.svg'><link rel='preconnect' href='https://fonts.googleapis.com'><link rel='preconnect' href='https://fonts.gstatic.com' crossorigin>"+
 "<link href='https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700;800&display=swap' rel='stylesheet'><link rel='stylesheet' href='/assets/theme.css'><link rel='stylesheet' href='/assets/project-detail.css'><link rel='stylesheet' href='/assets/mghal-experience.css'>"+
 "<title>"+esc(mt)+"</title><meta property='og:type' content='website'><meta property='og:site_name' content='M.GH.AL'><meta property='og:url' content='"+canonical+"'><meta property='og:title' content='"+esc(mt)+"'><meta property='og:description' content='"+esc(md)+"'><meta property='og:image' content='"+origin+p.cover+"'><meta property='og:image:alt' content='"+esc(tx(p.coverAlt,l))+"'>"+
 "<meta name='twitter:card' content='summary_large_image'><meta name='twitter:title' content='"+esc(mt)+"'><meta name='twitter:description' content='"+esc(md)+"'><meta name='twitter:image' content='"+origin+p.cover+"'>"+
 "<script type='application/ld+json'>"+JSON.stringify(jsonld)+"</script>\n</head>\n<body>"+
 "<a class='skip-link' href='#main-content'>"+(ar?"تجاوز إلى المحتوى الرئيسي":"Skip to main content")+"</a>"+
 "<header class='top'><div class='wrap nav'><a class='brand' href='"+(ar?"/":"/en/")+"'>M.GH.AL</a><nav class='navlinks' aria-label='"+(ar?"التنقل الرئيسي":"Primary navigation")+"'><a href='"+(ar?"/":"/en/")+"'>"+(ar?"الرئيسية":"Home")+"</a><a href='"+(ar?"/profile.html":"/en/profile.html")+"'>"+(ar?"الهوية":"Identity")+"</a><a href='"+(ar?"/projects.html":"/en/projects.html")+"'>"+(ar?"المشاريع":"Projects")+"</a><a href='"+(ar?"/certificates.html":"/en/certificates.html")+"'>"+(ar?"الشهادات":"Credentials")+"</a><a href='"+(ar?"/knowledge.html":"/en/knowledge.html")+"'>"+(ar?"المعرفة":"Knowledge")+"</a><a href='"+(ar?"/contact.html":"/en/contact.html")+"'>"+(ar?"التواصل":"Contact")+"</a></nav><a class='btn secondary nav-resume' href='"+(ar?"/resume.html":"/en/resume.html")+"'>"+(ar?"السيرة الذاتية":"Résumé")+" ↗</a></div></header>"+
 "<main id='main-content' class='project-shell'><nav class='breadcrumbs' aria-label='"+(ar?"مسار التنقل":"Breadcrumb")+"'><a href='"+(ar?"/":"/en/")+"'>"+(ar?"الرئيسية":"Home")+"</a><span>/</span><a href='"+(ar?"/projects.html":"/en/projects.html")+"'>"+(ar?"المشاريع":"Projects")+"</a><span>/</span><span aria-current='page'>"+esc(title)+"</span></nav>"+
 "<section class='project-hero'><div class='hero-copy'><p class='eyebrow'>"+(ar?"ملف المشروع":"PROJECT PROFILE")+" · "+esc(tx(p.category,l))+"</p><h1>"+esc(title)+"</h1><p class='hero-summary'>"+esc(summary)+"</p><div class='hero-badges'><span class='badge status-"+esc(p.statusKey)+"'>"+esc(tx(p.status,l))+"</span><span class='badge'>"+esc(tx(p.visibility,l))+"</span></div><div class='project-actions'>"+links.join("")+"</div></div><figure class='cover-frame'><img src='"+esc(p.cover)+"' alt='"+esc(tx(p.coverAlt,l))+"' fetchpriority='high' decoding='async'><figcaption>"+(ar?"غلاف فني توضيحي":"Illustrative project artwork")+"</figcaption></figure></section>"+
 info("overview-title","نظرة عامة","Overview","<div class='info-grid'><article><h3>"+(ar?"المشكلة":"Problem")+"</h3><p>"+esc(tx(p.problem,l))+"</p></article><article><h3>"+(ar?"الهدف":"Goal")+"</h3><p>"+esc(tx(p.goal,l))+"</p></article><article><h3>"+(ar?"الفئة المستفيدة":"Audience")+"</h3><p>"+esc(tx(p.audience,l))+"</p></article><article><h3>"+(ar?"القيمة":"Value")+"</h3><p>"+esc(tx(p.value,l))+"</p></article></div>")+
 info("features-title","الميزات الموثقة","Documented features","<ul class='feature-list'>"+features+"</ul>")+
 info("stack-title","التقنيات المستخدمة","Technology stack","<ul class='tech-list'>"+tech+"</ul><p class='small-note'>"+(ar?"تعكس القائمة ما ظهر في README وبنية المستودع؛ ولا تعني أن كل تكامل أو خدمة إنتاجية اختُبرت حياً.":"This list reflects the README and repository structure; it does not mean every integration or production service was tested live.")+"</p>")+
 info("architecture-title","ملخص المعمارية","Architecture summary","<p class='architecture-copy'>"+esc(tx(p.architecture,l))+"</p>")+
 "<section class='detail-section' aria-labelledby='gallery-title'>"+heading("05","الصور","Visual evidence")+"<h2 id='gallery-title'>"+(ar?"صور من المشروع":"Project visuals")+"</h2>"+gallery+"</section>"+
 "<section class='detail-section' aria-labelledby='status-title'>"+heading("06","الحالة والمصادر","Status & evidence")+"<h2 id='status-title'>"+(ar?"الحالة ومصدر المعلومات":"Status and evidence")+"</h2><p class='status-copy'><strong>"+(ar?"الحالة الحالية:":"Current status:")+"</strong> "+esc(tx(p.status,l))+"</p><p class='status-copy'><strong>"+(ar?"آخر مراجعة لسجل المشروع:":"Project record reviewed:")+"</strong> "+catalog.reviewedAt+"</p><h3>"+(ar?"أدلة المراجعة":"Review evidence")+"</h3><ul class='evidence-list'>"+evidence+"</ul>"+(notes?"<h3>"+(ar?"ملاحظات وحدود التحقق":"Notes and verification limits")+"</h3><ul class='notes-list'>"+notes+"</ul>":"")+"</section>"+
 "<section class='detail-section links-section' aria-labelledby='links-title'>"+heading("07","الروابط","Links")+"<h2 id='links-title'>"+(ar?"روابط المشروع":"Project links")+"</h2><div class='project-actions'>"+links.join("")+"</div></section></main>"+
 "<footer class='project-footer'><div class='project-shell'><span>M.GH.AL — "+(ar?"محمد غالب العصيمي":"Mohammed Ghaleb Alaosimi")+"</span><a href='"+(ar?"/projects.html":"/en/projects.html")+"'>"+(ar?"العودة إلى محفظة المشاريع":"Back to project portfolio")+"</a></div></footer><script src='/assets/site.js' defer></script><script src='/assets/visitor-tracking.js' defer></script></body></html>";
}
let sitemap=readFileSync(path.join(root,"sitemap.xml"),"utf8");
for(const p of catalog.projects){
 for(const l of ["ar","en"]){
  const dest=path.join(root,l==="en"?"en":"", "projects",p.slug);
  mkdirSync(dest,{recursive:true});
  writeFileSync(path.join(dest,"index.html"),render(p,l),"utf8");
  const u=url(p,l);
  if(!sitemap.includes("<loc>"+u+"</loc>"))sitemap=sitemap.replace("</urlset>","  <url><loc>"+u+"</loc><lastmod>"+catalog.reviewedAt+"</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>");
 }
}
writeFileSync(path.join(root,"sitemap.xml"),sitemap,"utf8");
console.log("Generated "+(catalog.projects.length*2)+" bilingual project detail pages and updated sitemap.xml.");
