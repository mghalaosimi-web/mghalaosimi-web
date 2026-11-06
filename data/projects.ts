export type Project={slug:string;name:string;stack:string[];featured?:boolean;status?:string;summary?:string;repository?:string};
export const projects:Project[]=[
{slug:'waynah',name:'WAYNAH | وَيْنَه؟',stack:['Next.js','TypeScript','PostgreSQL','PostGIS'],featured:true,status:'In Progress',summary:'منصة استكشاف جغرافي محلية موثوقة لليمن.',repository:'https://github.com/mghalaosimi-web/waynah'},
{slug:'mghal-content-os',name:'M.GH.AL Content OS',stack:['Next.js','TypeScript','Prisma','PostgreSQL'],featured:true,status:'In Progress',summary:'نظام لإدارة دورة إنتاج المحتوى وتخطيطه ومراجعته.'},
{slug:'manar-schedule-system',name:'Manar Schedule System',stack:['React','Node.js','Prisma','PostgreSQL'],featured:true,status:'Collaborative',summary:'نظام تعاوني لتنظيم الجداول الأكاديمية.'},
{slug:'humanity-system',name:'Humanity System',stack:['Full-Stack','Database','RBAC'],status:'Private / In Progress'},
{slug:'focusflow',name:'FocusFlow',stack:['Flutter','Dart'],status:'Experimental'},
{slug:'al-manar-schedule-system',name:'Al-Manar Schedule System',stack:['Web','Academic Systems'],status:'In Progress'},
{slug:'yemen-ai-platform',name:'Yemen AI Platform',stack:['Python','AI','RAG'],status:'Experimental'},
{slug:'ciphersphere',name:'CipherSphere',stack:['Cryptography','Web'],status:'Experimental'},
{slug:'mghal-esdp',name:'M.GH.AL ESDP',stack:['Desktop Software'],status:'Private · Unpublished'},
{slug:'mghal-official-website',name:'M.GH.AL Official Website',stack:['Next.js','React','SEO'],status:'Active'}
];
