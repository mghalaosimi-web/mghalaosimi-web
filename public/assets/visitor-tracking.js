(()=>{'use strict';
 if(window.__mghalVisitorTracking)return;window.__mghalVisitorTracking=true;
 if(navigator.doNotTrack==='1')return;
 const API='',KEY='mghal_visitor_v1';
 const path=location.pathname,kind=path.includes('/projects/')?'project_view':path.includes('certificates')?'certificate_view':path.includes('knowledge')?'article_view':'page_view';
 async function createVisitor(){
  let visitorToken=null;try{visitorToken=localStorage.getItem(KEY)}catch{}
  const response=await fetch(API+'/api/public/visitors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken,path}),keepalive:true});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.visitorToken)throw new Error('Visitor session unavailable');
  try{localStorage.setItem(KEY,data.visitorToken)}catch{}
  window.dispatchEvent(new CustomEvent('mghal:visitor-ready',{detail:data}));
  return data.visitorToken;
 }
 window.__mghalVisitorPromise=window.__mghalVisitorPromise||createVisitor();
 window.__mghalVisitorPromise.then(async visitorToken=>{
  try{await fetch(API+'/api/public/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken,eventType:kind,path,referrer:document.referrer||undefined}),keepalive:true})}catch{}
 }).catch(()=>{window.__mghalVisitorPromise=null});
})();