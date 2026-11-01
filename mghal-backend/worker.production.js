export default {
 async fetch(request, env) {
  const url = new URL(request.url), path = url.pathname, method = request.method;
  const allowed = ["https://mghalaosimi-web.vercel.app","https://mghal-static.onrender.com","https://mghal.vercel.app"];
  const origin = request.headers.get("Origin") || "";
  const headers = new Headers({"Vary":"Origin","Access-Control-Allow-Methods":"GET,POST,PATCH,DELETE,OPTIONS","Access-Control-Allow-Headers":"Content-Type,Authorization","X-Content-Type-Options":"nosniff","X-Frame-Options":"DENY","Referrer-Policy":"strict-origin-when-cross-origin","Cache-Control":"no-store"});
  if (allowed.includes(origin)) headers.set("Access-Control-Allow-Origin",origin);
  const out=(data,status=200)=>Response.json(data,{status,headers});
  const fail=(status,code,message)=>out({error:{code,message}},status);
  const q=(sql,...params)=>env.DB.prepare(sql).bind(...params);
  const hash=async value=>{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")};
  const json=async()=>{try{return await request.json()}catch{return null}};
  const token=()=>[...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,"0")).join("");
  const actor=async()=>{const raw=request.headers.get("Authorization")||"",t=raw.startsWith("Bearer ")?raw.slice(7):"";if(!t||t.length>200)return null;return q("SELECT u.id,u.email FROM admin_sessions s JOIN admin_users u ON u.id=s.user_id WHERE s.token_hash=? AND s.revoked_at IS NULL AND s.expires_at>? AND u.status='active' LIMIT 1",await hash(t),new Date().toISOString()).first()};
  const admin=path.startsWith("/api/admin/");
  if(method==="OPTIONS") return new Response(null,{status:204,headers});
  if(origin&&!allowed.includes(origin)) return fail(403,"ORIGIN_DENIED","Origin is not allowed");
  if(path==="/health"&&method==="GET"){const r=await q("SELECT 1 AS ok").first();return out({status:r?.ok===1?"ok":"degraded",database:r?.ok===1?"connected":"unavailable"});}
  if(!path.startsWith("/api/"))return fail(404,"NOT_FOUND","Route not found");
  const minute=Math.floor(Date.now()/60000),ip=request.headers.get("CF-Connecting-IP")||"unknown",rateKey="rl:"+await hash(ip+":"+minute);try{await q("INSERT INTO site_settings(key,value_json) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value_json=CAST(CAST(site_settings.value_json AS INTEGER)+1 AS TEXT)",rateKey,"1").run();const count=await q("SELECT value_json FROM site_settings WHERE key=?",rateKey).first();if(Number(count?.value_json||0)>120)return fail(429,"RATE_LIMITED","Too many requests");}catch{return fail(503,"RATE_LIMIT_UNAVAILABLE","Request protection is temporarily unavailable");}
  if(path==="/api/admin/auth/login"&&method==="POST"){
   const b=await json();if(!b||typeof b.email!=="string"||typeof b.password!=="string"||b.password.length<12)return fail(400,"VALIDATION_ERROR","Invalid login payload");
   const u=await q("SELECT id,email,password_hash,status FROM admin_users WHERE email=? COLLATE NOCASE LIMIT 1",b.email.trim()).first();if(!u||u.status!=="active")return fail(401,"INVALID_CREDENTIALS","Invalid credentials");
   const [kind,n,salt,expected]=(u.password_hash||"").split("$");if(kind!=="pbkdf2-sha256"||!salt||!expected)return fail(401,"INVALID_CREDENTIALS","Invalid credentials");
   const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(b.password),"PBKDF2",false,["deriveBits"]);
   const bits=await crypto.subtle.deriveBits({name:"PBKDF2",hash:"SHA-256",salt:Uint8Array.from(atob(salt),c=>c.charCodeAt(0)),iterations:Number(n)},key,256);
   const actual=btoa(String.fromCharCode(...new Uint8Array(bits)));if(actual!==expected)return fail(401,"INVALID_CREDENTIALS","Invalid credentials");
   const t=token(),expires=new Date(Date.now()+28800000).toISOString();await q("INSERT INTO admin_sessions(id,user_id,token_hash,expires_at) VALUES(?,?,?,?)",crypto.randomUUID(),u.id,await hash(t),expires).run();await q("UPDATE admin_users SET last_login_at=?,updated_at=? WHERE id=?",new Date().toISOString(),new Date().toISOString(),u.id).run();return out({token:t,expiresAt:expires,user:{id:u.id,email:u.email}});
  }
  let current=null;if(admin){current=await actor();if(!current)return fail(401,"UNAUTHENTICATED","Authentication required");}
  const can=async code=>!!(await q("SELECT 1 FROM admin_user_roles ur JOIN role_permissions rp ON rp.role_id=ur.role_id JOIN permissions p ON p.id=rp.permission_id WHERE ur.user_id=? AND p.code=? LIMIT 1",current?.id||"",code).first());
  if(path==="/api/admin/auth/logout"&&method==="POST"){const t=(request.headers.get("Authorization")||"").slice(7);await q("UPDATE admin_sessions SET revoked_at=? WHERE user_id=? AND token_hash=? AND revoked_at IS NULL",new Date().toISOString(),current.id,await hash(t)).run();return out({success:true});}
  if(path==="/api/public/visitors"&&method==="POST"){
   const b=await json(),visitorToken=typeof b?.visitorToken==="string"&&b.visitorToken.length>=32?b.visitorToken:token(),key="visitor:"+await hash(visitorToken);
   let f=await q("SELECT id FROM followers WHERE email_hash=? LIMIT 1",key).first();let fresh=false;if(!f){f={id:crypto.randomUUID()};fresh=true;await q("INSERT INTO followers(id,email_hash,status) VALUES(?,?,'active')",f.id,key).run();}
   const page=typeof b?.path==="string"&&b.path.startsWith("/")?b.path.slice(0,500):"/";
   if(fresh)await q("INSERT INTO analytics_events(id,event_type,path,session_hash) VALUES(?,?,?,?)",crypto.randomUUID(),"visitor_start",page,await hash(visitorToken)).run();
   return out({visitorToken,followerId:f.id,status:"active"},201);
  }
  if(path==="/api/public/events"&&method==="POST"){
   const b=await json();if(!b||typeof b.visitorToken!=="string"||!["page_view","project_view","article_view","certificate_view","contact_click"].includes(b.eventType)||typeof b.path!=="string"||!b.path.startsWith("/"))return fail(400,"VALIDATION_ERROR","Invalid event payload");
   const key="visitor:"+await hash(b.visitorToken),f=await q("SELECT id FROM followers WHERE email_hash=? AND status='active' LIMIT 1",key).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   let ref=null;try{ref=b.referrer?new URL(b.referrer).hostname:null}catch{}
   await q("INSERT INTO analytics_events(id,event_type,path,target_type,target_id,referrer_host,session_hash) VALUES(?,?,?,?,?,?,?)",crypto.randomUUID(),b.eventType,b.path.slice(0,500),b.targetType||null,b.targetId||null,ref,await hash(b.visitorToken)).run();return out({success:true},202);
  }
  if(path==="/api/public/articles"&&method==="GET"){const locale=url.searchParams.get("locale");const rows=locale?q("SELECT id,slug,locale,title,excerpt,category_id,cover_media_id,published_at FROM articles WHERE status='Published' AND published_at IS NOT NULL AND locale=? ORDER BY published_at DESC LIMIT 50",locale):q("SELECT id,slug,locale,title,excerpt,category_id,cover_media_id,published_at FROM articles WHERE status='Published' AND published_at IS NOT NULL ORDER BY published_at DESC LIMIT 50");return out({data:(await rows.all()).results});}
  if(path.startsWith("/api/public/articles/")&&method==="GET"){const slug=decodeURIComponent(path.split("/").pop());const row=await q("SELECT id,slug,locale,title,excerpt,body,category_id,cover_media_id,seo_title,seo_description,published_at FROM articles WHERE slug=? AND status='Published' AND published_at IS NOT NULL LIMIT 1",slug).first();return row?out(row):fail(404,"NOT_FOUND","Article not found");}
  if(path==="/api/public/comments"&&method==="POST"){
   const b=await json();if(!b||typeof b.visitorToken!=="string"||typeof b.articleId!=="string"||typeof b.body!=="string"||b.body.trim().length<2||b.body.length>2000)return fail(400,"VALIDATION_ERROR","Invalid comment");
   const f=await q("SELECT id FROM followers WHERE email_hash=? AND status='active' LIMIT 1","visitor:"+await hash(b.visitorToken)).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   const a=await q("SELECT id FROM articles WHERE id=? AND status='Published'",b.articleId).first();if(!a)return fail(404,"ARTICLE_NOT_FOUND","Published article not found");
   const id=crypto.randomUUID();await q("INSERT INTO comments(id,article_id,follower_id,body,status) VALUES(?,?,?,?,'pending')",id,b.articleId,f.id,b.body.trim()).run();return out({id,status:"pending"},201);
  }
  if(path==="/api/public/reactions"&&method==="POST"){
   const b=await json();if(!b||!["article","project"].includes(b.targetType)||typeof b.targetId!=="string"||!["like","clap"].includes(b.reaction)||typeof b.visitorToken!=="string")return fail(400,"VALIDATION_ERROR","Invalid reaction");
   const f=await q("SELECT id FROM followers WHERE email_hash=? AND status='active' LIMIT 1","visitor:"+await hash(b.visitorToken)).first();if(!f)return fail(401,"VISITOR_SESSION_REQUIRED","Register visitor session first");
   const table=b.targetType==="article"?"articles":"projects",where=b.targetType==="article"?"status='Published'":"is_published=1";const target=await q("SELECT id FROM "+table+" WHERE id=? AND "+where,b.targetId).first();if(!target)return fail(404,"TARGET_NOT_FOUND","Published target not found");
   await q("INSERT INTO reactions(id,target_type,target_id,follower_id,reaction) VALUES(?,?,?,?,?) ON CONFLICT(target_type,target_id,follower_id,reaction) DO NOTHING",crypto.randomUUID(),b.targetType,b.targetId,f.id,b.reaction).run();return out({success:true},201);
  }
  if(admin&&path==="/api/admin/dashboard"&&method==="GET"){if(!(await can("analytics.read"))&&!(await can("content.read")))return fail(403,"FORBIDDEN","Missing dashboard permission");
   const names=["projects","certificates","followers","comments","articles","analytics_events"],sql=["SELECT COUNT(*) n FROM projects WHERE is_published=1","SELECT COUNT(*) n FROM certificates WHERE is_published=1","SELECT COUNT(*) n FROM followers WHERE status='active'","SELECT COUNT(*) n FROM comments WHERE status='pending'","SELECT COUNT(*) n FROM articles WHERE status='Published'","SELECT COUNT(*) n FROM analytics_events WHERE created_at>=?"];
   const vals=await Promise.all(sql.map((s,i)=>i===5?q(s,new Date(Date.now()-30*86400000).toISOString()).first():q(s).first()));return out(Object.fromEntries(names.map((n,i)=>[n,vals[i]?.n||0])));
  }
  if(admin&&path==="/api/admin/followers"&&method==="GET"){if(!(await can("followers.read"))&&!(await can("analytics.read")))return fail(403,"FORBIDDEN","Missing followers.read permission");const rows=await q("SELECT id,display_name,status,verified_at,consent_at,created_at,unsubscribed_at FROM followers ORDER BY created_at DESC LIMIT 100").all();return out({data:rows.results});}
  if(admin&&path==="/api/admin/comments"&&method==="GET"){if(!(await can("comments.read"))&&!(await can("content.read")))return fail(403,"FORBIDDEN","Missing comments.read permission");const rows=await q("SELECT c.id,c.article_id,c.follower_id,c.body,c.status,c.created_at,a.title article_title FROM comments c JOIN articles a ON a.id=c.article_id ORDER BY c.created_at DESC LIMIT 100").all();return out({data:rows.results});}
  if(admin&&path.startsWith("/api/admin/comments/")&&method==="PATCH"){if(!(await can("comments.moderate")))return fail(403,"FORBIDDEN","Missing comments.moderate permission");const id=path.split("/").pop(),b=await json();if(!["approved","rejected","spam"].includes(b?.status))return fail(400,"VALIDATION_ERROR","Invalid moderation status");const r=await q("UPDATE comments SET status=? WHERE id=? AND status='pending' RETURNING id,status",b.status,id).first();return r?out(r):fail(404,"NOT_FOUND","Pending comment not found");}
  if(admin&&path==="/api/admin/analytics"&&method==="GET"){if(!(await can("analytics.read")))return fail(403,"FORBIDDEN","Missing analytics.read permission");const days=Math.max(1,Math.min(90,Number(url.searchParams.get("days")||30)));const rows=await q("SELECT date(created_at) day,event_type,COUNT(*) count,COUNT(DISTINCT session_hash) visitors FROM analytics_events WHERE created_at>=? GROUP BY date(created_at),event_type ORDER BY day DESC",new Date(Date.now()-days*86400000).toISOString()).all();return out({days,data:rows.results});}
  if(path.startsWith("/api/public/")&&method==="GET"){
   const name=path.split("/")[3],tables={identity:["identity_profiles","is_published=1"],education:["education","is_published=1"],skills:["skills","is_published=1"],projects:["projects","is_published=1 AND status!='Archived'"],certificates:["certificates","is_published=1"],achievements:["achievements","is_published=1"],technologies:["technologies","1=1"]};
   const cfg=tables[name];if(!cfg)return fail(404,"RESOURCE_NOT_FOUND","Unknown resource");const cols={identity:"id,locale,full_name,professional_title,headline,biography,location,avatar_media_id,updated_at",education:"id,institution,degree,field_of_study,location,start_date,end_date,status,description,sort_order",skills:"id,name,locale,category,proficiency,sort_order",technologies:"id,name,category,logo_url,website_url",projects:"id,slug,name,locale,short_description,description,status,repository_url,live_url,cover_media_id,started_at,completed_at,sort_order,created_at,updated_at",certificates:"id,slug,title,issuer,category,credential_id,issued_at,expires_at,verification_url,image_media_id,pdf_media_id,qr_url,description,sort_order,created_at,updated_at",achievements:"id,slug,title,description,achieved_at,related_project_id,media_id,sort_order"};
   const rows=await q("SELECT "+cols[name]+" FROM "+cfg[0]+" WHERE "+cfg[1]+" ORDER BY "+(name==="projects"||name==="certificates"?"sort_order ASC":"rowid DESC")+" LIMIT 100").all();return out({data:rows.results,total:rows.results.length});
  }
  return fail(404,"NOT_FOUND","Route not found");
 }
};