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
  const prefix = isEn ? '/en' : '';

  const items = isEn ? [
    ['home', 'Home', '/en/'],
    ['identity', 'Identity', '/en/profile.html'],
    ['resume', 'Résumé', '/en/resume.html'],
    ['projects', 'Projects', '/en/projects.html'],
    ['showcase', 'Showcase', '/en/showcase.html'],
    ['credentials', 'Credentials', '/en/certificates.html'],
    ['skills', 'Skills', '/en/skills.html'],
    ['education', 'Education', '/en/education.html'],
    ['achievements', 'Achievements', '/en/achievements.html'],
    ['knowledge', 'Knowledge', '/en/knowledge.html'],
    ['contact', 'Contact', '/en/contact.html'],
  ] : [
    ['home', 'الرئيسية', '/'],
    ['identity', 'الهوية', '/profile.html'],
    ['resume', 'السيرة الذاتية', '/resume.html'],
    ['projects', 'المشاريع', '/projects.html'],
    ['showcase', 'معرض الأعمال', '/showcase.html'],
    ['credentials', 'الشهادات', '/certificates.html'],
    ['skills', 'المهارات', '/skills.html'],
    ['education', 'التعليم', '/education.html'],
    ['achievements', 'الإنجازات', '/achievements.html'],
    ['knowledge', 'المعرفة', '/knowledge.html'],
    ['contact', 'التواصل', '/contact.html'],
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
  links.classList.remove('links');
  links.classList.add('navlinks', 'mghal-horizontal-links');
  links.id = links.id || 'site-navigation';
  links.dataset.horizontalScroll = 'true';
  links.setAttribute('aria-label', isEn ? 'Primary navigation' : 'التنقل الرئيسي');

  const activeKey = (key) => {
    if (key === 'home') return currentPath === '/';
    if (key === 'projects') return currentPath === '/projects.html' || currentPath.startsWith('/projects/');
    if (key === 'identity') return currentPath === '/profile.html';
    if (key === 'resume') return currentPath === '/resume.html';
    if (key === 'showcase') return currentPath === '/showcase.html';
    if (key === 'credentials') return currentPath === '/certificates.html';
    if (key === 'skills') return currentPath === '/skills.html';
    if (key === 'education') return currentPath === '/education.html';
    if (key === 'achievements') return currentPath === '/achievements.html';
    if (key === 'knowledge') return currentPath === '/knowledge.html' || currentPath === '/article.html';
    if (key === 'contact') return currentPath === '/contact.html';
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
