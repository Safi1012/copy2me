toolbox = require('sw-toolbox');
localForage = require('localforage');

// const lfMessages = localForage.createInstance({
//   name: 'copy2me_messsage'
// });
// const lfHistory = localForage.createInstance({
//   name: 'copy2me_history'
// });

/*
 * precache all static files
 */

toolbox.options.cache.name = 'copy2me-aot-shell-cache-v1';
toolbox.precache([
  '/',
]);

/*
 * active event
 */

self.addEventListener('activate', event => {
  event.waitUntil(caches
    .keys()
    .then(keys => {
      // remove old cache
      keys.forEach(key => {
        caches.delete(key);
      });
    })
    .then(
      // claim client without waiting for reload
      self.clients.claim()
    )
  );
});

/*
 * push event
 */

self.addEventListener('push', event => {
  console.log('[push] received: ' + event);

  event.waitUntil(
    self.registration.showNotification('Vibration Sample', {
      body: 'Buzz! Buzz!',
      icon: './assets/app-icon/icon-512x512.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'vibration-sample'
    })
  );
});
