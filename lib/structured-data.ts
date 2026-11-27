const siteUrl='https://mghalaosimi-web.vercel.app';
const personId=siteUrl+'/#person';
const profileId=siteUrl+'/#profile';

const person={
  '@type':'Person',
  '@id':personId,
  name:'محمد غالب العصيمي',
  givenName:'Mohammed Ghaleb',
  familyName:'Alaosimi',
  alternateName:[
    'محمد غالب ناصر العصيمي',
    'محمد العصيمي',
    'Mohammed Ghaleb Alaosimi',
    'Mohammed Alaosimi',
    'M.GH.AL'
  ],
  identifier:{'@type':'PropertyValue',propertyID:'ORCID',value:'0009-0000-6007-3170'},
  url:siteUrl,
  mainEntityOfPage:{'@id':profileId},
  image:siteUrl+'/assets/images/mghal-profile-primary.jpg',
  jobTitle:'Full-Stack Developer | Software Engineer | IT Student',
  description:'محمد غالب العصيمي، المعروف أيضاً باسم محمد غالب ناصر العصيمي وMohammed Ghaleb Alaosimi، طالب بكالوريوس تقنية معلومات في كلية المنار للعلوم والتكنولوجيا باليمن ومطور برمجيات شامل يعمل على بناء تطبيقات الويب والأنظمة المؤسسية ومنتجات رقمية ثنائية اللغة.',
  affiliation:{
    '@type':'CollegeOrUniversity',
    name:'Al-Manar College for Science and Technology',
    address:{'@type':'PostalAddress',addressCountry:'YE'}
  },
  sameAs:[
    'https://github.com/mghalaosimi-web',
    'https://www.linkedin.com/in/mohammed-alaosimi-038155443/',
    'https://www.credly.com/users/mohammed-ghaleb-al-aosimi',
    'https://orcid.org/0009-0000-6007-3170',
    'https://www.instagram.com/q_v94/',
    'https://www.tiktok.com/@m.gh.al.2006'
  ],
  knowsAbout:[
    'Information Technology',
    'Software Engineering',
    'Full-Stack Development',
    'Enterprise Resource Planning',
    'Role-Based Access Control',
    'TypeScript',
    'React',
    'Next.js',
    'Node.js',
    'PostgreSQL',
    'Artificial Intelligence',
    'AI Agent Governance',
    'Database Systems',
    'Cloud Computing',
    'User Experience Design'
  ]
};

export function siteJsonLd(){
  return {
    '@context':'https://schema.org',
    '@graph':[
      person,
      {
        '@type':'ProfilePage',
        '@id':profileId,
        url:siteUrl,
        name:'الملف الشخصي الرسمي لمحمد غالب العصيمي | M.GH.AL',
        inLanguage:['ar','en'],
        mainEntity:{'@id':personId},
        isPartOf:{'@id':siteUrl+'/#website'}
      },
      {
        '@type':'WebSite',
        '@id':siteUrl+'/#website',
        url:siteUrl,
        name:'M.GH.AL',
        alternateName:'Mohammed Ghaleb Alaosimi',
        inLanguage:['ar','en'],
        publisher:{'@id':personId}
      }
    ]
  };
}

export function credentialsJsonLd(){
  return {'@context':'https://schema.org',...person,hasCredential:[]};
}

export function projectJsonLd(project:{slug:string;name:string;summary:string;stack:string[];repository?:string}){
  return {
    '@context':'https://schema.org',
    '@type':'SoftwareSourceCode',
    name:project.name,
    description:project.summary,
    url:siteUrl+'/projects/'+project.slug+'/',
    author:person,
    programmingLanguage:project.stack,
    ...(project.repository?{codeRepository:project.repository}:{})
  };
}
