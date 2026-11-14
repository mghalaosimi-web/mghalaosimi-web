import type {Metadata} from 'next';
import {notFound,redirect} from 'next/navigation';
import HomePageEnglish from '../../HomePageEnglish';
import AboutTabsEnglish from '../../about/AboutTabsEnglish';
import ProjectsExplorerEnglish from '../../projects/ProjectsExplorerEnglish';
import ProjectDetail from '../../projects/[slug]/page';
import SkillsExplorer from '../../skills/SkillsExplorer';
import CredentialsPage from '../../credentials/page';
import ContactPageEnglish from '../../contact/ContactPageEnglish';
import LabsExplorerEnglish from '../../labs/LabsExplorerEnglish';
import ResearchPage from '../../research/page';
import PhotosPage from '../../photos/page';

type RouteProps={params:Promise<{path?:string[]}>};

const aliases:Record<string,string>={
  profile:'about','profile.html':'about',
  'projects.html':'projects','skills.html':'skills',
  education:'about','education.html':'about',
  achievements:'credentials','achievements.html':'credentials',
  certificates:'credentials','certificates.html':'credentials',
  knowledge:'labs','knowledge.html':'labs',
  contact:'contact','contact.html':'contact',
  showcase:'projects','showcase.html':'projects',
  resume:'about','resume.html':'about',
  research:'research','research.html':'research',
  'article.html':'labs'
};

export async function generateMetadata({params}:RouteProps):Promise<Metadata>{
  const {path=[]}=await params;
  const raw=path.join('/');
  const normalized=aliases[raw]||raw;
  const canonical='/en'+(normalized?'/'+normalized:'');
  const titles:Record<string,string>={
    '':'Home | M.GH.AL','about':'About Mohammed Ghaleb Alaosimi | M.GH.AL',
    'projects':'Engineering Projects | M.GH.AL','skills':'Skills & Capabilities | M.GH.AL',
    'credentials':'Credentials | M.GH.AL','contact':'Professional Contact | M.GH.AL',
    'labs':'Labs & Knowledge | M.GH.AL','research':'Research | M.GH.AL','photos':'Photo Gallery | M.GH.AL'
  };
  const arabicPath=normalized?'/'+normalized:'/';
  const origin='https://mghalaosimi-web.vercel.app';
  return {title:titles[normalized]||'Project | M.GH.AL',alternates:{canonical,languages:{ar:origin+arabicPath,en:origin+canonical,'x-default':origin+arabicPath}},robots:{index:true,follow:true}};
}

export default async function EnglishRoute({params}:RouteProps){
  const {path=[]}=await params;
  const raw=path.join('/');
  const normalized=aliases[raw]||raw;
  if(raw!==normalized)redirect('/en/'+normalized);
  if(path.length===0)return <HomePageEnglish/>;
  if(normalized==='about')return <AboutTabsEnglish/>;
  if(normalized==='projects')return <ProjectsExplorerEnglish/>;
  if(normalized==='skills')return <SkillsExplorer locale="en"/>;
  if(normalized==='credentials')return <CredentialsPage/>;
  if(normalized==='contact')return <ContactPageEnglish/>;
  if(normalized==='labs')return <LabsExplorerEnglish/>;
  if(normalized==='research')return <ResearchPage/>;
  if(normalized==='photos')return <PhotosPage/>;
  if(path.length===2&&path[0]==='projects')return <ProjectDetail params={Promise.resolve({slug:path[1]})}/>;
  notFound();
}
