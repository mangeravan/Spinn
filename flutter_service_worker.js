'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/asset/fsts.jpg": "2b619642b651709ef67e576f934d89db",
"assets/asset/logof.png": "a6db8f6dc583cb0e0e7e6dac92c20a0e",
"assets/asset/snds.jpg": "b4a35f37ef78a41e808ceeb21ba4e938",
"assets/asset/thrds.jpg": "e2cce8ff2e5a94216b2089850b7bd486",
"assets/AssetManifest.bin": "463a33ec17b68b0d0bb267e646e40274",
"assets/AssetManifest.bin.json": "330e8dd4ae27acf5e583fdd494d1c83e",
"assets/AssetManifest.json": "795b0fc8cb26805e4925b161e611bf50",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "5862dc2677c6bb3e0cbf9ed3cfed9d19",
"assets/NOTICES": "9166c2658d9a252729b7ddf9bd0caf9d",
"assets/packages/checkout_screen_ui/assets/images/apple-32.png": "9093edf287db8600bc186e9607916a04",
"assets/packages/checkout_screen_ui/assets/images/card_amex.png": "650359dc6d2af46ed20ccfcdac4719a6",
"assets/packages/checkout_screen_ui/assets/images/card_diners.png": "bfe3fd25d256a0601bd4017ffe9a6f84",
"assets/packages/checkout_screen_ui/assets/images/card_discover.png": "cc6e7458dcfe4f92b84610962c14f81d",
"assets/packages/checkout_screen_ui/assets/images/card_jcb.png": "87c7684e033657125bc99e305077c318",
"assets/packages/checkout_screen_ui/assets/images/card_mastercard.png": "b82d1e23200eb0108333da2d3667e4ef",
"assets/packages/checkout_screen_ui/assets/images/card_union_pay.png": "c986b0160e7b00a20e490a24c56f3ba0",
"assets/packages/checkout_screen_ui/assets/images/card_visa.png": "85d57bb0a82e92e6f4c17a1cd3a84d0a",
"assets/packages/checkout_screen_ui/assets/images/cvv_back.png": "474f6db18bbadfb28bfd98a4e79fc713",
"assets/packages/checkout_screen_ui/assets/images/cvv_front.png": "9169b9b152e3dae3e736f49e56746483",
"assets/packages/checkout_screen_ui/assets/images/google_pay_button.png": "0021c490ab2bed2313ff7da23dbdcacb",
"assets/packages/checkout_screen_ui/assets/images/G_mark_small.png": "3853bea160f56119432927417c4ed5b2",
"assets/packages/checkout_screen_ui/assets/images/pay_option_cash.png": "32d5c80cdfdd328d831cfad26942a9b6",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "26eef3024dbc64886b7f48e1b6fb05cf",
"canvaskit/canvaskit.js.symbols": "efc2cd87d1ff6c586b7d4c7083063a40",
"canvaskit/canvaskit.wasm": "e7602c687313cfac5f495c5eac2fb324",
"canvaskit/chromium/canvaskit.js": "b7ba6d908089f706772b2007c37e6da4",
"canvaskit/chromium/canvaskit.js.symbols": "e115ddcfad5f5b98a90e389433606502",
"canvaskit/chromium/canvaskit.wasm": "ea5ab288728f7200f398f60089048b48",
"canvaskit/skwasm.js": "ac0f73826b925320a1e9b0d3fd7da61c",
"canvaskit/skwasm.js.symbols": "96263e00e3c9bd9cd878ead867c04f3c",
"canvaskit/skwasm.wasm": "828c26a0b1cc8eb1adacbdd0c5e8bcfa",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c",
"favicon.png": "540c7c8d537c505e3d8cf2373d7d881a",
"flutter.js": "4b2350e14c6650ba82871f60906437ea",
"flutter_bootstrap.js": "ec82556dd357bcec10e45b246434658f",
"icons/Icon-192.png": "690653fc15f070f2ea456ce8c4fd7622",
"icons/Icon-512.png": "690653fc15f070f2ea456ce8c4fd7622",
"icons/Icon-maskable-192.png": "690653fc15f070f2ea456ce8c4fd7622",
"icons/Icon-maskable-512.png": "690653fc15f070f2ea456ce8c4fd7622",
"icons/SpinnerMaster.apk": "584f6301a2b384bc843462d52abfcafa",
"index.html": "0b56fd752e40ea3cffcd008ccbc7ef93",
"/": "0b56fd752e40ea3cffcd008ccbc7ef93",
"main.dart.js": "b59313985c3cfb57fc32ee17cd36d6f3",
"manifest.json": "b1e748152f42d0139bf06d332b8c1cea",
"version.json": "c8097c8a4d749515a26cce028e82fec3"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
