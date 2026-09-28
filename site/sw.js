const CACHE='jcb-entry-v2';
const SHELL=['/jcb.html','/manifest.json','https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js','https://www.gstatic.com/firebasejs/12.9.0/firebase-database-compat.js','https://www.gstatic.com/firebasejs/12.9.0/firebase-auth-compat.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match('/jcb.html'))))});
self.addEventListener('message',e=>{if(e.data==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('sync',e=>{if(e.tag==='jcb-sync')e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>cs.forEach(c=>c.postMessage({type:'JCB_SYNC'}))))});