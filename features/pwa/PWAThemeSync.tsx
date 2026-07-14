"use client";

import { useEffect } from "react";

export default function PWAThemeSync() {
  useEffect(() => {
    const updateManifest = () => {
      if (typeof window === "undefined") return;

      const isDark =
        document.documentElement.classList.contains("dark") ||
        document.documentElement.getAttribute("data-theme") === "dark" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      const theme = isDark ? "dark" : "light";
      const link = document.querySelector('link[rel="manifest"]');

      if (link) {
        link.setAttribute("href", `/manifest.webmanifest?theme=${theme}`);
      }
    };

    // 1. Initial sync on page mount
    updateManifest();

    // 2. Watch for theme class changes on the HTML element
    const observer = new MutationObserver(updateManifest);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
