import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };

  const serviceWorkerCode = `
    const CACHE_NAME = "kampusfilter-cache-v5";
    const OFFLINE_URL = "/offline";

    const STATIC_ASSETS = [
      OFFLINE_URL,
      "/icon-192.png",
      "/icon-512.png",
      "/icon-maskable.png",
    ];

    // 1. Install Event (Pre-caching base PWA assets)
    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log("[Service Worker] Pre-caching offline fallback");
          return cache.addAll(STATIC_ASSETS);
        })
      );
      self.skipWaiting();
    });

    // 2. Activate Event (Cleanup old caches)
    self.addEventListener("activate", (event) => {
      event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cache) => {
              if (cache !== CACHE_NAME) {
                console.log("[Service Worker] Deleting old cache:", cache);
                return caches.delete(cache);
              }
            })
          );
        })
      );
      self.clients.claim();
    });

    // 3. Fetch Event (Caching strategy with Network/Data saving intelligence)
    self.addEventListener("fetch", (event) => {
      if (event.request.method !== "GET") return;

      const url = new URL(event.request.url);

      // Bypass caching for internal Next.js, API, or Firebase requests
      if (
        url.pathname.startsWith("/_next") ||
        url.pathname.startsWith("/api") ||
        url.pathname.includes("firebase") ||
        url.pathname.includes("fcm")
      ) {
        return;
      }

      // Smart Network & Connection check
      const isDataSavingMode = navigator.connection && (
        navigator.connection.saveData ||
        ['2g', '3g'].includes(navigator.connection.effectiveType)
      );

      if (event.request.mode === "navigate") {
        event.respondWith(
          fetch(event.request)
            .then((response) => {
              if (response && response.status === 200 && !isDataSavingMode) {
                const responseCopy = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseCopy);
                });
              }
              return response;
            })
            .catch(() => {
              return caches.match(event.request).then((cachedResponse) => {
                return cachedResponse || caches.match(OFFLINE_URL);
              });
            })
        );
        return;
      }

      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          const fetchPromise = fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200 && !isDataSavingMode) {
                const responseCopy = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, responseCopy);
                });
              }
              return networkResponse;
            })
            .catch(() => {});

          return fetchPromise;
        })
      );
    });

    // 4. Import Firebase compat SDK libraries
    importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

    // Initialize Firebase inside the Service Worker context
    firebase.initializeApp(${JSON.stringify(firebaseConfig)});

    const messaging = firebase.messaging();

    // 5. Firebase background message handler
    messaging.onBackgroundMessage(function(payload) {
      console.log('[SW] Background message received:', payload);

      const title =
        (payload.data && payload.data.title) ||
        (payload.notification && payload.notification.title) ||
        'New on Kampus Filter!';

      const body =
        (payload.data && payload.data.body) ||
        (payload.notification && payload.notification.body) ||
        'Read the latest trends now.';

      const image =
        (payload.data && payload.data.image) ||
        (payload.notification && payload.notification.image) ||
        '';

      const clickAction =
        (payload.data && payload.data.click_action) ||
        '/';

      const options = {
        body: body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        image: image || undefined,
        tag: 'kampusfilter-notification',
        renotify: true,
        data: {
          click_action: clickAction,
          url: clickAction
        }
      };

      return self.registration.showNotification(title, options);
    });

    // 6. Notification click handler
    self.addEventListener('notificationclick', function(event) {
      event.notification.close();

      const clickUrl =
        (event.notification.data && (event.notification.data.click_action || event.notification.data.url)) ||
        '/';

      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            var clientUrl = new URL(client.url);
            var targetUrl = new URL(clickUrl, self.location.origin);
            if (clientUrl.href === targetUrl.href && 'focus' in client) {
              return client.focus();
            }
          }
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if ('navigate' in client && 'focus' in client) {
              return client.focus().then(function() {
                return client.navigate(clickUrl);
              });
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(clickUrl);
          }
        })
      );
    });
  `;

  return new Response(serviceWorkerCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
