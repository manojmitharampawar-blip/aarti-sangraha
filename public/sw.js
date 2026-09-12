// Aarti Sangraha Service Worker for PWA Offline, Instant Updates & Install Support
const CACHE_NAME = 'aarti-sangraha-v3';
const STATIC_ASSETS = [
  './',
  'manifest.json',
  'icon-192.png',
  'icon-512.png',
];

// Install: Cache initial shell and immediately prepare for activation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return Promise.allSettled(
        STATIC_ASSETS.map(asset => cache.add(asset).catch(err => console.warn('SW cache skip:', asset, err)))
      );
    })
  );
  self.skipWaiting();
});

// Activate: Delete old caches from previous builds so users never see stale content
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Listen for SKIP_WAITING message sent from client when new update is accepted
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch: Instant freshness strategy without requiring hard reload
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // 1. Next.js static chunks & assets (immutable hashes): Cache First
  if (
    url.pathname.includes('/_next/static/') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);
      })
    );
    return;
  }

  // 2. HTML navigation & JSON data: Network-First (cache: no-cache) with offline cache fallback
  // This guarantees new website updates are fetched immediately without needing a hard reload
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            return caches.match('./');
          }
          return null;
        });
      })
  );
});
