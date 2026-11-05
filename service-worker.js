const CACHE_NAME='manu-app-v3.28.0';
// Arkusz aplikacji potrzebny do uruchomienia wszystkich kart bez sieci.
// Dopiero po zapisaniu całej tej grupy uaktywniamy nową wersję SW.
const CORE_SHELL=[
 './',
 './index.html',
 './styles.css?v=3.28.0',
 './app.js?v=3.28.0',
 './cloud-config.js?v=3.13.0',
 './cloud.js?v=3.26.0',
 './gallery.js?v=3.28.0',
 './templates.js?v=3.28.0'
];
// Brak pojedynczej grafiki nie powinien blokować całej aplikacji offline.
const OPTIONAL_SHELL=[
 './manifest.webmanifest',
 './manu48-192-v5.png',
 './manu48-512-v5.png',
 './manu48-maskable-512-v5.png',
 './manu48-icon.svg',
 './manu48-mark.svg'
];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(async cache=>{
  await cache.addAll(CORE_SHELL);
  await Promise.allSettled(OPTIONAL_SHELL.map(path=>cache.add(path)));
 }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
  keys.filter(key=>(key.startsWith('pracownia-app-')||key.startsWith('manu-app-'))&&key!==CACHE_NAME)
   .map(key=>caches.delete(key))
 )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(request).then(response=>{
  if(response.ok){
   const copy=response.clone();
   event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.put(request,copy)).catch(e=>console.warn('MANU: pominięto zapis pliku do cache',e)));
  }
  return response;
 }).catch(async()=>{
  const cached=await caches.match(request);
  if(cached)return cached;
  if(request.mode==='navigate')return (await caches.match('./index.html'))||Response.error();
  return Response.error();
 }));
});
