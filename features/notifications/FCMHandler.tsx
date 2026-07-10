"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bell, X, ShieldCheck, Loader2, AlertTriangle } from "lucide-react";
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getToken, onMessage } from "firebase/messaging";
import { firestore, messaging } from "@/lib/firebase";

export default function FCMHandler() {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"default" | "granted" | "denied" | "unsupported">("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  // Prevent the auto-prompt from firing multiple times in a session
  const autoPromptFiredRef = useRef(false);

  useEffect(() => {
    // 1. Listen for header button click trigger
    const handleTriggerOptIn = () => {
      setShowModal(true);
    };
    window.addEventListener("trigger-fcm-optin", handleTriggerOptIn);

    // 2. Initial permission and subscription state check
    const updateSubscriptionStatus = () => {
      if (typeof window !== "undefined" && "Notification" in window) {
        const permission = Notification.permission;
        setStatus(permission as any);
        const localSub = localStorage.getItem("fcm_subscribed") === "true";
        setIsSubscribed(permission === "granted" && localSub);
      } else {
        setStatus("unsupported");
      }
    };
    updateSubscriptionStatus();

    window.addEventListener("storage", updateSubscriptionStatus);
    window.addEventListener("fcm-subscription-changed", updateSubscriptionStatus);

    // 3. Auto-prompt logic with smart engagement checks, iOS browser bypass, and frequency muting
    let timer: NodeJS.Timeout | undefined;
    let cleanupScrollListener: (() => void) | undefined;

    if (typeof window !== "undefined" && "Notification" in window) {
      const dismissedCount = parseInt(localStorage.getItem("fcm_dismissed_count") || "0", 10);
      const lastDismissed = parseInt(localStorage.getItem("fcm_last_dismissed_time") || "0", 10);
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      const isMuted = dismissedCount >= 2 && (Date.now() - lastDismissed < oneMonth);

      const isIOSDevice = /ipad|iphone|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;

      // Do NOT auto-prompt iOS browser users (only prompt inside PWA standalone where push acts natively)
      const shouldBypassPrompt = isIOSDevice && !isStandalone;

      if (
        Notification.permission === "default" &&
        !autoPromptFiredRef.current &&
        !isMuted &&
        !shouldBypassPrompt
      ) {
        const triggerPrompt = () => {
          if (autoPromptFiredRef.current) return;
          autoPromptFiredRef.current = true;
          setShowModal(true);
          if (cleanupScrollListener) cleanupScrollListener();
        };

        const isAlreadyEngaged = localStorage.getItem("fcm_highly_engaged") === "true";

        if (isAlreadyEngaged) {
          timer = setTimeout(triggerPrompt, 4000);
        } else {
          // Detect user scrolling down >40% of the page
          const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (scrollHeight > 0 && (scrollTop / scrollHeight) > 0.4) {
              localStorage.setItem("fcm_highly_engaged", "true");
              triggerPrompt();
            }
          };

          cleanupScrollListener = () => {
            window.removeEventListener("scroll", handleScroll);
          };

          window.addEventListener("scroll", handleScroll);

          // 30 seconds page dwell timer as fallback engagement
          timer = setTimeout(() => {
            localStorage.setItem("fcm_highly_engaged", "true");
            triggerPrompt();
          }, 30000);
        }
      }
    }

    // 4. Foreground notification display handler
    let unsubscribeOnMessage: (() => void) | undefined;
    if (messaging) {
      try {
        unsubscribeOnMessage = onMessage(messaging, (payload) => {
          console.log("Foreground message received:", payload);
          if (Notification.permission === "granted") {
            const notificationTitle =
              payload.data?.title ||
              payload.notification?.title ||
              "New Update from Kampus Filter";
            const notificationOptions = {
              body: payload.data?.body || payload.notification?.body || "",
              icon: payload.data?.image || payload.notification?.image || "/icon-192.png",
              badge: "/icon-192.png",
              data: payload.data,
            };
            new Notification(notificationTitle, notificationOptions);
          }
        });
      } catch (err) {
        console.error("Failed to setup onMessage handler:", err);
      }
    }

    return () => {
      window.removeEventListener("trigger-fcm-optin", handleTriggerOptIn);
      window.removeEventListener("storage", updateSubscriptionStatus);
      window.removeEventListener("fcm-subscription-changed", updateSubscriptionStatus);
      if (timer) clearTimeout(timer);
      if (unsubscribeOnMessage) unsubscribeOnMessage();
    };
  }, []);

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

  const handleSubscribe = async () => {
    if (status === "unsupported" || !messaging) {
      alert("Push notifications are not supported in this browser.");
      setShowModal(false);
      return;
    }

    setLoading(true);

    try {
      // 1. Request browser permission
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        setLoading(false);
        setShowModal(false);
        localStorage.setItem("fcm_prompt_dismissed", "true");
        localStorage.setItem("fcm_subscribed", "false");
        return;
      }

      setStatus("granted");

      // 2. Wait for SW to be fully ready before requesting token
      console.log("[FCM] Waiting for service worker to be ready...");
      const registration = await navigator.serviceWorker.ready;

      // 3. Fetch FCM Token using the main active service worker registration
      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
      console.log("[FCM] Fetching FCM token...");
      const fcmToken = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });

      if (!fcmToken) {
        throw new Error("No FCM token generated. Check VAPID key and SW registration.");
      }

      // 5. Upsert token in Firestore
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

      // 6. Persist subscription state
      localStorage.setItem("fcm_subscribed", "true");
      localStorage.setItem("fcm_prompt_dismissed", "true");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("fcm-subscription-changed"));

      // 7. Celebrate with confetti
      import("canvas-confetti").then((module) => {
        module.default({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      });

      setShowModal(false);
    } catch (err: any) {
      console.error("Failed to subscribe user to FCM:", err);
      alert(
        "Notification setup failed. Please try again or check your browser permissions.\n\n" +
        (err?.message || "")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (status === "unsupported" || !messaging) return;
    setLoading(true);

    try {
      const registration = await navigator.serviceWorker.getRegistration("/firebase-messaging-sw.js");
      if (registration) {
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";
        const fcmToken = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        });

        if (fcmToken) {
          const notificationsRef = collection(firestore, "notifications");
          const q = query(notificationsRef, where("fcm_token", "==", fcmToken));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            const existingDocId = querySnapshot.docs[0].id;
            const docRef = doc(firestore, "notifications", existingDocId);
            await updateDoc(docRef, {
              is_active: false,
              deactivated_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          }
        }
      }

      localStorage.setItem("fcm_subscribed", "false");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("fcm-subscription-changed"));
      setIsSubscribed(false);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to unsubscribe user from FCM:", err);
      localStorage.setItem("fcm_subscribed", "false");
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("fcm-subscription-changed"));
      setShowModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    setShowModal(false);
    // Smart frequency capping: increment dismissed count and record timestamp
    const count = parseInt(localStorage.getItem("fcm_dismissed_count") || "0", 10) + 1;
    localStorage.setItem("fcm_dismissed_count", count.toString());
    localStorage.setItem("fcm_last_dismissed_time", Date.now().toString());
    localStorage.setItem("fcm_prompt_dismissed", "true");
  };

  if (!showModal) return null;

  // Render variables dynamically based on client subscription state
  let modalIcon = <Bell className="h-7 w-7 animate-bounce" />;
  let modalIconBg = "bg-primary/10 text-primary";
  let modalTitle = "Enable Push Notifications";
  let modalDesc =
    "Be the first to get student admission briefings, scholarship deadlines, and internship alerts. No spam, just pure insights.";
  let modalFooter = (
    <div className="flex w-full gap-3">
      <button
        onClick={handleDismiss}
        className="flex-1 bg-secondary text-foreground text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary/80 transition-colors border border-border"
        disabled={loading}
      >
        Not Now
      </button>
      <button
        onClick={handleSubscribe}
        className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2.5 rounded-xl hover:bg-primary/95 transition-colors flex items-center justify-center gap-1.5 shadow-md disabled:opacity-75"
        disabled={loading}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Allow Notifications"}
      </button>
    </div>
  );

  if (status === "unsupported") {
    modalIcon = <AlertTriangle className="h-7 w-7" />;
    modalIconBg = "bg-amber-100 dark:bg-amber-950/20 text-amber-500";
    modalTitle = "Unsupported Browser";
    modalDesc =
      "Push notifications are not supported in this browser environment. Please open this app in Chrome, Firefox, or Safari to enable alerts.";
    modalFooter = (
      <button
        onClick={handleDismiss}
        className="w-full bg-secondary text-foreground text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary/80 transition-colors border border-border"
      >
        Close
      </button>
    );
  } else if (status === "denied") {
    modalIcon = <AlertTriangle className="h-7 w-7 text-destructive" />;
    modalIconBg = "bg-red-100 dark:bg-red-950/20 text-destructive";
    modalTitle = "Notifications Blocked";
    modalDesc =
      "You have previously blocked notifications for this site. To receive alerts, click the site settings/lock icon in your browser address bar and reset permission to 'Allow'.";
    modalFooter = (
      <button
        onClick={handleDismiss}
        className="w-full bg-secondary text-foreground text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary/80 transition-colors border border-border"
      >
        Got it
      </button>
    );
  } else if (isSubscribed) {
    modalIcon = <ShieldCheck className="h-7 w-7 text-emerald-500" />;
    modalIconBg = "bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500";
    modalTitle = "Notifications Active";
    modalDesc =
      "You are successfully subscribed! You will receive real-time notifications for student admissions, scholarship circulars, and internship alerts.";
    modalFooter = (
      <div className="flex w-full gap-3">
        <button
          onClick={handleDismiss}
          className="flex-1 bg-secondary text-foreground text-xs font-semibold py-2.5 rounded-xl hover:bg-secondary/80 transition-colors border border-border"
          disabled={loading}
        >
          Keep Enabled
        </button>
        <button
          onClick={handleUnsubscribe}
          className="flex-1 bg-destructive/10 text-destructive border border-destructive/20 text-xs font-semibold py-2.5 rounded-xl hover:bg-destructive hover:text-white transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-75"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Disable Alerts"}
        </button>
      </div>
    );
  }

  return (
    // FIX: Use bg-black/50 instead of bg-background/60 which was near-transparent on some themes
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-6 relative overflow-hidden">
        {/* Decorative background gradient */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />

        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close Modal"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`h-14 w-14 rounded-2xl ${modalIconBg} flex items-center justify-center mb-4 shadow-inner`}>
            {modalIcon}
          </div>

          <h3 className="font-heading text-xl font-bold tracking-tight text-foreground">
            {modalTitle}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed mt-2 max-w-sm">
            {modalDesc}
          </p>

          <div className="w-full bg-secondary/35 rounded-xl border border-border p-3.5 my-5 text-left flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-foreground">Anonymous & Secure</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                We store only your browser's push token to route alerts. No account registration or email submission is required.
              </p>
            </div>
          </div>

          {modalFooter}
        </div>
      </div>
    </div>
  );
}
