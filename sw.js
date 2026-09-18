const CACHE_NAME = 'quiz-app-v1.1';

const urlsToCache = [
  './',
  './index.html',
  './style.css', 
  './manifest.json',
  './M1.csv',
  './M2.csv',
  './M3.csv',
  './M4.csv',
  './icona.png',
  'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// FASE 1: Installazione (scarica e salva i file in locale)
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Cache aperta: salvataggio file in corso...');
            return cache.addAll(urlsToCache);
        })
    );
});

// FASE 2: Intercettazione delle richieste (fa funzionare l'app offline)
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Se il file è presente nella cache, usa quello
            if (response) {
                return response;
            }
            // Altrimenti prova a scaricarlo da internet
            return fetch(event.request).catch(() => {
                console.log('Sei offline e il file non è in cache:', event.request.url);
            });
        })
    );
});

// FASE 3: Attivazione e pulizia (elimina le vecchie versioni della cache se cambi CACHE_NAME)
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Eliminazione vecchia cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});