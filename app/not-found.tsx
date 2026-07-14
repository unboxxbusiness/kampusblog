import React from "react";
import Link from "next/link";
import { Home, Search, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 py-12 animate-fade-in-up">
      {/* 404 Visual badge with glowing background aura */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
        <h1 className="relative font-heading text-8xl sm:text-9xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-primary select-none">
          404
        </h1>
      </div>

      {/* Message Details */}
      <h2 className="font-heading text-xl sm:text-2xl font-extrabold text-foreground tracking-tight max-w-md">
        Lost in Space? Page Not Found
      </h2>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mt-3 leading-relaxed">
        We searched our entire network but couldn't find the page you're looking for. It may have been moved, renamed, or deleted.
      </p>

      {/* Interactive Action CTAs */}
      <div className="flex flex-col sm:flex-row gap-3.5 mt-8 w-full max-w-xs sm:max-w-md justify-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/95 transition-colors shadow-md text-xs sm:text-sm cursor-pointer"
        >
          <Home className="h-4 w-4" />
          <span>Back to Homepage</span>
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center justify-center gap-2 bg-secondary border border-border text-foreground font-semibold px-5 py-2.5 rounded-xl hover:bg-muted transition-colors text-xs sm:text-sm cursor-pointer"
        >
          <Search className="h-4 w-4" />
          <span>Search Articles</span>
        </Link>
      </div>

      {/* Bottom Hint */}
      <div className="mt-12 text-[10px] text-muted-foreground flex items-center gap-1.5 opacity-60">
        <HelpCircle className="h-3.5 w-3.5" />
        <span>Need help? Return home or check our dynamic sitemap options.</span>
      </div>
    </div>
  );
}
