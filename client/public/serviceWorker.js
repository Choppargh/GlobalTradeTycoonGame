// Service Worker for Global Trading Tycoon PWA
const CACHE_NAME = 'global-trading-tycoon-v5'; // Updated for better offline support
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/images/GTC_Background_Portrait.png',
  '/images/GTC_Logo.png',
  '/images/GTC_Play.png',
  '/images/GTC_Rules.png',
  '/images/GTC_Leaderboard.png'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Improved fetch handler with better offline support
self.addEventListener('fetch', event => {
  // For navigation requests (page loads), always serve the app shell
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('/')
        .then(response => {
          return response || fetch(event.request);
        })
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Only cache successful responses from the network
        if (response && response.status === 200) {
          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(event.request)
          .then(cachedResponse => {
            // If we have a cached version, return it
            if (cachedResponse) {
              return cachedResponse;
            }
            // For navigation requests that aren't cached, return the app shell
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            // For other requests, let them fail naturally
            throw new Error('No cached content available');
          });
      })
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  // Take control immediately without waiting for reload
  event.waitUntil(
    Promise.all([
      // Clear old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients immediately
      self.clients.claim()
    ])
  );
});