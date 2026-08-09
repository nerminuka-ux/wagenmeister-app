const CACHE='wagenmeister-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./logo.jpg','./icon-180.png','./icon-192.png','./icon-512.png','./wagons.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))));
