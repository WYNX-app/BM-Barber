const CACHE_NAME = 'dm-barbearia-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Estratégia: Tenta buscar na rede, se falhar, busca no cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});