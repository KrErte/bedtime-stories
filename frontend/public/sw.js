// Dreamlit Service Worker
// Caches the app shell for offline support and fast repeat visits.

const CACHE_NAME = 'dreamlit-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico'
];

// ─── Install ──────────────────────────────────────────────────────────────────
// Pre-cache the app shell so the app loads instantly on repeat visits.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching app shell');
      return cache.addAll(APP_SHELL);
    })
  );
  // Activate immediately rather than waiting for old tabs to close.
  self.skipWaiting();
});

// ─── Activate ─────────────────────────────────────────────────────────────────
// Remove stale caches from previous versions.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    )
  );
  // Take control of all open clients immediately.
  self.clients.claim();
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
// Strategy: Network-first for API calls, Cache-first for everything else.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Let non-GET requests (POST, PUT, DELETE) pass straight through.
  if (request.method !== 'GET') return;

  // API calls: always go to the network; never serve stale data.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(
          JSON.stringify({ error: 'You appear to be offline.' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        )
      )
    );
    return;
  }

  // App shell & static assets: Cache-first, fall back to network.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Only cache valid same-origin responses.
        if (
          !response ||
          response.status !== 200 ||
          response.type === 'opaque' ||
          !url.origin === self.location.origin
        ) {
          return response;
        }

        // Clone before consuming: one copy for the cache, one for the browser.
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
        return response;
      });
    }).catch(() => {
      // Offline fallback: serve index.html for navigation requests so the
      // Angular router can display an offline message if it chooses.
      if (request.destination === 'document') {
        return caches.match('/index.html');
      }
    })
  );
});

// ─── Message ──────────────────────────────────────────────────────────────────
// Allow the app to trigger a cache refresh (e.g. after a user logs out).
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
