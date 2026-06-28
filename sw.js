
const CACHE = 'ascend-v2';
const PAGE = 'https://alok-who-builds.github.io/Alok-s-habit-tracker-/';

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.add(PAGE))
      .catch(() => {})
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.open(CACHE).then(cache =>
      fetch(e.request)
        .then(res => {
          if (res && res.status === 200 && res.type !== 'opaque')
            cache.put(e.request, res.clone());
          return res;
        })
        .catch(() => caches.match(e.request) || caches.match(PAGE))
    )
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});
