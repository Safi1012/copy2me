toolbox = require('sw-toolbox');

let shellCacheKey = 'copy2me-aot-shell-cache-v2';

/*
 * precache all static files
 */

toolbox.options.cache.name = shellCacheKey;
toolbox.precache([
  '/',
  'index.html',
  '/assets/icons/icons.svg',
  '/assets/favicon/favicon.ico',
  'manifest.json'
].concat((self.serviceWorkerOption ? self.serviceWorkerOption.assets : [])));

/*
 * active event
 */

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => keys.filter(key => !key.startsWith(shellCacheKey)))
    .then(keys => keys.forEach((key) => caches.delete(key)))
    .then(self.clients.claim())
    .then(sendMessageToAllClients('sw_initial'))
  );
});

/*
 * install event
 */

self.addEventListener('install', event => {
  // replace old sw without browser restart
  event.waitUntil(self.skipWaiting());
});

/*
 * fetch: app-shell
 */

toolbox.router.get(/^(?!.*sockjs-node|.*apis.google|.*webpack-dev-server).*$/, (request, values, options) => {
  console.log('[SW] fetch: ' + request.url);
  return toolbox.cacheFirst(request, values, options);
}, {
  cache: {
    name: shellCacheKey
  }
});

/*
 * communicate with client (host)
 */

function sendMessageToAllClients(msg) {
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      sendMessage(client, msg)
        .then(m => console.log('SW Received Message: ' + m));
    });
  });
}

function sendMessage(client, msg) {
  return new Promise(function(resolve, reject) {
    let channel = new MessageChannel();

    channel.port1.onmessage = function(event) {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };
    client.postMessage(msg, [channel.port2]);
  });
}

/*
 * push event
 */

self.addEventListener('push', event => {
  console.log('[push] received: ' + event);

  event.waitUntil(
    self.registration.showNotification('Copy2me', {
      body: 'A new link is available!',
      icon: './assets/app-icon/icon-512x512.png',
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      tag: 'vibration-sample'
    })
  );
});
