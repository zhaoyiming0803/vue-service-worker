/**
 * service worker
 * @author zhaoyiming
 * @since  2019/07/21
 */
;(function () {

  const cacheVersion = '201907212112';
  const cacheName = 'vue-sw-cache' + cacheVersion;
  const preCacheUrls = [];

  function clearCache () {
    return caches.keys()
      .then(keys => {
        keys.forEach(key => {
          if (key !== cacheName) caches.delete(key);
        });
      });
  }

  self.addEventListener('install', function (event) {
    event.waitUntil(
      caches
        .open(cacheName)
        .then(cache => cache.addAll(preCacheUrls))
        .then(() => self.skipWaiting())
    );
    
  });

  self.addEventListener('activate', function (event) {
    event.waitUntil(Promise.all([
      self.clients.claim(),
      clearCache()
    ]));
  });

  self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    if (url.origin !== self.origin) {
      return;
    }
    event.respondWith(async function () {
      const cache = await caches.open(cacheName);
      if (event.request.url.match('/api/')) {
        return fetchAndCache(event, cache);
      }
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) return cachedResponse;
      return fetchAndCache(event, cache);
    }());
  });

  async function fetchAndCache (event, cache) {
    const networkResponse = await fetch(event.request);
    event.waitUntil(
      cache.put(event.request, networkResponse.clone())
    );
    return networkResponse;
  }

})();