/**
 * Adds bilingual engineering context and consistent action labels to project cards.
 */
const isEnglish = document.documentElement.lang.toLowerCase().startsWith("en");
const projectSelector = location.pathname.endsWith("projects.html")
  ? "main .grid .card, main .item"
  : "#projects .card";

function getProjectScope(title: string): string {
  if (/WAYNAH|وَيْنَه|وينه/i.test(title)) return isEnglish ? "Geospatial discovery & trusted local data" : "الاستكشاف الجغرافي والبيانات المحلية الموثوقة";
  if (/Humanity/i.test(title)) return isEnglish ? "Institutional workflow & records management" : "إدارة السجلات والعمليات المؤسسية";
  if (/Content/i.test(title)) return isEnglish ? "AI-assisted content workflow automation" : "أتمتة دورة إنتاج المحتوى بالذكاء الاصطناعي";
  if (/Yemen AI/i.test(title)) return isEnglish ? "AI platform, RAG & document retrieval" : "منصة ذكاء اصطناعي وRAG واسترجاع المستندات";
  if (/CipherSphere/i.test(title)) return isEnglish ? "Cryptography & cybersecurity education" : "التشفير والتعليم الأمني";
  if (/FocusFlow/i.test(title)) return isEnglish ? "Mobile productivity & habit tracking" : "إنتاجية الجوال وتتبع العادات";
  if (/Schedule/i.test(title)) return isEnglish ? "Academic scheduling systems" : "أنظمة الجدولة الأكاديمية";
  if (/ESDP/i.test(title)) return isEnglish ? "Windows desktop application" : "تطبيق مكتبي لنظام Windows";
  return isEnglish ? "Software engineering" : "هندسة البرمجيات";
}

document.querySelectorAll<HTMLElement>(projectSelector).forEach((card) => {
  const title = card.querySelector("h2, h3")?.textContent?.trim() ?? "";
  if (!title || card.dataset.engineeringEnhanced === "true") return;
  card.dataset.engineeringEnhanced = "true";
  card.classList.add("engineering-card");

  const status = card.querySelector(".status")?.textContent?.trim() ??
    (isEnglish ? "Recorded project" : "مشروع مسجل");
  const meta = document.createElement("div");
  meta.className = "engineering-meta";
  const scopeNode = document.createElement("span");
  scopeNode.className = "engineering-role";
  scopeNode.textContent = (isEnglish ? "Engineering scope: " : "النطاق الهندسي: ") + getProjectScope(title);
  const statusNode = document.createElement("span");
  statusNode.className = "status";
  statusNode.textContent = status;
  meta.append(scopeNode, statusNode);

  const cover = card.querySelector(".project-cover");
  if (cover) cover.after(meta);
  else card.prepend(meta);

  const links = Array.from(card.querySelectorAll<HTMLAnchorElement>("a[href]"))
    .filter((anchor) => !anchor.closest(".engineering-actions"));
  const actions = document.createElement("div");
  actions.className = "engineering-actions";
  links.forEach((anchor) => {
    const href = anchor.href;
    const preview = href.includes("vercel.app") || href.includes("onrender.com");
    anchor.textContent = href.includes("github.com")
      ? (isEnglish ? "GitHub repository ↗" : "المستودع على GitHub ↗")
      : preview
        ? (isEnglish ? "Live preview ↗" : "المعاينة المباشرة ↗")
        : (isEnglish ? "Project details ↗" : "تفاصيل المشروع ↗");
    anchor.classList.add("engineering-action");
    if (preview) anchor.classList.add("primary-action");
    actions.append(anchor);
  });
  if (actions.children.length > 0) card.append(actions);
});
