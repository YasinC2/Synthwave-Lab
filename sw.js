const CACHE_NAME = 'Synthwave-Lab-v1.0.1';
const OFFLINE_PAGE = 'index.html';
const ASSETS = [
  'index.html',
  'lib/Tone-15.3.5.js',
  'images/icon.svg',
  'images/icon-512.png',
  'images/icon-192.png',
  'images/screenshot-mobile.jpg',
  'images/screenshot-desktop.jpg',
  'style/poppins.css',
  'style/fonts/pxiEyp8kv8JHgFVrJJbecmNE.woff2',
  'style/fonts/pxiEyp8kv8JHgFVrJJfecg.woff2',
  'style/fonts/pxiEyp8kv8JHgFVrJJnecmNE.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Network First for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
  } else {
    // Cache First for static assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
    );
  }
});

self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
