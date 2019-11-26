/**
 * create service worker file, and update cache automatically
 * @author zhaoyiming
 * @since  2019/11/26
 */
const fs = require('fs');
const path = require('path');

module.exports = function createSwFile (timestamp) {
  const serviceWorkerFileStr = `
    const cacheVersion = "${timestamp}";
    const cacheName = 'sw-cache' + cacheVersion;
    const preCacheUrls = [];

    function clearCache() {
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
        clearCache(),
        self.clients.claim()
      ]));
    });

    self.addEventListener('fetch', (event) => {
      const url = new URL(event.request.url);
      
      if (url.protocol === 'http:') {
        return;
      }
      
      if (event.request.method.toUpperCase() === 'POST') {
        return;
      }
      
      event.respondWith(async function () {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
        if (event.request.url.match('/apiapp/')) {
          return fetchAndCache(event, cache);
        }
        return fetchAndCache(event, cache);
      }());
    });

    async function fetchAndCache(event, cache) {
      const networkResponse = await fetch(event.request);
      if (networkResponse.status === 200) {
        event.waitUntil(
          cache.put(event.request, networkResponse.clone())
        );
      }
      return networkResponse;
    }`;
  
  fs.writeFileSync(path.resolve(__dirname, '../src/sw.js'), serviceWorkerFileStr);
}