"use client";

import React, { useState, useEffect } from "react";
import { Download, Bell, X, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { getToken } from "firebase/messaging";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { firestore, messaging } from "@/lib/firebase";

export default function PWAHubModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loadingNotification, setLoadingNotification] = useState(false);

  useEffect(() => {
    // 1. Listen for global open trigger event
    const handleOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener("trigger-pwa-hub", handleOpen);

    // Check if the prompt was already caught by our early head script
    if (typeof window !== "undefined" && (window as any).deferredPrompt) {
      setDeferredPrompt((window as any).deferredPrompt);
      setIsInstallable(true);
      setIsInstalled(false);
    }

    // 2. Listen for deferred prompt ready event from head script
    const handleDeferredReady = () => {
      if ((window as any).deferredPrompt) {
        setDeferredPrompt((window as any).deferredPrompt);
        setIsInstallable(true);
        setIsInstalled(false);
      }
    };
    window.addEventListener("deferred-prompt-ready", handleDeferredReady);

    // 3. Detect PWA installation capability (fallback)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
      setIsInstalled(false);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // 4. Detect when app is successfully installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // 5. Check initial install state
    const checkInstallStatus = () => {
      const isStandalone = 
        window.matchMedia("(display-mode: standalone)").matches || 
        (navigator as any).standalone === true;
      setIsInstalled(isStandalone);
    };
    checkInstallStatus();

    // 6. Detect FCM notification status
    if (typeof window !== "undefined" && "Notification" in window) {
      setIsSubscribed(Notification.permission === "granted" && localStorage.getItem("fcm_subscribed") === "true");
    }

    return () => {
      window.removeEventListener("trigger-pwa-hub", handleOpen);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("deferred-prompt-ready", handleDeferredReady);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstallable(false);
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else {
      // Check platform to customize the message
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      if (isIOS) {
        alert("To install on iOS:\n1. Tap the Share button in Safari (box with up arrow).\n2. Scroll down and select 'Add to Home Screen'.");
      } else {
        alert("Kampus Filter is already installed on your device! You can open it from your applications menu or search shortcuts.");
      }
    }
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") > -1) return "Firefox";
    if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) return "Opera";
    if (userAgent.indexOf("Chrome") > -1) return "Chrome";
    if (userAgent.indexOf("Safari") > -1) return "Safari";
    return "Unknown Browser";
  };

  const getPlatformName = () => {
    const platform = navigator.platform || "";
    if (platform.toLowerCase().includes("win")) return "Windows";
    if (platform.toLowerCase().includes("mac")) return "macOS";
    if (platform.toLowerCase().includes("linux")) return "Linux";
    if (/android/i.test(navigator.userAgent)) return "Android";
    if (/iphone|ipad|ipod/i.test(navigator.userAgent)) return "iOS";
    return "Unknown Platform";
  };

  const handleEnableNotifications = async () => {
    if (!messaging) {
      alert("Push notifications are not supported in this browser.");
      return;
    }

    setLoadingNotification(true);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission denied. Please reset permissions in your browser address bar.");
        setLoadingNotification(false);
        return;
      }

      // Explicit SW registration to avoid Next.js routing scopes conflicts
      console.log("[FCM Push Setup] Registering service worker...");
      const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", { updateViaCache: "none" });

      // FIX: Wait for the service worker to become fully active/activated
      // This prevents the 'Subscription failed - no active Service Worker' AbortError.
      if (!registration.active) {
        console.log("[FCM Push Setup] Waiting for service worker to activate...");
        await new Promise<void>((resolve) => {
          const serviceWorker = registration.installing || registration.waiting;
          if (serviceWorker) {
            serviceWorker.addEventListener("statechange", (e: any) => {
              if (e.target.state === "activated") {
                console.log("[FCM Push Setup] Service worker activated!");
                resolve();
              }
            });
          } else {
            resolve();
          }
        });
      }

      console.log("[FCM Push Setup] Fetching messaging token...");
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
      const fcmToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!fcmToken) {
        throw new Error("Could not retrieve push token.");
      }

      // Store in Firestore
      const notificationsRef = collection(firestore, "notifications");
      const q = query(notificationsRef, where("fcm_token", "==", fcmToken));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await addDoc(notificationsRef, {
          fcm_token: fcmToken,
          browser: getBrowserName(),
          platform: getPlatformName(),
          language: navigator.language || "en",
          is_active: true,
          created_at: new Date().toISOString(),
        });
      } else {
        const existingDocId = querySnapshot.docs[0].id;
        const docRef = doc(firestore, "notifications", existingDocId);
        await updateDoc(docRef, {
          is_active: true,
          updated_at: new Date().toISOString(),
        });
      }

      localStorage.setItem("fcm_subscribed", "true");
      setIsSubscribed(true);

      // Trigger Confetti!
      import("canvas-confetti").then((module) => {
        module.default({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      });
    } catch (err: any) {
      console.error("FCM setup failed in modal:", err);
      alert(`Could not register notifications: ${err.message || err}`);
    } finally {
      setLoadingNotification(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Top gradient bubble */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close Hub"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="space-y-6">
          <div className="text-center">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md mb-2">
              <Sparkles className="h-3 w-3" />
              Application Options
            </span>
            <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
              Configure App & Alerts
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Get the complete premium experience. Save the platform to your screen and get notified of new articles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Box 1: PWA Install */}
            <div className="bg-secondary/25 border border-border rounded-xl p-5 flex flex-col items-center text-center justify-between min-h-[240px]">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Download className="h-5 w-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-foreground">PWA Desktop App</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 flex-grow">
                Install **Kampus Filter** directly to your home screen for quick, offline-capable access and zero loading lag.
              </p>
              
              {isInstalled ? (
                <div className="w-full bg-muted text-muted-foreground text-xs font-semibold py-2 rounded-lg mt-4 flex items-center justify-center gap-1.5 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Installed / Active
                </div>
              ) : (
                <button
                  onClick={handleInstallApp}
                  className="w-full bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:bg-primary/95 transition-colors shadow-sm mt-4 flex items-center justify-center gap-1"
                >
                  <Download className="h-3.5 w-3.5" />
                  Install App
                </button>
              )}
            </div>

            {/* Box 2: FCM Notifications */}
            <div className="bg-secondary/25 border border-border rounded-xl p-5 flex flex-col items-center text-center justify-between min-h-[220px]">
              <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Bell className="h-5 w-5" />
              </div>
              <h4 className="font-heading text-sm font-bold text-foreground">Push Notifications</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed mt-1 flex-grow">
                Get real-time push alerts on your installed device the exact second we publish a new automation workflow.
              </p>
              {isSubscribed ? (
                <div className="w-full bg-muted text-muted-foreground text-xs font-semibold py-2 rounded-lg mt-4 flex items-center justify-center gap-1.5 border border-border">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Subscribed
                </div>
              ) : (
                <button
                  onClick={handleEnableNotifications}
                  className="w-full bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:bg-primary/95 transition-colors shadow-sm mt-4 flex items-center justify-center gap-1"
                  disabled={loadingNotification}
                >
                  {loadingNotification ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      <Bell className="h-3.5 w-3.5" />
                      Allow Notifications
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
