toolbox = require('sw-toolbox/sw-toolbox.js');
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
