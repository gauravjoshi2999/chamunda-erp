const CACHE='jcb-entry-v4';
const SHELL=['/jcb.html','/manifest.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('jcb-entry-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 const isPage=e.request.mode==='navigate'||new URL(e.request.url).pathname==='/jcb.html';
 if(isPage){
   e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put('/jcb.html',copy));return r}).catch(()=>caches.match('/jcb.html')));
   return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok||r.type==='opaque'){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>caches.match('/jcb.html'))));
});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('sync',e=>{if(e.tag==='jcb-sync')e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs.forEach(c=>c.postMessage({type:'JCB_SYNC'}))))});