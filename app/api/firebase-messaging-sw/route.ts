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

    // Background messaging handler
    messaging.onBackgroundMessage((payload) => {
      console.log('[SW] Background notification payload received:', payload);
      
      const title = payload.data?.title || payload.notification?.title || 'New on Kampus Filter!';
      const options = {
        body: payload.data?.body || payload.notification?.body || 'Read the latest trends now.',
        icon: payload.data?.image || payload.notification?.image || '/icon-192.png',
        image: payload.data?.image || payload.notification?.image || '',
        badge: '/icon-192.png',
        data: {
          click_action: payload.data?.click_action || '/'
        }
      };

      self.registration.showNotification(title, options);
    });

    // Handle click of notification
    self.addEventListener('notificationclick', (event) => {
      event.notification.close();
      const clickActionUrl = event.notification.data?.click_action || '/';

      event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
          // Focus existing window if open
          for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === clickActionUrl && 'focus' in client) {
              return client.focus();
            }
          }
          // If no window is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(clickActionUrl);
          }
        })
      );
    });
  `;

  return new Response(serviceWorkerCode, {
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=60, must-revalidate",
    },
  });
}
