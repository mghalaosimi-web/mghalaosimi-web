(()=>{'use strict';
if(window.__mghalSocialEngagement)return;window.__mghalSocialEngagement=true;
const API='',VISITOR_KEY='mghal_visitor_v1';
const en=document.documentElement.lang.toLowerCase().startsWith('en'),$=(s,r=document)=>r.querySelector(s);
const words=en?{
 followTitle:'Follow M.GH.AL',followCopy:'You are automatically following as an anonymous guest on this browser.',
 guest:'You are following as an anonymous guest. Your name and email are not published, and no email notifications are sent.',
 name:'Public display name',consent:'I agree to publish this display name in the M.GH.AL followers list.',
 follow:'Become a public follower',following:'You are following M.GH.AL.',notFollowing:'You are not following yet.',
 unfollow:'Stop following',privacy:'Guest following uses a random browser token. The site cannot read your email account automatically. Add a public name only with your consent.',
 count:'Public followers',guests:'Anonymous guest follows',like:'Like',clap:'Applaud',share:'Share',shared:'Link copied / ready to share',
 google:'Continue with Google',googleConnected:'Google account verified. Your email remains private.',googleDisabled:'Google sign-in is not configured yet.', error:'Could not complete the action. Please try again.',liked:'Reaction updated.',comments:'Comments',noComments:'No approved comments yet.'
}:{followTitle:'تابع M.GH.AL',followCopy:'أصبحت تتابع الموقع تلقائياً كزائر مجهول على هذا المتصفح.',
 guest:'أنت تتابع الآن كضيف مجهول. لا ننشر اسمك أو بريدك الإلكتروني، ولا نرسل إليك رسائل بريدية.',
 name:'الاسم الذي سيظهر علناً',consent:'أوافق على نشر هذا الاسم ضمن قائمة متابعي M.GH.AL.',
 follow:'حوّل المتابعة إلى متابعة باسمك',following:'أنت تتابع M.GH.AL حالياً.',notFollowing:'أنت لا تتابع الموقع حالياً.',
 unfollow:'إيقاف المتابعة',privacy:'تُحفظ متابعة الضيف بمعرّف عشوائي لهذا المتصفح. لا يستطيع الموقع قراءة بريدك تلقائياً. لن يظهر اسم علني إلا بموافقتك.',
 count:'المتابعون بأسماء معلنة',guests:'متابعات الضيوف المجهولة',like:'إعجاب',clap:'أعجبني جداً',share:'مشاركة',shared:'تم نسخ الرابط أو تجهيزه للمشاركة',
 google:'المتابعة باستخدام Google',googleConnected:'تم توثيق حساب Google. بريدك الإلكتروني خاص ولن يُنشر.',googleDisabled:'تسجيل Google غير مفعّل حالياً.',error:'تعذر تنفيذ العملية. حاول مرة أخرى.',liked:'تم تحديث التفاعل.',comments:'التعليقات',noComments:'لا توجد تعليقات منشورة بعد.'
};
let visitorPromise=window.__mghalVisitorPromise||null,googleEnabled=false;
function storedToken(){try{return localStorage.getItem(VISITOR_KEY)}catch{return null}}
async function visitor(){
 if(!visitorPromise&&window.__mghalVisitorPromise)visitorPromise=window.__mghalVisitorPromise;
 if(visitorPromise)return visitorPromise;
 visitorPromise=(async()=>{
  if(navigator.doNotTrack==='1')throw new Error(en?'Visitor tracking is disabled by your browser setting.':'إعداد عدم التتبع في متصفحك يمنع إنشاء متابعة الضيف.');
  let current=storedToken();
  if(!current||current.length<32)current=null;
  const response=await fetch(API+'/api/public/visitors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:current,path:location.pathname})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.visitorToken)throw new Error(data.error?.message||'Visitor session unavailable');
  try{localStorage.setItem(VISITOR_KEY,data.visitorToken)}catch{}
  window.dispatchEvent(new CustomEvent('mghal:visitor-ready',{detail:data}));
  return data.visitorToken;
 })();
 window.__mghalVisitorPromise=visitorPromise;
 try{return await visitorPromise}catch(error){visitorPromise=null;window.__mghalVisitorPromise=null;throw error}
}
async function json(path,options){const response=await fetch(API+path,options);const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error?.message||data.message||('HTTP '+response.status));return data}
async function track(eventType,targetType,targetId){
 if(navigator.doNotTrack==='1')return;
 try{const token=await visitor();await json('/api/public/events',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token,eventType,path:location.pathname,targetType:targetType||undefined,targetId:targetId||undefined})})}catch{}
}
async function share(url,title){
 const data={title:title||'M.GH.AL',text:title||'M.GH.AL',url};
 if(navigator.share){try{await navigator.share(data);return true}catch(error){if(error.name==='AbortError')return false}}
 try{await navigator.clipboard.writeText(url);return true}catch{}
 const field=document.createElement('textarea');field.value=url;document.body.append(field);field.select();const copied=document.execCommand('copy');field.remove();return copied;
}
function shareButton(url,title){
 const button=document.createElement('button');button.type='button';button.className='mghal-social-btn mghal-share';button.textContent=words.share;
 button.addEventListener('click',async()=>{const result=await share(url,title);if(result){await track('share');button.textContent=words.shared;window.setTimeout(()=>button.textContent=words.share,2200)}});
 return button;
}
function reactionWidget(type,id){
 const box=document.createElement('div');box.className='mghal-reactions';box.dataset.targetType=type;box.dataset.targetId=id;
 const feedback=document.createElement('span');feedback.className='mghal-reaction-feedback';feedback.setAttribute('role','status');
 let state={like:false,clap:false};
 const buttons={};
 const make=(reaction,label)=>{
  const button=document.createElement('button');button.type='button';button.className='mghal-social-btn';button.dataset.reaction=reaction;button.textContent=label+' · …';
  button.addEventListener('click',async()=>{
   button.disabled=true;
   try{
    const token=await visitor(),active=!!state[reaction],method=active?'DELETE':'POST';
    await json('/api/public/reactions',{method,headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token,targetType:type,targetId:id,reaction})});
    await refresh();feedback.textContent=words.liked;await track('reaction',type,id);
   }catch(error){feedback.textContent=error.message||words.error}
   finally{button.disabled=false}
  });
  buttons[reaction]=button;return button;
 };
 const like=make('like',words.like),clap=make('clap',words.clap);box.append(like,clap,feedback);
 async function refresh(){
  try{
   let token=null;try{token=await visitor()}catch{}
   const query=new URLSearchParams({targetType:type,targetId:id});if(token)query.set('visitorToken',token);
   const data=await json('/api/public/reactions?'+query.toString());
   state=data.viewerReactions||{like:!!data.reacted,clap:false};
   like.textContent=words.like+' · '+Number(data.counts?.like||0).toLocaleString(en?'en':'ar');
   clap.textContent=words.clap+' · '+Number(data.counts?.clap||0).toLocaleString(en?'en':'ar');
   like.setAttribute('aria-pressed',String(!!state.like));clap.setAttribute('aria-pressed',String(!!state.clap));
  }catch{like.textContent=words.like+' · 0';clap.textContent=words.clap+' · 0'}
 }
 refresh();return box;
}
function addFollowPanel(){
 const main=$('main');if(!main||$('#mghal-follow-panel'))return;
 const section=document.createElement('section');section.id='mghal-follow-panel';section.className='mghal-follow-panel';
 section.innerHTML='<div class="mghal-follow-copy"><p class="mghal-social-eyebrow">M.GH.AL COMMUNITY</p><h2></h2><p class="mghal-follow-intro"></p><p class="mghal-guest-notice" role="status"></p><small class="mghal-follow-privacy"></small><div class="mghal-follower-counts" aria-live="polite"></div></div><form class="mghal-follow-form"><label class="mghal-name-label"></label><label class="mghal-consent"><input type="checkbox" name="consent"><span></span></label><button class="mghal-social-btn mghal-google-login" type="button" hidden></button><button class="mghal-social-btn mghal-follow-submit" type="submit"></button><button class="mghal-social-btn mghal-unfollow" type="button" hidden></button><p class="mghal-follow-status" role="status" aria-live="polite"></p></form>';
 $('h2',section).textContent=words.followTitle;$('.mghal-follow-intro',section).textContent=words.followCopy;$('.mghal-guest-notice',section).textContent=words.guest;$('.mghal-follow-privacy',section).textContent=words.privacy;
 const form=$('.mghal-follow-form',section),submit=$('.mghal-follow-submit',section),google=$('.mghal-google-login',section),unfollow=$('.mghal-unfollow',section),status=$('.mghal-follow-status',section),nameLabel=$('.mghal-name-label',section),name=document.createElement('input'),consent=$('input[name="consent"]',form);
 name.name='displayName';name.minLength=2;name.maxLength=80;name.autocomplete='nickname';name.placeholder=en?'Your name':'اكتب الاسم الذي تريد إظهاره';name.required=true;nameLabel.append(document.createTextNode(words.name),name);
 $('.mghal-consent span',section).textContent=words.consent;submit.textContent=words.follow;google.textContent=words.google;unfollow.textContent=words.unfollow;
 async function configureGoogle(){try{const cfg=await json('/api/public/auth/google/config');googleEnabled=!!cfg.enabled;google.hidden=!googleEnabled;if(googleEnabled)state()}catch{googleEnabled=false;google.hidden=true}}
 google.addEventListener('click',async()=>{google.disabled=true;try{const token=await visitor(),data=await json('/api/public/auth/google/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token,returnPath:location.pathname+location.search})});location.assign(data.authorizationUrl)}catch(error){status.textContent=error.message||words.error;google.disabled=false}});
 async function state(){
  try{
   const token=await visitor(),data=await json('/api/public/followers/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})}),identity=googleEnabled?await json('/api/public/auth/google/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})}):{connected:false};
   const following=!!data.following,publicFollowing=following&&!!data.displayName;
   if(identity.connected){if(!publicFollowing&&!name.value&&identity.suggestedName)name.value=identity.suggestedName;status.textContent=words.googleConnected+(identity.email?' ('+identity.email+')':'')} 
   form.classList.toggle('is-following',following);form.classList.toggle('is-guest-following',following&&!publicFollowing);
   if(publicFollowing){name.value=data.displayName;name.disabled=true;consent.checked=true;consent.disabled=true;submit.hidden=true;submit.textContent=words.follow;unfollow.hidden=false;$('.mghal-guest-notice',section).hidden=true;status.textContent=words.following}
   else if(following){name.value='';name.disabled=false;consent.checked=false;consent.disabled=false;submit.hidden=false;submit.textContent=words.follow;unfollow.hidden=false;$('.mghal-guest-notice',section).hidden=false;status.textContent=words.guest}
   else{name.disabled=false;consent.disabled=false;consent.checked=false;submit.hidden=false;submit.textContent=words.follow;unfollow.hidden=true;$('.mghal-guest-notice',section).hidden=true;status.textContent=words.notFollowing}
  }catch(error){status.textContent=error.message||words.error;$('.mghal-guest-notice',section).hidden=true}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;submit.disabled=true;
  try{const token=await visitor();await json('/api/public/followers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token,displayName:name.value,consent:consent.checked})});await track('follow');await state();await refreshCount()}
  catch(error){status.textContent=error.message||words.error}finally{submit.disabled=false}
 });
 unfollow.addEventListener('click',async()=>{
  unfollow.disabled=true;try{const token=await visitor();await json('/api/public/followers',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})});await track('unfollow');name.value='';consent.checked=false;await state();await refreshCount()}
  catch(error){status.textContent=error.message||words.error}finally{unfollow.disabled=false}
 });
 async function refreshCount(){
  try{const data=await json('/api/public/followers/count'),target=$('.mghal-follower-counts',section);target.replaceChildren();
   const publicCount=document.createElement('span');publicCount.textContent=words.count+': '+Number(data.count||0).toLocaleString(en?'en':'ar');
   const guestCount=document.createElement('span');guestCount.textContent=words.guests+': '+Number(data.guestCount||0).toLocaleString(en?'en':'ar');target.append(publicCount,guestCount);
  }catch{}
 }
 main.append(section);configureGoogle();state();refreshCount();
 const identityResult=new URLSearchParams(location.search).get('identity');if(identityResult){const messages={connected:words.googleConnected,cancelled:en?'Google sign-in was cancelled.':'تم إلغاء تسجيل Google.',expired:en?'The sign-in link expired. Please try again.':'انتهت صلاحية رابط تسجيل الدخول. حاول مجدداً.',blocked:en?'This follower account is blocked and cannot be linked.':'حساب المتابعة هذا محظور ولا يمكن ربطه.',unverified:en?'Google did not return a verified email.':'لم يُرجع Google بريداً موثقاً.', 'account-conflict':en?'This email is linked to a different Google identity.':'هذا البريد مرتبط بهوية Google مختلفة.',failed:words.error};status.textContent=messages[identityResult]||words.error;const clean=new URL(location.href);clean.searchParams.delete('identity');history.replaceState({},'',clean.pathname+clean.search+clean.hash);state()}
 window.addEventListener('mghal:visitor-ready',state);
}
function getProjects(){if(!window.__mghalProjectIndex)window.__mghalProjectIndex=json('/api/public/projects?locale='+(en?'en':'ar')).then(data=>data.data||[]);return window.__mghalProjectIndex}
function projectCards(){
 const cards=[...document.querySelectorAll('main .grid .card[data-project-slug],main .grid .card,main .home-project-card')];
 for(const card of cards){
  if(card.dataset.socialReady==='1')continue;
  const link=card.querySelector('a.project-detail-link,a[href*="/projects/"]'),path=link?new URL(link.href,location.origin).pathname:'';
  const slug=card.dataset.projectSlug||(path.match(/\/projects\/([^/]+)/)||[])[1];if(!slug)continue;
  card.dataset.socialReady='1';card.dataset.projectSlug=slug;
  const row=document.createElement('div');row.className='mghal-card-social';row.textContent=en?'Loading reactions…':'جارٍ تحميل التفاعلات…';card.append(row);
  getProjects().then(projects=>{const project=projects.find(item=>item.slug===slug);if(!project){row.remove();return}row.replaceChildren(reactionWidget('project',project.id),shareButton(location.origin+(en?'/en':'')+'/projects/'+slug+'/',project.name||project.name_ar))}).catch(()=>{row.textContent=''});
 }
}
async function projectDetail(){
 const match=location.pathname.match(/^\/(?:en\/)?projects\/([^/]+)\/?$/);if(!match)return;
 try{const projects=await getProjects(),project=projects.find(item=>item.slug===match[1]);if(!project)return;const hero=$('.project-hero');if(!hero||$('#mghal-project-engagement'))return;
  const section=document.createElement('section');section.id='mghal-project-engagement';section.className='mghal-project-engagement';
  const heading=document.createElement('h2');heading.textContent=en?'Support this project':'تفاعل مع المشروع';const row=document.createElement('div');row.className='mghal-card-social';row.append(reactionWidget('project',project.id),shareButton(location.href,project.name||project.name_ar));section.append(heading,row);hero.after(section);
 }catch{}
}
function setup(){addFollowPanel();projectCards();projectDetail();const grid=$('main .grid');if(grid&&'MutationObserver'in window)new MutationObserver(()=>projectCards()).observe(grid,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
})();