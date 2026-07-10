"use client";

import React, { useState, useEffect } from "react";
import { Twitter, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react";

interface ShareButtonsProps {
  title: string;
  slug: string;
}

export default function ShareButtons({ title, slug }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(`https://kampusfilter.com/articles/${slug}`);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(`${window.location.origin}/articles/${slug}`);
    }
  }, [slug]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy url to clipboard:", err);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1.5">Share:</span>
      
      {/* Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200"
        aria-label="Share on Twitter"
      >
        <Twitter className="h-4 w-4" />
      </a>

      {/* LinkedIn */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200"
        aria-label="Share on LinkedIn"
      >
        <Linkedin className="h-4 w-4" />
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
        target="_blank"
        rel="noreferrer"
        className="p-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground transition-all duration-200"
        aria-label="Share on Facebook"
      >
        <Facebook className="h-4 w-4" />
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`p-2 rounded-lg flex items-center justify-center transition-all duration-200 ${
          copied 
            ? "bg-emerald-500 text-white" 
            : "bg-secondary hover:bg-primary hover:text-primary-foreground text-muted-foreground"
        }`}
        aria-label="Copy Link to Clipboard"
      >
        {copied ? <Check className="h-4 w-4" /> : <LinkIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}
