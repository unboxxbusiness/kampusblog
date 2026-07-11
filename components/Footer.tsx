"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Twitter, Linkedin, Facebook, Rss, Map, Send, Loader2, Filter } from "lucide-react";
import { siteConfig } from "@/config/site";
import { submitNewsletterAction } from "@/actions/newsletter-action";

interface FooterProps {
  activeCategories?: string[];
}

export default function Footer({ activeCategories = [] }: FooterProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      setStatus("error");
      setErrorMessage("Name and Email are required.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await submitNewsletterAction({
        name,
        email,
        mobileNumber: mobile,
        sourcePage: window.location.pathname,
      });

      if (response.success) {
        setStatus("success");
        setEmail("");
        setName("");
        setMobile("");
        // Trigger client-side confetti animation
        import("canvas-confetti").then((module) => {
          module.default({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.8 },
          });
        });
      } else {
        setStatus("error");
        setErrorMessage(response.error || "Subscription failed. Please check inputs.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <footer className="bg-secondary/40 border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1: Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center group">
              <img 
                src="https://res.cloudinary.com/dhrigocvd/image/upload/v1769401433/logo_Kampus_Filter_gync6j.webp" 
                alt="Kampus Filter" 
                className="h-8 w-auto object-contain dark:hidden transition-transform duration-300 group-hover:scale-[1.02]" 
              />
              <img 
                src="https://res.cloudinary.com/dhrigocvd/image/upload/v1769402686/Logo_voqhtq.png" 
                alt="Kampus Filter" 
                className="h-8 w-auto object-contain hidden dark:block transition-transform duration-300 group-hover:scale-[1.02]" 
              />
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter Link"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors"
                aria-label="LinkedIn Link"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook Link"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <Link
                href="/feed.xml"
                className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary transition-colors"
                aria-label="RSS Feed Link"
              >
                <Rss className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">Categories</h3>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              {siteConfig.learnHubCategories
                .filter((cat) => activeCategories.includes(cat.dbCategory))
                .map((category) => (
                  <li key={category.name}>
                    <Link href={category.path} className="hover:text-primary transition-colors">
                      {category.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          {/* Col 3: Company & Policies */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">Legal & Info</h3>
            <ul className="flex flex-col gap-2 text-xs text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
              </li>
              <li>
                <Link href="/editorial-policy" className="hover:text-primary transition-colors">Editorial Policy</Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-primary transition-colors flex items-center gap-1">
                  <Map className="h-3 w-3" /> Sitemap
                </Link>
              </li>
              <li>
                <Link href="/unsubscribe" className="hover:text-primary transition-colors text-destructive/80 font-medium">Unsubscribe & Erasure</Link>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new Event("trigger-pwa-hub"))}
                  className="hover:text-primary transition-colors text-left focus:outline-none cursor-pointer"
                  suppressHydrationWarning
                >
                  Install App & Alerts
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="font-heading font-semibold text-sm text-foreground uppercase tracking-wider">Stay Updated</h3>
            <p className="text-xs text-muted-foreground">
              Subscribe to get the latest student briefings, scholarship notices, and internship updates.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                disabled={status === "loading"}
                suppressHydrationWarning
              />
              <input
                type="email"
                placeholder="your.email@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                disabled={status === "loading"}
                suppressHydrationWarning
              />
              <input
                type="tel"
                placeholder="Phone (Optional, with country code)"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs focus:ring-1 focus:ring-primary focus:outline-none"
                disabled={status === "loading"}
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-2 rounded-lg hover:bg-primary/95 text-xs transition-colors shadow-sm disabled:opacity-50"
                disabled={status === "loading"}
                suppressHydrationWarning
              >
                {status === "loading" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3 w-3" />
                )}
                Subscribe Newsletter
              </button>
            </form>
            {status === "success" && (
              <div className="text-xs text-emerald-500 font-semibold mt-1">
                🎉 Success! You are now subscribed.
              </div>
            )}
            {status === "error" && (
              <div className="text-xs text-destructive font-semibold mt-1">
                ⚠️ {errorMessage}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <div>
            © {new Date().getFullYear()} {siteConfig.name}. Filter the Noise. Make Better Decisions.
          </div>
        </div>
      </div>
    </footer>
  );
}
