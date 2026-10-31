"use strict";
(async function(){
 const grid=document.querySelector("main .grid");if(!grid)return;
 const en=document.documentElement.lang.toLowerCase().startsWith("en"),lang=en?"en":"ar";
 const r=await fetch("/assets/projects/catalog.json",{cache:"force-cache"});if(!r.ok)return;
 const data=await r.json(),cards=[...grid.querySelectorAll(".card")];
 const map=[[/WAYNAH|وَيْنَه|وينه/i,"waynah"],[/Humanity/i,"humanity-system"],[/Yemen AI/i,"yemen-ai"],[/Content/i,"mghal-content-os"],[/CipherSphere/i,"ciphersphere"],[/FocusFlow/i,"focusflow"],[/Schedule|الجدول|الجامعي/i,"manar-schedule-system"],[/ESDP/i,"mghal-esdp"]];
 const words=en?{title:"Find a project",placeholder:"Search by name, technology or purpose",all:"All categories",web:"Web platforms",ai:"AI & automation",academic:"Academic systems",desktop:"Desktop apps",mobile:"Mobile apps",empty:"No matching projects.",detail:"Project details ↗",count:n=>n+" projects shown"}:{title:"ابحث وصنّف المشاريع",placeholder:"ابحث بالاسم أو التقنية أو مجال المشروع",all:"كل التصنيفات",web:"منصات الويب",ai:"الذكاء الاصطناعي والأتمتة",academic:"الأنظمة الأكاديمية",desktop:"تطبيقات سطح المكتب",mobile:"تطبيقات الجوال",empty:"لا توجد مشاريع مطابقة.",detail:"تفاصيل المشروع ↗",count:n=>"عرض "+n+" مشروع"};
 const panel=document.createElement("section");panel.className="project-filter";panel.setAttribute("aria-label",words.title);
 panel.innerHTML="<label><span>"+words.title+"</span><input type='search' id='project-search' placeholder='"+words.placeholder+"' autocomplete='off'></label><label><span>"+(en?"Category":"التصنيف")+"</span><select id='project-category'><option value=''>"+words.all+"</option><option value='web'>"+words.web+"</option><option value='ai'>"+words.ai+"</option><option value='academic'>"+words.academic+"</option><option value='desktop'>"+words.desktop+"</option><option value='mobile'>"+words.mobile+"</option></select></label><p class='project-count' aria-live='polite'></p>";
 grid.before(panel);const input=panel.querySelector("#project-search"),select=panel.querySelector("#project-category"),count=panel.querySelector(".project-count");
 const empty=document.createElement("p");empty.className="project-empty";empty.textContent=words.empty;empty.hidden=true;grid.after(empty);
 cards.forEach(card=>{
  const title=card.querySelector("h2,h3")?.textContent?.trim()||"",m=map.find(x=>x[0].test(title));if(!m)return;
  const p=data.projects.find(x=>x.slug===m[1]);if(!p)return;
  card.dataset.category=p.categoryKey;card.dataset.search=[title,p.summary[lang],...(p.technologies||[])].join(" ").toLowerCase();
  const a=document.createElement("a");a.className="project-detail-link";a.href=(en?"/en":"")+"/projects/"+p.slug+"/";a.textContent=words.detail;a.setAttribute("aria-label",words.detail+" "+p.title[lang]);card.append(a);
 });
 function apply(){const q=input.value.trim().toLowerCase(),c=select.value;let n=0;cards.forEach(card=>{const ok=(!q||(card.dataset.search||card.textContent).toLowerCase().includes(q))&&(!c||card.dataset.category===c);card.hidden=!ok;if(ok)n++;});count.textContent=words.count(n);empty.hidden=n!==0;}
 input.addEventListener("input",apply);select.addEventListener("change",apply);apply();
})().catch(e=>console.error("Project catalogue enhancement:",e));