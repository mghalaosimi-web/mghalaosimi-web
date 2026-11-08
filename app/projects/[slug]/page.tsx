import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import '../../mghal-portfolio.css';
import { projects, type ProjectCategory } from '../../../data/projects';
import { localizedAlternates } from '../../../lib/seo';

const siteUrl = 'https://mghalaosimi-web.vercel.app';

type LocalizedProjectCopy = {
  label: string;
  summary: string;
  status: string;
  contribution: string;
};

const englishCopy: Record<string, LocalizedProjectCopy> = {
  waynah: {
    label: 'Local geographic discovery platform',
    summary: 'A trusted local geographic discovery platform for Yemen, using PostgreSQL and PostGIS with a low-bandwidth-first experience.',
    status: 'In development · v0.12.0',
    contribution: 'A development contribution within the project team. Platform ownership and the complete implementation are not attributed to one individual.',
  },
  'humanity-system': {
    label: 'Enterprise management system',
    summary: 'An enterprise-oriented system for managing organizational data and workflows. Sensitive implementation details remain private.',
    status: 'Private · in development',
    contribution: 'A private project. Public information is limited and does not expose the private repository or internal architecture.',
  },
  focusflow: {
    label: 'Productivity and focus application',
    summary: 'A productivity application for tasks, focus sessions, and daily habits. Documentation and functionality remain in development.',
    status: 'Experimental · incomplete',
    contribution: 'An experimental development project. No unverified features or outcomes are attributed to it.',
  },
  'mghal-content-os': {
    label: 'Content operations system',
    summary: 'A system for managing content planning, review, and supported publishing workflows.',
    status: 'In development',
    contribution: 'Design and development of the system architecture and core components, with development and validation continuing.',
  },
  'manar-schedule-system': {
    label: 'Collaborative academic scheduling system',
    summary: 'A collaborative system for academic scheduling and related workflows.',
    status: 'Collaborative project',
    contribution: 'A team project. Individual contribution scope should be checked against repository history; no sole ownership is claimed.',
  },
  'almanar-schedule-system': {
    label: 'Independent academic scheduling system',
    summary: 'A separate project for academic scheduling at Al-Manar College, distinct from Manar Schedule System.',
    status: 'In development',
    contribution: 'A separate project from Manar Schedule System. Its implementation scope continues to evolve.',
  },
  'yemen-ai': {
    label: 'Bilingual applied AI platform',
    summary: 'A bilingual knowledge platform exploring applied AI and document-based search.',
    status: 'Experimental',
    contribution: 'An experimental prototype. No accuracy, performance, or production-readiness claims are made.',
  },
  ciphersphere: {
    label: 'Educational cryptography lab',
    summary: 'An educational cryptography lab for cipher analysis and data-integrity concepts.',
    status: 'Experimental · educational',
    contribution: 'Educational and experimental work in cryptography concepts; it is not presented as a certified security product.',
  },
  'mghal-esdp': {
    label: 'Private desktop application',
    summary: 'A private desktop application project with no public download.',
    status: 'Private · unpublished',
    contribution: 'A private project. No public source repository or downloadable build is available.',
  },
  'mghal-official-website': {
    label: 'Professional digital identity hub',
    summary: 'The professional digital identity hub for profile, projects, credentials, CV, and professional links.',
    status: 'Active · in development',
    contribution: 'Design and development of the professional digital identity hub and its shared components.',
  },
};

const categoryLabels: Record<ProjectCategory, { ar: string; en: string }> = {
  software: { ar: 'هندسة البرمجيات', en: 'Software engineering' },
  academic: { ar: 'الأنظمة الأكاديمية', en: 'Academic systems' },
  'cyber-defense': { ar: 'الأمن والتشفير', en: 'Security & cryptography' },
};

const liveUrls: Record<string, string> = {
  waynah: 'https://waynah.vercel.app',
};

type Props = { params: Promise<{ slug: string }> };

function findProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return { title: 'Project not found', robots: { index: false, follow: false } };

  const isEn = (await cookies()).get('portfolio-locale')?.value === 'en';
  const copy = englishCopy[slug];
  const title = isEn ? copy.label + ' · ' + project.name : project.name;
  const description = isEn ? copy.summary : project.summary;

  return {
    title,
    description,
    alternates: localizedAlternates(`/projects/${slug}`, isEn ? 'en' : 'ar'),
    openGraph: {
      type: 'article',
      title,
      description,
      url: `${siteUrl}/projects/${slug}`,
    },
  };
}

export default async function ProjectDetail({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();

  const isEn = (await cookies()).get('portfolio-locale')?.value === 'en';
  const copy = isEn ? englishCopy[slug] : undefined;
  const label = copy?.label ?? project.label;
  const summary = copy?.summary ?? project.summary;
  const status = copy?.status ?? project.status;
  const contribution = copy?.contribution ?? project.contribution;
  const category = categoryLabels[project.category][isEn ? 'en' : 'ar'];
  const liveUrl = liveUrls[slug];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.name,
    description: summary,
    url: `${siteUrl}/projects/${project.slug}`,
    inLanguage: isEn ? 'en' : 'ar',
    keywords: project.stack,
    ...(project.repository ? { sameAs: project.repository } : {}),
  };

  return (
    <main className="mghal-archive mghal-case-study" id="main" dir={isEn ? 'ltr' : 'rtl'}>
      <nav className="mghal-case-breadcrumb" aria-label={isEn ? 'Breadcrumb' : 'مسار التنقل'}>
        <Link href="/projects">{isEn ? '← All projects' : 'جميع المشاريع ←'}</Link>
      </nav>

      <section className="mghal-archive-hero mghal-case-hero" aria-labelledby="case-study-title">
        <span className="mghal-eyebrow">M.GH.AL / PROJECT CASE STUDY</span>
        <p className="mghal-case-category">{category} · {label}</p>
        <h1 id="case-study-title">{project.name}</h1>
        <p>{summary}</p>
        <div className="mghal-case-meta">
          <span className="mghal-status">{status}</span>
          <span className="mghal-case-slug">{project.slug}</span>
        </div>
      </section>

      <div className="mghal-case-grid">
        <section className="mghal-card mghal-case-section" aria-labelledby="case-contribution-title">
          <span className="mghal-eyebrow">01 / CONTRIBUTION</span>
          <h2 id="case-contribution-title">{isEn ? 'Contribution & attribution' : 'المساهمة وحدود النسبة'}</h2>
          <p>{contribution}</p>
        </section>

        <section className="mghal-card mghal-case-section" aria-labelledby="case-stack-title">
          <span className="mghal-eyebrow">02 / TECHNOLOGY</span>
          <h2 id="case-stack-title">{isEn ? 'Technology stack' : 'التقنيات المستخدمة'}</h2>
          <div className="mghal-tags mghal-case-tags">
            {project.stack.map((technology) => <span key={technology}>{technology}</span>)}
          </div>
        </section>

        <section className="mghal-card mghal-case-section" aria-labelledby="case-references-title">
          <span className="mghal-eyebrow">03 / PUBLIC REFERENCES</span>
          <h2 id="case-references-title">{isEn ? 'Public references' : 'المراجع والروابط العامة'}</h2>
          <p>{isEn
            ? 'Only publicly linked sources are shown. Private repositories and unpublished downloads are not exposed.'
            : 'نعرض الروابط العامة المتاحة فقط، ولا نكشف المستودعات الخاصة أو ملفات المشاريع غير المنشورة.'}</p>
          <div className="mghal-case-actions">
            {project.repository && (
              <a href={project.repository} target="_blank" rel="noopener noreferrer">
                {isEn ? 'GitHub repository' : 'مستودع GitHub'} ↗
              </a>
            )}
            {liveUrl && (
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                {isEn ? 'Project website' : 'موقع المشروع'} ↗
              </a>
            )}
            {!project.repository && !liveUrl && (
              <span className="mghal-case-no-link">
                {isEn ? 'No public repository or deployment link is available.' : 'لا يتوفر رابط عام لمستودع أو نشر هذا المشروع.'}
              </span>
            )}
          </div>
        </section>

        <section className="mghal-card mghal-case-section mghal-case-note" aria-labelledby="case-scope-title">
          <span className="mghal-eyebrow">04 / SCOPE NOTE</span>
          <h2 id="case-scope-title">{isEn ? 'Scope & verification' : 'النطاق والتحقق'}</h2>
          <p>{isEn
            ? 'This page reflects the available project record. It does not claim unverified implementation details, test results, individual ownership, or production readiness.'
            : 'تعكس هذه الصفحة سجل المشروع المتاح، ولا تدّعي تفاصيل تنفيذ أو نتائج اختبار أو ملكية فردية أو جاهزية إنتاجية غير موثقة.'}</p>
        </section>
      </div>

      <p className="mghal-case-back">
        <Link href="/projects">{isEn ? '← Back to all projects' : '← العودة إلى جميع المشاريع'}</Link>
      </p>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
    </main>
  );
}
