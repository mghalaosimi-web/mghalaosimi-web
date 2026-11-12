import type {Metadata} from 'next';
import Image from 'next/image';
import {cookies} from 'next/headers';
import {localizedAlternates} from '../../lib/seo';
import {Award,ExternalLink} from 'lucide-react';
import {getPublishedCertificates,type PublicCertificateRow,safePublicHttpsUrl} from '../../lib/public-content';

export async function generateMetadata():Promise<Metadata>{
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  return en
    ? {
        title:'Digital Credentials | Mohammed Ghaleb Alaosimi',
        description:'Eighteen recorded credentials: Cisco Networking Academy, Edraak, OpenJS, and other verified issuer records.',
        alternates:localizedAlternates('/credentials','en'),
      }
    : {
        title:'الشهادات والاعتمادات | M.GH.AL',
        description:'سجل الشهادات والاعتمادات المهنية والتعليمية لمحمد غالب العصيمي.',
        alternates:localizedAlternates('/credentials','ar'),
      };
}

type Credential={
  id:string;
  slug?:string;
  issuer?:string;
  fileUrl?:string;
  previewUrl?:string;
  referenceId?:string;
  badgeImage?:string;
  provider:'Cisco'|'Edraak'|'OpenJS'|'Other';
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
  {id:'cisco-01',referenceId:'926baf56-48f3-4f9d-b86d-77b2c538663c',badgeImage:'https://images.credly.com/size/340x340/images/94cbdf0d-3e44-44b2-b213-866fe22aa7d5/blob',verification:'https://www.credly.com/badges/926baf56-48f3-4f9d-b86d-77b2c538663c/public_url',provider:'Cisco',name:'Hardware and Upgrade Support',nameEn:'Hardware and Upgrade Support',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'أساسيات دعم مكونات الحاسوب وترقيتها والتعامل مع احتياجات الصيانة والدعم الفني للأجهزة.',descriptionEn:'Fundamentals of computer hardware support, upgrades, maintenance needs, and device troubleshooting.',file:'Hardware_and_Upgrade_Support_certificate_m-gh-alaosimi-gmail-com_bc68bb11-3b72-420d-877a-a92139aff2f6.pdf',preview:'cisco-hardware-upgrade-support.png',tags:['Hardware Support','Upgrade Support','Troubleshooting'],tagsEn:['Hardware Support','Upgrade Support','Troubleshooting']},
  {id:'cisco-02',referenceId:'eaec19be-fa80-429e-8055-5bbd260b0776',badgeImage:'https://images.credly.com/size/340x340/images/a8d6cb9c-e0e3-4705-aab0-160cc9d10a11/blob',verification:'https://www.credly.com/badges/eaec19be-fa80-429e-8055-5bbd260b0776/public_url',provider:'Cisco',name:'Cybersecurity Defense Analyst Career Path',nameEn:'Cybersecurity Defense Analyst Career Path',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مسار تدريبي في التحليل الدفاعي للأمن السيبراني ومفاهيم المراقبة والتحقيق والاستجابة للتهديدات.',descriptionEn:'A learning path covering defensive cybersecurity analysis, monitoring, investigation, and threat response.',tags:['Cybersecurity','Security Analysis','Threat Monitoring'],tagsEn:['Cybersecurity','Security Analysis','Threat Monitoring']},
  {id:'cisco-03',referenceId:'96acb061-5011-4c45-89e3-07f8bf43980c',badgeImage:'https://images.credly.com/size/340x340/images/70cc28ef-542c-4ce2-8bad-e8d95daf5138/blob',verification:'https://www.credly.com/badges/96acb061-5011-4c45-89e3-07f8bf43980c/public_url',provider:'Cisco',name:'Operating Systems Support',nameEn:'Operating Systems Support',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مفاهيم دعم أنظمة التشغيل واستكشاف المشكلات المرتبطة ببيئات الاستخدام والحواسيب.',descriptionEn:'Operating-system support concepts and troubleshooting across common computing environments.',tags:['Operating Systems','Technical Support'],tagsEn:['Operating Systems','Technical Support']},
  {id:'cisco-04',referenceId:'31c303bf-725d-4061-b6b1-2dfb76d6ad3f',badgeImage:'https://images.credly.com/size/340x340/images/77b1ea15-6287-4d97-8ecd-c5afa2d137ea/image.png',verification:'https://www.credly.com/badges/31c303bf-725d-4061-b6b1-2dfb76d6ad3f/public_url',provider:'Cisco',name:'English for IT 1',nameEn:'English for IT 1',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مصطلحات ومفاهيم اللغة الإنجليزية المستخدمة في سياقات تقنية المعلومات والدعم الفني.',descriptionEn:'English terminology and communication concepts used in information technology and technical support.',tags:['IT Vocabulary','Technical Communication'],tagsEn:['IT Vocabulary','Technical Communication']},
  {id:'cisco-05',referenceId:'dd87ef5f-4c10-4d9d-928b-cf0a995c5ccb',badgeImage:'https://images.credly.com/size/340x340/images/441578ec-c0f3-46cc-95fc-86b27e90cf4f/image.png',verification:'https://www.credly.com/badges/dd87ef5f-4c10-4d9d-928b-cf0a995c5ccb/public_url',provider:'Cisco',name:'Junior Cybersecurity Analyst Career Path',nameEn:'Junior Cybersecurity Analyst Career Path',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مسار تعليمي تأسيسي في مهام محلل الأمن السيبراني ومفاهيم الدفاع ومراقبة التهديدات.',descriptionEn:'A foundational learning path covering cybersecurity analyst tasks, defensive concepts, and threat monitoring.',file:'JuniorCybersecurityAnalystUpdate20260727-21-iou924.pdf',preview:'JuniorCybersecurityAnalystUpdate20260727-21-iou924.png',tags:['Cybersecurity','Threat Detection','Security Operations'],tagsEn:['Cybersecurity','Threat Detection','Security Operations']},
  {id:'cisco-06',referenceId:'6e1ad458-e752-4064-a997-27092902f884',badgeImage:'https://images.credly.com/size/340x340/images/5bdd6a39-3e03-4444-9510-ecff80c9ce79/image.png',verification:'https://www.credly.com/badges/6e1ad458-e752-4064-a997-27092902f884/public_url',provider:'Cisco',name:'Networking Basics',nameEn:'Networking Basics',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'أساسيات أنواع الشبكات ووسائط الاتصال وعناوين IP والبروتوكولات وخدمات الشبكات.',descriptionEn:'Fundamentals of network types, communication media, IP addressing, protocols, and network services.',file:'NetworkingBasicsUpdate20260727-21-xz9ceq.pdf',preview:'NetworkingBasicsUpdate20260727-21-xz9ceq.png',tags:['Networking','IP Addressing','Protocols'],tagsEn:['Networking','IP Addressing','Protocols']},
  {id:'cisco-07',referenceId:'327cec43-3807-4a02-b144-c72407bdc4f3',badgeImage:'https://images.credly.com/size/340x340/images/a42c5fcd-6617-429c-b4a9-8805310e0b10/blob',verification:'https://www.credly.com/badges/327cec43-3807-4a02-b144-c72407bdc4f3/public_url',provider:'Cisco',name:'Security and Connectivity Support',nameEn:'Security and Connectivity Support',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مفاهيم دعم الاتصال وأساسيات الحماية المرتبطة بالشبكات والأجهزة وإعدادات الوصول.',descriptionEn:'Connectivity support and foundational security concepts for networks, devices, and access settings.',file:'SecurityandConnectivitySupportv120260727-21-51cp9q.pdf',preview:'SecurityandConnectivitySupportv120260727-21-51cp9q.png',tags:['Connectivity','Network Security','Access Control'],tagsEn:['Connectivity','Network Security','Access Control']},
  {id:'cisco-08',referenceId:'8d8f1cba-4a98-4cd5-b3b9-fe4233f085b1',badgeImage:'https://images.credly.com/size/340x340/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/image.png',verification:'https://www.credly.com/badges/8d8f1cba-4a98-4cd5-b3b9-fe4233f085b1/public_url',provider:'Cisco',name:'Python Essentials 1',nameEn:'Python Essentials 1',date:'26 يوليو 2026',dateEn:'26 Jul 2026',description:'مدخل إلى البرمجة باستخدام Python والتفكير الخوارزمي وكتابة البرامج النصية وتصحيحها.',descriptionEn:'An introduction to Python programming, algorithmic thinking, scripting, and debugging.',file:'PythonEssentials1Update20260727-20-xydgji.pdf',tags:['Python','Programming Fundamentals'],tagsEn:['Python','Programming Fundamentals']},
  {id:'cisco-09',referenceId:'73d091cc-193d-4b57-b8e0-e64340df62c7',badgeImage:'https://images.credly.com/size/340x340/images/dcdf1a3c-2594-4f4c-a33a-050b4bca58b5/image.png',verification:'https://www.credly.com/badges/73d091cc-193d-4b57-b8e0-e64340df62c7/public_url',provider:'Cisco',name:'Operating Systems Basics',nameEn:'Operating Systems Basics',date:'25 يوليو 2026',dateEn:'25 Jul 2026',description:'التعرف على المفاهيم الأساسية لأنظمة التشغيل ووظائفها وإدارة موارد الحاسوب.',descriptionEn:'An introduction to operating-system concepts, core functions, and computer resource management.',file:'OperatingSystemsBasicsUpdate20260727-20-mcda4y.pdf',preview:'OperatingSystemsBasicsUpdate20260727-20-mcda4y.png',tags:['Operating Systems','Computer Fundamentals'],tagsEn:['Operating Systems','Computer Fundamentals']},
  {id:'cisco-10',referenceId:'2319c9be-ea2f-44ff-a256-d431cd48404e',badgeImage:'https://images.credly.com/size/340x340/images/474a03c6-b5e1-44df-b313-adf0fed6c531/blob',verification:'https://www.credly.com/badges/2319c9be-ea2f-44ff-a256-d431cd48404e/public_url',provider:'Cisco',name:'IT Customer Support Basics',nameEn:'IT Customer Support Basics',date:'24 يوليو 2026',dateEn:'24 Jul 2026',description:'مبادئ خدمة المستخدمين واستكشاف الأعطال وتقديم الدعم الفني بطريقة منظمة.',descriptionEn:'User support fundamentals, troubleshooting, and structured technical assistance.',file:'IT_Customer_Support_Basics_certificate_m-gh-alaosimi-gmail-com_c21859f1-476d-49bb-a798-ac1479307855.pdf',preview:'cisco-it-customer-support-basics.png',tags:['IT Support','Troubleshooting','Customer Service'],tagsEn:['IT Support','Troubleshooting','Customer Service']},
  {id:'cisco-11',referenceId:'35fadd6d-f9d6-4d4f-b151-464d30637bbb',badgeImage:'https://images.credly.com/size/340x340/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/blob',verification:'https://www.credly.com/badges/35fadd6d-f9d6-4d4f-b151-464d30637bbb/public_url',provider:'Cisco',name:'Introduction to Modern AI',nameEn:'Introduction to Modern AI',date:'23 يوليو 2026',dateEn:'23 Jul 2026',description:'مقدمة إلى مفاهيم الذكاء الاصطناعي الحديث وتطبيقاته العامة والتعلم الآلي وروبوتات المحادثة.',descriptionEn:'An introduction to modern AI concepts and applications, including machine learning and conversational systems.',file:'IntrotoModernAIUpdate20260723-21-kproqx.pdf',preview:'IntrotoModernAIUpdate20260723-21-kproqx.png',tags:['Artificial Intelligence','Machine Learning','AI Applications'],tagsEn:['Artificial Intelligence','Machine Learning','AI Applications']},

  {id:'edraak-01',referenceId:'6addfdb9d4ce42cbb6581c5ad7798421',provider:'Edraak',name:'UI/UX Design',nameEn:'UI/UX Design',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'مدخل إلى تصميم واجهات المستخدم وتجربة الاستخدام ومبادئ بناء تجارب رقمية متمحورة حول المستخدم.',descriptionEn:'An introduction to user-interface and user-experience design and user-centred digital experiences.',file:'uiux-v1_certificate.PDF',tags:['UI Design','UX Design','User-Centred Design'],tagsEn:['UI Design','UX Design','User-Centred Design'],verification:edraakVerifyBase+'6addfdb9d4ce42cbb6581c5ad7798421/?lang=en'},
  {id:'edraak-02',referenceId:'e3d641d030654b5ea5a62a0011a80f41',provider:'Edraak',name:'Communications Skills',nameEn:'Communications Skills',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مهارات التواصل الفعال وتنظيم الأفكار والتفاعل في السياقات التعليمية والمهنية.',descriptionEn:'Effective communication, structuring ideas, and interaction in academic and professional contexts.',tags:['Communication','Professional Skills'],tagsEn:['Communication','Professional Skills'],verification:edraakVerifyBase+'e3d641d030654b5ea5a62a0011a80f41/?lang=en'},
  {id:'edraak-03',referenceId:'b774c07893ef4cacb20a6271fcc126c3',provider:'Edraak',name:'Interaction Design Fundamentals',nameEn:'Interaction Design Fundamentals',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'مبادئ تصميم التفاعل وتنظيم استجابات الواجهة وسلوكها بما يدعم وضوح الاستخدام.',descriptionEn:'Interaction-design principles for structuring interface responses and predictable user behaviour.',file:'interactiondesign-v1_certificate.PDF',preview:'interactiondesign-v1_certificate.png',tags:['Interaction Design','User Experience'],tagsEn:['Interaction Design','User Experience'],verification:edraakVerifyBase+'b774c07893ef4cacb20a6271fcc126c3/?lang=en'},
  {id:'edraak-04',referenceId:'528490ad79e14aefb6f42e361200d20d',provider:'Edraak',name:'UX Research',nameEn:'UX Research',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مقدمة في فهم المستخدمين وجمع الملاحظات وتحليل الاحتياجات لدعم قرارات التصميم.',descriptionEn:'An introduction to understanding users, collecting feedback, and analysing needs to inform design decisions.',tags:['User Research','Research Methods'],tagsEn:['User Research','Research Methods'],verification:edraakVerifyBase+'528490ad79e14aefb6f42e361200d20d/?lang=en'},
  {id:'edraak-05',referenceId:'261ba96416f847dea412232020b915ec',provider:'Edraak',name:'UX Design',nameEn:'UX Design',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مفاهيم تصميم تجربة المستخدم وتنظيم الرحلات والتدفقات وتحسين قابلية الاستخدام.',descriptionEn:'User-experience design concepts, user journeys, interaction flows, and usability.',file:'uxdesign-v1_certificate.PDF',preview:'uxdesign-v1_certificate.png',tags:['UX Design','Usability','User Journeys'],tagsEn:['UX Design','Usability','User Journeys'],verification:edraakVerifyBase+'261ba96416f847dea412232020b915ec/?lang=en'},
  {id:'edraak-06',referenceId:'39ab850762d242e4aba085047a34a440',provider:'Edraak',name:'User Interface Design Principles',nameEn:'User Interface Design Principles',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'مبادئ تصميم واجهات واضحة ومتناسقة، مع الاهتمام بالتسلسل البصري وسهولة الاستخدام.',descriptionEn:'Principles for clear and consistent interfaces, visual hierarchy, and ease of use.',file:'uidesign-v1_certificate.PDF',preview:'uidesign-v1_certificate.png',tags:['Interface Design','Visual Hierarchy'],tagsEn:['Interface Design','Visual Hierarchy'],verification:edraakVerifyBase+'39ab850762d242e4aba085047a34a440/?lang=en'},

  {id:'jsnad-01',referenceId:'JSNAD-ALOSEIMI-20241112',provider:'OpenJS',name:'OpenJS Node.js Application Developer (JSNAD)',nameEn:'OpenJS Node.js Application Developer (JSNAD)',date:'12 نوفمبر 2024',dateEn:'12 Nov 2024',description:'اعتماد مهني في تطوير تطبيقات Node.js صادر ضمن منظومة OpenJS Foundation وThe Linux Foundation.',descriptionEn:'A professional Node.js application-development credential issued through the OpenJS Foundation and The Linux Foundation.',tags:['Node.js','JavaScript','Application Development'],tagsEn:['Node.js','JavaScript','Application Development']},
];

const credentialSlugById:Record<string,string>={
 'cisco-01':'hardware-and-upgrade-support-02',
 'cisco-02':'cybersecurity-defense-analyst-career-path-03',
 'cisco-03':'operating-systems-support-04',
 'cisco-04':'english-for-it-1-05',
 'cisco-05':'junior-cybersecurity-analyst-career-path-06',
 'cisco-06':'networking-basics-07',
 'cisco-07':'security-and-connectivity-support-08',
 'cisco-08':'python-essentials-1-09',
 'cisco-09':'operating-systems-basics-10',
 'cisco-10':'it-customer-support-basics-11',
 'cisco-11':'introduction-to-modern-ai-12',
 'edraak-01':'ui-ux-design-13',
 'edraak-02':'communications-skills-14',
 'edraak-03':'interaction-design-fundamentals-15',
 'edraak-04':'ux-research-16',
 'edraak-05':'ux-design-17',
 'edraak-06':'user-interface-design-principles-18',
 'jsnad-01':'jsnad-node-js-application-developer-01'
};
const curatedCredentials=credentials.map(item=>({...item,slug:credentialSlugById[item.id]}));
function issuedDate(value:string|null,locale:'ar'|'en',fallback:string){
 if(!value)return fallback;
 const date=new Date(value.slice(0,10)+'T12:00:00Z');
 return new Intl.DateTimeFormat(locale==='ar'?'ar-YE':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(date);
}
function providerFromIssuer(issuer:string):Credential['provider']{
 if(/cisco/i.test(issuer))return 'Cisco';
 if(/edraak|إدراك/i.test(issuer))return 'Edraak';
 if(/openjs|linux foundation/i.test(issuer))return 'OpenJS';
 return 'Other';
}
function mergePublishedCredentials(rows:PublicCertificateRow[]|null,locale:'ar'|'en'):Credential[]{
 if(rows===null)return curatedCredentials;
 const bySlug=new Map(rows.map(row=>[row.slug,row]));
 const merged=curatedCredentials.filter(item=>!item.slug||bySlug.has(item.slug)).map(item=>{
  const row=item.slug?bySlug.get(item.slug):undefined;
  if(!row)return item;
  return {
   ...item,
   name:row.title||item.name,
   nameEn:row.title||item.nameEn,
   date:issuedDate(row.issued_at,'ar',item.date),
   dateEn:issuedDate(row.issued_at,'en',item.dateEn),
   descriptionEn:row.description||item.descriptionEn,
   referenceId:row.credential_id||item.referenceId,
   issuer:row.issuer||item.issuer,
   verification:item.verification||safePublicHttpsUrl(row.verification_url),
   badgeImage:row.image_media_id?'/api/public/media/'+encodeURIComponent(row.image_media_id):item.badgeImage,
   fileUrl:row.pdf_media_id?'/api/public/media/'+encodeURIComponent(row.pdf_media_id):item.fileUrl
  };
 });
 const curatedSlugs=new Set(curatedCredentials.map(item=>item.slug).filter(Boolean));
 const additions=rows.filter(row=>!curatedSlugs.has(row.slug)).map(row=>{
  const dateAr=issuedDate(row.issued_at,'ar','غير محدد');
  const dateEn=issuedDate(row.issued_at,'en','Not recorded');
  const provider=providerFromIssuer(row.issuer||'');
  const description=row.description||'لم تُوثّق تفاصيل إضافية لهذا الاعتماد.';
  const descriptionEn=row.description||'No additional credential details have been documented.';
  return {
   id:row.slug,slug:row.slug,referenceId:row.credential_id||undefined,provider,issuer:row.issuer,
   name:row.title,nameEn:row.title,date:dateAr,dateEn,
   description,descriptionEn,tags:[],tagsEn:[],
   verification:safePublicHttpsUrl(row.verification_url),
   badgeImage:row.image_media_id?'/api/public/media/'+encodeURIComponent(row.image_media_id):undefined,
   fileUrl:row.pdf_media_id?'/api/public/media/'+encodeURIComponent(row.pdf_media_id):undefined
  } satisfies Credential;
 });
 return [...merged,...additions];
}

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

function IssuerMark({credential}:{credential:Credential}){
  if(credential.provider==='Cisco')return <div className="wallet-issuer-logo"><CiscoMark/><small>CISCO · NETWORKING ACADEMY</small></div>;
  if(credential.provider==='Edraak')return <div className="wallet-partner-mark"><strong>إدراك</strong><small>EDRAAK · LEARNING</small></div>;
  if(credential.provider==='OpenJS')return <div className="wallet-partner-mark openedg-mark"><strong>OpenJS</strong><small>OPENJS FOUNDATION</small></div>;
  return <div className="wallet-partner-mark"><strong>{credential.issuer||'Issuer'}</strong><small>PROFESSIONAL CREDENTIAL</small></div>;
}

function CredentialCard({credential,index,en}:{credential:Credential;index:number;en:boolean}){
  const verify=credential.verification||(credential.provider==='Cisco'?credlyProfile:credential.provider==='Edraak'?'https://programs.edraak.org/':credential.provider==='OpenJS'?'https://openjsf.org/':undefined);
  const verifyLabel=credential.provider==='Cisco'?(en?'Credly badge':'شارة Credly'):credential.provider==='Edraak'?(en?'Edraak verification':'التحقق عبر إدراك'):credential.provider==='OpenJS'?'OpenJS Foundation':(en?'Issuer verification':'التحقق من الجهة');
  const pdfUrl=credential.file?'/assets/certificates/'+credential.file:credential.fileUrl;
  const previewUrl=credential.preview?'/assets/certificates/'+credential.preview:credential.previewUrl;
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
          <span>{pdfUrl?(en?'CERTIFICATE FILE':'ملف الشهادة'):(en?'CREDENTIAL RECORD':'سجل الاعتماد')}</span>
          <span>{pdfUrl?'PDF / IMAGE':'ISSUER RECORD'}</span>
        </div>
        <div className="certificate-document-preview">
          {previewUrl
            ? <Image src={previewUrl} alt={(en?'Preview: ':'معاينة: ')+(en?credential.nameEn:credential.name)} width={720} height={520} loading="lazy" unoptimized className="credential-preview-image"/>
            : <div className="credential-document-placeholder"><Award/><b>{credential.provider==='Cisco'?'CISCO':credential.provider==='Edraak'?'EDRAAK':credential.provider==='OpenJS'?'OpenJS':'CREDENTIAL'}</b><small>{credential.provider==='OpenJS'?'JSNAD':credential.provider==='Other'?'ISSUER RECORD':'DIGITAL CREDENTIAL'}</small></div>}
        </div>
        <div className="certificate-actions">
          {pdfUrl&&<a href={pdfUrl} target="_blank" rel="noopener noreferrer">{en?'Open original PDF':'فتح ملف PDF الأصلي'} ↗</a>}
          {verify&&<a href={verify} target="_blank" rel="noopener noreferrer">{en?verifyLabel:'التحقق من الجهة المانحة'} ↗</a>}
        </div>
      </section>
      <div className="wallet-detail-row">
        <aside className="wallet-issuer-column">
          <div className="wallet-panel-heading"><span>01 / ISSUER</span><h4>{en?'Issuing organization':'الجهة المانحة'}</h4></div>
          <div className="wallet-issuer-logos wallet-issuer-logos-v3"><IssuerMark credential={credential}/></div>
        </aside>
        <section className="credential-wallet-verification">
          <div className="wallet-panel-heading"><span>02 / CREDENTIAL RECORD</span><h4>{en?'Credential details':'بيانات الاعتماد'}</h4></div>
          <div className="wallet-facts">
            <div><span>{en?'Provider':'الجهة'}</span><strong>{credential.issuer||(credential.provider==='Cisco'?'Cisco Networking Academy':credential.provider==='Edraak'?'Edraak':credential.provider==='OpenJS'?'OpenJS Foundation · The Linux Foundation':'Credential issuer not recorded')}</strong></div>
            <div><span>{en?'Issue date':'تاريخ الإصدار'}</span><strong>{en?credential.dateEn:credential.date}</strong></div>
            <div><span>{en?'Record':'حالة السجل'}</span><strong>{en?'Recorded credential':'شهادة مدرجة في السجل'}</strong></div>
            <div><span>{en?'Credential identifier':'معرّف الشهادة'}</span><code>{credential.referenceId||(en?'Not supplied in the current record':'غير متاح في السجل الحالي')}</code></div>
          </div>
          {verify&&<a className="wallet-verify-button" href={verify} target="_blank" rel="noopener noreferrer">{en?'Open verification source':'فتح مصدر التحقق'} ↗</a>}
        </section>
        <aside className="wallet-badge-column">
          <div className="wallet-badge-logo">
            <span className="credential-panel-label">M.GH.AL / CREDENTIAL</span>
            <div className="credential-badge-placeholder">{credential.badgeImage?<Image src={credential.badgeImage} alt={(en?"Official Credly badge for ":"شارة Credly الأصلية لاعتماد ")+(en?credential.nameEn:credential.name)} width={112} height={112} loading="lazy" unoptimized className="credential-badge-image"/>:<Award/>}<b>{credential.provider==='OpenJS'?'JSNAD':credential.provider==='Edraak'?'EDRAAK':'CISCO'}</b><small>{String(index+1).padStart(2,'0')} / 18</small></div>
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
  const rows=await getPublishedCertificates();
  const credentialList=mergePublishedCredentials(rows,en?'en':'ar');
  const cisco=credentialList.filter(item=>item.provider==='Cisco');
  const edraak=credentialList.filter(item=>item.provider==='Edraak');
  const openjs=credentialList.filter(item=>item.provider==='OpenJS');
  const other=credentialList.filter(item=>item.provider==='Other');
  return <main className="content-page credentials-page">
    <header className="credentials-hero">
      <div className="credentials-brand"><div className="credential-hero-mark"><Award/><b>M.GH.AL</b></div><span/></div>
      <div className="credentials-hero-copy">
        <span className="eyebrow">VERIFIABLE LEARNING & PROFESSIONAL CREDENTIALS</span>
        <h1>{en?'Digital credentials & certificates':'الشهادات والاعتمادات الرقمية'}</h1>
        <p>{en
          ?'A structured record of published professional credentials with original files and issuer verification sources where available.'
          :'سجل منظم يضم سجل منشور للشهادات والاعتمادات من الجهات المانحة. تُعرض الملفات الأصلية وروابط التحقق حيث تتوفر.'}</p>
      </div>
      <div className="credentials-verified"><span>✓</span> {en?'{credentialList.length} recorded credentials':'{credentialList.length} شهادة واعتماداً مسجلاً'}</div>
    </header>

    <section className="credentials-section" aria-labelledby="cisco-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">CISCO NETWORKING ACADEMY · CREDLY</span><h2 id="cisco-credentials-title">{en?'Cisco professional credentials':'شهادات Cisco المهنية'}</h2></div>
        <span className="credentials-count">{cisco.length.toString().padStart(2,'0')} CREDENTIALS</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {cisco.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index} en={en}/>)}
      </div>
    </section>

    <section className="credentials-section" aria-labelledby="edraak-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">EDRAAK · DIGITAL CERTIFICATES</span><h2 id="edraak-credentials-title">{en?'Edraak learning certificates':'شهادات إدراك التعليمية'}</h2></div>
        <span className="credentials-count">{edraak.length.toString().padStart(2,'0')} CERTIFICATES</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {edraak.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+11} en={en}/>)}
      </div>
      <div className="credential-verification-references">
        <div className="wallet-panel-heading"><span>EDRAAK / VERIFICATION REFERENCES</span><h4>{en?'Stored verification links':'روابط التحقق المحفوظة'}</h4></div>
        <p>{en?'These six verification references are preserved from the certificate record. Individual reference-to-title mapping is shown only where it is confirmed.':'روابط التحقق الستة محفوظة من سجل الشهادات. لم تُربط كل وصلة بعنوان شهادة إلا حيث تتوفر مطابقة مؤكدة.'}</p>
        <div className="credential-reference-list">
          {edraakVerificationRefs.filter(ref=>edraak.some(item=>item.referenceId===ref)).map((ref,index)=>(
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
        <span className="credentials-count">{openjs.length.toString().padStart(2,'0')} CREDENTIAL</span>
      </div>
      <div className="credentials-list credentials-wallet-list">
        {openjs.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+17} en={en}/>)}
      </div>
    </section>

    {other.length>0&&<section className="credentials-section" aria-labelledby="other-credentials-title">
      <div className="credentials-section-heading"><div><span className="eyebrow">OTHER ISSUERS · DIGITAL CREDENTIALS</span><h2 id="other-credentials-title">{en?'Other published credentials':'اعتمادات من جهات أخرى'}</h2></div><span className="credentials-count">{other.length.toString().padStart(2,'0')} CREDENTIALS</span></div>
      <div className="credentials-list credentials-wallet-list">{other.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index} en={en}/>)}</div>
    </section>}

    <p className="disclaimer">{en
      ?'Credential records reflect the information available in the M.GH.AL archive. A verification link is provided only to the issuer or profile source currently recorded; the presence of a local file does not replace issuer-side verification.'
      :'تعكس سجلات الشهادات المعلومات المتاحة في أرشيف M.GH.AL. يُعرض رابط التحقق إلى الجهة أو الملف المسجل حالياً؛ ووجود ملف محلي لا يحل محل التحقق من المصدر المانح.'}</p>
  </main>;
}
