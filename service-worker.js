const CACHE_NAME = 'park-ease-cache-v1';
const urlsToCache = [
    '/', // Add your app's root
    '/index.html', // Main HTML file
    '/_expo/static/js/web/entry-5aa45a5a3250f9ef50b71bfcfa58b170.js', // Main JavaScript file
    '/manifest.json', // PWA manifest
    '/icons/icon-192x192.png', // Example icon
    '/icons/icon-512x512.png' // Example icon
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(urlsToCache);
        })
    );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});