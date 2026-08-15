const CACHE = 'wagenmeister-original-excel-20260815-v2';
const STATIC = ['./manifest.webmanifest','./logo.jpg','./icon-180.png','./icon-192.png','./icon-512.png','./wagons.json','./wagenmeister-original.xlsx'];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(STATIC).catch(()=>{})));
});

self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // HTML / navigation is ALWAYS network-first. Never let an old index.html stick.
  if (req.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/')) {
    event.respondWith(fetch(req, {cache:'no-store'}).catch(()=>caches.match('./index.html')));
    return;
  }
  // wagons.json should also prefer fresh data.
  if (url.pathname.endsWith('/wagons.json')) {
    event.respondWith(fetch(req, {cache:'no-store'}).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));return r;}).catch(()=>caches.match(req)));
    return;
  }
  event.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(x=>x.put(req,c));return r;})));
});
