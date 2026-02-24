const CACHE_NAME = "qurani-v41";

const PRECACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./quran.json",
  "./quran-fr.json",
  "./manifest.json",
  "./fonts/Amiri-Regular.ttf",
  "./fonts/Amiri-Bold.ttf",
  "./fonts/AmiriQuran.ttf",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((res) => {
          if (res.status === 200 && e.request.url.startsWith(self.location.origin)) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => {
          if (e.request.mode === "navigate") return caches.match("./index.html");
          return new Response("Offline", { status: 503 });
        });
    })
  );
});
