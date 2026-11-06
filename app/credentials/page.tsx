import type {Metadata} from 'next';
import { cookies } from 'next/headers';
import CredentialsPageEnglish from './CredentialsPageEnglish';
import {localizedAlternates} from '../../lib/seo';
import Script from 'next/script';
import CertificatePreview from './CertificatePreview';
import {credentialsJsonLd} from '../../lib/structured-data';

export async function generateMetadata(): Promise<Metadata> {
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return en
    ? { title: 'Digital Credentials | Mohammed Ghaleb Alaosimi', description: 'Verified Cisco and Credly credentials, digital badges, acquired skills, and verification links.', alternates: localizedAlternates('/credentials','en') }
    : { title: 'الشهادات والشارات الرقمية', description: 'سجل الشهادات الأصلية والشارات الرقمية المعتمدة من Cisco وCredly، مع المهارات وروابط التحقق.', alternates: localizedAlternates('/credentials','ar') };
}

const credentials=[
  {name:'Cybersecurity Defense Analyst Career Path',date:'29 يوليو 2026',issuer:'Cisco بالتعاون مع Splunk',id:'23bda189-2470-4ce0-8065-ee904979ba21',skills:['Cybersecurity','Cybersecurity Standards','Security','Splunk','Threat Detection','Analyst','Big Data Analysis','Cyber Kill Chain Framework','Cyber Risk','Cyber Safety','Cybersecurity Systems','Monitoring','SOC','Threat-Hunting'],file:'CybersecurityDefenseAnalystCareerPathv120261103-20-1nonu3.pdf',description:'مسار مهني يركز على فهم مشهد التهديدات السيبرانية والعمل داخل مركز العمليات الأمنية SOC، واستخدام تقنيات Splunk للمراقبة والتحقيق والبحث عن التهديدات والاستجابة للحوادث.'},
  {name:'Network Defense',date:'27 يوليو 2026',issuer:'Cisco',id:'e16ca722-84d2-4da2-ad1f-46e972453890',skills:['Application Security','Cloud Security','Firewalls','Physical Security','Public Key Cryptography','Access Controls','Defense-in-Depth','End Device Logs','Evaluating Alerts','Hashing','Integrity And Authenticity','Network Hardening','Network Logs','Security Policies - Regulations - Standards','System And Network Defense'],file:'NetworkDefenseUpdate20261103-20-xyacmt.pdf',description:'مفاهيم وتقنيات مراقبة الشبكات وحمايتها، بما في ذلك التحكم بالوصول والجدران النارية وأمن السحابة والتشفير وتقييم التنبيهات الأمنية والاستجابة لها.'},
  {name:'Networking Basics',date:'27 يوليو 2026',issuer:'Cisco',id:'2f9902ec-e035-4b56-bf1b-42c66f05ed75',skills:['Application Layer Services','IPv4 Addresses','Network Media','Network Types','Protocols Standards','Wireless Access'],file:'NetworkingBasicsUpdate20261103-20-u7bz38.pdf',description:'أساسيات أنواع الشبكات وآلية عملها، وتبادل البيانات بين الأجهزة، ووسائط الاتصال وعناوين IP والبروتوكولات وخدمات التطبيقات والشبكات اللاسلكية.'},
  {name:'Python Essentials 2',date:'27 يوليو 2026',issuer:'Cisco بالتعاون مع OpenEDG',id:'de9c51d6-2eb6-4f7e-833a-31670170e278',skills:['Iterators','Python','Classes','Exceptions','Generators','Inheritance','Methods','Modules','Object Oriented Programming','Objects','Packages','PIP','Polymorphism','Properties'],file:'PythonEssentials2Update20261103-20-7rc84e.pdf',description:'موضوعات متقدمة في Python تشمل البرمجة كائنية التوجه، والفئات والكائنات والوراثة والاستثناءات والمولدات والمكررات والوحدات والحزم.'},
  {name:'Python Essentials 1',date:'25 يوليو 2026',issuer:'Cisco بالتعاون مع OpenEDG',id:'43943e68-05c5-40ea-93d1-d2a26e07ced0',skills:['Computer Programming','Python','Algorithmic Thinking','Analytical Thinking','Basic Python Programming','Best Practices in Programming','Design, Develop, and Debug Scripts','Entry-level','Procedural Programming'],file:'PythonEssentials1Update20261103-20-qqgzmk.pdf',description:'مدخل إلى البرمجة باستخدام Python، والتفكير الخوارزمي والتحليلي، وكتابة البرامج النصية وتطويرها وتصحيحها وفق ممارسات البرمجة الأساسية.'},
  {name:'Introduction to Modern AI',date:'23 يوليو 2026',issuer:'Cisco',id:'4e822fcc-656e-4891-bc51-666ca95cd6e8',skills:['Chatbots','Computer Vision','AI Learning','Machine Learning','Machine Translation','Prompting Tips'],file:'IntrotoModernAIUpdate20261103-20-kom6qi.pdf',description:'مقدمة إلى مفاهيم الذكاء الاصطناعي الحديث وتطبيقاته، بما في ذلك روبوتات المحادثة والرؤية الحاسوبية والتعلم الآلي والترجمة الآلية ومهارات كتابة المطالبات.'},
  {name:'Endpoint Security',date:'3 يونيو 2026',issuer:'Cisco',id:'f0520c01-63aa-4440-9df4-69c7303d8762',skills:['Application Security','Antimalware Protection','Common Cyber Threats','Defending Systems And Devices','Host-based Intrusion Prevention','IP/TCP/UDP Vulnerabilities','Linux Basics','Mitigating Common Network Attacks','Network Security Infrastructure','Securing WLANs','System And Endpoint Protection','Windows Security','Wireless And Mobile Device Attacks'],file:'EndpointSecurityUpdate20261103-20-6t8kl6.pdf',description:'أساسيات أمن الشبكات وأنظمة التشغيل وحماية الأجهزة الطرفية، والتعرف على التهديدات الشائعة وطرق الدفاع عن الأنظمة والأجهزة وتقليل مخاطر الهجمات.'},
  {name:'Create Digital Content, Communicate and Collaborate Online',date:'27 مايو 2026',issuer:'Cisco بالتعاون مع OpenEDG',id:'a370a36f-7ce1-4531-b44b-b909e56ee52d',skills:['Digital Accessibility','Digital Collaboration','Digital Communication','Digital Document Creation','Digital Etiquette','File Management and Backup','Hybrid Working Tools','Remote Work Skills'],file:'CreateDigitalContentUpdate20261103-20-jw76h8.pdf',description:'مهارات إنشاء المحتوى الرقمي والتواصل والتعاون عبر الإنترنت، وإتاحة المحتوى وإدارة الملفات والنسخ الاحتياطي وأدوات العمل عن بُعد.'},
  {name:'Introduction to Cybersecurity',date:'18 مايو 2026',issuer:'Cisco',id:'dd68b74c-65f9-468f-9a51-3bb78adad239',skills:['Cybersecurity','Threat Detection','Cyber Best Practices','Network Vulnerabilities','Privacy And Data Confidentiality'],file:'I2CSUpdate20261103-20-mm0e2z.pdf',description:'مفاهيم تمهيدية في الأمن السيبراني، وتأثير التهديدات على القطاعات المختلفة، والثغرات واكتشاف التهديدات والدفاع عنها، وأهمية الخصوصية وسرية البيانات.'}
];

const pdfBase='https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web-portfolio/public-certificates-upload/public/certificates/';
const previewFiles=[
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A6%D9%A5%D9%A3_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A4%D9%A3%D9%A2_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A7%D9%A4%D9%A6_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A5%D9%A2%D9%A6_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A5%D9%A1%D9%A4_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A7%D9%A2%D9%A7_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A7%D9%A1%D9%A2_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A6%D9%A3%D9%A1_(1).png',
  '/certificates/previews/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A0%D9%A4-%D9%A0%D9%A2%D9%A4%D9%A9%D9%A0%D9%A9_(1).png'
];
const credlyBase='https://www.credly.com/badges/';

function CiscoMark(){
  return <div className="cisco-brand-mark" aria-label="Cisco">
    <svg viewBox="0 0 150 78" role="img" aria-hidden="true">
      <g fill="currentColor">
        <rect x="12" y="14" width="5" height="18" rx="2"/><rect x="27" y="5" width="5" height="27" rx="2"/>
        <rect x="42" y="18" width="5" height="14" rx="2"/><rect x="57" y="1" width="5" height="31" rx="2"/>
        <rect x="72" y="12" width="5" height="20" rx="2"/><rect x="87" y="1" width="5" height="31" rx="2"/>
        <rect x="102" y="18" width="5" height="14" rx="2"/><rect x="117" y="5" width="5" height="27" rx="2"/>
        <rect x="132" y="14" width="5" height="18" rx="2"/>
      </g>
      <text x="75" y="67" textAnchor="middle" fill="currentColor" fontSize="25" fontWeight="800" letterSpacing="4">CISCO</text>
    </svg>
  </div>;
}

function CredentialsPageArabic(){
  return <main className="content-page credentials-page">
    <Script src="https://cdn.credly.com/assets/utilities/embed.js" strategy="lazyOnload" />
    <header className="credentials-hero">
      <div className="credentials-brand"><CiscoMark/><span></span></div>
      <div className="credentials-hero-copy">
        <span className="eyebrow">VERIFIED PROFESSIONAL CREDENTIALS</span>
        <h1>الشهادات والشارات الرقمية</h1>
        <p>سجل الإنجازات التعليمية والمهارات المكتسبة من برامج Cisco، مع شارات Credly الرقمية ووثائق الشهادات الأصلية.</p>
      </div>
      <div className="credentials-verified"><span>✓</span> شهادات موثقة</div>
    </header>
    <section className="credentials-section" aria-labelledby="cisco-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">CISCO NETWORKING ACADEMY · CREDLY</span><h2 id="cisco-credentials-title">الشهادات والشارات المهنية</h2></div>
        <span className="credentials-count">09 CREDENTIALS</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {credentials.map((credential,i)=>{
          const pdf=pdfBase+credential.file;
          const verify=credlyBase+credential.id+'/public_url';
          return <article className="credential-showcase credential-wallet" key={credential.id}>
            <div className="credential-showcase-head credential-wallet-head">
              <div className="credential-title-block">
                <span className="credential-index">CREDENTIAL / {String(i+1).padStart(2,'0')}</span>
                <h3>{credential.name}</h3>
                <p>Verified digital credential · {credential.date}</p>
              </div>
              <span className="credential-status"><i>✓</i> اعتماد موثق</span>
            </div>
            <div className="credential-wallet-grid credential-wallet-grid-v3">
              <section className="credential-wallet-document" aria-label={'وثيقة '+credential.name}>
                <div className="wallet-document-heading"><span>OFFICIAL CERTIFICATE</span><span>ORIGINAL DOCUMENT · PDF</span></div>
                <div className="certificate-document-preview"><CertificatePreview file={pdf} image={previewFiles[i]} title={credential.name} /></div>
                <div className="certificate-actions">
                  <a href={pdf} target="_blank" rel="noopener noreferrer" download>تنزيل نسخة PDF ↓</a>
                  <a href={verify} target="_blank" rel="noopener noreferrer">عرض الشهادة ↗</a>
                </div>
              </section>
              <div className="wallet-detail-row">
                <aside className="wallet-issuer-column">
                  <div className="wallet-panel-heading"><span>01 / ISSUERS</span><h4>الجهة المانحة والشريك</h4></div>
                  <div className="wallet-issuer-logos wallet-issuer-logos-v3">
                    <div className="wallet-issuer-logo"><CiscoMark/><small>CISCO · NETWORKING ACADEMY</small></div>
                    {credential.issuer.includes('Splunk')&&<div className="wallet-partner-mark splunk-mark"><strong>splunk&gt;</strong><small>LEARNING PARTNER</small></div>}
                    {credential.issuer.includes('OpenEDG')&&<div className="wallet-partner-mark openedg-mark"><strong>OpenEDG</strong><small>EDUCATION PARTNER</small></div>}
                  </div>
                </aside>
                <section className="credential-wallet-verification">
                  <div className="wallet-panel-heading"><span>02 / CREDENTIAL RECORD</span><h4>بيانات الاعتماد والتحقق</h4></div>
                  <div className="wallet-facts">
                    <div><span>الجهة المانحة</span><strong>{credential.issuer}</strong></div>
                    <div><span>تاريخ الإصدار</span><strong>{credential.date}</strong></div>
                    <div><span>الصلاحية</span><strong>لا تنتهي صلاحيتها</strong></div>
                    <div><span>معرّف الشارة</span><code>{credential.id}</code></div>
                  </div>
                  <a className="wallet-verify-button" href={verify} target="_blank" rel="noopener noreferrer">التحقق من الاعتماد على Credly ↗</a>
                </section>
                <aside className="wallet-badge-column">
                  <div className="wallet-badge-logo">
                    <span className="credential-panel-label">DIGITAL BADGE · CREDLY</span>
                    <div className="credly-embed-frame credly-embed-frame-compact"><div data-iframe-width="150" data-iframe-height="170" data-share-badge-id={credential.id} data-share-badge-host="https://www.credly.com"></div></div>
                  </div>
                </aside>
              </div>
              <section className="credential-wallet-skills credential-wallet-skills-wide">
                <div className="wallet-skills-wide-heading">
                  <span className="skills-symbol">✦</span>
                  <div><span className="wallet-panel-kicker">03 / SKILLS ACQUIRED</span><h4>المهارات المكتسبة</h4><p>{credential.description}</p></div>
                </div>
                <div className="credential-skill-list">{credential.skills.map(skill=><span key={skill}><i>✓</i>{skill}</span>)}</div>
              </section>
            </div>
          </article>;
        })}
      </div>
    </section>
    <p className="disclaimer">تُعرض بيانات كل اعتماد وفق المعلومات المتاحة في سجل الشارة. روابط Credly مخصصة للتحقق من صحة الاعتماد، وملفات PDF هي نسخ الشهادات المرفقة.</p>
  </main>;
}


export default async function CredentialsPage(){
  const en = (await cookies()).get('portfolio-locale')?.value === 'en';
  return <><Script id="credentials-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(credentialsJsonLd()).replace(/</g,'\\u003c')}} />{en ? <CredentialsPageEnglish /> : <CredentialsPageArabic />}</>;
}
