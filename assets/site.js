(()=>{const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)],ico=n=>n==="search"?'<svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></svg>':n==="menu"?'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>':'<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>';document.documentElement.classList.add("js-ready");const isEnglish=document.documentElement.lang.toLowerCase().startsWith("en");const bar=document.createElement("div");bar.className="site-progress";document.body.append(bar);let closeNav=()=>document.body.classList.remove("nav-open"),searchTrigger=null;const nav=$(".nav");if(nav){const navLinks=$(".navlinks",nav);if(navLinks){if(!navLinks.id)navLinks.id="site-navigation";navLinks.setAttribute("aria-label",isEnglish?"Primary navigation":"التنقل الرئيسي")}const c=document.createElement("div");c.className="site-controls";const s=document.createElement("button");s.className="site-icon-button";s.type="button";s.id="site-search-trigger";s.setAttribute("aria-label",isEnglish?"Search the site":"بحث في الموقع");s.setAttribute("aria-haspopup","dialog");s.setAttribute("aria-controls","site-search-dialog");s.setAttribute("aria-expanded","false");s.innerHTML=ico("search")+"<span>"+(isEnglish?"Search":"بحث")+"</span>";s.onclick=openSearch;searchTrigger=s;const m=document.createElement("button");m.className="site-icon-button site-menu-button";m.type="button";m.setAttribute("aria-label",isEnglish?"Open navigation menu":"فتح قائمة التنقل");m.setAttribute("aria-expanded","false");if(navLinks)m.setAttribute("aria-controls",navLinks.id);m.innerHTML=ico("menu");closeNav=(returnFocus=false)=>{const wasOpen=document.body.classList.contains("nav-open");document.body.classList.remove("nav-open");m.setAttribute("aria-expanded","false");m.setAttribute("aria-label",isEnglish?"Open navigation menu":"فتح قائمة التنقل");if(returnFocus&&wasOpen)m.focus()};m.onclick=()=>{const open=!document.body.classList.contains("nav-open");document.body.classList.toggle("nav-open",open);m.setAttribute("aria-expanded",String(open));m.setAttribute("aria-label",open?(isEnglish?"Close navigation menu":"إغلاق قائمة التنقل"):(isEnglish?"Open navigation menu":"فتح قائمة التنقل"))};if(navLinks)navLinks.addEventListener("click",e=>{if(e.target.closest("a"))closeNav()});document.addEventListener("click",e=>{if(!nav.contains(e.target))closeNav()});c.append(s,m);nav.append(c)}const top=document.createElement("button");top.className="site-to-top";top.type="button";top.setAttribute("aria-label",isEnglish?"Back to top":"العودة إلى أعلى الصفحة");top.innerHTML=ico("top");top.onclick=()=>scrollTo({top:0,behavior:"smooth"});document.body.append(top);function onScroll(){let max=document.documentElement.scrollHeight-innerHeight;bar.style.width=(max>0?Math.min(100,scrollY/max*100):0)+"%";top.classList.toggle("visible",scrollY>480)}addEventListener("scroll",onScroll,{passive:true});onScroll();$("main")&&$$("main section,main .hero,main .card,main .item").forEach(e=>e.classList.add("reveal"));if("IntersectionObserver"in window&&!matchMedia("(prefers-reduced-motion: reduce)").matches){let ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");ob.unobserve(e.target)}}),{threshold:.08});$$(".reveal").forEach(e=>ob.observe(e))}else $$(".reveal").forEach(e=>e.classList.add("is-visible"));$$("img").forEach(i=>{i.decoding="async";i.addEventListener("error",()=>i.classList.add("image-unavailable"),{once:true})});let path=location.pathname.replace(/\/+$/,"")||"/";$$(".navlinks a").forEach(a=>{let h=new URL(a.href,location.origin).pathname.replace(/\/+$/,"")||"/";if(h===path)a.setAttribute("aria-current","page")});let index=null,overlay=null,input=null,lastSearchFocus=null;const norm=s=>String(s||"").toLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}\s.-]/gu," ").replace(/\s+/g," ").trim();async function getIndex(){if(index)return index;let r=await fetch("/assets/search-index.json",{cache:"force-cache"});if(!r.ok)throw Error();index=await r.json();return index}
function results(q){
  let out=$(".site-search-results",overlay);
  out.replaceChildren();
  let query=norm(q);
  if(!query){
    out.textContent=isEnglish?"Enter a name, project, or technology to search.":"اكتب اسماً أو مشروعاً أو تقنية للبحث في الموقع.";
    return;
  }
  let terms=query.split(" "),found=index.map(x=>{
    let t=norm(x.title),d=norm([x.description,...(x.keywords||[])].join(" ")),score=0;
    terms.forEach(w=>{if(t.includes(w))score+=t===w?12:6;if(d.includes(w))score+=2});
    return{x,score};
  }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,10);
  if(!found.length){
    out.textContent=isEnglish?"No matching results. Try a term in Arabic or English.":"لا توجد نتائج مطابقة. جرّب كلمة بالعربية أو الإنجليزية.";
    return;
  }
  found.forEach(({x})=>{
    let a=document.createElement("a");
    a.className="site-search-result";
    a.href=x.url;
    let b=document.createElement("strong");
    b.textContent=x.title;
    let d=document.createElement("span");
    d.textContent=x.description||"";
    a.append(b,d);
    out.append(a);
  });
}
async function openSearch(){
  if(overlay&&!overlay.hidden){
    input.focus();
    return;
  }
  if(!overlay){
    overlay=document.createElement("div");
    overlay.className="site-overlay";
    overlay.id="site-search-overlay";
    overlay.hidden=true;
    overlay.innerHTML=
      '<section class="site-search" id="site-search-dialog" role="dialog" aria-modal="true" aria-labelledby="site-search-title" aria-describedby="site-search-hint">'+
        '<div class="site-search-head">'+
          '<div class="site-search-title" id="site-search-title">'+(isEnglish?"Search M.GH.AL":"البحث في M.GH.AL")+'</div>'+
          '<button type="button" class="site-icon-button site-search-close">'+(isEnglish?"Close ×":"إغلاق ×")+'</button>'+
        '</div>'+
        '<input class="site-search-input" type="search" autocomplete="off" placeholder="'+(isEnglish?"Search names, projects, or skills...":"ابحث عن الاسم أو المشاريع أو المهارات...")+'" aria-label="'+(isEnglish?"Search query":"عبارة البحث")+'">'+
        '<div class="site-search-results" aria-live="polite" aria-atomic="false"></div>'+
        '<div class="site-search-hint" id="site-search-hint">'+(isEnglish?"Search in Arabic or English · Esc to close · Ctrl/⌘ + K to open":"يدعم البحث بالعربية والإنجليزية · Esc للإغلاق · Ctrl/⌘ + K للفتح")+'</div>'+
      '</section>';
    overlay.onclick=e=>{if(e.target===overlay)closeSearch()};
    $(".site-search-close",overlay).onclick=closeSearch;
    input=$(".site-search-input",overlay);
    input.oninput=()=>results(input.value);
    overlay.addEventListener("keydown",e=>{
      if(e.key!=="Tab")return;
      const focusable=$$('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',overlay)
        .filter(el=>!el.hidden&&el.getAttribute("aria-hidden")!=="true"&&el.getClientRects().length);
      if(!focusable.length){
        e.preventDefault();
        return;
      }
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey&&document.activeElement===first){
        e.preventDefault();
        last.focus();
      }else if(!e.shiftKey&&document.activeElement===last){
        e.preventDefault();
        first.focus();
      }
    });
    document.body.append(overlay);
  }
  lastSearchFocus=document.activeElement;
  overlay.hidden=false;
  document.body.style.overflow="hidden";
  if(searchTrigger)searchTrigger.setAttribute("aria-expanded","true");
  input.focus();
  try{
    await getIndex();
    results(input.value);
  }catch{
    $(".site-search-results",overlay).textContent=isEnglish?"The search index could not be loaded.":"تعذر تحميل فهرس البحث حالياً.";
  }
}
function closeSearch(){
  if(!overlay||overlay.hidden)return;
  overlay.hidden=true;
  document.body.style.overflow="";
  if(searchTrigger)searchTrigger.setAttribute("aria-expanded","false");
  const target=lastSearchFocus&&lastSearchFocus!==document.body&&lastSearchFocus.isConnected?lastSearchFocus:searchTrigger;
  lastSearchFocus=null;
  if(target&&typeof target.focus==="function")target.focus();
}
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){e.preventDefault();openSearch()}if(e.key==="Escape"){closeSearch();closeNav(true)}});let q=new URLSearchParams(location.search);if(q.has("q"))openSearch().then(()=>{input.value=q.get("q")||"";results(input.value)});let y=$("#year");if(y)y.textContent=new Date().getFullYear()})();