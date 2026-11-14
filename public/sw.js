const CACHE_NAME="mghal-pwa-v7";
const CORE_ASSETS=[
  "/favicon.svg",
  "/assets/pwa-icon.svg",
  "/manifest.json",
  "/assets/design-tokens.css",
  "/assets/theme.css"
];
const OFFLINE_DOCUMENT="/offline";

self.addEventListener("install",(event)=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    try{await cache.add(OFFLINE_DOCUMENT);}catch{}
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",(event)=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith("mghal-pwa-")&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request){
  try{return await fetch(request);}
  catch{
    const cache=await caches.open(CACHE_NAME);
    return (await cache.match(OFFLINE_DOCUMENT))||Response.error();
  }
}

async function staleWhileRevalidate(request){
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request);
  const update=fetch(request).then(async response=>{
    if(response&&response.ok)await cache.put(request,response.clone());
    return response;
  });
  if(cached){update.catch(()=>{});return cached;}
  try{return await update;}catch{return Response.error();}
}

self.addEventListener("fetch",(event)=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=="GET"||url.origin!==self.location.origin)return;
  if(request.mode==="navigate"||request.destination==="document"){
    event.respondWith(networkFirst(request));
    return;
  }
  if(["style","script","image","font"].includes(request.destination)||url.pathname==="/manifest.json"){
    event.respondWith(staleWhileRevalidate(request));
  }
});
