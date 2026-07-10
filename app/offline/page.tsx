import React from "react";
import Link from "next/link";
import { WifiOff, Home, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Offline - Kampus Filter",
  description: "You are currently offline. Please check your internet connection.",
};

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto">
      <div className="h-16 w-16 bg-red-100 dark:bg-red-950/30 rounded-2xl flex items-center justify-center text-red-500 mb-6 animate-pulse">
        <WifiOff className="h-8 w-8" />
      </div>
      
      <h1 className="font-heading text-3xl font-bold text-foreground tracking-tight mb-2">
        Connection Lost
      </h1>
      
      <p className="text-muted-foreground text-sm leading-relaxed mb-8">
        It seems you are currently offline. Pages you have previously visited can still be loaded from your local browser cache, but new articles require an internet connection.
      </p>

      <div className="w-full bg-secondary/35 rounded-xl border border-border p-4 mb-8 text-left">
        <div className="flex gap-2.5 items-start">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-foreground uppercase tracking-wide">Offline Tips</h4>
            <ul className="text-xs text-muted-foreground list-disc pl-4 mt-1.5 space-y-1">
              <li>Check your Wi-Fi or cellular network settings.</li>
              <li>Try reloading previously opened articles from your history.</li>
              <li>We will automatically sync push notifications once you are back online.</li>
            </ul>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/95 transition-colors shadow-md"
      >
        <Home className="h-4 w-4" />
        Return Home
      </Link>
    </div>
  );
}
