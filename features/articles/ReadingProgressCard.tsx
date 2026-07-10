"use client";

import React, { useState, useEffect } from "react";
import { Clock, CheckCircle } from "lucide-react";

interface ReadingProgressCardProps {
  readingTime: number;
}

export default function ReadingProgressCard({ readingTime }: ReadingProgressCardProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        // Limit progress strictly between 0 and 100
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to handle initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalBlocks = 10;
  const filledCount = Math.min(totalBlocks, Math.max(0, Math.round(scrollProgress / 10)));
  const filledBlocks = "█".repeat(filledCount);
  const emptyBlocks = "░".repeat(totalBlocks - filledCount);
  const roundedProgress = Math.round(scrollProgress);

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <h4 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Completion Progress
        </h4>
        {roundedProgress === 100 ? (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10 animate-pulse">
            <CheckCircle className="h-3 w-3" /> Done
          </span>
        ) : (
          <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/10">
            Reading
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Time and Percentage */}
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center gap-1 text-muted-foreground font-semibold">
            <Clock className="h-3.5 w-3.5 text-primary" />
            {readingTime} min read
          </span>
          <span className="font-mono font-bold text-foreground">
            {roundedProgress}%
          </span>
        </div>

        {/* ASCII Block Progress Bar */}
        <div className="bg-secondary/40 border border-border/30 rounded-xl p-3 flex items-center justify-center font-mono tracking-widest text-base select-none">
          <span className="text-primary font-bold">{filledBlocks}</span>
          <span className="text-muted-foreground/35">{emptyBlocks}</span>
        </div>

        {/* Sleek Graphical Progress Bar */}
        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-indigo-500 transition-all duration-150 ease-out rounded-full"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
