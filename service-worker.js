// MANU 3.28.2 — spójny zestaw plików i kontrolowane aktywowanie aktualizacji.
const CACHE_NAME='manu-app-v3.28.2';
const CORE_SHELL=[
 './',
 './index.html',
 './styles.css?v=3.28.2',
 './app.js?v=3.28.2',
 './cloud-config.js?v=3.13.0',
 './cloud.js?v=3.28.2',
 './gallery.js?v=3.28.2',
 './templates.js?v=3.28.2'
];
const OPTIONAL_SHELL=[
 './manifest.webmanifest',
 './manu48-192-v5.png',
 './manu48-512-v5.png',
 './manu48-maskable-512-v5.png',
 './manu48-icon.svg',
 './manu48-mark.svg'
];
const inAppScope=url=>{
 const source=new URL(url);
 const scope=new URL(self.registration.scope);
 return source.origin===scope.origin&&source.pathname.startsWith(scope.pathname);
};

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE_NAME).then(async cache=>{
  // Błąd choć jednego pliku krytycznego wstrzymuje instalację NOWEJ wersji.
  // Poprzednia działająca aplikacja pozostaje bez zmian.
  await cache.addAll(CORE_SHELL);
  await Promise.allSettled(OPTIONAL_SHELL.map(path=>cache.add(path)));
 }).then(()=>{
  // Pierwsza instalacja: przejmij aplikację. Aktualizacja: czekaj na
  // świadomą zgodę — nie mieszaj starego HTML z nowym JavaScriptem.
  if(!self.registration.active)return self.skipWaiting();
 }));
});

self.addEventListener('message',event=>{
 if(event.data?.type==='MANU_ACTIVATE_UPDATE'){
  event.waitUntil(self.skipWaiting());
 }
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>
   (key.startsWith('pracownia-app-')||key.startsWith('manu-app-'))&&key!==CACHE_NAME
  ).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});

self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET'||!inAppScope(request.url))return;
 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE_NAME);
   // Jeden HTML z tej samej wersji co skrypty. Nawigacja online również
   // korzysta z niego do momentu zatwierdzenia aktualizacji.
   const shell=await cache.match('./index.html');
   if(shell)return shell;
   try{return await fetch(request)}catch(e){return Response.error()}
  })());
  return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE_NAME);
  const cached=await cache.match(request);
  if(cached)return cached;
  try{
   const response=await fetch(request);
   if(response.ok)event.waitUntil(cache.put(request,response.clone()).catch(e=>
    console.warn('MANU: pominięto zapis pliku do cache',e)
   ));
   return response;
  }catch(e){return Response.error()}
 })());
});
