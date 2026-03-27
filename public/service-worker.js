const CACHE_VERSION = 'tt-travels-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const API_CACHE = `${CACHE_VERSION}-api`;

const OFFLINE_FALLBACKS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './favicon-32x32.png',
  './favicon-16x16.png',
  './apple-touch-icon.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(OFFLINE_FALLBACKS)),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => !cacheName.startsWith(CACHE_VERSION))
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
});

const isNavigationRequest = (request) => request.mode === 'navigate';

const isApiRequest = (requestUrl) => {
  const { origin, pathname } = new URL(requestUrl);
  return origin === self.location.origin && pathname.startsWith('/api/');
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  if (isApiRequest(request.url)) {
    event.respondWith(
      caches.open(API_CACHE).then(async (cache) => {
        const cachedResponse = await cache.match(request);
        const networkFetch = fetch(request).then((networkResponse) => {
          if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => null);

        if (cachedResponse) {
          // Stale-while-revalidate: return cached immediately, update in background
          networkFetch.catch(() => {});
          return cachedResponse;
        }

        const networkResponse = await networkFetch;
        if (networkResponse) {
          return networkResponse;
        }
        return new Response(JSON.stringify({ error: 'Offline and no cached API response available.' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );
    return;
  }

  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(STATIC_CACHE);
        return cache.match('./index.html');
      }),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => Response.error());
    }),
  );
});
