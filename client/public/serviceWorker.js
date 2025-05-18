// Service Worker for Global Trading Tycoon PWA
const CACHE_NAME = 'global-trading-tycoon-v3'; // Incremented version to force cache refresh
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

// Cache and return requests
self.addEventListener('fetch', event => {
  // For HTML and JS requests, use network-first strategy to ensure latest version
  if (event.request.url.endsWith('.html') || 
      event.request.url.endsWith('.js') || 
      event.request.url.endsWith('.css') ||
      event.request.url.includes('/assets/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response as it can only be consumed once
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          // If network fails, try to serve from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For other requests (images, fonts, etc.), use cache-first strategy
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit - return response
          if (response) {
            return response;
          }
          return fetch(event.request).then(
            response => {
              // Check if we received a valid response
              if(!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }

              // Clone the response as it can only be consumed once
              const responseToCache = response.clone();

              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });

              return response;
            }
          );
        })
      );
  }
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