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
    importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.3.0/firebase-messaging-compat.js');

    // Initialize Firebase in Service Worker
    firebase.initializeApp(${JSON.stringify(firebaseConfig)});

    const messaging = firebase.messaging();

    // Background messaging handler — called when the app is in background/closed
    messaging.onBackgroundMessage(function(payload) {
      console.log('[SW] Background notification payload received:', JSON.stringify(payload));

      // Support both data-only and notification+data payloads
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
        requireInteraction: false,
        data: {
          click_action: clickAction,
          url: clickAction
        }
      };

      return self.registration.showNotification(title, options);
    });

    // Handle notification click — open or focus the relevant page
    self.addEventListener('notificationclick', function(event) {
      event.notification.close();

      const clickUrl =
        (event.notification.data && (event.notification.data.click_action || event.notification.data.url)) ||
        '/';

      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
          // Try to focus an existing window that matches the target URL
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            var clientUrl = new URL(client.url);
            var targetUrl = new URL(clickUrl, self.location.origin);
            if (clientUrl.href === targetUrl.href && 'focus' in client) {
              return client.focus();
            }
          }
          // Try to focus any existing window and navigate it
          for (var i = 0; i < windowClients.length; i++) {
            var client = windowClients[i];
            if ('navigate' in client && 'focus' in client) {
              return client.focus().then(function() {
                return client.navigate(clickUrl);
              });
            }
          }
          // No existing window — open a new one
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
      // Short cache so updated SW deploys quickly
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
