export default {
 async fetch(request, env) {
  const url = new URL(request.url), path = url.pathname, method = request.method;
  const allowed = (env.ALLOWED_ORIGINS || "https://mghalaosimi-web.vercel.app,https://mghal-static.onrender.com,https://mghal-release.onrender.com,https://mghal-release-current.onrender.com,https://mghal.vercel.app").split(",").map(value => value.trim()).filter(Boolean);
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers({"Vary":"Origin","Access-Control-Allow-Methods":"GET,POST,PATCH,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":"no-store"});
  const previewOrigin=/^https:\/\/mghalaosimi-[a-z0-9-]+-mghalaosimi-webs-projects\.vercel\.app$/i.test(origin);
  if (allowed.includes(origin)||previewOrigin) headers.set("Access-Control-Allow-Origin",origin);
  const out=(data,status=200)=>Response.json(data,{status,headers});
  const fail=(status,code,message)=>out({error:{code,message}},status);
  const q=(sql,...params)=>env.DB.prepare(sql).bind(...params);
  const hash=async value=>{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")};
  const json=async()=>{try{return await request.json()}catch{return null}};
  const token=()=>[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,"0")).join("");
  const actor=async()=>{const raw=request.headers.get("Authorization")||"",t=raw.startsWith("Bearer ")?raw.slice(7):"";if(!t||t.length>200)return null;return q("SELECT u.id,u.email FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>? AND u.status='active' LIMIT 1",await hash(t),new Date().toISOString()).first()};
  const admin=path.startsWith("/api/admin/");
  const setupRoute=path==="/api/admin/bootstrap/status"||path==="/api/admin/bootstrap"||path==="/api/admin/auth/login";
  const resources={
   projects:{table:"projects",cols:["id","slug","name","name_ar","locale","short_description","short_description_ar","description","description_ar","status","repository_url","live_url","cover_media_id","started_at","completed_at","sort_order","is_published","created_at","updated_at"],fields:["slug","name","name_ar","locale","short_description","short_description_ar","description","description_ar","status","repository_url","live_url","cover_media_id","started_at","completed_at","sort_order","is_published"],permission:"content"},
   certificates:{table:"certificates",cols:["id","slug","title","issuer","category","credential_id","issued_at","expires_at","verification_url","image_media_id","pdf_media_id","qr_url","description","is_published","sort_order","created_at","updated_at"],fields:["slug","title","issuer","category","credential_id","issued_at","expires_at","verification_url","image_media_id","pdf_media_id","qr_url","description","is_published","sort_order"],permission:"content"},
   articles:{table:"articles",cols:["id","slug","locale","title","excerpt","body","status","category_id","cover_media_id","seo_title","seo_description","canonical_url","scheduled_at","published_at","author_id","created_at","updated_at"],fields:["slug","locale","title","excerpt","body","status","category_id","cover_media_id","seo_title","seo_description","canonical_url","scheduled_at","published_at"],permission:"content"},
   skills:{table:"skills",cols:["id","name","locale","category","proficiency","sort_order","is_published"],fields:["name","locale","category","proficiency","sort_order","is_published"],permission:"content"},
   education:{table:"education",cols:["id","institution","degree","field_of_study","location","start_date","end_date","status","description","sort_order","is_published"],fields:["institution","degree","field_of_study","location","start_date","end_date","status","description","sort_order","is_published"],permission:"content"},
   achievements:{table:"achievements",cols:["id","slug","title","description","achieved_at","related_project_id","media_id","is_published","sort_order"],fields:["slug","title","description","achieved_at","related_project_id","media_id","is_published","sort_order"],permission:"content"},
   identity:{table:"identity_profiles",cols:["id","locale","full_name","professional_title","headline","biography","location","avatar_media_id","is_published","updated_at"],fields:["locale","full_name","professional_title","headline","biography","location","avatar_media_id","is_published"],permission:"content"},
   technologies:{table:"technologies",cols:["id","name","category","logo_url","website_url","is_published","archived"],fields:["name","category","logo_url","website_url","is_published","archived"],permission:"content"}
  };
  if(method==="OPTIONS") return new Response(null,{status:204,headers});
  if(origin&&!allowed.includes(origin)&&!previewOrigin) return fail(403,"ORIGIN_DENIED","Origin is not allowed");
  if(path==="/health"&&method==="GET"){const r=await q("SELECT 1 AS ok").first();return out({status:r?.ok===1?"ok":"degraded",database:r?.ok===1?"connected":"unavailable"});}
  if(!path.startsWith("/api/"))return fail(404,"NOT_FOUND","Route not found");
  const minute=Math.floor(Date.now()/60000),ip=request.headers.get("CF-Connecting-IP")||"unknown",rateKey="rl:"+await hash(ip+":"+minute);try{await q("INSERT INTO site_settings(key,value_json) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value_json=CAST(CAST(site_settings.value_json AS INTEGER)+1 AS TEXT)",rateKey,"1").run();const count=await q("SELECT value_json FROM site_settings WHERE key=?",rateKey).first();if(Number(count?.value_json||0)>120)return fail(429,"RATE_LIMITED","Too many requests");}catch{return fail(503,"RATE_LIMIT_UNAVAILABLE","Request protection is temporarily unavailable");}
  if(path==="/api/admin/bootstrap/status"&&method==="GET"){
   const [users,setup]=await Promise.all([q("SELECT COUNT(*) n FROM admin_users").first(),q("SELECT value_json FROM site_settings WHERE key='owner_bootstrap_hash'").first()]);
   return out({available:Number(users?.n||0)===0&&!!setup?.value_json,ownerExists:Number(users?.n||0)>0});
  }
  if(path==="/api/admin/bootstrap"&&method==="POST"){
   const b=await json();if(!b||typeof b.token!=="string"||typeof b.email!=="string"||typeof b.password!=="string"||typeof b.displayName!=="string"||b.password.length<12||b.password.length>200||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)||b.displayName.trim().length<2||b.displayName.length>120)return fail(400,"VALIDATION_ERROR","Provide a valid email, display name and password of at least 12 characters");
   const supplied=await hash(b.token),configured=await q("SELECT value_json FROM site_settings WHERE key='owner_bootstrap_hash'").first();if(!configured?.value_json||supplied!==configured.value_json)return fail(403,"BOOTSTRAP_TOKEN_INVALID","Bootstrap token is invalid or expired");
   const salt=crypto.getRandomValues(new Uint8Array(16)),key=await crypto.subtle.importKey("raw",new TextEncoder().encode(b.password),"PBKDF2",false,["deriveBits"]),bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:210000},key,256),b64=x=>btoa(String.fromCharCode(...x));
   const passwordHash="pbkdf2-sha256$210000$"+b64(salt)+"$"+b64(new Uint8Array(bits)),id=crypto.randomUUID(),email=b.email.trim().toLowerCase();
   const batch=await env.DB.batch([
    q("INSERT INTO admin_users(id,email,password_hash,display_name,status) SELECT ?,?,?,?,'active' WHERE (SELECT COUNT(*) FROM admin_users)=0 AND (SELECT value_json FROM site_settings WHERE key='owner_bootstrap_hash')=?",id,email,passwordHash,b.displayName.trim(),supplied),
    q("INSERT INTO admin_user_roles(user_id,role_id) SELECT ?,id FROM roles WHERE name='owner' AND EXISTS(SELECT 1 FROM admin_users WHERE id=?)",id,id),
    q("DELETE FROM site_settings WHERE key='owner_bootstrap_hash' AND EXISTS(SELECT 1 FROM admin_users WHERE id=?)",id)
   ]);
   if(Number(batch?.[0]?.meta?.changes||0)!==1)return fail(409,"BOOTSTRAP_ALREADY_USED","Owner setup has already been completed or token expired");
   return out({success:true,message:"Owner account created. Sign in now."},201);
  }
  if(path==="/api/admin/auth/login"&&method==="POST"){
   const b=await json();if(!b||typeof b.email!=="string"||typeof b.password!=="string"||b.password.length<12)return fail(400,"VALIDATION_ERROR","Invalid login payload");
   const u=await q("SELECT id,email,password_hash,status FROM admin_users WHERE email=? COLLATE NOCASE LIMIT 1",b.email.trim()).first();if(!u||u.status!=="active")return fail(401,"INVALID_CREDENTIALS","Invalid credentials");
   const [kind,n,salt,expected]=(u.password_hash||"").split("$");if(kind!=="pbkdf2-sha256"||!salt||!expected)return fail(401,"INVALID_CREDENTIALS","Invalid credentials");
   const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(b.password),"PBKDF2",false,["deriveBits"]);
   const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:Uint8Array.from(atob(salt),c=>c.charCodeAt(0)),iterations:Number(n)},key,256);
   const actual=btoa(String.fromCharCode(...new Uint8Array(bits)));if(actual!==expected)return fail(401,"INVALID_CREDENTIALS","Invalid credentials");
   const t=token(),expires=new Date(Date.now()+28800000).toISOString();await q("INSERT INTO admin_sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)",crypto.randomUUID(),u.id,await hash(t),expires).run();await q("UPDATE admin_users SET last_login_at=?,updated_at=? WHERE id=?",new Date().toISOString(),new Date().toISOString(),u.id).run();return out({token:t,expiresAt:expires,user:{id:u.id,email:u.email}});
  }
  let current=null;if(admin&&!setupRoute){current=await actor();if(!current)return fail(401,"UNAUTHENTICATED","Authentication required");}
  const can=async code=>!!(await q("SELECT 1 FROM admin_user_roles ur JOIN role_permissions rp ON rp.role_id=ur.role_id JOIN permissions p ON p.id=rp.permission_id WHERE ur.user_id=? AND p.code=? LIMIT 1",current?.id||"",code).first());
  if(path==="/api/admin/auth/logout"&&method==="POST"){const t=(request.headers.get("Authorization")||"").slice(7);await q("UPDATE admin_sessions SET revoked_at=? WHERE user_id=? AND token_hash=? AND revoked_at IS NULL",new Date().toISOString(),current.id,await hash(t)).run();return out({success:true});}
  if(path==="/api/public/visitors"&&method==="POST"){
   const b=await json(),visitorToken=typeof b?.visitorToken==="string"&&b.visitorToken.length>=32?b.visitorToken:token(),key="visitor:"+await hash(visitorToken);
   let f=await q("SELECT id,status,display_name FROM followers WHERE email_hash=? LIMIT 1",key).first();let fresh=false;
   if(!f){f={id:crypto.randomUUID(),status:"unverified",display_name:null};fresh=true;await q("INSERT INTO followers(id,email_hash,status) VALUES(?,?,'unverified')",f.id,key).run();}
   const page=typeof b?.path==="string"&&b.path.startsWith("/")?b.path.slice(0,500):"/";
   if(fresh)await q("INSERT INTO analytics_events(id,event_type,path,session_hash) VALUES(?,?,?,?)",crypto.randomUUID(),"visitor_start",page,await hash(visitorToken)).run();
   return out({visitorToken,followerId:f.id,status:f.status,displayName:f.display_name||null},201);
  }
  if(path==="/api/public/followers/count"&&method==="GET"){
   const row=await q("SELECT COUNT(*) count FROM followers WHERE status='active' AND consent_at IS NOT NULL").first();
   return out({count:Number(row?.count||0)});
  }
  if(path==="/api/public/followers/status"&&method==="POST"){
   const b=await json();if(typeof b?.visitorToken!=="string"||b.visitorToken.length<32)return fail(400,"VALIDATION_ERROR","Invalid visitor session");
   const f=await q("SELECT id,status,display_name,consent_at FROM followers WHERE email_hash=? LIMIT 1","visitor:"+await hash(b.visitorToken)).first();
   return out({following:f?.status==="active",status:f?.status||"unknown",displayName:f?.display_name||null,consentAt:f?.consent_at||null});
  }
  if(path==="/api/public/followers"&&method==="POST"){
   const b=await json();if(typeof b?.visitorToken!=="string"||b.visitorToken.length<32||typeof b?.displayName!=="string"||b.displayName.trim().length<2||b.displayName.trim().length>80||b.consent!==true)return fail(400,"VALIDATION_ERROR","Provide a display name and explicit consent");
   const key="visitor:"+await hash(b.visitorToken),f=await q("SELECT id,status FROM followers WHERE email_hash=? LIMIT 1",key).first();
   if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   if(f.status==="blocked")return fail(403,"FOLLOW_BLOCKED","This visitor cannot follow updates");
   const now=new Date().toISOString();
   const row=await q("UPDATE followers SET display_name=?,status='active',consent_at=?,unsubscribed_at=NULL WHERE id=? RETURNING id,status,display_name,consent_at",b.displayName.trim(),now,f.id).first();
   if(!row)return fail(409,"FOLLOW_FAILED","Unable to activate following");
   return out({success:true,following:true,data:row},200);
  }
  if(path==="/api/public/followers"&&method==="DELETE"){
   const b=await json();if(typeof b?.visitorToken!=="string"||b.visitorToken.length<32)return fail(400,"VALIDATION_ERROR","Invalid visitor session");
   const key="visitor:"+await hash(b.visitorToken),now=new Date().toISOString();
   const row=await q("UPDATE followers SET status='unsubscribed',unsubscribed_at=? WHERE email_hash=? AND status='active' RETURNING id,status",now,key).first();
   return out({success:true,following:false,status:row?.status||"unsubscribed"});
  }
  if(path==="/api/public/events"&&method==="POST"){
   const b=await json();if(!b||typeof b.visitorToken!=="string"||!["page_view","project_view","article_view","certificate_view","contact_click","share","follow","unfollow","reaction","comment_submitted"].includes(b.eventType)||typeof b.path!=="string"||!b.path.startsWith("/"))return fail(400,"VALIDATION_ERROR","Invalid event payload");
   const key="visitor:"+await hash(b.visitorToken),f=await q("SELECT id FROM followers WHERE email_hash=? AND status IN ('active','unverified') LIMIT 1",key).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   let ref=null;try{ref=b.referrer?new URL(b.referrer).hostname:null}catch{}
   await q("INSERT INTO analytics_events(id,event_type,path,target_type,target_id,referrer_host,session_hash) VALUES(?,?,?,?,?,?,?)",crypto.randomUUID(),b.eventType,b.path.slice(0,500),b.targetType||null,b.targetId||null,ref,await hash(b.visitorToken)).run();return out({success:true},202);
  }
  if(path==="/api/public/articles"&&method==="GET"){const locale=url.searchParams.get("locale");const rows=locale?q("SELECT id,slug,locale,title,excerpt,category_id,cover_media_id,published_at FROM articles WHERE status='Published' AND published_at IS NOT NULL AND locale=? ORDER BY published_at DESC LIMIT 50",locale):q("SELECT id,slug,locale,title,excerpt,category_id,cover_media_id,published_at FROM articles WHERE status='Published' AND published_at IS NOT NULL ORDER BY published_at DESC LIMIT 50");return out({data:(await rows.all()).results});}
  if(path.startsWith("/api/public/articles/")&&method==="GET"){const slug=decodeURIComponent(path.split("/").pop());const row=await q("SELECT id,slug,locale,title,excerpt,body,category_id,cover_media_id,seo_title,seo_description,published_at FROM articles WHERE slug=? AND status='Published' AND published_at IS NOT NULL LIMIT 1",slug).first();return row?out(row):fail(404,"NOT_FOUND","Article not found");}
  if(path==="/api/public/comments"&&method==="POST"){
   const b=await json();if(!b||typeof b.visitorToken!=="string"||typeof b.articleId!=="string"||typeof b.body!=="string"||b.body.trim().length<2||b.body.length>2000)return fail(400,"VALIDATION_ERROR","Invalid comment");
   const f=await q("SELECT id FROM followers WHERE email_hash=? AND status IN ('active','unverified') LIMIT 1","visitor:"+await hash(b.visitorToken)).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   const a=await q("SELECT id FROM articles WHERE id=? AND status='Published'",b.articleId).first();if(!a)return fail(404,"ARTICLE_NOT_FOUND","Published article not found");
   const id=crypto.randomUUID();await q("INSERT INTO comments(id,article_id,follower_id,body,status) VALUES(?,?,?,?,'pending')",id,b.articleId,f.id,b.body.trim()).run();return out({id,status:"pending"},201);
  }
  if(path==="/api/public/reactions"&&method==="GET"){
   const targetType=url.searchParams.get("targetType"),targetId=url.searchParams.get("targetId");
   if(!["article","project"].includes(targetType)||!targetId||targetId.length>100)return fail(400,"VALIDATION_ERROR","Invalid reaction target");
   const table=targetType==="article"?"articles":"projects",where=targetType==="article"?"status='Published'":"is_published=1";
   const target=await q("SELECT id FROM "+table+" WHERE id=? AND "+where,targetId).first();if(!target)return fail(404,"TARGET_NOT_FOUND","Published target not found");
   const rows=await q("SELECT reaction,COUNT(*) count FROM reactions WHERE target_type=? AND target_id=? GROUP BY reaction",targetType,targetId).all();
   const counts={like:0,clap:0};for(const row of rows.results||[])if(row.reaction in counts)counts[row.reaction]=Number(row.count)||0;
   let reacted=false;const visitorToken=url.searchParams.get("visitorToken");
   if(visitorToken&&visitorToken.length>=32){const f=await q("SELECT id FROM followers WHERE email_hash=? LIMIT 1","visitor:"+await hash(visitorToken)).first();if(f)reacted=!!(await q("SELECT 1 FROM reactions WHERE target_type=? AND target_id=? AND follower_id=? AND reaction='like' LIMIT 1",targetType,targetId,f.id).first());}
   return out({targetType,targetId,counts,reacted});
  }
  if(path==="/api/public/comments"&&method==="GET"){
   const articleId=url.searchParams.get("articleId");if(!articleId)return fail(400,"VALIDATION_ERROR","Article ID is required");
   const article=await q("SELECT id FROM articles WHERE id=? AND status='Published'",articleId).first();if(!article)return fail(404,"ARTICLE_NOT_FOUND","Published article not found");
   const rows=await q("SELECT c.id,c.body,c.created_at,COALESCE(f.display_name,'زائر') display_name FROM comments c LEFT JOIN followers f ON f.id=c.follower_id WHERE c.article_id=? AND c.status='approved' ORDER BY c.created_at ASC LIMIT 100",articleId).all();
   return out({data:rows.results});
  }
  if(path==="/api/public/reactions"&&method==="POST"){
   const b=await json();if(!b||!["article","project"].includes(b.targetType)||typeof b.targetId!=="string"||!["like","clap"].includes(b.reaction)||typeof b.visitorToken!=="string"||b.visitorToken.length<32)return fail(400,"VALIDATION_ERROR","Invalid reaction");
   const f=await q("SELECT id FROM followers WHERE email_hash=? AND status IN ('active','unverified') LIMIT 1","visitor:"+await hash(b.visitorToken)).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   const table=b.targetType==="article"?"articles":"projects",where=b.targetType==="article"?"status='Published'":"is_published=1";const target=await q("SELECT id FROM "+table+" WHERE id=? AND "+where,b.targetId).first();if(!target)return fail(404,"TARGET_NOT_FOUND","Published target not found");
   const result=await q("INSERT INTO reactions(id,target_type,target_id,follower_id,reaction) VALUES(?,?,?,?,?) ON CONFLICT(target_type,target_id,follower_id,reaction) DO NOTHING",crypto.randomUUID(),b.targetType,b.targetId,f.id,b.reaction).run();
   return out({success:true,created:Number(result?.meta?.changes||0)===1},200);
  }
  if(path==="/api/public/reactions"&&method==="DELETE"){
   const b=await json();if(!b||!["article","project"].includes(b.targetType)||typeof b.targetId!=="string"||typeof b.visitorToken!=="string"||b.visitorToken.length<32||!["like","clap"].includes(b.reaction||"like"))return fail(400,"VALIDATION_ERROR","Invalid reaction removal");
   const f=await q("SELECT id FROM followers WHERE email_hash=? LIMIT 1","visitor:"+await hash(b.visitorToken)).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   const result=await q("DELETE FROM reactions WHERE target_type=? AND target_id=? AND follower_id=? AND reaction=? RETURNING id",b.targetType,b.targetId,f.id,b.reaction||"like").first();
   return out({success:true,removed:!!result});
  }
  if(admin&&path==="/api/admin/users"&&method==="GET"){
   if(!(await can("users.manage")))return fail(403,"FORBIDDEN","Missing users.manage permission");
   const rows=await q("SELECT u.id,u.email,u.display_name,u.status,u.created_at,u.last_login_at,GROUP_CONCAT(r.name,', ') roles FROM admin_users u LEFT JOIN admin_user_roles ur ON ur.user_id=u.id LEFT JOIN roles r ON r.id=ur.role_id GROUP BY u.id ORDER BY u.created_at DESC").all();return out({data:rows.results});
  }
  if(admin&&path==="/api/admin/users"&&method==="POST"){
   if(!(await can("users.manage")))return fail(403,"FORBIDDEN","Missing users.manage permission");const b=await json();if(!b||typeof b.email!=="string"||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)||typeof b.password!=="string"||b.password.length<12||b.password.length>200||typeof b.displayName!=="string"||b.displayName.trim().length<2||b.displayName.length>120||! ["editor","analyst"].includes(b.role))return fail(400,"VALIDATION_ERROR","Invalid user payload");
   const salt=crypto.getRandomValues(new Uint8Array(16)),key=await crypto.subtle.importKey("raw",new TextEncoder().encode(b.password),"PBKDF2",false,["deriveBits"]),bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt,iterations:210000},key,256),b64=x=>btoa(String.fromCharCode(...x)),passwordHash="pbkdf2-sha256$210000$"+b64(salt)+"$"+b64(new Uint8Array(bits)),id=crypto.randomUUID();
   const batch=await env.DB.batch([q("INSERT INTO admin_users(id,email,password_hash,display_name,status) VALUES(?,?,?,?,'active')",id,b.email.trim().toLowerCase(),passwordHash,b.displayName.trim()),q("INSERT INTO admin_user_roles(user_id,role_id) SELECT ?,id FROM roles WHERE name=?",id,b.role)]);if(Number(batch?.[0]?.meta?.changes||0)!==1)return fail(409,"USER_CREATE_FAILED","Could not create user");return out({id,email:b.email.trim().toLowerCase(),displayName:b.displayName.trim(),role:b.role},201);
  }
  if(admin&&path.startsWith("/api/admin/users/")&&method==="PATCH"){
   if(!(await can("users.manage")))return fail(403,"FORBIDDEN","Missing users.manage permission");const id=path.split("/").pop(),b=await json();if(id===current.id)return fail(409,"SELF_STATUS_CHANGE_DENIED","You cannot change your own account status");if(!["active","disabled","locked"].includes(b?.status))return fail(400,"VALIDATION_ERROR","Invalid account status");const target=await q("SELECT u.id,r.name role FROM admin_users u LEFT JOIN admin_user_roles ur ON ur.user_id=u.id LEFT JOIN roles r ON r.id=ur.role_id WHERE u.id=?",id).first();if(!target)return fail(404,"NOT_FOUND","User not found");if(target.role==="owner"&&b.status!=="active"){const count=await q("SELECT COUNT(*) n FROM admin_users u JOIN admin_user_roles ur ON ur.user_id=u.id JOIN roles r ON r.id=ur.role_id WHERE r.name='owner' AND u.status='active'").first();if(Number(count?.n||0)<=1)return fail(409,"LAST_OWNER_PROTECTED","Cannot disable the last active owner");}await q("UPDATE admin_users SET status=?,updated_at=? WHERE id=?",b.status,new Date().toISOString(),id).run();return out({success:true,id,status:b.status});
  }
  if(admin&&path.startsWith("/api/admin/")&&method==="GET"&&resources[path.split("/")[3]]){
   if(!(await can("content.read")))return fail(403,"FORBIDDEN","Missing content.read permission");const name=path.split("/")[3],c=resources[name],rows=await q("SELECT "+c.cols.join(",")+" FROM "+c.table+" ORDER BY rowid DESC LIMIT 200").all();return out({data:rows.results,total:rows.results.length});
  }
  if(admin&&path.startsWith("/api/admin/")&&["POST","PATCH","DELETE"].includes(method)&&resources[path.split("/")[3]]){
   const name=path.split("/")[3],c=resources[name],id=path.split("/")[4];if(method==="DELETE"){if(!(await can("content.delete")))return fail(403,"FORBIDDEN","Missing content.delete permission");if(!id)return fail(400,"INVALID_ID","Record id required");const before=await q("SELECT "+c.cols.join(",")+" FROM "+c.table+" WHERE id=?",id).first();if(!before)return fail(404,"NOT_FOUND","Record not found");await q("DELETE FROM "+c.table+" WHERE id=?",id).run();await q("INSERT INTO audit_logs(id,actor_user_id,action,resource_type,resource_id,before_json) VALUES(?,?,?,?,?,?)",crypto.randomUUID(),current.id,"delete",c.table,id,JSON.stringify(before)).run();return out({success:true,id});}
   if(!(await can("content.write")))return fail(403,"FORBIDDEN","Missing content.write permission");const b=await json();if(!b||typeof b!=="object"||Array.isArray(b))return fail(400,"VALIDATION_ERROR","Invalid content payload");const keys=Object.keys(b);if(!keys.length||keys.some(k=>!c.fields.includes(k)))return fail(400,"VALIDATION_ERROR","Unsupported or empty content fields");
   if(name==="projects"&&!(["Completed","In Progress","Experimental","Incomplete","Paused","Planned","Archived"].includes(b.status)))return fail(400,"VALIDATION_ERROR","Invalid project status");if(name==="articles"&&(!["ar","en"].includes(b.locale)||!["Draft","Scheduled","Published","Archived"].includes(b.status)||typeof b.body!=="string"||b.body.length>50000))return fail(400,"VALIDATION_ERROR","Invalid article fields");
   if(method==="POST"){const newId=crypto.randomUUID(),now=new Date().toISOString(),data={...b};if(c.cols.includes("created_at"))data.created_at=now;if(c.cols.includes("updated_at"))data.updated_at=now;if(c.cols.includes("author_id")&&!data.author_id)data.author_id=current.id;if(name==="articles"&&data.status==="Published"&&!data.published_at)data.published_at=now;const insertKeys=Object.keys(data);const row=await q("INSERT INTO "+c.table+" (id,"+insertKeys.join(",")+") VALUES ("+insertKeys.map(()=>"?").join(",")+") RETURNING "+c.cols.join(","),newId,...insertKeys.map(k=>data[k])).first();await q("INSERT INTO audit_logs(id,actor_user_id,action,resource_type,resource_id,after_json) VALUES(?,?,?,?,?,?)",crypto.randomUUID(),current.id,"create",c.table,newId,JSON.stringify(row)).run();return out(row,201);}
   if(method==="PATCH"){if(!id)return fail(400,"INVALID_ID","Record id required");const before=await q("SELECT "+c.cols.join(",")+" FROM "+c.table+" WHERE id=?",id).first();if(!before)return fail(404,"NOT_FOUND","Record not found");const data={...b};if(name==="articles"&&data.status==="Published"&&!data.published_at)data.published_at=new Date().toISOString();if(c.cols.includes("updated_at"))data.updated_at=new Date().toISOString();const updateKeys=Object.keys(data);const row=await q("UPDATE "+c.table+" SET "+updateKeys.map(k=>k+"=?").join(",")+" WHERE id=? RETURNING "+c.cols.join(","),...updateKeys.map(k=>data[k]),id).first();await q("INSERT INTO audit_logs(id,actor_user_id,action,resource_type,resource_id,before_json,after_json) VALUES(?,?,?,?,?,?,?)",crypto.randomUUID(),current.id,"update",c.table,id,JSON.stringify(before),JSON.stringify(row)).run();return out(row);}
  }
  if(admin&&path==="/api/admin/media"&&method==="GET"){if(!(await can("content.read")))return fail(403,"FORBIDDEN","Missing content.read permission");const rows=await q("SELECT id,storage_provider,storage_key,public_url,original_name,mime_type,size_bytes,alt_ar,alt_en,created_at FROM media ORDER BY created_at DESC LIMIT 200").all();return out({data:rows.results});}
  if(admin&&path==="/api/admin/media"&&method==="POST"){if(!(await can("content.write")))return fail(403,"FORBIDDEN","Missing content.write permission");const form=await request.formData(),file=form.get("file");if(!(file instanceof File)||file.size<1||file.size>1572864||!["image/jpeg","image/png","image/webp","image/svg+xml","application/pdf"].includes(file.type))return fail(400,"INVALID_MEDIA","Allowed files: JPEG, PNG, WebP, SVG or PDF up to 1.5 MB");const id=crypto.randomUUID(),bytes=new Uint8Array(await file.arrayBuffer()),publicUrl=file.type.startsWith("image/")?"https://mghal-api.m-gh-alaosimi.workers.dev/api/public/media/"+id:null;const row=await q("INSERT INTO media(id,storage_provider,storage_key,public_url,original_name,mime_type,size_bytes,alt_ar,alt_en,uploaded_by,blob_data) VALUES(? ,'d1',?,?,?,?,?,?,?,?,?) RETURNING id,storage_provider,storage_key,public_url,original_name,mime_type,size_bytes,created_at",id,"d1:"+id,publicUrl,file.name.slice(0,255),file.type,file.size,String(form.get("alt_ar")||"").slice(0,250),String(form.get("alt_en")||"").slice(0,250),current.id,bytes).first();return out(row,201);}
  if(admin&&path.startsWith("/api/admin/media/")&&method==="DELETE"){if(!(await can("content.write")))return fail(403,"FORBIDDEN","Missing content.write permission");const id=path.split("/").pop(),row=await q("SELECT id,original_name FROM media WHERE id=? LIMIT 1",id).first();if(!row)return fail(404,"MEDIA_NOT_FOUND","Media not found");await q("DELETE FROM media WHERE id=?",id).run();await q("INSERT INTO audit_logs(id,actor_user_id,action,resource_type,resource_id,before_json) VALUES(?,?,?,?,?,?)",crypto.randomUUID(),current.id,"delete","media",id,JSON.stringify(row)).run();return out({success:true,id});}
  if(admin&&path.startsWith("/api/admin/media/")&&method==="GET"){if(!(await can("content.read")))return fail(403,"FORBIDDEN","Missing content.read permission");const id=path.split("/").pop(),row=await q("SELECT blob_data,mime_type,original_name FROM media WHERE id=? LIMIT 1",id).first();if(!row||!row.blob_data)return fail(404,"MEDIA_NOT_FOUND","Media not found");const h=new Headers({"Content-Type":row.mime_type,"Content-Disposition":"attachment; filename*=UTF-8''"+encodeURIComponent(row.original_name),"Content-Length":String(row.blob_data.byteLength),"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"});return new Response(row.blob_data,{headers:h});}
  if(path.startsWith("/api/public/media/")&&method==="GET"){const id=path.split("/").pop(),row=await q("SELECT blob_data,mime_type FROM media WHERE id=? AND mime_type LIKE 'image/%' LIMIT 1",id).first();if(!row||!row.blob_data)return fail(404,"MEDIA_NOT_FOUND","Public image not found");const h=new Headers({"Content-Type":row.mime_type,"Content-Length":String(row.blob_data.byteLength),"Cache-Control":"public, max-age=86400","X-Content-Type-Options":"nosniff","Content-Security-Policy":"default-src 'none'; sandbox"});return new Response(row.blob_data,{headers:h});}
  if(admin&&path==="/api/admin/dashboard"&&method==="GET"){if(!(await can("analytics.read"))&&!(await can("content.read")))return fail(403,"FORBIDDEN","Missing dashboard permission");
   const names=["projects","certificates","followers","comments","articles","analytics_events"],sql=["SELECT COUNT(*) n FROM projects WHERE is_published=1","SELECT COUNT(*) n FROM certificates WHERE is_published=1","SELECT COUNT(*) n FROM followers WHERE status='active'","SELECT COUNT(*) n FROM comments WHERE status='pending'","SELECT COUNT(*) n FROM articles WHERE status='Published'","SELECT COUNT(*) n FROM analytics_events WHERE created_at>=?"];
   const vals=await Promise.all(sql.map((s,i)=>i===5?q(s,new Date(Date.now()-30*86400000).toISOString()).first():q(s).first()));return out(Object.fromEntries(names.map((n,i)=>[n,vals[i]?.n||0])));
  }
  if(admin&&path==="/api/admin/followers"&&method==="GET"){if(!(await can("followers.read"))&&!(await can("analytics.read")))return fail(403,"FORBIDDEN","Missing followers.read permission");const rows=await q("SELECT id,display_name,status,verified_at,consent_at,created_at,unsubscribed_at FROM followers WHERE consent_at IS NOT NULL ORDER BY created_at DESC LIMIT 100").all();return out({data:rows.results});}
  if(admin&&path.startsWith("/api/admin/followers/")&&method==="PATCH"){
   if(!(await can("followers.manage")))return fail(403,"FORBIDDEN","Missing followers.manage permission");const id=path.split("/").pop(),b=await json();if(!["active","unsubscribed","blocked"].includes(b?.status))return fail(400,"VALIDATION_ERROR","Invalid follower status");const row=await q("UPDATE followers SET status=?,unsubscribed_at=CASE WHEN ?='unsubscribed' THEN ? ELSE unsubscribed_at END WHERE id=? RETURNING id,status",b.status,b.status,new Date().toISOString(),id).first();return row?out(row):fail(404,"NOT_FOUND","Follower not found");
  }
  if(admin&&path==="/api/admin/comments"&&method==="GET"){if(!(await can("comments.read"))&&!(await can("content.read")))return fail(403,"FORBIDDEN","Missing comments.read permission");const rows=await q("SELECT c.id,c.article_id,c.follower_id,c.body,c.status,c.created_at,a.title article_title FROM comments c JOIN articles a ON a.id=c.article_id ORDER BY c.created_at DESC LIMIT 100").all();return out({data:rows.results});}
  if(admin&&path.startsWith("/api/admin/comments/")&&method==="PATCH"){if(!(await can("comments.moderate")))return fail(403,"FORBIDDEN","Missing comments.moderate permission");const id=path.split("/").pop(),b=await json();if(!["approved","rejected","spam"].includes(b?.status))return fail(400,"VALIDATION_ERROR","Invalid moderation status");const r=await q("UPDATE comments SET status=? WHERE id=? AND status='pending' RETURNING id,status",b.status,id).first();return r?out(r):fail(404,"NOT_FOUND","Pending comment not found");}
  if(admin&&path==="/api/admin/analytics"&&method==="GET"){if(!(await can("analytics.read")))return fail(403,"FORBIDDEN","Missing analytics.read permission");const days=Math.max(1,Math.min(90,Number(url.searchParams.get("days")||30)));const rows=await q("SELECT date(created_at) day,event_type,COUNT(*) count,COUNT(DISTINCT session_hash) visitors FROM analytics_events WHERE created_at>=? GROUP BY date(created_at),event_type ORDER BY day DESC",new Date(Date.now()-days*86400000).toISOString()).all();return out({days,data:rows.results});}
  if(path.startsWith("/api/public/")&&method==="GET"){
   const name=path.split("/")[3],tables={identity:["identity_profiles","is_published=1"],education:["education","is_published=1"],skills:["skills","is_published=1"],projects:["projects","is_published=1 AND status!='Archived'"],certificates:["certificates","is_published=1"],achievements:["achievements","is_published=1"],technologies:["technologies","is_published=1 AND archived=0"]};
   const cfg=tables[name];if(!cfg)return fail(404,"RESOURCE_NOT_FOUND","Unknown resource");const cols={identity:"id,locale,full_name,professional_title,headline,biography,location,avatar_media_id,updated_at",education:"id,institution,degree,field_of_study,location,start_date,end_date,status,description,sort_order",skills:"id,name,locale,category,proficiency,sort_order",technologies:"id,name,category,logo_url,website_url",projects:"id,slug,name,locale,short_description,description,status,repository_url,live_url,cover_media_id,started_at,completed_at,sort_order,created_at,updated_at",certificates:"id,slug,title,issuer,category,credential_id,issued_at,expires_at,verification_url,image_media_id,pdf_media_id,qr_url,description,sort_order,created_at,updated_at",achievements:"id,slug,title,description,achieved_at,related_project_id,media_id,sort_order"};
   const locale=url.searchParams.get("locale")==="ar"?"ar":"en";
   const sql=name==="projects"?"SELECT id,slug,CASE WHEN ?='ar' THEN COALESCE(NULLIF(name_ar,''),name) ELSE name END AS name,locale,CASE WHEN ?='ar' THEN COALESCE(NULLIF(short_description_ar,''),short_description) ELSE short_description END AS short_description,CASE WHEN ?='ar' THEN COALESCE(NULLIF(description_ar,''),description) ELSE description END AS description,status,repository_url,live_url,cover_media_id,started_at,completed_at,sort_order,created_at,updated_at FROM projects WHERE is_published=1 AND status!='Archived' ORDER BY sort_order ASC LIMIT 100":"SELECT "+cols[name]+" FROM "+cfg[0]+" WHERE "+cfg[1]+" ORDER BY "+(name==="certificates"?"sort_order ASC":"rowid DESC")+" LIMIT 100";
   const rows=name==="projects"?await q(sql,locale,locale,locale).all():await q(sql).all();return out({data:rows.results,total:rows.results.length,locale:name==="projects"?locale:undefined});
  }
  return fail(404,"NOT_FOUND","Route not found");
 }
};