const siteUrl='https://mghalaosimi-web.vercel.app';
const personId=siteUrl+'/#person';

const person={
  '@type':'Person',
  '@id':personId,
  name:'Mohammed Ghaleb Alaosimi',
  givenName:'Mohammed Ghaleb',
  familyName:'Alaosimi',
  alternateName:['محمد غالب العصيمي','M.GH.AL'],
  identifier:{'@type':'PropertyValue',propertyID:'ORCID',value:'0009-0000-6007-3170'},
  url:siteUrl,
  image:siteUrl+'/assets/images/mghal-profile-primary.jpg',
  jobTitle:'Full-Stack Developer | Software Engineer | IT Student',
  description:'Mohammed Ghaleb Alaosimi (M.GH.AL) is an Information Technology bachelor’s student at Al-Manar College for Science and Technology in Yemen and a Full-Stack Developer focused on software engineering, React, Next.js, Node.js, TypeScript, enterprise and ERP systems, role-based access control, databases, applied AI, and bilingual Arabic-English digital products.',
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
