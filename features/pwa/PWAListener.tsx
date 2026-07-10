"use client";

import React, { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

export default function PWAListener() {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // 1. Register Service Worker in production
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      // In Next.js, wait for full load before registering to avoid blocking primary loads
      const registerSW = () => {
        // Register main PWA service worker
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("Main service worker registered successfully:", reg.scope);
          })
          .catch((err) => {
            console.warn("Main service worker registration failed:", err);
          });
      };

      if (document.readyState === "complete") {
        registerSW();
      } else {
        window.addEventListener("load", registerSW);
      }
    }

    // 2. Listen to browser PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Don't show if user dismissed it in this browser session
      const dismissed = sessionStorage.getItem("pwa_dismissed") === "true";
      if (!dismissed) {
        setShowBanner(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("pwa_dismissed", "true");
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-sm glass border border-border p-4 rounded-xl shadow-2xl flex flex-col gap-3 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-extrabold text-sm shadow-sm flex-shrink-0">
            KF
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-foreground">Install Kampus Filter</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
              Access student briefings offline and get push alerts directly on your device.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss Banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleDismiss}
          className="flex-1 bg-secondary text-foreground text-xs font-semibold py-2 rounded-lg hover:bg-secondary/80 transition-colors border border-border"
        >
          Not Now
        </button>
        <button
          onClick={handleInstall}
          className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Install
        </button>
      </div>
    </div>
  );
}
