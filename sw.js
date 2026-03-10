const CACHE_NAME = "qurani-v445";

const PRECACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./audio-processor.js",
  "./follow-worker.js",
  "./vocab.json",
  "./quran.json",
  "./quran-fr.json",
  "./quran-en.json",
  "./quran-phonetic.json",
  "./manifest.json",
  "./fonts/Amiri-Regular.ttf",
  "./fonts/Amiri-Bold.ttf",
  "./fonts/AmiriQuran.ttf",
  "./fonts/ArefRuqaa-Regular.ttf",
  "./fonts/ScheherazadeNew-Regular.ttf",
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
  const url = new URL(e.request.url);

  // API routes — always network, never cache (critical for large model download)
  if (url.pathname.startsWith("/api/")) {
    return; // let browser handle directly, no SW interception
  }

  // External CDN resources (ONNX Runtime, WASM) — always network, never cache
  if (url.hostname.includes("cdn.jsdelivr.net") ||
      url.hostname.includes("onnxruntime")) {
    return; // let browser handle directly
  }

  // Firebase & Google auth: always network, never cache
  if (url.hostname.includes("firebase") ||
      url.hostname.includes("googleapis") ||
      url.hostname.includes("gstatic") ||
      url.hostname.includes("firestore")) {
    e.respondWith(fetch(e.request));
    return;
  }

  // Network-first pour les fichiers critiques (index.html, app.js, style.css, sw.js)
  // → l'app iOS reçoit toujours la dernière version dès que le réseau est disponible
  const isCritical = url.pathname === "/" ||
    url.pathname.endsWith("index.html") ||
    url.pathname.endsWith("app.js") ||
    url.pathname.endsWith("style.css");
  if (isCritical) {
    e.respondWith(
      fetch(e.request).then((res) => {
        if (res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((c) => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match(e.request).then((cached) => {
        return cached || caches.match("./index.html");
      }))
    );
    return;
  }

  // Cache-first pour les assets lourds (fonts, images, JSON)
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
        .catch(() => new Response("Offline", { status: 503 }));
    })
  );
});
