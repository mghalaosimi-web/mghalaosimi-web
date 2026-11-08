import type {Metadata} from 'next';
import {cookies} from 'next/headers';
import Link from 'next/link';
import {
  ArrowUpLeft,
  ArrowUpRight,
  BrainCircuit,
  Fingerprint,
} from 'lucide-react';
import {localizedAlternates} from '../../lib/seo';

export async function generateMetadata():Promise<Metadata>{
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  return en
    ? {
        title:'Research & Academic Directions | M.GH.AL',
        description:'Research directions of Mohammed Ghaleb Alaosimi across applied AI, enterprise systems, software engineering, and transaction-aware authorization for AI agents in ERP.',
        alternates:localizedAlternates('/research','en'),
      }
    : {
        title:'الأبحاث والمسارات الأكاديمية | M.GH.AL',
        description:'المسارات البحثية لمحمد غالب العصيمي في الذكاء الاصطناعي التطبيقي والأنظمة المؤسسية وهندسة البرمجيات والتفويض الواعي بالمعاملات لوكلاء الذكاء الاصطناعي داخل ERP.',
        alternates:localizedAlternates('/research','ar'),
      };
}

const researchPrograms=[
  {
    id:'01',
    category:'حوكمة الذكاء الاصطناعي والأنظمة المؤسسية',
    categoryEn:'AI GOVERNANCE & ENTERPRISE SYSTEMS',
    title:'التفويض الواعي بالمعاملات والتنفيذ المقيّد للوكلاء الذكيين داخل أنظمة ERP',
    titleEn:'Transaction-Aware Authorization and Bounded Execution for AI Agents in ERP Systems',
    status:'مسار بحثي رئيسي قيد الإعداد · غير منشور',
    statusEn:'Research direction in preparation · Not published',
    tone:'active',
    summary:'استكشاف تصميم آليات تفويض تراعي سياق المعاملة داخل أنظمة ERP، وتقيّد تنفيذ الوكلاء الذكيين بمبدأ أقل صلاحية وحدود تشغيل واضحة وموافقات بشرية عند الحاجة.',
    summaryEn:'Exploring authorization mechanisms that account for transaction context in ERP systems and constrain AI-agent execution through least privilege, bounded runtime policies, and human approval for sensitive actions.',
    question:'كيف يمكن ضبط تنفيذ وكلاء الذكاء الاصطناعي داخل ERP بحيث ترتبط الصلاحية بنوع المعاملة وحالتها ومستخدمها، مع منع تجاوز الفصل بين المهام أو تنفيذ عمليات حساسة دون موافقة؟',
    questionEn:'How can AI-agent execution in ERP systems be constrained so permissions depend on transaction type, state, and user context while preventing separation-of-duties violations and unapproved sensitive actions?',
    method:'بناء نموذج تهديد يشمل حقن المطالبات وتضارب الصلاحيات وتجاوز الموافقات، ثم تصميم طبقة سياسات وقت التشغيل تجمع أقل صلاحية والتفويض المرتبط بالمعاملة وحدود الأفعال وسجل التدقيق والموافقة البشرية. تُقيّم الآلية على سيناريوهات ERP مضبوطة وقابلة لإعادة الاختبار.',
    methodEn:'Develop a threat model covering prompt injection, permission conflicts, and approval bypass; then design a runtime policy layer combining least privilege, transaction-aware authorization, bounded actions, audit logging, and human approval. Evaluate it using controlled, reproducible ERP scenarios.',
    outcome:'مرجع معماري، ومصفوفة سياسات وصلاحيات، ونموذج أولي قابل للاختبار، ومقاييس لقياس منع الأفعال غير المصرح بها وسلامة الموافقات وقابلية التدقيق.',
    outcomeEn:'An architecture reference, policy and permission matrix, testable prototype, and evaluation measures for unauthorized-action prevention, approval integrity, and auditability.',
    tags:['AI Agents','ERP','Least Privilege','Separation of Duties','Prompt Injection','Human-in-the-Loop'],
  },
  {
    id:'02',
    category:'الذكاء الاصطناعي التطبيقي وأنظمة المعرفة',
    categoryEn:'APPLIED AI & KNOWLEDGE SYSTEMS',
    title:'أنظمة معرفة ثنائية اللغة تعتمد المستندات والاسترجاع الموثّق',
    titleEn:'Bilingual Document-Grounded Knowledge Systems with Verifiable Retrieval',
    status:'استكشاف وتطوير',
    statusEn:'Exploration & development',
    tone:'preparing',
    summary:'دراسة تصميم منصات معرفية عربية وإنجليزية تسترجع المعلومات من المستندات، وتربط الإجابات بمصادرها، وتوضح حدود المعرفة بدلاً من تقديم إجابات غير مسندة.',
    summaryEn:'Exploring Arabic and English knowledge systems that retrieve information from documents, connect answers to their sources, and communicate knowledge limits rather than presenting unsupported responses.',
    question:'كيف يمكن تقييم موثوقية الإجابات المسترجعة من مستندات عربية وإنجليزية، وقياس دقة الاستشهاد بالمصدر وحدود الهلوسة؟',
    questionEn:'How can the reliability of answers retrieved from Arabic and English documents be evaluated, including source-citation accuracy and hallucination boundaries?',
    method:'إعداد مجموعة أسئلة ومستندات مرجعية، ومقارنة خطوط أساس للاسترجاع والتوليد المعزز بالاسترجاع، ثم قياس جودة الاسترجاع ووفاء الإجابة للمصدر وتغطية الاستشهادات وزمن الاستجابة.',
    methodEn:'Prepare a reference corpus and question set, compare retrieval and retrieval-augmented generation baselines, then measure retrieval quality, answer faithfulness, citation coverage, and response latency.',
    outcome:'مجموعة تقييم موثقة، وخط أساس قابل للتكرار، ومصفوفة قياس لجودة الإجابات والاستشهادات.',
    outcomeEn:'A documented evaluation set, reproducible baseline, and measurement framework for answer and citation quality.',
    tags:['Applied AI','RAG','Arabic NLP','Information Retrieval','Evaluation'],
  },
  {
    id:'03',
    category:'هندسة البرمجيات والأنظمة المؤسسية',
    categoryEn:'SOFTWARE ENGINEERING & ENTERPRISE SYSTEMS',
    title:'أنماط معمارية للصلاحيات وسير العمل في الأنظمة المؤسسية',
    titleEn:'Architecture Patterns for Authorization and Workflow in Enterprise Systems',
    status:'اهتمام أكاديمي وتطبيقي',
    statusEn:'Academic & practical interest',
    tone:'preparing',
    summary:'دراسة تصميم أنظمة مؤسسية قابلة للصيانة والتوسع، مع ربط الصلاحيات بالأدوار والموارد وسياق العملية، وتوثيق أثر القرارات على مسارات العمل.',
    summaryEn:'Studying maintainable enterprise-system architectures that connect permissions to roles, resources, and workflow context while preserving decision traceability.',
    question:'ما الأنماط التي تساعد على تحقيق توازن بين بساطة إدارة الصلاحيات، والفصل بين المهام، وقابلية التوسع والتدقيق في الأنظمة متعددة الوحدات؟',
    questionEn:'Which patterns balance permission-management simplicity, separation of duties, scalability, and auditability in multi-module enterprise systems?',
    method:'مراجعة أنماط RBAC وABAC ومبادئ الفصل بين المهام، ثم تصميم نموذج مرجعي يربط الأدوار والموارد والعمليات وسجل التدقيق، واختباره على سيناريوهات إدارية نموذجية.',
    methodEn:'Review RBAC and ABAC patterns and separation-of-duties principles, then design a reference model connecting roles, resources, workflows, and audit records and test it against representative administrative scenarios.',
    outcome:'نموذج صلاحيات موثق، ومخططات تدفق، وقائمة تحقق لتقييم قابلية الصيانة والتدقيق.',
    outcomeEn:'A documented authorization model, workflow diagrams, and a checklist for maintainability and auditability.',
    tags:['Software Architecture','RBAC','ABAC','ERP','Auditability'],
  },
];

export default async function ResearchPage(){
  const en=(await cookies()).get('portfolio-locale')?.value==='en';
  return <main className="content-page rs-page">
    <div className="rs-topline">
      <span>M.GH.AL / RESEARCH OFFICE</span>
      <span>APPLIED AI · SOFTWARE ENGINEERING · ENTERPRISE SYSTEMS</span>
    </div>

    <section className="rs-identity">
      <div className="rs-identity-grid" aria-hidden="true"><i/><i/><i/><i/></div>
      <div className="rs-identity-copy">
        <span className="rs-kicker"><span className="rs-live-dot"/> M.GH.AL RESEARCH DIRECTIONS / 2026</span>
        <p className="rs-overline">APPLIED AI · SOFTWARE ENGINEERING · ENTERPRISE SYSTEMS</p>
        <h1>{en?<>Research <em>identity</em></>:<>الهوية <em>البحثية</em></>}</h1>
        <h2>Mohammed Ghaleb Alaosimi</h2>
        <p className="rs-intro">{en
          ?'An independent academic and applied-research direction connecting software engineering, enterprise systems, and applied AI. The focus is on clear research questions, testable methods, and verifiable outcomes.'
          :'مسار بحثي أكاديمي وتطبيقي مستقل يربط هندسة البرمجيات والأنظمة المؤسسية والذكاء الاصطناعي التطبيقي، مع التركيز على الأسئلة الواضحة والمنهجيات القابلة للاختبار والمخرجات التي يمكن التحقق منها.'}</p>
        <div className="rs-focus-tags">
          <span>Applied AI</span><span>Enterprise Systems</span><span>AI Agents</span><span>Software Architecture</span>
        </div>
      </div>
      <div className="rs-seal">
        <div className="rs-seal-ring">
          <div className="rs-seal-core"><BrainCircuit/><b>MG</b><small>RESEARCH</small></div>
        </div>
        <span>M.GH.AL / INDEPENDENT RESEARCH</span>
        <strong>RESEARCH · DESIGN · VALIDATE</strong>
      </div>
      <div className="rs-identity-footer">
        <span>RESEARCH PROFILE / MGHAL-2026</span>
        <span>YEMEN <i/> INFORMATION TECHNOLOGY</span>
      </div>
    </section>

    <section className="rs-orcid">
      <div className="rs-orcid-main">
        <span className="rs-orcid-mark">iD</span>
        <div><small>INTERNATIONAL RESEARCHER IDENTIFIER</small><h2>{en?'International researcher identifier':'المعرّف البحثي الدولي'}</h2><p>ORCID researcher record</p></div>
      </div>
      <a href="https://orcid.org/0009-0000-6007-3170" target="_blank" rel="noopener noreferrer">
        <b>0009-0000-6007-3170</b>
        <span>{en?'View ORCID record':'عرض سجل ORCID'} <ArrowUpRight size={15}/></span>
      </a>
    </section>

    <section className="rs-intro-section">
      <div>
        <span className="rs-section-kicker">RESEARCH PORTFOLIO / 01</span>
        <h2>{en?'Research directions and study proposals':'المسارات البحثية والمقترحات العلمية'}</h2>
        <p>{en
          ?'A focused set of research directions designed to develop into academic plans and applied studies. Each entry states its problem, method, and expected outputs.'
          :'مجموعة مركزة من المسارات البحثية القابلة للتطوير إلى خطط أكاديمية ودراسات تطبيقية. يوضح كل مسار المشكلة والمنهجية والمخرجات المتوقعة.'}</p>
      </div>
      <div className="rs-count"><b>03</b><span>RESEARCH<br/>DIRECTIONS</span></div>
    </section>

    <div className="rs-status-legend">
      <span><i className="active"/> {en?'Primary direction in preparation':'المسار البحثي الرئيسي قيد الإعداد'}</span>
      <span><i className="preparing"/> {en?'Exploration & development':'استكشاف وتطوير'}</span>
    </div>

    <section className="rs-research-grid" aria-label={en?'Research directions':'المسارات البحثية'}>
      {researchPrograms.map(item=>(
        <article className="rs-paper" key={item.id}>
          <div className="rs-paper-top">
            <span className="rs-paper-number">RESEARCH / {item.id}</span>
            <span className={'rs-status '+item.tone}>{en?item.statusEn:item.status}</span>
          </div>
          <span className="rs-paper-category">{en?item.categoryEn:item.category}</span>
          <h3>{en?item.titleEn:item.title}</h3>
          <small className="rs-paper-en">{item.titleEn}</small>
          <p className="rs-paper-summary">{en?item.summaryEn:item.summary}</p>
          <div className="rs-paper-detail"><b>{en?'Research question':'الإشكالية البحثية'}</b><p>{en?item.questionEn:item.question}</p></div>
          <div className="rs-paper-detail"><b>{en?'Proposed methodology':'المنهجية المقترحة'}</b><p>{en?item.methodEn:item.method}</p></div>
          <div className="rs-paper-outcome"><b>{en?'Expected outputs':'المخرجات المتوقعة'}</b><p>{en?item.outcomeEn:item.outcome}</p></div>
          <div className="rs-paper-tags">{item.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
          <div className="rs-paper-foot"><span>RESEARCH PROFILE</span><b>M.GH.AL · Mohammed Ghaleb Alaosimi</b></div>
        </article>
      ))}
    </section>

    <section className="rs-method">
      <div>
        <span className="rs-section-kicker">RESEARCH GOVERNANCE / 02</span>
        <h2>{en?'Research methodology':'منهجية العمل البحثي'}</h2>
        <p>{en
          ?'Each study begins with a bounded question, a review of primary sources, a reproducible method, and an explicit account of limitations. Hypotheses are not presented as findings, and outcomes are not claimed before evaluation.'
          :'تبدأ كل دراسة بسؤال محدد النطاق، ومراجعة للمصادر الأولية، ومنهج قابل للتكرار، وبيان واضح للحدود. لا تُعرض الفرضيات على أنها نتائج، ولا تُنسب مخرجات قبل اختبارها وتوثيقها.'}</p>
      </div>
      <div className="rs-method-steps">
        <article><b>01</b><strong>{en?'Define the problem':'تحديد المشكلة'}</strong><small>{en?'Scope, question, and assumptions':'النطاق والسؤال والفرضيات'}</small></article>
        <article><b>02</b><strong>{en?'Review the literature':'مراجعة الأدبيات'}</strong><small>{en?'Standards and prior work':'المعايير والأعمال السابقة'}</small></article>
        <article><b>03</b><strong>{en?'Design and experiment':'التصميم والتجربة'}</strong><small>{en?'Reproducible method':'منهج قابل للتكرار'}</small></article>
        <article><b>04</b><strong>{en?'Evaluate and document':'التقييم والتوثيق'}</strong><small>{en?'Results, limits, and sources':'النتائج والحدود والمراجع'}</small></article>
      </div>
    </section>

    <aside className="rs-authorship-note">
      <div className="rs-note-icon"><Fingerprint/></div>
      <div>
        <span>AUTHORSHIP & RESEARCH STATUS</span>
        <h2>{en?'Research authorship and status':'ملاحظة توثيقية حول ملكية الأفكار وحالة الأبحاث'}</h2>
        <p>{en
          ?'These entries describe research directions and proposals associated with M.GH.AL. They are not presented as completed theses, peer-reviewed papers, or published results. Their status will be updated when methods, evidence, and outputs are completed and documented.'
          :'هذه الصفحات تعرض مسارات ومقترحات بحثية ضمن M.GH.AL، ولا تُقدَّم على أنها رسائل مكتملة أو أوراق محكّمة أو نتائج منشورة. ستُحدّث حالة كل مسار عند اكتمال المنهجية والأدلة والمخرجات وتوثيقها.'}</p>
        <p>{en
          ?'The primary direction focuses on transaction-aware authorization and bounded execution for AI agents in ERP systems, with least privilege, separation of duties, runtime policy enforcement, and human approval for sensitive actions.'
          :'يركز المسار الرئيسي على التفويض الواعي بالمعاملات والتنفيذ المقيّد لوكلاء الذكاء الاصطناعي داخل ERP، مع أقل صلاحية والفصل بين المهام وإنفاذ السياسات وقت التشغيل والموافقة البشرية على الإجراءات الحساسة.'}</p>
      </div>
    </aside>

    <footer className="rs-footer">
      <span>M.GH.AL / RESEARCH PORTFOLIO</span>
      <b>Building Knowledge. Engineering with Purpose.</b>
      <Link href="/contact">{en?'Professional contact':'التواصل المهني'} <ArrowUpLeft size={14}/></Link>
    </footer>
  </main>;
}
