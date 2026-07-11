"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, Sun, Moon, Bell, Download, Menu, X, ArrowRight, Filter } from "lucide-react";
import LearnHubDropdown from "./LearnHubDropdown";
import { siteConfig } from "@/config/site";
import ReadingProgressBar from "@/features/articles/ReadingProgressBar";

interface HeaderProps {
  activeCategories?: string[];
}

export default function Header({ activeCategories = [] }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // 1. Theme initialization
    const storedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (storedTheme === "dark" || (!storedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }

    // 2. Scroll detection
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // 3. PWA Installation Listener
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstallable(false);
    }

    // 5. FCM Subscription Status check
    const subStatus = localStorage.getItem("fcm_subscribed") === "true";
    setIsSubscribed(subStatus);

    const handleSubscriptionChange = () => {
      setIsSubscribed(localStorage.getItem("fcm_subscribed") === "true");
    };

    window.addEventListener("storage", handleSubscriptionChange);
    window.addEventListener("fcm-subscription-changed", handleSubscriptionChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("storage", handleSubscriptionChange);
      window.removeEventListener("fcm-subscription-changed", handleSubscriptionChange);
    };
  }, []);

  // Lock body scroll when mobile navigation menu is active
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsInstallable(false);
      setDeferredPrompt(null);
    }
  };

  const triggerNotificationOptIn = () => {
    // Custom event dispatch to open FCM consent modal in features/notifications/FCMHandler
    const event = new CustomEvent("trigger-fcm-optin");
    window.dispatchEvent(event);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled
          ? "bg-background border-b border-border shadow-md backdrop-blur-sm"
          : "bg-background border-b border-border/50"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left Section: Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center group">
              <img
                src="/logo-light.webp"
                alt="Kampus Filter"
                className="h-9 md:h-10 w-auto object-contain dark:hidden transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <img
                src="/logo-dark.png"
                alt="Kampus Filter"
                className="h-9 md:h-10 w-auto object-contain hidden dark:block transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/about" ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                About
              </Link>
              <Link
                href="/education-news"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/education-news" ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                News
              </Link>
              <Link
                href="/scholarships"
                className={`text-sm font-medium transition-colors hover:text-primary ${pathname === "/scholarships" ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                Scholarships
              </Link>
              <LearnHubDropdown activeCategories={activeCategories} />
              <button
                onClick={() => window.dispatchEvent(new Event("trigger-pwa-hub"))}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors py-2 px-1 focus:outline-none flex items-center gap-1 cursor-pointer"
                suppressHydrationWarning
              >
                <Download className="h-3.5 w-3.5" />
                App & Alerts
              </button>
            </nav>
          </div>

          {/* Right Section: Toggles & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Toggle Search"
              suppressHydrationWarning
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Toggle Dark Mode"
              suppressHydrationWarning
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={triggerNotificationOptIn}
              className={`p-2 rounded-lg transition-colors relative ${isSubscribed
                ? "text-primary hover:bg-accent"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              aria-label="Manage Notifications"
              suppressHydrationWarning
            >
              <Bell className={`h-5 w-5 ${isSubscribed ? "animate-[swing_1s_ease-in-out_infinite]" : ""}`} />
              {isSubscribed && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-ping" />
              )}
              {isSubscribed && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
              )}
            </button>

            {/* PWA Install Button */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="hidden lg:flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
                suppressHydrationWarning
              >
                <Download className="h-3.5 w-3.5" />
                Install App
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg md:hidden text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              aria-label="Toggle Menu"
              suppressHydrationWarning
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Floating Slide-down Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 w-full bg-background border-b border-border shadow-md z-30 animate-fade-in-up overflow-hidden">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                autoFocus
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="shrink-0 bg-primary text-primary-foreground text-sm font-semibold px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                suppressHydrationWarning
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="shrink-0 p-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
                suppressHydrationWarning
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
        {pathname.startsWith("/articles/") && <ReadingProgressBar />}
      </header>

      {/* Mobile Sidebar Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-50 bg-background md:hidden animate-fade-in border-t border-border overflow-y-auto">
          <div className="flex flex-col p-6 gap-6">
            <Link
              href="/"
              className={`text-lg font-semibold border-b border-border pb-2 ${pathname === "/" ? "text-primary" : "text-foreground"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-lg font-semibold border-b border-border pb-2 ${pathname === "/about" ? "text-primary" : "text-foreground"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/education-news"
              className={`text-lg font-semibold border-b border-border pb-2 ${pathname === "/education-news" ? "text-primary" : "text-foreground"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              News
            </Link>
            <Link
              href="/scholarships"
              className={`text-lg font-semibold border-b border-border pb-2 ${pathname === "/scholarships" ? "text-primary" : "text-foreground"
                }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Scholarships
            </Link>

            {/* LearnHub Mobile List */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Kampus Categories</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {siteConfig.learnHubCategories
                  .filter((cat) => activeCategories.includes(cat.dbCategory))
                  .map((category) => (
                    <Link
                      key={category.name}
                      href={category.path}
                      className="text-sm font-medium p-2 rounded-md hover:bg-secondary text-foreground flex items-center gap-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <ArrowRight className="h-3 w-3 text-primary" />
                      {category.name}
                    </Link>
                  ))}
              </div>
            </div>

            {/* Mobile PWA Install & Alerts */}
            <button
              onClick={() => {
                window.dispatchEvent(new Event("trigger-pwa-hub"));
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/90 transition-colors mt-auto shadow-md"
              suppressHydrationWarning
            >
              <Download className="h-5 w-5" />
              App & Alerts Hub
            </button>
          </div>
        </div>
      )}
    </>
  );
}
