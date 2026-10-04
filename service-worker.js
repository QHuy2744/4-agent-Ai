const CACHE_NAME = 'nexus-titan-v1';
const ASSETS = [
  './index.html',
  './style.css',
  './app.js',
  './state.js',
  './storage.js',
  './tasks.js',
  './projects.js',
  './calendar.js',
  './analytics.js',
  './search.js',
  './commands.js',
  './settings.js',
  './notifications.js',
  './import-export.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request)).catch(() => caches.match('./index.html'))
  );
});
