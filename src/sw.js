toolbox = require('sw-toolbox');
localForage = require('localForage');

let shellCacheKey = 'copy2me-aot-shell-cache-v1';

const historyDB = localForage.createInstance({
  name: 'copy2me_history'
});
const historyIntialDB = localForage.createInstance({
  name: 'copy2me_history_initial'
});
const messageDB = localForage.createInstance({
  name: 'copy2me_messsages'
});

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
        .then(m => console.log('[SW] Received Message: ' + m));
    });
  });
}

function sendMessage(client, msg) {
  return new Promise((resolve, reject) => {
    let channel = new MessageChannel();

    channel.port1.onmessage = event => {
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

/*
 * background sync, send request over REST API to firebase
 */

self.addEventListener('sync', e => {
  console.log('[ServiceWorker] Sync: ' + e);

  e.waitUntil(
    messageDB.iterate((value, key, iterationNumber) => {
      pushToFirebase(value.user.uid, value.user.token, value.timestamp, value.text, value.user.push.auth);

    }).catch(err => {
      console.log('[ServiceWorker] Sync: ' + err);

    })
  );
});

/*
 * push information (uid, token, timestamp, text) to firebase over REST API
 */

function pushToFirebase(uid, token, timestamp, text, pushAuth) {
  console.log(pushAuth.length);

  return fetch('https://clipme-32a80.firebaseio.com/links/' + uid + '/history.json?auth=' + token, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json; charset=UTF-8'
    }),
    body: JSON.stringify({
      'notification-sent': (pushAuth.length > 0 ? true : false),
      'push-auth': pushAuth,
      'text': text,
      'timestamp': (timestamp * -1)
    }),
    mode: 'cors'

  }).then(result => {
    messageDB.removeItem(timestamp.toString()).catch(err => {
      console.log('Could not remove item: ' + err);
    });

  }).catch(err => {
    historyDB.removeItem(timestamp.toString());
    historyIntialDB.removeItem(timestamp.toString());
    console.log(err);

  });
}
