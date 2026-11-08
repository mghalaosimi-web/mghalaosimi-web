import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import {localizedAlternates} from '../../lib/seo';
import {ArrowUpRight,Award,BookOpenCheck,CheckCircle2,ExternalLink} from 'lucide-react';

export async function generateMetadata():Promise<Metadata>{
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  return en
    ? {
        title:'Digital Credentials | Mohammed Ghaleb Alaosimi',
        description:'Eighteen recorded credentials: eleven Cisco Networking Academy records, six Edraak certificates, and the OpenJS Node.js Application Developer credential.',
        alternates:localizedAlternates('/credentials','en'),
      }
    : {
        title:'الشهادات والاعتمادات | M.GH.AL',
        description:'سجل 18 شهادة واعتماداً لمحمد غالب العصيمي: 11 من Cisco Networking Academy، و6 من إدراك، واعتماد JSNAD من OpenJS وThe Linux Foundation.',
        alternates:localizedAlternates('/credentials','ar'),
      };
}

type Credential={
  id:string;
  referenceId?:string;
  provider:'Cisco'|'Edraak'|'OpenJS';
  name:string;
  nameEn:string;
  date:string;
  dateEn:string;
  description:string;
  descriptionEn:string;
  file?:string;
  preview?:string;
  tags:string[];
  tagsEn:string[];
  verification?:string;
};

const credlyProfile='https://www.credly.com/users/mohammed-ghaleb-al-aosimi';
const edraakVerifyBase='https://programs.edraak.org/learn/verify-certificate/';

const credentials:Credential[]=[
  {id:'cisco-01',provider:'Cisco',name:'Hardware and Upgrade Support',nameEn:'Hardware and Upgrade Support',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'أساسيات دعم مكونات الحاسوب وترقيتها والتعامل مع احتياجات الصيانة والدعم الفني للأجهزة.',descriptionEn:'Fundamentals of computer hardware support, upgrades, maintenance needs, and device troubleshooting.',file:'Hardware_and_Upgrade_Support_certificate_m-gh-alaosimi-gmail-com_bc68bb11-3b72-420d-877a-a92139aff2f6.pdf',preview:'cisco-hardware-upgrade-support.png',tags:['Hardware Support','Upgrade Support','Troubleshooting'],tagsEn:['Hardware Support','Upgrade Support','Troubleshooting']},
  {id:'cisco-02',provider:'Cisco',name:'Cybersecurity Defense Analyst Career Path',nameEn:'Cybersecurity Defense Analyst Career Path',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مسار تدريبي في التحليل الدفاعي للأمن السيبراني ومفاهيم المراقبة والتحقيق والاستجابة للتهديدات.',descriptionEn:'A learning path covering defensive cybersecurity analysis, monitoring, investigation, and threat response.',tags:['Cybersecurity','Security Analysis','Threat Monitoring'],tagsEn:['Cybersecurity','Security Analysis','Threat Monitoring']},
  {id:'cisco-03',provider:'Cisco',name:'Operating Systems Support',nameEn:'Operating Systems Support',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مفاهيم دعم أنظمة التشغيل واستكشاف المشكلات المرتبطة ببيئات الاستخدام والحواسيب.',descriptionEn:'Operating-system support concepts and troubleshooting across common computing environments.',tags:['Operating Systems','Technical Support'],tagsEn:['Operating Systems','Technical Support']},
  {id:'cisco-04',provider:'Cisco',name:'English for IT 1',nameEn:'English for IT 1',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مصطلحات ومفاهيم اللغة الإنجليزية المستخدمة في سياقات تقنية المعلومات والدعم الفني.',descriptionEn:'English terminology and communication concepts used in information technology and technical support.',tags:['IT Vocabulary','Technical Communication'],tagsEn:['IT Vocabulary','Technical Communication']},
  {id:'cisco-05',provider:'Cisco',name:'Junior Cybersecurity Analyst Career Path',nameEn:'Junior Cybersecurity Analyst Career Path',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مسار تعليمي تأسيسي في مهام محلل الأمن السيبراني ومفاهيم الدفاع ومراقبة التهديدات.',descriptionEn:'A foundational learning path covering cybersecurity analyst tasks, defensive concepts, and threat monitoring.',file:'JuniorCybersecurityAnalystUpdate20260727-21-iou924.pdf',preview:'JuniorCybersecurityAnalystUpdate20260727-21-iou924.png',tags:['Cybersecurity','Threat Detection','Security Operations'],tagsEn:['Cybersecurity','Threat Detection','Security Operations']},
  {id:'cisco-06',provider:'Cisco',name:'Networking Basics',nameEn:'Networking Basics',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'أساسيات أنواع الشبكات ووسائط الاتصال وعناوين IP والبروتوكولات وخدمات الشبكات.',descriptionEn:'Fundamentals of network types, communication media, IP addressing, protocols, and network services.',file:'NetworkingBasicsUpdate20260727-21-xz9ceq.pdf',preview:'NetworkingBasicsUpdate20260727-21-xz9ceq.png',tags:['Networking','IP Addressing','Protocols'],tagsEn:['Networking','IP Addressing','Protocols']},
  {id:'cisco-07',provider:'Cisco',name:'Security and Connectivity Support',nameEn:'Security and Connectivity Support',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مفاهيم دعم الاتصال وأساسيات الحماية المرتبطة بالشبكات والأجهزة وإعدادات الوصول.',descriptionEn:'Connectivity support and foundational security concepts for networks, devices, and access settings.',file:'SecurityandConnectivitySupportv120260727-21-51cp9q.pdf',preview:'SecurityandConnectivitySupportv120260727-21-51cp9q.png',tags:['Connectivity','Network Security','Access Control'],tagsEn:['Connectivity','Network Security','Access Control']},
  {id:'cisco-08',provider:'Cisco',name:'Python Essentials 1',nameEn:'Python Essentials 1',date:'26 يوليو 2026',dateEn:'26 Jul 2026',description:'مدخل إلى البرمجة باستخدام Python والتفكير الخوارزمي وكتابة البرامج النصية وتصحيحها.',descriptionEn:'An introduction to Python programming, algorithmic thinking, scripting, and debugging.',tags:['Python','Programming Fundamentals'],tagsEn:['Python','Programming Fundamentals']},
  {id:'cisco-09',provider:'Cisco',name:'Operating Systems Basics',nameEn:'Operating Systems Basics',date:'25 يوليو 2026',dateEn:'25 Jul 2026',description:'التعرف على المفاهيم الأساسية لأنظمة التشغيل ووظائفها وإدارة موارد الحاسوب.',descriptionEn:'An introduction to operating-system concepts, core functions, and computer resource management.',file:'OperatingSystemsBasicsUpdate20260727-20-mcda4y.pdf',preview:'OperatingSystemsBasicsUpdate20260727-20-mcda4y.png',tags:['Operating Systems','Computer Fundamentals'],tagsEn:['Operating Systems','Computer Fundamentals']},
  {id:'cisco-10',provider:'Cisco',name:'IT Customer Support Basics',nameEn:'IT Customer Support Basics',date:'24 يوليو 2026',dateEn:'24 Jul 2026',description:'مبادئ خدمة المستخدمين واستكشاف الأعطال وتقديم الدعم الفني بطريقة منظمة.',descriptionEn:'User support fundamentals, troubleshooting, and structured technical assistance.',preview:'cisco-it-customer-support-basics.png',tags:['IT Support','Troubleshooting','Customer Service'],tagsEn:['IT Support','Troubleshooting','Customer Service']},
  {id:'cisco-11',provider:'Cisco',name:'Introduction to Modern AI',nameEn:'Introduction to Modern AI',date:'23 يوليو 2026',dateEn:'23 Jul 2026',description:'مقدمة إلى مفاهيم الذكاء الاصطناعي الحديث وتطبيقاته العامة والتعلم الآلي وروبوتات المحادثة.',descriptionEn:'An introduction to modern AI concepts and applications, including machine learning and conversational systems.',file:'IntrotoModernAIUpdate20260723-21-kproqx.pdf',preview:'IntrotoModernAIUpdate20260723-21-kproqx.png',tags:['Artificial Intelligence','Machine Learning','AI Applications'],tagsEn:['Artificial Intelligence','Machine Learning','AI Applications']},

  {id:'edraak-01',referenceId:'6addfdb9d4ce42cbb6581c5ad7798421',provider:'Edraak',name:'UI/UX Design',nameEn:'UI/UX Design',date:'غير محدد في السجل',dateEn:'Date not recorded',description:'مدخل إلى تصميم واجهات المستخدم وتجربة الاستخدام ومبادئ بناء تجارب رقمية متمحورة حول المستخدم.',descriptionEn:'An introduction to user-interface and user-experience design and user-centred digital experiences.',file:'uiux-v1_certificate.PDF',tags:['UI Design','UX Design','User-Centred Design'],tagsEn:['UI Design','UX Design','User-Centred Design'],verification:edraakVerifyBase+'6addfdb9d4ce42cbb6581c5ad7798421/?lang=en'},
  {id:'edraak-02',referenceId:'e3d641d030654b5ea5a62a0011a80f41',provider:'Edraak',name:'Communications Skills',nameEn:'Communications Skills',date:'غير محدد في السجل',dateEn:'Date not recorded',description:'مهارات التواصل الفعال وتنظيم الأفكار والتفاعل في السياقات التعليمية والمهنية.',descriptionEn:'Effective communication, structuring ideas, and interaction in academic and professional contexts.',tags:['Communication','Professional Skills'],tagsEn:['Communication','Professional Skills'],verification:edraakVerifyBase+'e3d641d030654b5ea5a62a0011a80f41/?lang=en'},
  {id:'edraak-03',referenceId:'b774c07893ef4cacb20a6271fcc126c3',provider:'Edraak',name:'Interaction Design Fundamentals',nameEn:'Interaction Design Fundamentals',date:'غير محدد في السجل',dateEn:'Date not recorded',description:'مبادئ تصميم التفاعل وتنظيم استجابات الواجهة وسلوكها بما يدعم وضوح الاستخدام.',descriptionEn:'Interaction-design principles for structuring interface responses and predictable user behaviour.',file:'interactiondesign-v1_certificate.PDF',preview:'interactiondesign-v1_certificate.png',tags:['Interaction Design','User Experience'],tagsEn:['Interaction Design','User Experience'],verification:edraakVerifyBase+'b774c07893ef4cacb20a6271fcc126c3/?lang=en'},
  {id:'edraak-04',provider:'Edraak',name:'UX Research',nameEn:'UX Research',date:'غير محدد في السجل',dateEn:'Date not recorded',description:'مقدمة في فهم المستخدمين وجمع الملاحظات وتحليل الاحتياجات لدعم قرارات التصميم.',descriptionEn:'An introduction to understanding users, collecting feedback, and analysing needs to inform design decisions.',tags:['User Research','Research Methods'],tagsEn:['User Research','Research Methods']},
  {id:'edraak-05',referenceId:'261ba96416f847dea412232020b915ec',provider:'Edraak',name:'UX Design',nameEn:'UX Design',date:'غير محدد في السجل',dateEn:'Date not recorded',description:'مفاهيم تصميم تجربة المستخدم وتنظيم الرحلات والتدفقات وتحسين قابلية الاستخدام.',descriptionEn:'User-experience design concepts, user journeys, interaction flows, and usability.',file:'uxdesign-v1_certificate.PDF',preview:'uxdesign-v1_certificate.png',tags:['UX Design','Usability','User Journeys'],tagsEn:['UX Design','Usability','User Journeys'],verification:edraakVerifyBase+'261ba96416f847dea412232020b915ec/?lang=en'},
  {id:'edraak-06',provider:'Edraak',name:'User Interface Design Principles',nameEn:'User Interface Design Principles',date:'غير محدد في السجل',dateEn:'Date not recorded',description:'مبادئ تصميم واجهات واضحة ومتناسقة، مع الاهتمام بالتسلسل البصري وسهولة الاستخدام.',descriptionEn:'Principles for clear and consistent interfaces, visual hierarchy, and ease of use.',file:'uidesign-v1_certificate.PDF',preview:'uidesign-v1_certificate.png',tags:['Interface Design','Visual Hierarchy'],tagsEn:['Interface Design','Visual Hierarchy']},

  {id:'jsnad-01',referenceId:'JSNAD-ALOSEIMI-20241112',provider:'OpenJS',name:'OpenJS Node.js Application Developer (JSNAD)',nameEn:'OpenJS Node.js Application Developer (JSNAD)',date:'12 نوفمبر 2024',dateEn:'12 Nov 2024',description:'اعتماد مهني في تطوير تطبيقات Node.js صادر ضمن منظومة OpenJS Foundation وThe Linux Foundation.',descriptionEn:'A professional Node.js application-development credential issued through the OpenJS Foundation and The Linux Foundation.',tags:['Node.js','JavaScript','Application Development'],tagsEn:['Node.js','JavaScript','Application Development']},
];

const edraakVerificationRefs=[
  '6addfdb9d4ce42cbb6581c5ad7798421',
  'e3d641d030654b5ea5a62a0011a80f41',
  'b774c07893ef4cacb20a6271fcc126c3',
  '528490ad79e14aefb6f42e361200d20d',
  '261ba96416f847dea412232020b915ec',
  '39ab850762d242e4aba085047a34a440',
];

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

function IssuerMark({provider}:{provider:Credential['provider']}){
  if(provider==='Cisco')return <div className="wallet-issuer-logo"><CiscoMark/><small>CISCO · NETWORKING ACADEMY</small></div>;
  if(provider==='Edraak')return <div className="wallet-partner-mark"><strong>إدراك</strong><small>EDRAAK · LEARNING</small></div>;
  return <div className="wallet-partner-mark openedg-mark"><strong>OpenJS</strong><small>OPENJS FOUNDATION</small></div>;
}

function CredentialCard({credential,index,en}:{credential:Credential;index:number;en:boolean}){
  const verify=credential.verification||(credential.provider==='Cisco'?credlyProfile:credential.provider==='Edraak'?'https://programs.edraak.org/':'https://openjsf.org/');
  const verifyLabel=credential.provider==='Cisco'?(en?'Credly profile':'ملف Credly'):credential.provider==='Edraak'?(en?'Edraak verification':'التحقق عبر إدراك'):(en?'OpenJS Foundation':'OpenJS Foundation');
  return <article className="credential-showcase credential-wallet" key={credential.id}>
    <div className="credential-showcase-head credential-wallet-head">
      <div className="credential-title-block">
        <span className="credential-index">CREDENTIAL / {String(index+1).padStart(2,'0')}</span>
        <h3>{en?credential.nameEn:credential.name}</h3>
        <p>{credential.provider} · {en?credential.dateEn:credential.date}</p>
      </div>
      <span className="credential-status"><i>✓</i> {en?'Listed credential':'ضمن سجل الشهادات'}</span>
    </div>
    <div className="credential-wallet-grid credential-wallet-grid-v3">
      <section className="credential-wallet-document" aria-label={en?'Credential document':'وثيقة الاعتماد'}>
        <div className="wallet-document-heading">
          <span>{credential.file?(en?'CERTIFICATE FILE':'ملف الشهادة'):(en?'CREDENTIAL RECORD':'سجل الاعتماد')}</span>
          <span>{credential.file?'PDF / IMAGE':'ISSUER RECORD'}</span>
        </div>
        <div className="certificate-document-preview">
          {credential.preview
            ? <img src={'/assets/certificates/'+credential.preview} alt={(en?'Preview: ':'معاينة: ')+(en?credential.nameEn:credential.name)} loading="lazy" decoding="async"/>
            : <div className="credential-document-placeholder"><Award/><b>{credential.provider==='Cisco'?'CISCO':credential.provider==='Edraak'?'EDRAAK':'OpenJS'}</b><small>{credential.provider==='OpenJS'?'JSNAD':'DIGITAL CREDENTIAL'}</small></div>}
        </div>
        <div className="certificate-actions">
          {credential.file&&<a href={'/assets/certificates/'+credential.file} target="_blank" rel="noopener noreferrer">{en?'Open original PDF':'فتح ملف PDF الأصلي'} ↗</a>}
          <a href={verify} target="_blank" rel="noopener noreferrer">{en?verifyLabel:'التحقق من الجهة المانحة'} ↗</a>
        </div>
      </section>
      <div className="wallet-detail-row">
        <aside className="wallet-issuer-column">
          <div className="wallet-panel-heading"><span>01 / ISSUER</span><h4>{en?'Issuing organization':'الجهة المانحة'}</h4></div>
          <div className="wallet-issuer-logos wallet-issuer-logos-v3"><IssuerMark provider={credential.provider}/></div>
        </aside>
        <section className="credential-wallet-verification">
          <div className="wallet-panel-heading"><span>02 / CREDENTIAL RECORD</span><h4>{en?'Credential details':'بيانات الاعتماد'}</h4></div>
          <div className="wallet-facts">
            <div><span>{en?'Provider':'الجهة'}</span><strong>{credential.provider==='Cisco'?'Cisco Networking Academy':credential.provider==='Edraak'?'Edraak':'OpenJS Foundation · The Linux Foundation'}</strong></div>
            <div><span>{en?'Issue date':'تاريخ الإصدار'}</span><strong>{en?credential.dateEn:credential.date}</strong></div>
            <div><span>{en?'Record':'حالة السجل'}</span><strong>{en?'Recorded credential':'شهادة مدرجة في السجل'}</strong></div>
            <div><span>{en?'Credential identifier':'معرّف الشهادة'}</span><code>{credential.referenceId||(en?'Not supplied in the current record':'غير متاح في السجل الحالي')}</code></div>
          </div>
          <a className="wallet-verify-button" href={verify} target="_blank" rel="noopener noreferrer">{en?'Open verification source':'فتح مصدر التحقق'} ↗</a>
        </section>
        <aside className="wallet-badge-column">
          <div className="wallet-badge-logo">
            <span className="credential-panel-label">M.GH.AL / CREDENTIAL</span>
            <div className="credential-badge-placeholder"><Award/><b>{credential.provider==='OpenJS'?'JSNAD':credential.provider==='Edraak'?'EDRAAK':'CISCO'}</b><small>{String(index+1).padStart(2,'0')} / 18</small></div>
          </div>
        </aside>
      </div>
      <section className="credential-wallet-skills credential-wallet-skills-wide">
        <div className="wallet-skills-wide-heading">
          <span className="skills-symbol">✦</span>
          <div>
            <span className="wallet-panel-kicker">03 / LEARNING OUTCOME</span>
            <h4>{en?'Credential summary':'ملخص الاعتماد'}</h4>
            <p>{en?credential.descriptionEn:credential.description}</p>
          </div>
        </div>
        <div className="credential-skill-list">
          {(en?credential.tagsEn:credential.tags).map(tag=><span key={tag}><i>✓</i>{tag}</span>)}
        </div>
      </section>
    </div>
  </article>;
}

export default async function CredentialsPage(){
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  const cisco=credentials.filter(item=>item.provider==='Cisco');
  const edraak=credentials.filter(item=>item.provider==='Edraak');
  const openjs=credentials.filter(item=>item.provider==='OpenJS');
  return <main className="content-page credentials-page">
    <header className="credentials-hero">
      <div className="credentials-brand"><div className="credential-hero-mark"><Award/><b>M.GH.AL</b></div><span/></div>
      <div className="credentials-hero-copy">
        <span className="eyebrow">VERIFIABLE LEARNING & PROFESSIONAL CREDENTIALS</span>
        <h1>{en?'Digital credentials & certificates':'الشهادات والاعتمادات الرقمية'}</h1>
        <p>{en
          ?'A structured record of eighteen credentials: eleven Cisco Networking Academy records, six Edraak certificates, and the OpenJS Node.js Application Developer credential. Original files and verification sources are shown when available.'
          :'سجل منظم يضم 18 شهادة واعتماداً: 11 من Cisco Networking Academy، و6 من إدراك، واعتماد JSNAD من OpenJS. تُعرض الملفات الأصلية وروابط التحقق حيث تتوفر.'}</p>
      </div>
      <div className="credentials-verified"><span>✓</span> {en?'18 recorded credentials':'18 شهادة واعتماداً مسجلاً'}</div>
    </header>

    <section className="credentials-section" aria-labelledby="cisco-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">CISCO NETWORKING ACADEMY · CREDLY</span><h2 id="cisco-credentials-title">{en?'Cisco professional credentials':'شهادات Cisco المهنية'}</h2></div>
        <span className="credentials-count">11 CREDENTIALS</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {cisco.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index} en={en}/>)}
      </div>
    </section>

    <section className="credentials-section" aria-labelledby="edraak-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">EDRAAK · DIGITAL CERTIFICATES</span><h2 id="edraak-credentials-title">{en?'Edraak learning certificates':'شهادات إدراك التعليمية'}</h2></div>
        <span className="credentials-count">06 CERTIFICATES</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {edraak.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+11} en={en}/>)}
      </div>
      <div className="credential-verification-references">
        <div className="wallet-panel-heading"><span>EDRAAK / VERIFICATION REFERENCES</span><h4>{en?'Stored verification links':'روابط التحقق المحفوظة'}</h4></div>
        <p>{en?'These six verification references are preserved from the certificate record. Individual reference-to-title mapping is shown only where it is confirmed.':'روابط التحقق الستة محفوظة من سجل الشهادات. لم تُربط كل وصلة بعنوان شهادة إلا حيث تتوفر مطابقة مؤكدة.'}</p>
        <div className="credential-reference-list">
          {edraakVerificationRefs.map((ref,index)=>(
            <a key={ref} href={edraakVerifyBase+ref+'/?lang=en'} target="_blank" rel="noopener noreferrer">
              <span>0{index+1}</span><b>{en?'Open verification reference':'فتح مرجع التحقق'}</b><code>{ref}</code><ExternalLink size={14}/>
            </a>
          ))}
        </div>
      </div>
    </section>

    <section className="credentials-section" aria-labelledby="openjs-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">OPENJS FOUNDATION · THE LINUX FOUNDATION</span><h2 id="openjs-credentials-title">{en?'Node.js professional credential':'اعتماد Node.js المهني'}</h2></div>
        <span className="credentials-count">01 CREDENTIAL</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {openjs.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+17} en={en}/>)}
      </div>
    </section>

    <p className="disclaimer">{en
      ?'Credential records reflect the information available in the M.GH.AL archive. A verification link is provided only to the issuer or profile source currently recorded; the presence of a local file does not replace issuer-side verification.'
      :'تعكس سجلات الشهادات المعلومات المتاحة في أرشيف M.GH.AL. يُعرض رابط التحقق إلى الجهة أو الملف المسجل حالياً؛ ووجود ملف محلي لا يحل محل التحقق من المصدر المانح.'}</p>
  </main>;
}
