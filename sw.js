const CACHE_NAME = "qurani-v152";

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
  "./fonts/ArefRuqaa-Regular.ttf",
  "./fonts/SpaceMono-Regular.ttf",
  "./fonts/SpaceMono-Bold.ttf",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./img/prayer/1.jpg", "./img/prayer/2.jpg", "./img/prayer/3.jpg", "./img/prayer/4.jpg",
  "./img/prayer/5.jpg", "./img/prayer/6.jpg", "./img/prayer/7.jpg", "./img/prayer/8.jpg",
  "./img/prayer/9.jpg", "./img/prayer/10.jpg", "./img/prayer/11.jpg", "./img/prayer/12.jpg",
  "./img/prayer/13.jpg", "./img/prayer/14.jpg", "./img/prayer/15.jpg", "./img/prayer/16.jpg",
  "./img/prayer/17.jpg", "./img/prayer/18.jpg", "./img/prayer/19.jpg", "./img/prayer/20.png",
  "./img/prayer/21.jpg", "./img/prayer/22.jpg", "./img/prayer/23.jpg", "./img/prayer/24.jpg",
  "./img/prayer/25.jpg", "./img/prayer/26.jpg", "./img/prayer/27.jpg", "./img/prayer/28.jpg",
  "./img/prayer/29.jpg", "./img/prayer/30.jpg", "./img/prayer/31.jpg", "./img/prayer/32.jpg",
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
      .then((keys) => {
        const oldKeys = keys.filter((k) => k !== CACHE_NAME);
        const hadOldCache = oldKeys.length > 0;
        return Promise.all(oldKeys.map((k) => caches.delete(k))).then(
          () => hadOldCache
        );
      })
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
