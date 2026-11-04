;(() => {
  if (!document.querySelector("link[data-mghal-rail-style]")) {
    const railStyle = document.createElement("link");
    railStyle.rel = "stylesheet";
    railStyle.href = "/assets/section-rail.css";
    railStyle.dataset.mghalRailStyle = "true";
    document.head.appendChild(railStyle);
  }
})();


/* M.GH.AL persistent section rail — bilingual, responsive and page-aware. */
;(() => {
  if (document.querySelector('[data-mghal-rail]')) return;
  const en = document.documentElement.lang.toLowerCase().startsWith('en');
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const groups = en ? [
    ['OVERVIEW', [['⌂','Home','/en/'],['◎','Professional identity','/en/profile.html'],['▤','Résumé / CV','/en/resume.html']]],
    ['CAREER & WORK', [['◇','Projects','/en/projects.html'],['▦','Project showcase','/en/showcase.html'],['✦','Certificates','/en/certificates.html'],['⌘','Skills & technologies','/en/skills.html'],['▣','Education','/en/education.html'],['★','Achievements','/en/achievements.html']]],
    ['CONTENT & CONNECT', [['▧','Articles & knowledge','/en/knowledge.html'],['✉','Contact','/en/contact.html']]]
  ] : [
    ['الرئيسية والهوية', [['⌂','الرئيسية','/'],['◎','الهوية والملف المهني','/profile.html'],['▤','السيرة الذاتية','/resume.html']]],
    ['المسيرة والأعمال', [['◇','المشاريع','/projects.html'],['▦','معرض المشاريع','/showcase.html'],['✦','الشهادات والاعتمادات','/certificates.html'],['⌘','المهارات والتقنيات','/skills.html'],['▣','التعليم','/education.html'],['★','الإنجازات','/achievements.html']]],
    ['المحتوى والتواصل', [['▧','المقالات والمعرفة','/knowledge.html'],['✉','التواصل','/contact.html']]]
  ];
  const rail = document.createElement('aside');
  rail.className = 'mghal-rail'; rail.dataset.mghalRail = 'true';
  rail.setAttribute('aria-label', en ? 'All website sections' : 'جميع أقسام الموقع');
  const head = document.createElement('div'); head.className = 'mghal-rail-head';
  head.innerHTML = '<a class="mghal-rail-brand" href="'+(en?'/en/':'/')+'">M.GH.AL</a><span>'+(en?'PERSONAL HUB':'المركز المهني')+'</span>';
  const toggle = document.createElement('button'); toggle.className = 'mghal-rail-collapse'; toggle.type = 'button';
  toggle.setAttribute('aria-label', en?'Collapse sidebar':'طي الشريط الجانبي'); toggle.setAttribute('aria-expanded','true'); toggle.textContent = '‹';
  head.append(toggle); rail.append(head);
  const body = document.createElement('div'); body.className='mghal-rail-body';
  for (const [label, links] of groups) {
    const section=document.createElement('section'); section.className='mghal-rail-group';
    const title=document.createElement('h2'); title.textContent=label; section.append(title);
    for (const [symbol,name,href] of links) {
      const a=document.createElement('a'); a.className='mghal-rail-link'; a.href=href;
      const target=href.replace(/\/+$/,'')||'/';
      const active=path===target || (target.endsWith('projects.html') && path.includes('/projects/')) || (target.endsWith('profile.html') && /\/(resume|skills|education|achievements)\.html$/.test(path)) || (target.endsWith('knowledge.html') && /\/(?:en\/)?article\.html$/.test(path));
      if(active){a.classList.add('is-active');a.setAttribute('aria-current','page')}
      const icon=document.createElement('span');icon.className='mghal-rail-icon';icon.setAttribute('aria-hidden','true');icon.textContent=symbol;
      const text=document.createElement('span');text.className='mghal-rail-label';text.textContent=name;
      a.append(icon,text);section.append(a);
    }
    body.append(section);
  }
  rail.append(body);
  const footer=document.createElement('div');footer.className='mghal-rail-foot';
  const locale=document.createElement('a');
  const localizedPath=en?(path==='/en'||path==='/en/'?'/':path.replace(/^\/en(?=\/|$)/,'')||'/'):(path==='/'?'/en/':'/en'+path);
  locale.href=localizedPath+location.search+location.hash;
  locale.textContent=en?'العربية':'English';locale.lang=en?'ar':'en';footer.append(locale);
  const top=document.createElement('a');top.href='#main-content';top.textContent=en?'↑ Back to content':'↑ العودة إلى المحتوى';footer.append(top);rail.append(footer);
  const mobile=document.createElement('button');mobile.className='mghal-rail-mobile';mobile.type='button';mobile.textContent=en?'☰ Sections':'☰ الأقسام';mobile.setAttribute('aria-expanded','false');mobile.setAttribute('aria-controls','mghal-section-rail');
  rail.id='mghal-section-rail'; document.body.append(rail,mobile);
  const overlay=document.createElement('button');overlay.className='mghal-rail-overlay';overlay.type='button';overlay.setAttribute('aria-label',en?'Close sections menu':'إغلاق قائمة الأقسام');document.body.append(overlay);
  const close=()=>{const wasOpen=rail.classList.contains('is-open');rail.classList.remove('is-open');overlay.classList.remove('is-visible');mobile.setAttribute('aria-expanded','false');mobile.setAttribute('aria-label',en?'Open sections menu':'فتح قائمة الأقسام');if(wasOpen)mobile.focus()};
  mobile.addEventListener('click',()=>{const open=!rail.classList.contains('is-open');rail.classList.toggle('is-open',open);overlay.classList.toggle('is-visible',open);mobile.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-label',open?(en?'Close sections menu':'إغلاق قائمة الأقسام'):(en?'Open sections menu':'فتح قائمة الأقسام'));if(open)rail.querySelector('.mghal-rail-link')?.focus()});
  overlay.addEventListener('click',close); rail.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
  toggle.addEventListener('click',()=>{const collapsed=document.body.classList.toggle('mghal-rail-collapsed');toggle.setAttribute('aria-expanded',String(!collapsed));toggle.setAttribute('aria-label',collapsed?(en?'Expand sidebar':'توسيع الشريط الجانبي'):(en?'Collapse sidebar':'طي الشريط الجانبي'));toggle.textContent=collapsed?'›':'‹'});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){close();return}
    if(e.key==='Tab' && rail.classList.contains('is-open')){
      const focusable=[...rail.querySelectorAll('a[href],button:not([disabled])')].filter(el=>el.tabIndex>=0);
      if(!focusable.length)return;
      const first=focusable[0],last=focusable[focusable.length-1];
      if(e.shiftKey && document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey && document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
})();
