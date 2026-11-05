;(() => {
  const path = location.pathname.replace(/\/+$/, "") || "/";
  if (/\/(?:en\/)?certificates\.html$/.test(path)) return;
  const nav = document.querySelector(".nav");
  if (!nav) return;
  const english = document.documentElement.lang.toLowerCase().startsWith("en");
  const prefix = english ? "/en" : "";
  const items = english
    ? [["Home", "/en/"], ["Identity", "/en/profile.html"], ["Projects", "/en/projects.html"], ["Certificates", "/en/certificates.html"], ["Skills", "/en/skills.html"], ["Achievements", "/en/achievements.html"], ["Knowledge", "/en/knowledge.html"], ["About", "/en/education.html"], ["Contact", "/en/contact.html"]]
    : [["الرئيسية", "/"], ["الهوية", "/profile.html"], ["المشاريع", "/projects.html"], ["الشهادات", "/certificates.html"], ["المهارات", "/skills.html"], ["الإنجازات", "/achievements.html"], ["المعرفة", "/knowledge.html"], ["التعليم", "/education.html"], ["التواصل", "/contact.html"]];
  let links = nav.querySelector(".navlinks, .links");
  if (!links) {
    links = document.createElement("nav");
    links.className = "navlinks";
    nav.insertBefore(links, nav.querySelector(".site-controls"));
  }
  links.classList.remove("links");
  links.classList.add("navlinks");
  links.replaceChildren();
  links.id = "site-navigation";
  links.setAttribute("aria-label", english ? "Primary navigation" : "التنقل الرئيسي");
  for (const [label, href] of items) {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    const target = href.replace(/\/+$/, "") || "/";
    if (path === target || (target.endsWith("projects.html") && path.includes("/projects/")) || (target.endsWith("profile.html") && /\/(?:en\/)?(?:resume|skills|education|achievements|showcase)\.html$/.test(path))) a.setAttribute("aria-current", "page");
    links.append(a);
  }
  const locale = document.createElement("a");
  locale.className = "site-locale-link";
  locale.href = english ? (path === "/en" || path === "/en/" ? "/" : path.replace(/^\/en/, "")) : (path === "/" ? "/en/" : "/en" + path);
  locale.textContent = english ? "العربية" : "English";
  locale.setAttribute("lang", english ? "ar" : "en");
  links.append(locale);
  nav.querySelectorAll(":scope > a").forEach(a => {
    if (a !== nav.querySelector(".brand") && !a.classList.contains("nav-resume")) {
      const href = new URL(a.href, location.origin).pathname;
      if (/^\/(?:en\/)?(?:profile|projects|skills|education|achievements|knowledge|contact|resume|showcase)\.html$/.test(href) || a.textContent.trim() === "English" || a.textContent.trim() === "العربية") a.remove();
    }
  });
  if (!nav.querySelector(".nav-resume")) {
    const a = document.createElement("a");
    a.className = "btn secondary nav-resume";
    a.href = prefix + "/resume.html";
    a.textContent = english ? "Résumé ↗" : "السيرة الذاتية ↗";
    nav.append(a);
  }
})();

;(() => {
  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const isCertificatePage = /\/(?:en\/)?certificates\.html$/.test(path);
  if (!isCertificatePage && !document.querySelector("link[data-mghal-experience]")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/assets/mghal-experience.css";
    link.dataset.mghalExperience = "true";
    document.head.appendChild(link);
  }
  if (!isCertificatePage && !document.querySelector("link[data-mghal-corporate]")) {
    const corporate = document.createElement("link");
    corporate.rel = "stylesheet";
    corporate.href = "/assets/corporate-ui.css";
    corporate.dataset.mghalCorporate = "true";
    document.head.appendChild(corporate);
  }
})();
;(() => { const script = document.createElement("script"); script.src = "/assets/section-rail.js"; script.async = true; document.head.appendChild(script); })();

(()=>{const accessibilityScript=document.createElement('script');accessibilityScript.src='/assets/accessibility.js';accessibilityScript.async=true;document.head.append(accessibilityScript);const projectCardsScript=document.createElement('script');projectCardsScript.src='/assets/project-cards.js';projectCardsScript.async=true;document.head.append(projectCardsScript);const themeMeta=document.querySelector('meta[name="theme-color"]');if(themeMeta)themeMeta.setAttribute("content","#172B4D");const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],ico=n=>n==="search"?'<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>':n==="menu"?'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>':'<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';if("serviceWorker"in navigator&&location.protocol==="https:"){window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(error=>console.error("M.GH.AL offline support:",error)))};document.documentElement.classList.add("js-ready");const bar=document.createElement("div");bar.className="site-progress";document.body.append(bar);let closeNav=()=>document.body.classList.remove("nav-open");const isEnglish=document.documentElement.lang.toLowerCase().startsWith("en"),nav=$(".nav");if(nav){const navLinks=$(".navlinks, .links",nav);if(navLinks){navLinks.classList.remove("links");navLinks.classList.add("navlinks");if(!navLinks.id)navLinks.id="site-navigation";navLinks.setAttribute("aria-label",isEnglish?"Primary navigation":"التنقل الرئيسي")}const c=document.createElement("div");c.className="site-controls";const s=document.createElement("button");s.className="site-icon-button";s.type="button";s.setAttribute("aria-label",isEnglish?"Search the website":"بحث في الموقع");s.innerHTML=ico("search")+"<span>"+(isEnglish?"Search":"بحث")+"</span>";s.onclick=openSearch;const m=document.createElement("button");m.className="site-icon-button site-menu-button";m.type="button";m.setAttribute("aria-label",isEnglish?"Open navigation menu":"فتح قائمة التنقل");m.setAttribute("aria-expanded","false");if(navLinks)m.setAttribute("aria-controls",navLinks.id);m.innerHTML=ico("menu");closeNav=(returnFocus=false)=>{const wasOpen=document.body.classList.contains("nav-open");document.body.classList.remove("nav-open");m.setAttribute("aria-expanded","false");m.setAttribute("aria-label",isEnglish?"Open navigation menu":"فتح قائمة التنقل");if(returnFocus&&wasOpen)m.focus()};m.onclick=()=>{const open=!document.body.classList.contains("nav-open");document.body.classList.toggle("nav-open",open);m.setAttribute("aria-expanded",String(open));m.setAttribute("aria-label",open?(isEnglish?"Close navigation menu":"إغلاق قائمة التنقل"):(isEnglish?"Open navigation menu":"فتح قائمة التنقل"))};if(navLinks)navLinks.addEventListener("click",e=>{if(e.target.closest("a"))closeNav()});document.addEventListener("click",e=>{if(!nav.contains(e.target))closeNav()});c.append(s,m);nav.append(c)}const top=document.createElement("button");top.className="site-to-top";top.type="button";top.setAttribute("aria-label","العودة إلى أعلى الصفحة");top.innerHTML=ico("top");top.onclick=()=>scrollTo({top:0,behavior:"smooth"});document.body.append(top);function onScroll(){let max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?Math.min(100,scrollY/max*100):0)+"%";top.classList.toggle("visible",scrollY>480)}addEventListener("scroll",onScroll,{passive:true});onScroll();$("main")&&$$("main section,main .hero,main .card,main .item").forEach(e=>e.classList.add("reveal"));if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){let ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{threshold:.08});$$(".reveal").forEach(e=>ob.observe(e))}else $$(".reveal").forEach(e=>e.classList.add("is-visible"));$$("img").forEach(i=>{i.decoding="async";i.addEventListener("error",()=>i.classList.add("image-unavailable"),{once:true})});let path=location.pathname.replace(/\/+$/,"")||"/";$$(".navlinks a").forEach(a=>{let h=new URL(a.href,location.origin).pathname.replace(/\/+$/,"")||"/";if(h===path)a.setAttribute("aria-current","page")});let index=null,overlay=null,input=null,searchOpener=null;const norm=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}\s.-]/gu," ").replace(/\s+/g," ").trim();async function getIndex(){if(index)return index;let r=await fetch("/assets/search-index.json",{cache:"force-cache"});if(!r.ok)throw Error();index=await r.json();return index}function results(q){let out=$(".site-search-results",overlay);out.replaceChildren();let query=norm(q);if(!query){out.innerHTML=isEnglish?'<div class="site-empty">Type a name, project, or technology to search.</div>':'<div class="site-empty">اكتب اسماً أو مشروعاً أو تقنية للبحث في الموقع.</div>';return}let terms=query.split(" "),found=index.map(x=>{let t=norm(x.title),d=norm([x.description,...(x.keywords||[])].join(" ")),score=0;terms.forEach(w=>{if(t.includes(w))score+=t===w?12:6;if(d.includes(w))score+=2});return{x,score}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,10);if(!found.length){out.innerHTML=isEnglish?'<div class="site-empty">No matching results. Try another keyword.</div>':'<div class="site-empty">لا توجد نتائج مطابقة. جرّب الاسم بالعربية أو الإنجليزية.</div>';return}found.forEach(({x})=>{let a=document.createElement("a");a.className="site-search-result";a.href=x.url;let b=document.createElement("strong");b.textContent=x.title;let d=document.createElement("span");d.textContent=x.description||"";a.append(b,d);out.append(a)})}async function openSearch(){if(!overlay||overlay.hidden)searchOpener=document.activeElement;if(!overlay){overlay=document.createElement("div");overlay.className="site-overlay";overlay.hidden=true;overlay.innerHTML=isEnglish?'<section class="site-search" role="dialog" aria-modal="true" aria-labelledby="site-search-title"><div class="site-search-head"><div class="site-search-title" id="site-search-title">Search M.GH.AL</div><button type="button" class="site-icon-button site-search-close">Close ×</button></div><input class="site-search-input" type="search" autocomplete="off" placeholder="Search identity, projects, or skills..." aria-label="Search query"><div class="site-search-results" aria-live="polite"></div><div class="site-search-hint">Arabic and English search · Esc to close · Ctrl/⌘ + K to open</div></section>':'<section class="site-search" role="dialog" aria-modal="true" aria-labelledby="site-search-title"><div class="site-search-head"><div class="site-search-title" id="site-search-title">البحث في M.GH.AL</div><button type="button" class="site-icon-button site-search-close">إغلاق ×</button></div><input class="site-search-input" type="search" autocomplete="off" placeholder="ابحث عن الاسم أو المشاريع أو المهارات..." aria-label="عبارة البحث"><div class="site-search-results" aria-live="polite"></div><div class="site-search-hint">يدعم البحث بالعربية والإنجليزية · Esc للإغلاق · Ctrl/⌘ + K للفتح</div></section>';overlay.onclick=e=>{if(e.target===overlay)closeSearch()};$(".site-search-close",overlay).onclick=closeSearch;input=$(".site-search-input",overlay);input.oninput=()=>results(input.value);document.body.append(overlay)}overlay.hidden=false;document.body.style.overflow="hidden";try{await getIndex();results(input.value)}catch{$(".site-search-results",overlay).textContent=isEnglish?"The search index is temporarily unavailable.":"تعذر تحميل فهرس البحث حالياً."}input.focus()}function closeSearch(){if(overlay&&!overlay.hidden){overlay.hidden=true;document.body.style.overflow="";if(searchOpener&&typeof searchOpener.focus==="function")searchOpener.focus();}}document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}if(e.key==="Escape"){closeSearch();closeNav(true)}if(e.key==="Tab"&&overlay&&!overlay.hidden){const focusable=[...overlay.querySelectorAll("a[href],button:not([disabled]),input:not([disabled]),[tabindex]")].filter(el=>!el.hidden&&el.tabIndex>=0);if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}}});let q=new URLSearchParams(location.search);if(q.has("q"))openSearch().then(()=>{input.value=q.get("q")||"";results(input.value)});let y=$("#year");if(y)y.textContent=new Date().getFullYear()})();

;(()=>{const s=document.createElement('script');s.src='/assets/visitor-tracking.js';s.defer=true;document.head.appendChild(s)})();

;(()=>{if(document.querySelector('link[data-mghal-social-style]'))return;const style=document.createElement('link');style.rel='stylesheet';style.href='/assets/social-engagement.css';style.dataset.mghalSocialStyle='true';document.head.append(style);const script=document.createElement('script');script.src='/assets/social-engagement.js';script.defer=true;document.head.append(script)})();
