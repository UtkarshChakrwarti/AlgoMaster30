// ============================================================================
// ALGOMASTER 30 — APPLE-GRADE OFFLINE CACHING SERVICE WORKER
// Cache-First with Stale-While-Revalidate • 100% Client-Side Offline Persistence
// ============================================================================

const CACHE_NAME = 'algomaster-apple-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/blind75.js',
  './js/curriculum.js',
  './js/coach-data.js',
  './js/visualizer-data.js',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png'
];

// Install: Pre-cache all core application assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate: Clean up old cache versions and claim clients instantly
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Message: Clean up all caches on demand from client request
self.addEventListener('message', (event) => {
  if (event.data && (event.data.action === 'CLEAR_CACHE' || event.data.action === 'PURGE_ALL')) {
    event.waitUntil(
      caches.keys().then((keys) => {
        return Promise.all(keys.map((key) => caches.delete(key)));
      }).then(() => {
        return self.clients.claim();
      }).then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ success: true, timestamp: Date.now() });
        }
      })
    );
  }
});

// Fetch: Cache-First with background revalidation and offline fallback
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore browser extensions or foreign protocols
  if (!url.protocol.startsWith('http')) return;

  // Bypass cache completely when cache-busting purge query parameters are present
  if (url.searchParams.has('cache_purge') || url.searchParams.has('state_reset') || url.searchParams.has('asset_refresh') || url.searchParams.has('reset')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version immediately for lightning-fast loads
        // Fetch network update in background if online (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
        }).catch(() => {
          // Offline, cachedResponse already served
        });

        return cachedResponse;
      }

      // If not in cache, fetch from network and cache dynamically
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(() => {
        // Fallback for document navigation if offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
