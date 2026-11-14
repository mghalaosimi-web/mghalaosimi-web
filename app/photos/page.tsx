import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { localizedAlternates } from '../../lib/seo';

const site = 'https://mghalaosimi-web.vercel.app';

const photos = [
  {
    src: '/profile-gallery/mghal-eid-portrait-2026.png',
    alt: 'صورة شخصية لمحمد غالب العصيمي في مناسبة اجتماعية',
    altEn: 'Mohammed Ghaleb Alaosimi at a social occasion',
  },
  {
    src: '/profile-gallery/mghal-cultural-portrait-2026.png',
    alt: 'صورة شخصية لمحمد غالب العصيمي ضمن جلسة تصوير بطابع تراثي',
    altEn: 'Mohammed Ghaleb Alaosimi in a heritage-inspired portrait session',
  },
  {
    src: '/profile-gallery/mghal-with-companion-2026.jpg',
    alt: 'صورة لمحمد غالب العصيمي برفقة شخص آخر في مناسبة',
    altEn: 'Mohammed Ghaleb Alaosimi with another person at an occasion',
  },
  {
    src: '/profile-gallery/mghal-professional-poster-01.png',
    alt: 'تصميم تعريفي بصري لهوية M.GH.AL وصورة محمد غالب العصيمي',
    altEn: 'M.GH.AL identity poster featuring Mohammed Ghaleb Alaosimi',
  },
  {
    src: '/profile-gallery/mghal-professional-poster-02.png',
    alt: 'تصميم بصري إضافي ضمن أرشيف هوية M.GH.AL',
    altEn: 'Additional visual design from the M.GH.AL identity archive',
  },
  {
    src: '/profile-gallery/mghal-brand-visual-01.png',
    alt: 'تصميم تعريفي بصري لهوية M.GH.AL',
    altEn: 'M.GH.AL brand identity visual',
  },
  {
    src: '/profile-gallery/mghal-brand-portrait-visual.png',
    alt: 'صورة بورتريه فنية لهوية M.GH.AL',
    altEn: 'Artistic portrait visual for the M.GH.AL identity',
  },
  {
    src: '/profile-gallery/mghal-brand-visual-02.png',
    alt: 'تصميم بصري إضافي لهوية M.GH.AL',
    altEn: 'Additional M.GH.AL brand visual',
  },
  {
    src: '/profile-gallery/mghal-reading-portrait-2026.jpg',
    alt: 'محمد غالب العصيمي أثناء القراءة',
    altEn: 'Mohammed Ghaleb Alaosimi reading',
  },
  {
    src: '/profile-gallery/mghal-photo-2026-07-22.jpg',
    alt: 'صورة شخصية من أرشيف يوليو 2026',
    altEn: 'Portrait from the July 2026 archive',
  },
  {
    src: '/profile-gallery/mghal-photo-2026-07-28-a.jpg',
    alt: 'صورة شخصية من أرشيف يوليو 2026',
    altEn: 'Portrait from the July 2026 archive',
  },
  {
    src: '/profile-gallery/mghal-photo-2026-07-28-b.jpg',
    alt: 'صورة شخصية من أرشيف يوليو 2026',
    altEn: 'Portrait from the July 2026 archive',
  },
] as const;

export async function generateMetadata(): Promise<Metadata> {
  const isEn = (await cookies()).get('portfolio-locale')?.value === 'en';
  const title = isEn
    ? 'Photo Gallery | Mohammed Ghaleb Alaosimi | M.GH.AL'
    : 'معرض صور محمد غالب العصيمي | M.GH.AL';
  const description = isEn
    ? 'Portrait photographs and visual identity designs published in the official M.GH.AL profile archive.'
    : 'معرض الصور الشخصية والتصاميم التعريفية المنشورة ضمن الهوية الرقمية الرسمية لمحمد غالب العصيمي M.GH.AL.';
  const url = site + (isEn ? '/en/photos' : '/photos');

  return {
    title,
    description,
    alternates: localizedAlternates('/photos', isEn ? 'en' : 'ar'),
    openGraph: {
      type: 'website',
      title,
      description,
      url,
      images: [
        {
          url: site + '/assets/images/mghal-profile-primary.jpg',
          alt: isEn ? 'Mohammed Ghaleb Alaosimi — M.GH.AL' : 'محمد غالب العصيمي — M.GH.AL',
        },
      ],
    },
  };
}

export default async function PhotosPage() {
  const isEn = (await cookies()).get('portfolio-locale')?.value === 'en';
  const title = isEn ? 'Mohammed Ghaleb Alaosimi Photo Gallery' : 'معرض صور محمد غالب العصيمي';
  const description = isEn
    ? 'A curated archive of personal photographs and visual identity designs associated with the M.GH.AL professional identity. Photographs and designed compositions are presented as separate kinds of media.'
    : 'أرشيف الصور الشخصية والتصاميم التعريفية المرتبطة بالهوية الرقمية المهنية M.GH.AL. تُعرض الصور كما رُفعت إلى مكتبة الهوية، مع تمييز الصور الفوتوغرافية عن التصاميم البصرية.';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    url: site + (isEn ? '/en/photos' : '/photos'),
    inLanguage: isEn ? 'en' : 'ar',
    about: {
      '@type': 'Person',
      name: 'Mohammed Ghaleb Alaosimi',
      alternateName: ['محمد غالب العصيمي', 'محمد غالب ناصر العصيمي', 'M.GH.AL'],
      url: site,
    },
    image: photos.map((photo) => site + photo.src),
  };

  return (
    <main
      dir={isEn ? 'ltr' : 'rtl'}
      lang={isEn ? 'en' : 'ar'}
      style={{
        maxWidth: 1120,
        margin: '0 auto',
        padding: 'clamp(20px, 5vw, 56px) 18px',
        color: 'var(--foreground, #172b4d)',
      }}
    >
      <header style={{ marginBottom: 28 }}>
        <p
          style={{
            letterSpacing: '.12em',
            fontSize: 12,
            fontWeight: 700,
            color: '#b69a62',
          }}
        >
          M.GH.AL · OFFICIAL IMAGE ARCHIVE
        </p>
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            lineHeight: 1.3,
            margin: '8px 0',
          }}
        >
          {title}
        </h1>
        <p style={{ maxWidth: 760, lineHeight: 1.9, opacity: 0.8 }}>
          {description}
        </p>
        <Link
          href={isEn ? '/en' : '/'}
          style={{ display: 'inline-block', marginTop: 8, color: '#315a85' }}
        >
          {isEn ? '← Back to home' : 'العودة إلى الصفحة الرئيسية ←'}
        </Link>
      </header>

      <section
        aria-label={isEn ? 'Photo gallery' : 'معرض الصور'}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))',
          gap: 18,
        }}
      >
        {photos.map((photo, index) => {
          const alt = isEn ? photo.altEn : photo.alt;
          return (
            <figure
              key={photo.src}
              style={{
                margin: 0,
                border: '1px solid rgba(49, 90, 133, .18)',
                borderRadius: 16,
                overflow: 'hidden',
                background: 'rgba(127, 127, 127, .04)',
              }}
            >
              <a
                href={photo.src}
                target="_blank"
                rel="noreferrer"
                aria-label={isEn ? \`Open image \${index + 1}\` : \`فتح الصورة \${index + 1}\`}
                style={{
                  display: 'block',
                  position: 'relative',
                  aspectRatio: '4 / 5',
                }}
              >
                <Image
                  src={photo.src}
                  alt={alt}
                  fill
                  sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw"
                  priority={index === 0}
                  style={{ objectFit: 'contain' }}
                />
              </a>
              <figcaption
                style={{
                  padding: '12px 14px',
                  fontSize: 14,
                  lineHeight: 1.8,
                }}
              >
                {alt}
              </figcaption>
            </figure>
          );
        })}
      </section>

      <p style={{ marginTop: 28, fontSize: 12, lineHeight: 1.8, opacity: 0.65 }}>
        {isEn
          ? 'Some items in this archive are designed or composite visuals rather than original photographs. Image rights remain with their respective owners.'
          : 'بعض عناصر هذا الأرشيف تصاميم تعريفية أو صور مركّبة، وليست كلها صورًا فوتوغرافية أصلية. حقوق الصور لأصحابها.'}
      </p>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
    </main>
  );
}
