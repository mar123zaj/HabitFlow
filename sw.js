const CACHE_NAME = 'habitflow-v6';

const STATIC_ASSETS = [
  './',
  './index.html',
  './login.html',
  './habit-form.html',
  './habit-detail.html',
  './css/reset.css',
  './css/variables.css',
  './css/app.css',
  './js/supabase.js',
  './js/auth.js',
  './js/habits.js',
  './js/logs.js',
  './js/ui.js',
  './js/app.js',
  './js/requirements.js',
  './manifest.json',
  './icons/favicon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Network only for Supabase API and auth requests
  if (url.hostname.includes('supabase')) return;

  // Network only for CDN-hosted ES modules (Supabase JS)
  if (url.hostname === 'esm.sh') return;

  // Cache first for same-origin static assets
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // Runtime caching for Google Fonts
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
  }
});
