// service-worker.js
const CACHE_NAME = "dsrt-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sitemap.xml",
  "./robot.txt",
  "./assets/images/favicon.png",
  "./assets/images/og-preview.png",
  "./demo/ui-demo.html",
  "./demo/lab-demo.html",
  "./demo/particles-demo.html",
  "./demo/flow-demo.html",
  "./docs/index.html",
  "./docs/api/index.html",
];

// Install event — cache all essential files
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  console.log("DSRT service worker installed");
});

// Activate event — cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      );
    })
  );
  console.log("DSRT service worker activated");
});

// Fetch event — serve cached assets
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
