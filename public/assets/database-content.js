(() => {
  'use strict';

  const API = '';
  const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');
  const locale = isEnglish ? 'en' : 'ar';
  const statusLabels = isEnglish
    ? { Completed: 'Completed', 'In Progress': 'In progress', Experimental: 'Experimental', Incomplete: 'Incomplete', Paused: 'Paused', Planned: 'Planned', Archived: 'Archived' }
    : { Completed: 'مكتمل', 'In Progress': 'قيد التطوير', Experimental: 'تجريبي', Incomplete: 'غير مكتمل', Paused: 'متوقف مؤقتاً', Planned: 'مخطط له', Archived: 'مؤرشف' };

  const safeExternalUrl = (value) => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value);
      return url.protocol === 'https:' ? url.href : null;
    } catch {
      return null;
    }
  };

  const setText = (node, value) => {
    if (node && value !== null && value !== undefined && String(value).trim()) {
      node.textContent = String(value);
    }
  };

  const detailSlug = (card) => {
    if (card.dataset.projectSlug) return card.dataset.projectSlug;
    const link = card.querySelector('.project-detail-link');
    if (!link) return null;
    const parts = new URL(link.getAttribute('href'), location.origin).pathname.split('/').filter(Boolean);
    const index = parts.indexOf('projects');
    return index >= 0 ? parts[index + 1] || null : null;
  };

  const imageFor = (slug) => ({
    waynah: 'waynah',
    'yemen-ai': 'yemen-ai',
    'mghal-content-os': 'content-os',
    'manar-schedule-system': 'schedule',
    'almanar-schedule-system': 'schedule',
    ciphersphere: 'ciphersphere',
    focusflow: 'focusflow',
    'mghal-official-website': 'mghal-official-website',
  }[slug] || null);

  const makeProjectCard = (project, staticRecord) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.projectSlug = project.slug;

    const image = document.createElement('img');
    image.className = 'project-cover';
    image.loading = 'lazy';
    image.src = project.cover_media_id
      ? API + '/api/public/media/' + encodeURIComponent(project.cover_media_id)
      : staticRecord?.cover || '/assets/og-image.svg';
    image.alt = staticRecord?.coverAlt?.[locale] || (isEnglish ? 'Project cover: ' : 'غلاف المشروع: ') + (project.name || project.slug);

    const heading = document.createElement('h2');
    heading.textContent = project.name || staticRecord?.title?.[locale] || project.slug;
    const summary = document.createElement('p');
    summary.textContent = project.short_description || staticRecord?.summary?.[locale] || '';

    const meta = document.createElement('div');
    meta.className = 'meta';
    const technologies = Array.isArray(project.technologies)
      ? project.technologies
      : Array.isArray(staticRecord?.technologies) ? staticRecord.technologies : [];
    for (const technology of technologies) {
      const label = typeof technology === 'string' ? technology : technology?.name;
      if (!label) continue;
      const tag = document.createElement('span');
      tag.className = 'tag';
      tag.textContent = label;
      meta.append(tag);
    }

    const status = document.createElement('div');
    status.className = 'status';
    status.textContent = statusLabels[project.status] || project.status || '';
    card.append(image, heading, summary, meta, status);
    return card;
  };

  async function syncProjects() {
    const grid = document.querySelector('main .grid');
    if (!grid || !location.pathname.includes('projects.html')) return;

    const response = await fetch(API + '/api/public/projects?locale=' + locale, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!response.ok) throw new Error('Projects API returned ' + response.status);
    const payload = await response.json();
    if (!Array.isArray(payload.data) || payload.data.length === 0) return;

    const staticCatalogue = await fetch('/assets/projects/catalog.json', { cache: 'no-cache' })
      .then((result) => result.ok ? result.json() : null)
      .catch(() => null);

    let cards = [...grid.querySelectorAll('.card')];
    for (let attempt = 0; attempt < 25 && !cards.some((card) => card.querySelector('.project-detail-link')); attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 80));
      cards = [...grid.querySelectorAll('.card')];
    }

    const cardsBySlug = new Map(cards.map((card) => [detailSlug(card), card]).filter(([slug]) => slug));
    const publishedSlugs = new Set();

    for (const project of payload.data) {
      if (!project || typeof project.slug !== 'string') continue;
      const staticRecord = staticCatalogue?.projects?.find((item) => item.slug === project.slug) || null;
      let card = cardsBySlug.get(project.slug);
      if (!card) {
        card = makeProjectCard(project, staticRecord);
        grid.append(card);
        cards.push(card);
        cardsBySlug.set(project.slug, card);
      }

      publishedSlugs.add(project.slug);
      card.hidden = false;
      card.dataset.projectSlug = project.slug;

      // Published API values take precedence; original catalogue values remain a safe fallback.
      const title = project.name || staticRecord?.title?.[locale] || card.querySelector('h2,h3')?.textContent || '';
      const summary = project.short_description || staticRecord?.summary?.[locale] || '';
      const repository = safeExternalUrl(project.repository_url) || safeExternalUrl(staticRecord?.repository);
      const liveUrl = safeExternalUrl(project.live_url);

      setText(card.querySelector('h2,h3'), title);
      setText(card.querySelector(':scope > p'), summary);
      setText(card.querySelector('.status'), statusLabels[project.status] || project.status || '');

      const detail = card.querySelector('.project-detail-link');
      if (detail) {
        detail.href = (isEnglish ? '/en' : '') + '/projects/' + encodeURIComponent(project.slug) + '/';
        detail.setAttribute('aria-label', (isEnglish ? 'Project details: ' : 'تفاصيل المشروع: ') + title);
      }

      const repositoryLinks = [...card.querySelectorAll('a[href*="github.com"]')];
      if (repository) {
        if (repositoryLinks[0]) {
          repositoryLinks[0].href = repository;
        } else {
          const link = document.createElement('a');
          link.className = 'muted';
          link.href = repository;
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.textContent = isEnglish ? 'Repository ↗' : 'المستودع ↗';
          card.append(link);
        }
        for (const extra of repositoryLinks.slice(1)) extra.remove();
      }

      if (liveUrl) {
        let liveLink = card.querySelector('.project-live-link');
        if (!liveLink) {
          liveLink = document.createElement('a');
          liveLink.className = 'muted project-live-link';
          liveLink.target = '_blank';
          liveLink.rel = 'noopener noreferrer';
          card.append(liveLink);
        }
        liveLink.href = liveUrl;
        liveLink.textContent = isEnglish ? 'Live project ↗' : 'المشروع المباشر ↗';
      }

      const image = card.querySelector('img');
      if (image) {
        image.src = project.cover_media_id
          ? API + '/api/public/media/' + encodeURIComponent(project.cover_media_id)
          : staticRecord?.cover || (imageFor(project.slug) ? '/assets/projects/' + imageFor(project.slug) + '.svg' : '/assets/og-image.svg');
        image.alt = staticRecord?.coverAlt?.[locale]
          || staticRecord?.gallery?.[0]?.alt?.[locale]
          || (isEnglish ? 'Project cover: ' : 'غلاف المشروع: ') + title;
      }

      card.dataset.search = [title, summary, ...[...card.querySelectorAll('.tag')].map((tag) => tag.textContent || '')]
        .join(' ')
        .toLocaleLowerCase();
    }

    // A successful public response is authoritative for visibility: unpublished records stay hidden.
    for (const card of cards) {
      const slug = detailSlug(card);
      if (slug && !publishedSlugs.has(slug)) card.hidden = true;
    }

    document.querySelector('#project-search')?.dispatchEvent(new Event('input'));
  }

  syncProjects().catch((error) => {
    // Static project cards and their original links remain intact during API outages.
    console.warn('Project API sync skipped; static catalogue retained.', error);
  });
})();
