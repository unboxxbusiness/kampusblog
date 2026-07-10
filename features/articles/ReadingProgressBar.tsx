"use client";

import React, { useState, useEffect } from "react";

export default function ReadingProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[3px] z-50 pointer-events-none bg-secondary/20">
      <div
        id="reading-progress"
        className="h-full bg-gradient-to-r from-primary to-indigo-500 rounded-r-full"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
