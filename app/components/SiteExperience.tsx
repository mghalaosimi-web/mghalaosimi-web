'use client';

import { useEffect } from 'react';

export default function SiteExperience() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator) || window.location.protocol !== 'https:') return;

    void navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;

    const updateProgress = () => {
      frame = 0;
      const scrollableHeight = Math.max(0, root.scrollHeight - window.innerHeight);
      const progress = scrollableHeight > 0
        ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
        : 0;
      root.style.setProperty('--mghal-reading-progress', String(progress));
    };

    const scheduleUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateProgress);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(scheduleUpdate);
    observer?.observe(document.body);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      observer?.disconnect();
      root.style.removeProperty('--mghal-reading-progress');
    };
  }, []);

  return <div className="mghal-reading-progress" aria-hidden="true" />;
}
