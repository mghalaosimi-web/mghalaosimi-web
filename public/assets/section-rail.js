/* M.GH.AL legacy-route navigation adapter.
   The public HTML routes use the same sticky horizontal rail contract as the Next.js shell. */
;(() => {
  if (document.documentElement.dataset.mghalHorizontalNav === 'true') return;

  if (!document.querySelector('link[data-mghal-rail-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/assets/section-rail.css';
    style.dataset.mghalRailStyle = 'true';
    document.head.appendChild(style);
  }

  const isEn = document.documentElement.lang.toLowerCase().startsWith('en');
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const currentPath = isEn ? (path.replace(/^\/en(?=\/|$)/, '') || '/') : path;

  const items = isEn ? [
    ['home', 'Home', '/en/'],
    ['identity', 'Identity', '/en/profile'],
    ['resume', 'Résumé', '/en/resume'],
    ['projects', 'Projects', '/en/projects'],
    ['showcase', 'Showcase', '/en/showcase'],
    ['credentials', 'Credentials', '/en/certificates'],
    ['skills', 'Skills', '/en/skills'],
    ['education', 'Education', '/en/education'],
    ['achievements', 'Achievements', '/en/achievements'],
    ['knowledge', 'Knowledge', '/en/knowledge'],
    ['contact', 'Contact', '/en/contact'],
  ] : [
    ['home', 'الرئيسية', '/'],
    ['identity', 'الهوية', '/profile'],
    ['resume', 'السيرة الذاتية', '/resume'],
    ['projects', 'المشاريع', '/projects'],
    ['showcase', 'معرض الأعمال', '/showcase'],
    ['credentials', 'الشهادات', '/certificates'],
    ['skills', 'المهارات', '/skills'],
    ['education', 'التعليم', '/education'],
    ['achievements', 'الإنجازات', '/achievements'],
    ['knowledge', 'المعرفة', '/knowledge'],
    ['contact', 'التواصل', '/contact'],
  ];

  const nav = document.querySelector('.nav');
  if (!nav) return;
  let links = nav.querySelector('.navlinks, .links, .cert-nav-links');
  if (!links) {
    links = document.createElement('nav');
    links.className = 'navlinks';
    nav.insertBefore(links, nav.querySelector('.site-controls, .nav-resume'));
  }

  links.replaceChildren();
  nav.querySelector(".nav-resume")?.remove();
  nav.querySelectorAll(':scope > a').forEach((anchor) => {
    if (anchor.classList.contains('brand')) return;
    const href = new URL(anchor.href, location.origin).pathname;
    if (href === '/en' || href.startsWith('/en/') || href.startsWith('/language/')) anchor.remove();
  });
  links.classList.remove('links');
  links.classList.add('navlinks', 'mghal-horizontal-links');
  links.id = links.id || 'site-navigation';
  links.dataset.horizontalScroll = 'true';
  links.setAttribute('aria-label', isEn ? 'Primary navigation' : 'التنقل الرئيسي');

  const activeKey = (key) => {
    if (key === 'home') return currentPath === '/';
    if (key === 'projects') return currentPath === '/projects' || currentPath.startsWith('/projects/');
    if (key === 'identity') return currentPath === '/profile';
    if (key === 'resume') return currentPath === '/resume';
    if (key === 'showcase') return currentPath === '/showcase';
    if (key === 'credentials') return currentPath === '/certificates';
    if (key === 'skills') return currentPath === '/skills';
    if (key === 'education') return currentPath === '/education';
    if (key === 'achievements') return currentPath === '/achievements';
    if (key === 'knowledge') return currentPath === '/knowledge' || currentPath === '/article';
    if (key === 'contact') return currentPath === '/contact';
    return false;
  };

  let activeLink = null;
  for (const [key, label, href] of items) {
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.dataset.navKey = key;
    if (activeKey(key)) {
      link.setAttribute('aria-current', 'page');
      activeLink = link;
    }
    links.appendChild(link);
  }

  const localizedPath = isEn
    ? (path === '/en' || path === '/en/' ? '/' : path.replace(/^\/en(?=\/|$)/, '') || '/')
    : (path === '/' ? '/en/' : '/en' + path);
  const locale = document.createElement('a');
  locale.href = localizedPath + location.search + location.hash;
  locale.lang = isEn ? 'ar' : 'en';
  locale.textContent = isEn ? 'العربية' : 'English';
  locale.className = 'mghal-nav-locale';
  links.appendChild(locale);

  const menu = nav.querySelector('.site-menu-button');
  if (menu) menu.remove();
  document.body.classList.remove('nav-open');
  document.documentElement.dataset.mghalHorizontalNav = 'true';

  if (activeLink) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => activeLink.scrollIntoView({
      block: 'nearest',
      inline: 'center',
      behavior: reducedMotion ? 'auto' : 'smooth',
    }));
  }
})();
