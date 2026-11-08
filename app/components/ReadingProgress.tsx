'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type ReadingProgressProps = {
  isEn: boolean;
};

export default function ReadingProgress({ isEn }: ReadingProgressProps) {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const next = scrollable > 0
          ? Math.min(100, Math.max(0, Math.round((window.scrollY / scrollable) * 100)))
          : 0;
        setProgress((current) => current === next ? current : next);
      });
    };

    setProgress(0);
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(update);
    observer?.observe(document.documentElement);

    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  return (
    <div
      className="mghal-reading-progress"
      data-reading-progress
      role="progressbar"
      aria-label={isEn ? 'Page scroll progress' : 'مؤشر تقدم التمرير'}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <span style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}
