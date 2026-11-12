import type {Metadata} from 'next';
import Image from 'next/image';
import {cookies} from 'next/headers';
import {localizedAlternates} from '../../lib/seo';
import {Award,ExternalLink} from 'lucide-react';

export async function generateMetadata():Promise<Metadata>{
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  return en
    ? {
        title:'Digital Credentials | Mohammed Ghaleb Alaosimi',
        description:'Twenty-six recorded credentials: fourteen Cisco Networking Academy records, six Edraak certificates, the OpenJS Node.js Application Developer credential, and five EMC Shiraa workshops.',
        alternates:localizedAlternates('/credentials','en'),
      }
    : {
        title:'الشهادات والاعتمادات | M.GH.AL',
        description:'سجل 26 شهادة واعتماداً لمحمد غالب العصيمي: 14 من Cisco Networking Academy، و6 من إدراك، واعتماد JSNAD من OpenJS، و5 ورش من EMC شِراع.',
        alternates:localizedAlternates('/credentials','ar'),
      };
}

type Credential={
  id:string;
  referenceId?:string;
  badgeImage?:string;
  provider:'Cisco'|'Edraak'|'OpenJS'|'EMC';
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
  {id:'cisco-01',referenceId:'926baf56-48f3-4f9d-b86d-77b2c538663c',badgeImage:'https://images.credly.com/size/340x340/images/94cbdf0d-3e44-44b2-b213-866fe22aa7d5/blob',verification:'https://www.credly.com/badges/926baf56-48f3-4f9d-b86d-77b2c538663c/public_url',provider:'Cisco',name:'Hardware and Upgrade Support',nameEn:'Hardware and Upgrade Support',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'أساسيات دعم مكونات الحاسوب وترقيتها والتعامل مع احتياجات الصيانة والدعم الفني للأجهزة.',descriptionEn:'Fundamentals of computer hardware support, upgrades, maintenance needs, and device troubleshooting.',file:'Hardware_and_Upgrade_Support_certificate_m-gh-alaosimi-gmail-com_bc68bb11-3b72-420d-877a-a92139aff2f6.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١١٠١٠_OneDrive.jpg",tags:['Hardware Support','Upgrade Support','Troubleshooting'],tagsEn:['Hardware Support','Upgrade Support','Troubleshooting']},
  {id:'cisco-02',referenceId:'eaec19be-fa80-429e-8055-5bbd260b0776',badgeImage:'https://images.credly.com/size/340x340/images/a8d6cb9c-e0e3-4705-aab0-160cc9d10a11/blob',verification:'https://www.credly.com/badges/eaec19be-fa80-429e-8055-5bbd260b0776/public_url',provider:'Cisco',name:'Cybersecurity Defense Analyst Career Path',nameEn:'Cybersecurity Defense Analyst Career Path',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مسار تدريبي في التحليل الدفاعي للأمن السيبراني ومفاهيم المراقبة والتحقيق والاستجابة للتهديدات.',descriptionEn:'A learning path covering defensive cybersecurity analysis, monitoring, investigation, and threat response.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/CybersecurityDefenseAnalystCareerPathv120261112-20-as0po8.pdf",preview:"previews/Screenshot_٢٠٢٦١١١٣_٠٠٤٧٢٣_OneDrive.jpg",tags:['Cybersecurity','Security Analysis','Threat Monitoring'],tagsEn:['Cybersecurity','Security Analysis','Threat Monitoring']},
  {id:'cisco-03',referenceId:'96acb061-5011-4c45-89e3-07f8bf43980c',badgeImage:'https://images.credly.com/size/340x340/images/70cc28ef-542c-4ce2-8bad-e8d95daf5138/blob',verification:'https://www.credly.com/badges/96acb061-5011-4c45-89e3-07f8bf43980c/public_url',provider:'Cisco',name:'Operating Systems Support',nameEn:'Operating Systems Support',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مفاهيم دعم أنظمة التشغيل واستكشاف المشكلات المرتبطة ببيئات الاستخدام والحواسيب.',descriptionEn:'Operating-system support concepts and troubleshooting across common computing environments.',tags:['Operating Systems','Technical Support'],tagsEn:['Operating Systems','Technical Support']},
  {id:'cisco-04',referenceId:'31c303bf-725d-4061-b6b1-2dfb76d6ad3f',badgeImage:'https://images.credly.com/size/340x340/images/77b1ea15-6287-4d97-8ecd-c5afa2d137ea/image.png',verification:'https://www.credly.com/badges/31c303bf-725d-4061-b6b1-2dfb76d6ad3f/public_url',provider:'Cisco',name:'English for IT 1',nameEn:'English for IT 1',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مصطلحات ومفاهيم اللغة الإنجليزية المستخدمة في سياقات تقنية المعلومات والدعم الفني.',descriptionEn:'English terminology and communication concepts used in information technology and technical support.',tags:['IT Vocabulary','Technical Communication'],tagsEn:['IT Vocabulary','Technical Communication']},
  {id:'cisco-05',referenceId:'dd87ef5f-4c10-4d9d-928b-cf0a995c5ccb',badgeImage:'https://images.credly.com/size/340x340/images/441578ec-c0f3-46cc-95fc-86b27e90cf4f/image.png',verification:'https://www.credly.com/badges/dd87ef5f-4c10-4d9d-928b-cf0a995c5ccb/public_url',provider:'Cisco',name:'Junior Cybersecurity Analyst Career Path',nameEn:'Junior Cybersecurity Analyst Career Path',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مسار تعليمي تأسيسي في مهام محلل الأمن السيبراني ومفاهيم الدفاع ومراقبة التهديدات.',descriptionEn:'A foundational learning path covering cybersecurity analyst tasks, defensive concepts, and threat monitoring.',file:'JuniorCybersecurityAnalystUpdate20260727-21-iou924.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٧٣٦_OneDrive.jpg",tags:['Cybersecurity','Threat Detection','Security Operations'],tagsEn:['Cybersecurity','Threat Detection','Security Operations']},
  {id:'cisco-06',referenceId:'6e1ad458-e752-4064-a997-27092902f884',badgeImage:'https://images.credly.com/size/340x340/images/5bdd6a39-3e03-4444-9510-ecff80c9ce79/image.png',verification:'https://www.credly.com/badges/6e1ad458-e752-4064-a997-27092902f884/public_url',provider:'Cisco',name:'Networking Basics',nameEn:'Networking Basics',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'أساسيات أنواع الشبكات ووسائط الاتصال وعناوين IP والبروتوكولات وخدمات الشبكات.',descriptionEn:'Fundamentals of network types, communication media, IP addressing, protocols, and network services.',file:'NetworkingBasicsUpdate20260727-21-xz9ceq.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٨١٤_OneDrive.jpg",tags:['Networking','IP Addressing','Protocols'],tagsEn:['Networking','IP Addressing','Protocols']},
  {id:'cisco-07',referenceId:'327cec43-3807-4a02-b144-c72407bdc4f3',badgeImage:'https://images.credly.com/size/340x340/images/a42c5fcd-6617-429c-b4a9-8805310e0b10/blob',verification:'https://www.credly.com/badges/327cec43-3807-4a02-b144-c72407bdc4f3/public_url',provider:'Cisco',name:'Security and Connectivity Support',nameEn:'Security and Connectivity Support',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مفاهيم دعم الاتصال وأساسيات الحماية المرتبطة بالشبكات والأجهزة وإعدادات الوصول.',descriptionEn:'Connectivity support and foundational security concepts for networks, devices, and access settings.',file:'SecurityandConnectivitySupportv120260727-21-51cp9q.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٩٠٦_OneDrive.jpg",tags:['Connectivity','Network Security','Access Control'],tagsEn:['Connectivity','Network Security','Access Control']},
  {id:'cisco-08',referenceId:'8d8f1cba-4a98-4cd5-b3b9-fe4233f085b1',badgeImage:'https://images.credly.com/size/340x340/images/68c0b94d-f6ac-40b1-a0e0-921439eb092e/image.png',verification:'https://www.credly.com/badges/8d8f1cba-4a98-4cd5-b3b9-fe4233f085b1/public_url',provider:'Cisco',name:'Python Essentials 1',nameEn:'Python Essentials 1',date:'26 يوليو 2026',dateEn:'26 Jul 2026',description:'مدخل إلى البرمجة باستخدام Python والتفكير الخوارزمي وكتابة البرامج النصية وتصحيحها.',descriptionEn:'An introduction to Python programming, algorithmic thinking, scripting, and debugging.',file:'PythonEssentials1Update20260727-20-xydgji.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٩٥١_OneDrive.jpg",tags:['Python','Programming Fundamentals'],tagsEn:['Python','Programming Fundamentals']},
  {id:'cisco-09',referenceId:'73d091cc-193d-4b57-b8e0-e64340df62c7',badgeImage:'https://images.credly.com/size/340x340/images/dcdf1a3c-2594-4f4c-a33a-050b4bca58b5/image.png',verification:'https://www.credly.com/badges/73d091cc-193d-4b57-b8e0-e64340df62c7/public_url',provider:'Cisco',name:'Operating Systems Basics',nameEn:'Operating Systems Basics',date:'25 يوليو 2026',dateEn:'25 Jul 2026',description:'التعرف على المفاهيم الأساسية لأنظمة التشغيل ووظائفها وإدارة موارد الحاسوب.',descriptionEn:'An introduction to operating-system concepts, core functions, and computer resource management.',file:'OperatingSystemsBasicsUpdate20260727-20-mcda4y.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٨٤٧_OneDrive.jpg",tags:['Operating Systems','Computer Fundamentals'],tagsEn:['Operating Systems','Computer Fundamentals']},
  {id:'cisco-10',referenceId:'2319c9be-ea2f-44ff-a256-d431cd48404e',badgeImage:'https://images.credly.com/size/340x340/images/474a03c6-b5e1-44df-b313-adf0fed6c531/blob',verification:'https://www.credly.com/badges/2319c9be-ea2f-44ff-a256-d431cd48404e/public_url',provider:'Cisco',name:'IT Customer Support Basics',nameEn:'IT Customer Support Basics',date:'24 يوليو 2026',dateEn:'24 Jul 2026',description:'مبادئ خدمة المستخدمين واستكشاف الأعطال وتقديم الدعم الفني بطريقة منظمة.',descriptionEn:'User support fundamentals, troubleshooting, and structured technical assistance.',file:'IT_Customer_Support_Basics_certificate_m-gh-alaosimi-gmail-com_c21859f1-476d-49bb-a798-ac1479307855.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٥٢٢_OneDrive.jpg",tags:['IT Support','Troubleshooting','Customer Service'],tagsEn:['IT Support','Troubleshooting','Customer Service']},
  {id:'cisco-11',referenceId:'35fadd6d-f9d6-4d4f-b151-464d30637bbb',badgeImage:'https://images.credly.com/size/340x340/images/e2d12302-10f9-40d4-8ff1-066a7008b61d/blob',verification:'https://www.credly.com/badges/35fadd6d-f9d6-4d4f-b151-464d30637bbb/public_url',provider:'Cisco',name:'Introduction to Modern AI',nameEn:'Introduction to Modern AI',date:'23 يوليو 2026',dateEn:'23 Jul 2026',description:'مقدمة إلى مفاهيم الذكاء الاصطناعي الحديث وتطبيقاته العامة والتعلم الآلي وروبوتات المحادثة.',descriptionEn:'An introduction to modern AI concepts and applications, including machine learning and conversational systems.',file:'IntrotoModernAIUpdate20260723-21-kproqx.pdf',preview:"previews/Screenshot_٢٠٢٦١١١٣_٠١٠٤٤٩_OneDrive.jpg",tags:['Artificial Intelligence','Machine Learning','AI Applications'],tagsEn:['Artificial Intelligence','Machine Learning','AI Applications']},
  {id:'cisco-12',referenceId:'8efc04e1-0fb8-45d6-ab73-42cf16880aec',provider:'Cisco',name:'Data Science Essentials With Python',nameEn:'Data Science Essentials With Python',date:'12 نوفمبر 2026',dateEn:'12 Nov 2026',description:'إتمام مسار أساسيات علم البيانات باستخدام Python ضمن أكاديمية Cisco للشبكات.',descriptionEn:'Completed Data Science Essentials with Python through Cisco Networking Academy.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/Data_Science_Essentials_with_Python_certificate_m-gh-alaosimi-gmail-com_8efc04e1-0fb8-45d6-ab73-42cf16880aec.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠٠٥٥٠٤_OneDrive.jpg',tags:['Python','Data Science','Data Analysis'],tagsEn:['Python','Data Science','Data Analysis']},
  {id:'cisco-13',referenceId:'b9485360-a555-4d35-a62c-d14266f2be50',provider:'Cisco',name:'Endpoint Security',nameEn:'Endpoint Security',date:'12 نوفمبر 2026',dateEn:'12 Nov 2026',description:'إتمام مقرر أمن نقاط النهاية ضمن أكاديمية Cisco للشبكات.',descriptionEn:'Completed Endpoint Security through Cisco Networking Academy.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/Endpoint_Security_certificate_m-gh-alaosimi-gmail-com_b9485360-a555-4d35-a62c-d14266f2be50.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠٠٥٦٠٤_OneDrive.jpg',tags:['Endpoint Security','Cybersecurity','Device Protection'],tagsEn:['Endpoint Security','Cybersecurity','Device Protection']},
  {id:'cisco-14',referenceId:'39070537-a84b-4e8a-82d6-2168b7c6b355',provider:'Cisco',name:'IT Support Specialist Career Path',nameEn:'IT Support Specialist Career Path',date:'12 نوفمبر 2026',dateEn:'12 Nov 2026',description:'إتمام مسار IT Support Specialist Career Path ضمن أكاديمية Cisco للشبكات.',descriptionEn:'Completed the IT Support Specialist Career Path through Cisco Networking Academy.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/ITSupportSpecialistCareerPathv120261112-20-o8qyjp.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠١٠٠٤٠_OneDrive.jpg',tags:['IT Support','Technical Support','Troubleshooting'],tagsEn:['IT Support','Technical Support','Troubleshooting']},

  {id:'edraak-01',referenceId:'6addfdb9d4ce42cbb6581c5ad7798421',provider:'Edraak',name:'UI/UX Design',nameEn:'UI/UX Design',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'مدخل إلى تصميم واجهات المستخدم وتجربة الاستخدام ومبادئ بناء تجارب رقمية متمحورة حول المستخدم.',descriptionEn:'An introduction to user-interface and user-experience design and user-centred digital experiences.',file:'uiux-v1_certificate.PDF',preview:"previews/Screenshot_٢٠٢٦١١١٢_٢٣٣٤٢٩_OneDrive.jpg",tags:['UI Design','UX Design','User-Centred Design'],tagsEn:['UI Design','UX Design','User-Centred Design'],verification:edraakVerifyBase+'6addfdb9d4ce42cbb6581c5ad7798421/?lang=en'},
  {id:'edraak-02',referenceId:'e3d641d030654b5ea5a62a0011a80f41',provider:'Edraak',name:'Communications Skills',nameEn:'Communications Skills',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مهارات التواصل الفعال وتنظيم الأفكار والتفاعل في السياقات التعليمية والمهنية.',descriptionEn:'Effective communication, structuring ideas, and interaction in academic and professional contexts.',preview:"previews/Screenshot_٢٠٢٦١١١٢_٢٣٣٥٢٤_Edraak.jpg",tags:['Communication','Professional Skills'],tagsEn:['Communication','Professional Skills'],verification:edraakVerifyBase+'e3d641d030654b5ea5a62a0011a80f41/?lang=en'},
  {id:'edraak-03',referenceId:'b774c07893ef4cacb20a6271fcc126c3',provider:'Edraak',name:'Interaction Design Fundamentals',nameEn:'Interaction Design Fundamentals',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'مبادئ تصميم التفاعل وتنظيم استجابات الواجهة وسلوكها بما يدعم وضوح الاستخدام.',descriptionEn:'Interaction-design principles for structuring interface responses and predictable user behaviour.',file:'interactiondesign-v1_certificate.PDF',preview:"previews/Screenshot_٢٠٢٦١١١٢_٢٣٣٢٢٩_OneDrive.jpg",tags:['Interaction Design','User Experience'],tagsEn:['Interaction Design','User Experience'],verification:edraakVerifyBase+'b774c07893ef4cacb20a6271fcc126c3/?lang=en'},
  {id:'edraak-04',referenceId:'528490ad79e14aefb6f42e361200d20d',provider:'Edraak',name:'UX Research',nameEn:'UX Research',date:'29 يوليو 2026',dateEn:'29 Jul 2026',description:'مقدمة في فهم المستخدمين وجمع الملاحظات وتحليل الاحتياجات لدعم قرارات التصميم.',descriptionEn:'An introduction to understanding users, collecting feedback, and analysing needs to inform design decisions.',preview:"previews/Screenshot_٢٠٢٦١١١٢_٢٣٣٢٠٠_OneDrive.jpg",tags:['User Research','Research Methods'],tagsEn:['User Research','Research Methods'],verification:edraakVerifyBase+'528490ad79e14aefb6f42e361200d20d/?lang=en'},
  {id:'edraak-05',referenceId:'261ba96416f847dea412232020b915ec',provider:'Edraak',name:'UX Design',nameEn:'UX Design',date:'27 يوليو 2026',dateEn:'27 Jul 2026',description:'مفاهيم تصميم تجربة المستخدم وتنظيم الرحلات والتدفقات وتحسين قابلية الاستخدام.',descriptionEn:'User-experience design concepts, user journeys, interaction flows, and usability.',file:'uxdesign-v1_certificate.PDF',preview:"previews/Screenshot_٢٠٢٦١١١٢_٢٣٣٣٤٠_OneDrive.jpg",tags:['UX Design','Usability','User Journeys'],tagsEn:['UX Design','Usability','User Journeys'],verification:edraakVerifyBase+'261ba96416f847dea412232020b915ec/?lang=en'},
  {id:'edraak-06',referenceId:'39ab850762d242e4aba085047a34a440',provider:'Edraak',name:'User Interface Design Principles',nameEn:'User Interface Design Principles',date:'2 أغسطس 2026',dateEn:'2 Aug 2026',description:'مبادئ تصميم واجهات واضحة ومتناسقة، مع الاهتمام بالتسلسل البصري وسهولة الاستخدام.',descriptionEn:'Principles for clear and consistent interfaces, visual hierarchy, and ease of use.',file:'uidesign-v1_certificate.PDF',preview:"previews/Screenshot_٢٠٢٦١١١٢_٢٣٣٢٥٧_OneDrive.jpg",tags:['Interface Design','Visual Hierarchy'],tagsEn:['Interface Design','Visual Hierarchy'],verification:edraakVerifyBase+'39ab850762d242e4aba085047a34a440/?lang=en'},

  {id:'jsnad-01',referenceId:'JSNAD-ALOSEIMI-20241112',provider:'OpenJS',name:'OpenJS Node.js Application Developer (JSNAD)',nameEn:'OpenJS Node.js Application Developer (JSNAD)',date:'12 نوفمبر 2024',dateEn:'12 Nov 2024',description:'اعتماد مهني في تطوير تطبيقات Node.js صادر ضمن منظومة OpenJS Foundation وThe Linux Foundation.',descriptionEn:'A professional Node.js application-development credential issued through the OpenJS Foundation and The Linux Foundation.',preview:'1785613862401.png',tags:['Node.js','JavaScript','Application Development'],tagsEn:['Node.js','JavaScript','Application Development']},
  {id:'emc-01',referenceId:'SHR-2026-WS01-0330',provider:'EMC',name:'الذكاء الاصطناعي في حل المشكلات الواقعية',nameEn:'Artificial Intelligence for Real-World Problem Solving',date:'7 نوفمبر 2026',dateEn:'7 Nov 2026',description:'ورشة تدريبية ضمن برنامج شِراع 2026 حول توظيف الذكاء الاصطناعي في معالجة المشكلات الواقعية.',descriptionEn:'A Shiraa 2026 workshop on applying artificial intelligence to real-world problem solving.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/SHIRAA_Certificate_SHR-2026-WS01-0330.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠١١٥١٣_OneDrive.jpg',verification:'https://forms.edumc.nl/verify/SHR-2026-WS01-0330',tags:['Artificial Intelligence','Problem Solving'],tagsEn:['Artificial Intelligence','Problem Solving']},
  {id:'emc-02',referenceId:'SHR-2026-WS02-0291',provider:'EMC',name:'عصر وكلاء الذكاء الاصطناعي',nameEn:'The Age of AI Agents',date:'8 نوفمبر 2026',dateEn:'8 Nov 2026',description:'ورشة تدريبية ضمن برنامج شِراع 2026 حول وكلاء الذكاء الاصطناعي وتطبيقاتهم.',descriptionEn:'A Shiraa 2026 workshop exploring AI agents and their applications.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/SHIRAA_Certificate_SHR-2026-WS02-0291.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠١١٣٣٦_Chrome.jpg',verification:'https://forms.edumc.nl/verify/SHR-2026-WS02-0291',tags:['AI Agents','Artificial Intelligence'],tagsEn:['AI Agents','Artificial Intelligence']},
  {id:'emc-03',referenceId:'SHR-2026-WS03-0326',provider:'EMC',name:'الأتمتة الذكية ووكلاء الذكاء الاصطناعي',nameEn:'Intelligent Automation and AI Agents',date:'9 نوفمبر 2026',dateEn:'9 Nov 2026',description:'ورشة تدريبية ضمن برنامج شِراع 2026 حول الأتمتة الذكية وتكامل وكلاء الذكاء الاصطناعي.',descriptionEn:'A Shiraa 2026 workshop on intelligent automation and AI-agent integration.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/SHIRAA_Certificate_SHR-2026-WS03-0326.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠١١٥٣٠_OneDrive.jpg',verification:'https://forms.edumc.nl/verify/SHR-2026-WS03-0326',tags:['Intelligent Automation','AI Agents'],tagsEn:['Intelligent Automation','AI Agents']},
  {id:'emc-04',referenceId:'SHR-2026-WS04-0421',provider:'EMC',name:'إدارة المخاطر في المشاريع الريادية',nameEn:'Risk Management in Entrepreneurial Projects',date:'10 نوفمبر 2026',dateEn:'10 Nov 2026',description:'ورشة تدريبية ضمن برنامج شِراع 2026 حول تحديد المخاطر وتقييمها وإدارتها في المشاريع الريادية.',descriptionEn:'A Shiraa 2026 workshop on identifying, assessing, and managing risks in entrepreneurial projects.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/SHIRAA_Certificate_SHR-2026-WS04-0421.pdf",preview:'previews/Screenshot_٢٠٢٦١١١٣_٠١١٥٤٣_OneDrive.jpg',verification:'https://forms.edumc.nl/verify/SHR-2026-WS04-0421',tags:['Risk Management','Entrepreneurship'],tagsEn:['Risk Management','Entrepreneurship']},
  {id:'emc-05',referenceId:'SHR-2026-WS05-0514',provider:'EMC',name:'البرمجة ولغات البرمجة',nameEn:'Programming and Programming Languages',date:'11 نوفمبر 2026',dateEn:'11 Nov 2026',description:'ورشة تدريبية ضمن برنامج شِراع 2026 حول البرمجة ومفاهيم لغات البرمجة.',descriptionEn:'A Shiraa 2026 workshop covering programming and programming-language concepts.',file:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/SHIRAA_Certificate_SHR-2026-WS05-0514.pdf",preview:"https://raw.githubusercontent.com/mghalaosimi-web/mghalaosimi-web/f71427766ef253271121310e5069e7744e9faa52/docs/certificates-inbox/Screenshot_%D9%A2%D9%A0%D9%A2%D9%A6%D9%A1%D9%A1%D9%A1%D9%A3_%D9%A0%D9%A1%D9%A5%D9%A9%D9%A5%D9%A3_OneDrive.jpg",verification:'https://forms.edumc.nl/verify/SHR-2026-WS05-0514',tags:['Programming','Programming Languages'],tagsEn:['Programming','Programming Languages']},
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
  if(provider==='OpenJS')return <div className="wallet-partner-mark openedg-mark"><strong>OpenJS</strong><small>OPENJS FOUNDATION</small></div>;
  return <div className="wallet-partner-mark"><strong>EMC شِراع</strong><small>MASTER EMC · SHIRAA 2026</small></div>;
}

function CredentialCard({credential,index,en}:{credential:Credential;index:number;en:boolean}){
  const verify=credential.verification||(credential.provider==='Cisco'?credlyProfile:credential.provider==='Edraak'?'https://programs.edraak.org/':credential.provider==='OpenJS'?'https://openjsf.org/':'https://forms.edumc.nl/');
  const verifyLabel=credential.provider==='Cisco'?(en?'Credly badge':'شارة Credly'):credential.provider==='Edraak'?(en?'Edraak verification':'التحقق عبر إدراك'):credential.provider==='OpenJS'?(en?'OpenJS Foundation':'OpenJS Foundation'):(en?'EMC Shiraa verification':'التحقق من EMC شِراع');
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
          {(credential.preview||credential.badgeImage)
            ? <Image src={(credential.preview||credential.badgeImage)!.startsWith('https://')?(credential.preview||credential.badgeImage)!:'/assets/certificates/'+(credential.preview||credential.badgeImage)!} alt={(en?'Preview: ':'معاينة: ')+(en?credential.nameEn:credential.name)} width={720} height={520} sizes="(max-width: 768px) 100vw, 50vw" quality={75} loading="lazy" unoptimized={(credential.preview||credential.badgeImage)!.startsWith('https://')} className="credential-preview-image"/>
            : <div className="credential-document-placeholder"><Award/><b>{credential.provider==='Cisco'?'CISCO':credential.provider==='Edraak'?'EDRAAK':credential.provider==='OpenJS'?'OpenJS':'EMC شِراع'}</b><small>{credential.provider==='OpenJS'?'JSNAD':credential.provider==='EMC'?'SHIRAA 2026':'DIGITAL CREDENTIAL'}</small></div>}
        </div>
        <div className="certificate-actions">
          {credential.file&&<a href={credential.file.startsWith('https://')?credential.file:'/assets/certificates/'+credential.file} target="_blank" rel="noopener noreferrer">{en?'Open original PDF':'فتح ملف PDF الأصلي'} ↗</a>}
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
            <div><span>{en?'Provider':'الجهة'}</span><strong>{credential.provider==='Cisco'?'Cisco Networking Academy':credential.provider==='Edraak'?'Edraak':credential.provider==='OpenJS'?'OpenJS Foundation · The Linux Foundation':'Master EMC · Shiraa 2026'}</strong></div>
            <div><span>{en?'Issue date':'تاريخ الإصدار'}</span><strong>{en?credential.dateEn:credential.date}</strong></div>
            <div><span>{en?'Record':'حالة السجل'}</span><strong>{en?'Recorded credential':'شهادة مدرجة في السجل'}</strong></div>
            <div><span>{en?'Credential identifier':'معرّف الشهادة'}</span><code>{credential.referenceId||(en?'Not supplied in the current record':'غير متاح في السجل الحالي')}</code></div>
          </div>
          <a className="wallet-verify-button" href={verify} target="_blank" rel="noopener noreferrer">{en?'Open verification source':'فتح مصدر التحقق'} ↗</a>
        </section>
        <aside className="wallet-badge-column">
          <div className="wallet-badge-logo">
            <span className="credential-panel-label">M.GH.AL / CREDENTIAL</span>
            <div className="credential-badge-placeholder">{credential.badgeImage?<Image src={credential.badgeImage} alt={(en?"Official Credly badge for ":"شارة Credly الأصلية لاعتماد ")+(en?credential.nameEn:credential.name)} width={112} height={112} loading="lazy" unoptimized className="credential-badge-image"/>:<Award/>}<b>{credential.provider==='OpenJS'?'JSNAD':credential.provider==='Edraak'?'EDRAAK':credential.provider==='EMC'?'EMC':'CISCO'}</b><small>{String(index+1).padStart(2,'0')} / 26</small></div>
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
          ?'A structured record of twenty-six credentials: fourteen Cisco Networking Academy records, six Edraak certificates, one OpenJS professional credential, and five EMC Shiraa workshops. Original files and verification sources are shown when available.'
          :'سجل منظم يضم 26 شهادة واعتماداً: 14 من Cisco Networking Academy، و6 من إدراك، واعتماد JSNAD من OpenJS، و5 ورش من EMC شِراع. تُعرض الملفات الأصلية وروابط التحقق حيث تتوفر.'}</p>
      </div>
      <div className="credentials-verified"><span>✓</span> {en?'26 recorded credentials':'26 شهادة واعتماداً مسجلاً'}</div>
    </header>

    <section className="credentials-section" aria-labelledby="cisco-credentials-title">
      <div className="credentials-section-heading">
        <div><span className="eyebrow">CISCO NETWORKING ACADEMY · CREDLY</span><h2 id="cisco-credentials-title">{en?'Cisco professional credentials':'شهادات Cisco المهنية'}</h2></div>
        <span className="credentials-count">14 CREDENTIALS</span>
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
        {edraak.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+14} en={en}/>)}
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
        {openjs.map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+20} en={en}/>)}
      </div>
    </section>

    <section className="credentials-section" aria-labelledby="emc-credentials-title">
      <div className="credentials-section-heading"><div><span className="eyebrow">MASTER EMC · SHIRAA 2026</span><h2 id="emc-credentials-title">{en?'EMC Shiraa workshops':'ورش EMC شِراع 2026'}</h2></div><span className="credentials-count">05 WORKSHOPS</span></div>
      <div className="credentials-list credentials-wallet-list">{credentials.filter(item=>item.provider==='EMC').map((credential,index)=><CredentialCard key={credential.id} credential={credential} index={index+21} en={en}/>)}</div>
    </section>

    <p className="disclaimer">{en
      ?'Credential records reflect the information available in the M.GH.AL archive. A verification link is provided only to the issuer or profile source currently recorded; the presence of a local file does not replace issuer-side verification.'
      :'تعكس سجلات الشهادات المعلومات المتاحة في أرشيف M.GH.AL. يُعرض رابط التحقق إلى الجهة أو الملف المسجل حالياً؛ ووجود ملف محلي لا يحل محل التحقق من المصدر المانح.'}</p>
  </main>;
}
