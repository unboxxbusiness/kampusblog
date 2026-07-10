"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitContactAction } from "@/actions/contact-action";
import { siteConfig } from "@/config/site";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !message) {
      setStatus("error");
      setErrorMessage("All fields are required.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await submitContactAction({
        name,
        email,
        phone,
        message,
      });

      if (response.success) {
        setStatus("success");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        
        // Confetti!
        import("canvas-confetti").then((module) => {
          module.default({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        });
      } else {
        setStatus("error");
        setErrorMessage(response.error || "Failed to submit form. Check your inputs.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-6">
      <header className="text-center space-y-3 max-w-xl mx-auto">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
          Get In Touch
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          Contact Kampus Filter Support
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Have questions about university admissions, scholarships, internships, or student opportunities? Drop us a message and our team will get back to you.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact info column */}
        <div className="md:col-span-4 bg-card border border-border p-6 rounded-2xl space-y-6">
          <h3 className="font-heading font-bold text-base text-foreground">
            Contact Channels
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Please use the most relevant channel below to reach the appropriate team directly.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 bg-secondary text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">General Support & Inquiries</h4>
                <a href="mailto:support@kampusfilter.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  support@kampusfilter.com
                </a>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 bg-secondary text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Editorial & Corrections</h4>
                <a href="mailto:editorial@kampusfilter.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  editorial@kampusfilter.com
                </a>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 bg-secondary text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Privacy & Copyright (DMCA)</h4>
                <a href="mailto:privacy@kampusfilter.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  privacy@kampusfilter.com
                </a>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="h-9 w-9 bg-secondary text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Business & Partnerships</h4>
                <a href="mailto:partners@kampusfilter.com" className="text-xs text-muted-foreground hover:text-primary transition-colors">
                  partners@kampusfilter.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact form column */}
        <div className="md:col-span-8 bg-card border border-border p-6 sm:p-8 rounded-2xl">
          {status === "success" ? (
            <div className="text-center py-10 flex flex-col items-center justify-center">
              <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-950/20 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-10 w-10 animate-bounce" />
              </div>
              <h3 className="font-heading text-lg font-bold text-foreground mb-1">
                Message Sent Successfully!
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed mb-6">
                Thank you for contacting us, {name || "there"}. We have registered your inquiry details and our support team will get back to you shortly.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="bg-secondary text-foreground text-xs font-semibold px-4 py-2 rounded-xl hover:bg-secondary/80 transition-colors border border-border"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                    disabled={status === "loading"}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-foreground uppercase tracking-wide">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                    disabled={status === "loading"}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Mobile Number (with country code)
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary focus:outline-none"
                  disabled={status === "loading"}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-bold text-foreground uppercase tracking-wide">
                  Your Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us how we can help you with admissions, scholarships, or internship queries..."
                  rows={5}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  disabled={status === "loading"}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:bg-primary/95 transition-colors shadow-md text-sm disabled:opacity-75"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-4.5 w-4.5" />
                )}
                Submit Contact Inquiry
              </button>

              {status === "error" && (
                <div className="text-xs text-destructive font-semibold mt-2">
                  ⚠️ {errorMessage}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
