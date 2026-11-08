(()=>{'use strict';
if(window.__mghalSocialEngagement)return;window.__mghalSocialEngagement=true;
const API='',VISITOR_KEY='mghal_visitor_v1';
const en=document.documentElement.lang.toLowerCase().startsWith('en'),$=(s,r=document)=>r.querySelector(s);
const words=en?{
 followTitle:'Follow M.GH.AL',followCopy:'Choose how you want to follow M.GH.AL. No follow is created just by visiting.',guestFollow:'Follow anonymously',guestFollowSaved:'You are now following M.GH.AL anonymously.',pageLike:'Like this page',pageLikeHelp:'Record your appreciation for the M.GH.AL professional identity hub.',
 guest:'You are following as an anonymous guest. Your name and email are not published, and no email notifications are sent.',
 name:'Public display name',consent:'I agree to publish this display name in the M.GH.AL followers list.',
 follow:'Become a public follower',following:'You are following M.GH.AL.',notFollowing:'You are not following yet.',
 unfollow:'Stop following',privacy:'Guest following uses a random browser token. The site cannot read your email account automatically. Add a public name only with your consent.',
 count:'Public followers',guests:'Anonymous guest follows',like:'Like',clap:'Applaud',reactionHelp:'Like or applaud to record a reaction. Select the same action again to remove it; counts come from the server.',followActionHint:'This button publishes the display name above only after you check the consent box. Anonymous guest following does not publish your name.',unfollowHint:'Stop following to remove this browser session from active follower counts. Your public name is no longer shown.',saving:'Saving…',savingShort:'…',saved:'Reaction saved.',removed:'Reaction removed.',savedCountPending:'Reaction saved; the count could not be refreshed yet.',countUnavailable:'Counts are temporarily unavailable.',previewDisabled:'Preview interactions are disabled until an isolated preview API is configured.',followSaved:'Your public follow is saved.',unfollowSaved:'You have stopped following M.GH.AL.',googleConnecting:'Connecting…',share:'Share',shared:'Link copied / ready to share',
 google:'Continue with Google',googleConnected:'Google account verified. Your email remains private.',googleDisabled:'Google sign-in is not configured yet.', error:'Could not complete the action. Please try again.',liked:'Reaction updated.',comments:'Comments',noComments:'No approved comments yet.'
}:{followTitle:'تابع M.GH.AL',followCopy:'اختر طريقة المتابعة التي تناسبك. لن تُسجّل متابعتك لمجرد زيارة الموقع.',guestFollow:'تابع كمستخدم مجهول',guestFollowSaved:'أصبحت تتابع M.GH.AL كمستخدم مجهول.',pageLike:'أعجبني الموقع',pageLikeHelp:'سجّل إعجابك بالهوية الرقمية المهنية لـ M.GH.AL.',
 guest:'أنت تتابع الآن كضيف مجهول. لا ننشر اسمك أو بريدك الإلكتروني، ولا نرسل إليك رسائل بريدية.',
 name:'الاسم الذي سيظهر علناً',consent:'أوافق على نشر هذا الاسم ضمن قائمة متابعي M.GH.AL.',
 follow:'حوّل المتابعة إلى متابعة باسمك',following:'أنت تتابع M.GH.AL حالياً.',notFollowing:'أنت لا تتابع الموقع حالياً.',
 unfollow:'إيقاف المتابعة',privacy:'تُحفظ متابعة الضيف بمعرّف عشوائي لهذا المتصفح. لا يستطيع الموقع قراءة بريدك تلقائياً. لن يظهر اسم علني إلا بموافقتك.',
 count:'المتابعون بأسماء معلنة',guests:'متابعات الضيوف المجهولة',like:'إعجاب',clap:'أعجبني جداً',reactionHelp:'يسجل الزر تفاعلك على هذا المحتوى، ويمكنك إلغاء التفاعل بالضغط عليه مجدداً. الأعداد المعروضة تأتي من الخادم.',followActionHint:'هذا الزر ينشر الاسم المكتوب أعلاه فقط بعد تحديد مربع الموافقة. متابعة الضيف المجهولة لا تنشر اسمك.',unfollowHint:'إيقاف المتابعة يزيل هذا المتصفح من عدد المتابعين النشطين، ولن يظهر اسمك ضمن القائمة العامة.',saving:'جارٍ الحفظ…',savingShort:'…',saved:'تم حفظ التفاعل.',removed:'تم إلغاء التفاعل.',savedCountPending:'تم حفظ التفاعل، لكن تعذر تحديث العداد حالياً.',countUnavailable:'العدادات غير متاحة مؤقتاً.',previewDisabled:'التفاعلات معطّلة في المعاينة حتى إعداد API وقاعدة بيانات منفصلين.',followSaved:'تم حفظ متابعتك بالاسم المعلن.',unfollowSaved:'تم إيقاف متابعة M.GH.AL.',googleConnecting:'جارٍ الاتصال…',share:'مشاركة',shared:'تم نسخ الرابط أو تجهيزه للمشاركة',
 google:'المتابعة باستخدام Google',googleConnected:'تم توثيق حساب Google. بريدك الإلكتروني خاص ولن يُنشر.',googleDisabled:'تسجيل Google غير مفعّل حالياً.',error:'تعذر تنفيذ العملية. حاول مرة أخرى.',liked:'تم تحديث التفاعل.',comments:'التعليقات',noComments:'لا توجد تعليقات منشورة بعد.'
};
let visitorPromise=window.__mghalVisitorPromise||null,googleEnabled=false;
function storedToken(){try{const value=localStorage.getItem(VISITOR_KEY);return typeof value==='string'&&value.length>=32&&value.length<=128?value:null}catch{return null}}
async function visitor(){
 if(!visitorPromise&&window.__mghalVisitorPromise)visitorPromise=window.__mghalVisitorPromise;
 if(visitorPromise)return visitorPromise;
 visitorPromise=(async()=>{
  if(navigator.doNotTrack==='1')throw new Error(en?'Visitor tracking is disabled by your browser setting.':'إعداد عدم التتبع في متصفحك يمنع إنشاء متابعة الضيف.');
  let current=storedToken();
  if(!current||current.length<32)current=null;
  const response=await fetch(API+'/api/public/visitors',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:current,path:location.pathname})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.visitorToken){const error=new Error(data.error?.message||'Visitor session unavailable');error.code=data.error?.code;throw error}
  try{localStorage.setItem(VISITOR_KEY,data.visitorToken)}catch{}
  window.dispatchEvent(new CustomEvent('mghal:visitor-ready',{detail:data}));
  return data.visitorToken;
 })();
 window.__mghalVisitorPromise=visitorPromise;
 try{return await visitorPromise}catch(error){visitorPromise=null;window.__mghalVisitorPromise=null;throw error}
}
async function json(path,options){const response=await fetch(API+path,options);const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error(data.error?.message||data.message||('HTTP '+response.status));error.code=data.error?.code;throw error}return data}
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
let reactionWidgetSequence=0;
function reactionWidget(type,id){
 const box=document.createElement('div');box.className='mghal-reactions';box.dataset.targetType=type;box.dataset.targetId=id;
 const help=document.createElement('small');help.className='mghal-social-help';help.id='mghal-reaction-help-'+(++reactionWidgetSequence);help.textContent=words.reactionHelp;
 const feedback=document.createElement('span');feedback.className='mghal-reaction-feedback';feedback.setAttribute('role','status');feedback.setAttribute('aria-live','polite');feedback.dataset.state='idle';
 let state={like:false,clap:false},countsReady=false,inFlight=false;const buttons={};
 const localStateKey=token=>'mghal_reactions_v1:'+type+':'+id+':'+token;
 const readLocalState=token=>{try{const value=JSON.parse(localStorage.getItem(localStateKey(token))||'{}');return {like:!!value.like,clap:!!value.clap}}catch{return {like:false,clap:false}}};
 const saveLocalState=token=>{try{localStorage.setItem(localStateKey(token),JSON.stringify(state))}catch{}};
 const make=(reaction,label)=>{
  const button=document.createElement('button');button.type='button';button.className='mghal-social-btn mghal-reaction-btn mghal-reaction-'+reaction;button.dataset.reaction=reaction;button.dataset.state='idle';button.setAttribute('aria-describedby',help.id);button.setAttribute('aria-pressed','false');button.setAttribute('aria-busy','false');button.textContent=label+' · …';
  button.addEventListener('click',async()=>{
   if(inFlight)return;inFlight=true;const wasActive=!!state[reaction];Object.values(buttons).forEach(item=>{item.disabled=true});
   button.setAttribute('aria-busy','true');button.dataset.state='loading';button.textContent=label+' · '+words.savingShort;feedback.textContent=words.saving;feedback.dataset.state='pending';
   try{
    const token=await visitor(),endpoint=type==='page'?'/api/public/site-reactions':'/api/public/reactions',payload=type==='page'?{visitorToken:token,targetId:id,reaction}:{visitorToken:token,targetType:type,targetId:id,reaction},result=await json(endpoint,{method:wasActive?'DELETE':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if(result.success!==true)throw new Error(words.error);
    state[reaction]=!wasActive;saveLocalState(token);button.setAttribute('aria-pressed',String(!!state[reaction]));
    const refreshed=await refresh();feedback.textContent=refreshed?(wasActive?words.removed:words.saved):words.savedCountPending;feedback.dataset.state='success';await track('reaction',type,id);
   }catch(error){feedback.textContent=error.message||words.error;feedback.dataset.state='error'}
   finally{Object.values(buttons).forEach(item=>{item.disabled=false});button.setAttribute('aria-busy','false');button.dataset.state='idle';inFlight=false}
  });
  buttons[reaction]=button;return button;
 };
 const like=make('like',type==='page'?words.pageLike:words.like),clap=make('clap',words.clap);if(type==='page'){clap.hidden=true;help.textContent=words.pageLikeHelp}box.append(help,like,clap,feedback);
 async function refresh(){
  try{
   let token=null;if(navigator.doNotTrack!=='1'){try{token=await visitor()}catch{}}
   const query=type==='page'?new URLSearchParams({targetId:id}):new URLSearchParams({targetType:type,targetId:id}),options=token?{headers:{'X-Visitor-Token':token}}:{},endpoint=type==='page'?'/api/public/site-reactions':'/api/public/reactions';
   const data=await json(endpoint+'?'+query.toString(),options);if(!data.counts||typeof data.counts!=='object')throw new Error(words.countUnavailable);
   const localState=token?readLocalState(token):{like:false,clap:false};
   state=data.viewerReactions||{like:localState.like||!!data.reacted,clap:localState.clap};
   if(token)saveLocalState(token);
   like.textContent=words.like+' · '+Number(data.counts.like||0).toLocaleString(en?'en':'ar');clap.textContent=words.clap+' · '+Number(data.counts.clap||0).toLocaleString(en?'en':'ar');
   like.setAttribute('aria-pressed',String(!!state.like));clap.setAttribute('aria-pressed',String(!!state.clap));countsReady=true;return true;
  }catch(error){if(error.code==='PREVIEW_API_NOT_CONFIGURED'){like.disabled=true;clap.disabled=true;feedback.textContent=words.previewDisabled;feedback.dataset.state='error'}else if(!countsReady){like.textContent=words.like+' · —';clap.textContent=words.clap+' · —';feedback.textContent=words.countUnavailable;feedback.dataset.state='error'}return false}
 }
 refresh();return box;
}
function addHomeLikePanel(){
 const main=$('main.home-v2');if(!main||$('#mghal-home-like'))return;
 const section=document.createElement('section');section.id='mghal-home-like';section.className='mghal-home-like';section.setAttribute('aria-label',en?'Like the M.GH.AL page':'الإعجاب بصفحة M.GH.AL');
 const copy=document.createElement('div');copy.className='mghal-home-like-copy';
 const eyebrow=document.createElement('span');eyebrow.className='mghal-social-eyebrow';eyebrow.textContent='M.GH.AL / COMMUNITY';
 const title=document.createElement('strong');title.textContent=en?'Support this professional identity':'ادعم الهوية الرقمية المهنية';
 const detail=document.createElement('small');detail.textContent=en?'One like for the main page, recorded with your visitor session.':'إعجاب واحد بالصفحة الرئيسية يُسجّل عبر جلسة الزائر.';
 copy.append(eyebrow,title,detail);section.append(copy,reactionWidget('page','mghal-home'));
 main.insertBefore(section,main.firstElementChild);
}
function addFollowPanel(){
 const main=$('main');if(!main||$('#mghal-follow-panel'))return;
 const section=document.createElement('section');section.id='mghal-follow-panel';section.className='mghal-follow-panel';
 section.innerHTML='<div class="mghal-follow-copy"><p class="mghal-social-eyebrow">M.GH.AL COMMUNITY</p><h2></h2><p class="mghal-follow-intro"></p><p class="mghal-guest-notice" role="status"></p><small class="mghal-follow-privacy"></small><div class="mghal-follower-counts" aria-live="polite"></div></div><form class="mghal-follow-form"><label class="mghal-name-label"></label><label class="mghal-consent"><input type="checkbox" name="consent"><span></span></label><button class="mghal-social-btn mghal-google-login" type="button" hidden></button><button class="mghal-social-btn mghal-guest-follow" type="button"></button><button class="mghal-social-btn mghal-follow-submit" type="submit"></button><button class="mghal-social-btn mghal-unfollow" type="button" hidden></button><small class="mghal-follow-action-hint"></small><p class="mghal-follow-status" role="status" aria-live="polite"></p></form>';
 $('h2',section).textContent=words.followTitle;$('.mghal-follow-intro',section).textContent=words.followCopy;$('.mghal-guest-notice',section).textContent=words.guest;$('.mghal-follow-privacy',section).textContent=words.privacy;
 const form=$('.mghal-follow-form',section),submit=$('.mghal-follow-submit',section),guestFollow=$('.mghal-guest-follow',section),google=$('.mghal-google-login',section),unfollow=$('.mghal-unfollow',section),status=$('.mghal-follow-status',section),hint=$('.mghal-follow-action-hint',section),nameLabel=$('.mghal-name-label',section),name=document.createElement('input'),consent=$('input[name="consent"]',form);let actionInFlight=false;
 name.name='displayName';name.minLength=2;name.maxLength=80;name.autocomplete='nickname';name.placeholder=en?'Your name':'اكتب الاسم الذي تريد إظهاره';name.required=true;nameLabel.append(document.createTextNode(words.name),name);
 $('.mghal-consent span',section).textContent=words.consent;hint.id='mghal-follow-action-hint';hint.textContent=words.followActionHint;submit.setAttribute('aria-describedby',hint.id);unfollow.setAttribute('aria-describedby',hint.id);submit.textContent=words.follow;guestFollow.textContent=words.guestFollow;google.textContent=words.google;unfollow.textContent=words.unfollow;const setStatus=(text,stateName='idle')=>{status.textContent=text;status.dataset.state=stateName};
 async function configureGoogle(){try{const cfg=await json('/api/public/auth/google/config');googleEnabled=!!cfg.enabled;google.hidden=!googleEnabled;if(googleEnabled)state()}catch{googleEnabled=false;google.hidden=true}}
 google.addEventListener('click',async()=>{if(actionInFlight)return;google.disabled=true;google.setAttribute('aria-busy','true');google.textContent=words.googleConnecting;setStatus(words.googleConnecting,'pending');try{const token=await visitor(),data=await json('/api/public/auth/google/start',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token,returnPath:location.pathname+location.search})});location.assign(data.authorizationUrl)}catch(error){setStatus(error.message||words.error,'error')}finally{google.disabled=false;google.setAttribute('aria-busy','false');google.textContent=words.google}});
 async function state(){
  try{
   const token=await visitor(),data=await json('/api/public/followers/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})}),identity=googleEnabled?await json('/api/public/auth/google/status',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})}):{connected:false};
   const following=!!data.following,publicFollowing=following&&!!data.displayName;
   if(identity.connected){if(!publicFollowing&&!name.value&&identity.suggestedName)name.value=identity.suggestedName;setStatus(words.googleConnected,'success')} 
   form.classList.toggle('is-following',following);form.classList.toggle('is-guest-following',following&&!publicFollowing);
   if(publicFollowing){guestFollow.hidden=true;name.value=data.displayName;name.disabled=true;consent.checked=true;consent.disabled=true;submit.hidden=true;submit.textContent=words.follow;unfollow.hidden=false;hint.textContent=words.unfollowHint;$('.mghal-guest-notice',section).hidden=true;setStatus(words.following,'success')}
   else if(following){guestFollow.hidden=true;name.value='';name.disabled=false;consent.checked=false;consent.disabled=false;submit.hidden=false;submit.textContent=words.follow;unfollow.hidden=false;hint.textContent=words.followActionHint;$('.mghal-guest-notice',section).hidden=false;setStatus(words.guest,'idle')}
   else{guestFollow.hidden=false;name.disabled=false;consent.disabled=false;consent.checked=false;submit.hidden=false;submit.textContent=words.follow;unfollow.hidden=true;hint.textContent=words.followActionHint;$('.mghal-guest-notice',section).hidden=true;setStatus(words.notFollowing,'idle')}
  }catch(error){if(error.code==='PREVIEW_API_NOT_CONFIGURED'){submit.disabled=true;guestFollow.disabled=true;unfollow.disabled=true;google.disabled=true;setStatus(words.previewDisabled,'error')}else setStatus(error.message||words.error,'error');$('.mghal-guest-notice',section).hidden=true}
 }
 guestFollow.addEventListener('click',async()=>{
  if(actionInFlight)return;actionInFlight=true;guestFollow.disabled=true;submit.disabled=true;guestFollow.setAttribute('aria-busy','true');guestFollow.textContent=words.savingShort;setStatus(words.saving,'pending');
  try{
   const token=await visitor(),result=await json('/api/public/followers/guest',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})});
   if(result.success!==true||result.following!==true||result.anonymous!==true)throw new Error(words.error);
   await track('follow');await state();const countUpdated=await refreshCount();setStatus(countUpdated?words.guestFollowSaved:words.savedCountPending,'success');
  }catch(error){setStatus(error.message||words.error,'error')}
  finally{actionInFlight=false;guestFollow.disabled=false;submit.disabled=false;guestFollow.setAttribute('aria-busy','false');guestFollow.textContent=words.guestFollow}
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(actionInFlight||!form.reportValidity())return;
  actionInFlight=true;submit.disabled=true;unfollow.disabled=true;submit.setAttribute('aria-busy','true');submit.textContent=words.savingShort;setStatus(words.saving,'pending');
  try{
   const token=await visitor(),result=await json('/api/public/followers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token,displayName:name.value,consent:consent.checked})});
   if(result.success!==true||result.following!==true)throw new Error(words.error);
   await track('follow');await state();const countUpdated=await refreshCount();setStatus(countUpdated?words.followSaved:words.savedCountPending,'success');
  }catch(error){setStatus(error.message||words.error,'error')}
  finally{actionInFlight=false;submit.disabled=false;unfollow.disabled=false;submit.setAttribute('aria-busy','false');submit.textContent=words.follow}
 });
 unfollow.addEventListener('click',async()=>{
  if(actionInFlight)return;actionInFlight=true;unfollow.disabled=true;submit.disabled=true;unfollow.setAttribute('aria-busy','true');unfollow.textContent=words.savingShort;setStatus(words.saving,'pending');
  try{
   const token=await visitor(),result=await json('/api/public/followers',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({visitorToken:token})});
   if(result.success!==true||result.following!==false)throw new Error(words.error);
   await track('unfollow');name.value='';consent.checked=false;await state();const countUpdated=await refreshCount();setStatus(countUpdated?words.unfollowSaved:words.savedCountPending,'success');
  }catch(error){setStatus(error.message||words.error,'error')}
  finally{actionInFlight=false;unfollow.disabled=false;submit.disabled=false;unfollow.setAttribute('aria-busy','false');unfollow.textContent=words.unfollow}
 });
 async function refreshCount(){
  try{const data=await json('/api/public/followers/count'),publicTotal=Number(data.count);if(!Number.isFinite(publicTotal))return false;const target=$('.mghal-follower-counts',section);target.replaceChildren();
   const publicCount=document.createElement('span');publicCount.textContent=words.count+': '+publicTotal.toLocaleString(en?'en':'ar');target.append(publicCount);
   const guestTotal=Number(data.guestCount);if(Number.isFinite(guestTotal)){const guestCount=document.createElement('span');guestCount.textContent=words.guests+': '+guestTotal.toLocaleString(en?'en':'ar');target.append(guestCount);}
  }catch{return false}
  return true;
 }
 const hero=$('.hv-hero',main);if(hero)hero.after(section);else main.append(section);configureGoogle();state();refreshCount();
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
function setup(){addHomeLikePanel();addFollowPanel();projectCards();projectDetail();const grid=$('main .grid');if(grid&&'MutationObserver'in window)new MutationObserver(()=>projectCards()).observe(grid,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
// Rebuild idempotent engagement widgets after browser back/forward cache restores or history navigation.
window.addEventListener('pageshow',setup);
window.addEventListener('popstate',()=>{window.setTimeout(setup,0)});
})();