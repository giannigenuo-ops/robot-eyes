// Service Worker — Robot Buddy PWA
// Mette in cache tutti i file per uso offline

const CACHE = "buddy-v1";
const FILES = [
  "robot_face_roboeyes.html",
  "manifest.json"
];

// Installazione: mette in cache i file essenziali
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

// Attivazione: rimuove cache vecchie
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: prima la cache, poi la rete
self.addEventListener("fetch", e => {
  // Le richieste esterne (CDN MediaPipe, Groq API) vanno sempre in rete
  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
