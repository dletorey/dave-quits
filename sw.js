const version = 'v0-01';
const staticCacheName = 'staticfiles-' + version;

addEventListener('install', installEvent => {
    installEvent.waitUntil(
        caches.open(staticCacheName)
        .then( staticCache => {
            return staticCache.addAll([
                'https://quit.letorey.co.uk'
            ]); // end return addAll
        }) // end open then
        .then(() => self.skipWaiting())
    ); // end waitUntil
}); // end addEventListener

// make sure the SW in use is always the most fresh
self.addEventListener('activate', activateEvent => {
    activateEvent.waitUntil(
        caches.keys()
            .then(keys => {
                return Promise.all(keys
                    .filter(key => {
                        return key.indexOf(version) === -1;
                    })
                    .map(key => {
                        return caches.delete(key);
                    })
                );
            })
    );
});

// when browser requests a file check to see if it's in the cache
addEventListener('fetch', fetchEvent => {
    const request = fetchEvent.request;
    fetchEvent.respondWith(
        // first look in the cache
        caches.match(request)
        .then ( responseFromCache => {
            if (responseFromCache) {
                return responseFromCache;
            } // end if
            // Otherwise fetch from the network
            return fetch(request);
        }) // end match then
    ); // end respondWith
}); // end addEventListener