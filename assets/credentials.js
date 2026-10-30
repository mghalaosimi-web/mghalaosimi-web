/* M.GH.AL Credentials — accessible search, filters and live totals */
(()=>{"use strict";
const root=document.querySelector(".credentials-page")||document.querySelector("main");
if(!root||!document.querySelector(".credential-toolbar"))return;
const toolbar=root.querySelector(".credential-toolbar"),search=toolbar.querySelector(".credential-search"),filters=[...toolbar.querySelectorAll(".credential-filter")],cards=[...root.querySelectorAll(".credential-detail")],count=toolbar.querySelector(".credential-count"),grid=root.querySelector(".credential-detail")?.parentElement;
const isEn=document.documentElement.lang.toLowerCase().startsWith("en");
const labels=isEn?{all:"All credentials",shown:"shown",empty:"No credentials match your search. Try another term or category.",stats:["Total credentials","Cisco Networking Academy","Edraak","OpenJS / Linux Foundation"]}:{all:"كل الشهادات",shown:"معروض",empty:"لا توجد شهادات تطابق البحث. جرّب كلمة أو تصنيفاً آخر.",stats:["إجمالي الشهادات","أكاديمية Cisco","إدراك","OpenJS / Linux Foundation"]};
const normalize=value=>String(value||"").toLocaleLowerCase().normalize("NFKD").replace(/[\u064B-\u065F\u0670]/g,"").replace(/[أإآ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").replace(/[^\p{L}\p{N}\s.-]/gu," ").replace(/\s+/g," ").trim();
let active="all";
const overview=document.createElement("section");overview.className="credential-overview";overview.setAttribute("aria-label",isEn?"Credential summary":"ملخص الشهادات");
const totals=[cards.length,cards.filter(c=>/Cisco Networking Academy/i.test(c.innerText)).length,cards.filter(c=>/Edraak/i.test(c.innerText)).length,cards.filter(c=>/OpenJS|Linux Foundation/i.test(c.innerText)).length];
totals.forEach((n,i)=>{const box=document.createElement("div");box.className="credential-stat";const value=document.createElement("strong");value.textContent=String(n);const label=document.createElement("span");label.textContent=labels.stats[i];box.append(value,label);overview.append(box)});
toolbar.before(overview);
let empty=grid?.querySelector(".credential-empty");
if(!empty&&grid){empty=document.createElement("div");empty.className="credential-empty";empty.hidden=true;empty.textContent=labels.empty;grid.append(empty)}
function apply(){const q=normalize(search?.value),terms=q.split(" ").filter(Boolean);let visible=0;
cards.forEach(card=>{const category=card.dataset.category||"other",hay=normalize(card.innerText+" "+(card.dataset.search||""));const matchCategory=active==="all"||category===active;const matchText=!terms.length||terms.every(term=>hay.includes(term));const show=matchCategory&&matchText;card.hidden=!show;if(show)visible++});
if(empty)empty.hidden=visible!==0;
if(count)count.textContent=isEn?visible+" of "+cards.length+" credentials "+labels.shown:visible+" من أصل "+cards.length+" شهادة معروضة";
}
filters.forEach(button=>button.addEventListener("click",()=>{active=button.dataset.filter||"all";filters.forEach(item=>item.setAttribute("aria-pressed",String(item===button)));apply()}));
search?.addEventListener("input",apply);
search?.addEventListener("keydown",event=>{if(event.key==="Escape"&&search.value){search.value="";apply();search.blur()}});
apply();
const fileSection=root.querySelector(".original-files");if(fileSection){const fileCards=[...fileSection.querySelectorAll(".credential-file")];const heading=fileSection.querySelector(".original-files-heading");if(heading&&fileCards.length){const note=document.createElement("p");note.className="credential-count";note.textContent=isEn?fileCards.length+" original PDF previews. Repeated uploads are retained as separate source files, not counted as extra credentials.":fileCards.length+" معاينة لملفات PDF الأصلية. النسخ المكررة محفوظة كملفات مصدر ولا تُحتسب شهادات إضافية.";heading.append(note)}}
})();