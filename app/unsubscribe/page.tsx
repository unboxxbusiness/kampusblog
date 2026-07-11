"use client";

import React, { useState } from "react";
import { ShieldCheck, ArrowRight, Trash2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { deleteUserDataAction } from "@/actions/delete-action";

export default function UnsubscribePage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const res = await deleteUserDataAction({ email });
      if (res.success) {
        setStatus({
          success: true,
          message: res.deletedCount && res.deletedCount > 0
            ? `Your personal data has been completely erased from our databases. Total records removed: ${res.deletedCount}.`
            : "No active subscription or contact logs were found for this email address.",
        });
        setEmail("");
      } else {
        setStatus({ success: false, message: res.error || "An error occurred." });
      }
    } catch (err) {
      setStatus({ success: false, message: "A server connection error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 space-y-8">
      {/* Header */}
      <header className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          Privacy Portal
        </span>
        <h1 className="font-heading text-3xl font-extrabold text-foreground tracking-tight">
          Unsubscribe & Data Erasure
        </h1>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Request permanent deletion of your email, phone, and subscription profile.
        </p>
      </header>

      {/* Form Card */}
      <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-foreground mb-1.5">
              Your Subscribed Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@example.com"
              required
              className="w-full px-4 py-2 text-sm rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-1.5 bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-sm hover:bg-primary/95 transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-75"
          >
            {isSubmitting ? (
              <span>Erasing data...</span>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete All My Data</span>
              </>
            )}
          </button>
        </form>

        {status && (
          <div
            className={`p-4 rounded-xl text-xs leading-relaxed border ${
              status.success
                ? "bg-green-500/10 border-green-500/25 text-green-700 dark:text-green-400"
                : "bg-destructive/10 border-destructive/25 text-destructive"
            }`}
          >
            {status.message}
          </div>
        )}
      </div>

      {/* FAQ / Info block */}
      <div className="bg-secondary/15 rounded-2xl border border-dashed border-border p-6 space-y-4 text-xs text-muted-foreground">
        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">What happens when I click delete?</h4>
            <p className="leading-relaxed">
              We perform a direct, hard-delete operation on our Firestore databases. Any signed-up newsletter profiles and contact form leads linked to this email address are deleted permanently.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-semibold text-foreground">What about push notifications?</h4>
            <p className="leading-relaxed">
              Device tokens are stored locally on your device. You can unsubscribe immediately from browser notifications by clicking the <strong>PWA & Alerts Hub</strong> button in the navigation header.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Link */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          <span>Back to Home</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
