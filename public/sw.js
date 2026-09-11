// ARC Learn service worker — offline shell for lessons and handouts.
// Video is allowed to require a connection; everything else should not.
const CACHE_NAME = "arc-learn-v2";
const APP_SHELL = [
  "/",
  "/modules",
  "/modules/this-years-challenge",
  "/modules/this-years-challenge/lesson",
  "/modules/this-years-challenge/quiz",
  "/offline",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("arc-learn-") && key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (
    url.pathname.startsWith("/auth") ||
    url.pathname.startsWith("/account") ||
    request.headers.has("RSC")
  )
    return;

  // Navigations: network-first, cache fallback, offline page as last resort.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          if (response.ok)
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(
          async () =>
            (await caches.match(request)) || (await caches.match("/offline")),
        ),
    );
    return;
  }

  if (
    !url.pathname.startsWith("/_next/static/") &&
    !url.pathname.startsWith("/images/") &&
    !url.pathname.startsWith("/icons/")
  )
    return;

  // Static assets and images: cache-first, network fallback, cache the result.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => cached);
    }),
  );
});
