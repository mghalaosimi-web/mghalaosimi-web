const siteUrl='https://mghalaosimi-web.vercel.app';
const personId=siteUrl+'/#person';

const person={
  '@type':'Person',
  '@id':personId,
  name:'Mohammed Ghaleb Alaosimi',
  alternateName:['محمد غالب العصيمي','M.GH.AL'],
  url:siteUrl,
  image:siteUrl+'/assets/images/mghal-avatar.webp',
  jobTitle:'Full-Stack Developer | Software Engineer | IT Student',
  description:'Information Technology student and full-stack developer focused on software engineering, enterprise systems, applied AI, and bilingual digital experiences.',
  affiliation:{
    '@type':'CollegeOrUniversity',
    name:'Al-Manar College for Science and Technology'
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
    'Artificial Intelligence',
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
