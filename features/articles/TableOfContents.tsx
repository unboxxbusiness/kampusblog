"use client";

import React, { useState, useEffect } from "react";
import { AlignLeft } from "lucide-react";

interface TocHeading {
  id: string;
  text: string;
}

interface TableOfContentsProps {
  htmlContent: string;
}

export default function TableOfContents({ htmlContent }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocHeading[]>([]);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    // 1. Extract headings
    const h2Regex = /<h2([^>]*)>([\s\S]*?)<\/h2>/g;
    const extracted: TocHeading[] = [];
    let match;
    
    while ((match = h2Regex.exec(htmlContent)) !== null) {
      const attrs = match[1] || "";
      const text = match[2]?.replace(/<[^>]*>/g, "").trim() || "";
      
      // Determine ID (either existing or generated)
      const idMatch = attrs.match(/id=["']([^"']+)["']/);
      const id = idMatch 
        ? idMatch[1] 
        : text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      if (id && text) {
        extracted.push({ id, text });
      }
    }
    setHeadings(extracted);

    // 2. Intersection Observer to highlight active heading on scroll
    if (extracted.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px 0px -60% 0px", // triggers when heading is in top 40% of viewport
      threshold: 0,
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    extracted.forEach((h) => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [htmlContent]);

  if (headings.length < 2) return null; // Only show TOC if there are 2 or more H2 headings

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // height of sticky header + spacing
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setActiveId(id);
    }
  };

  return (
    <nav className="bg-card border border-border rounded-2xl p-6 max-h-[70vh] overflow-y-auto">
      <div className="flex items-center gap-2 mb-4 border-b border-border pb-3">
        <AlignLeft className="h-4.5 w-4.5 text-primary" />
        <h3 className="font-heading font-bold text-xs text-foreground uppercase tracking-wider">
          Table of Contents
        </h3>
      </div>
      <ul className="space-y-3">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              onClick={(e) => handleLinkClick(e, h.id)}
              className={`text-xs block leading-relaxed hover:text-primary transition-colors border-l-2 pl-3 py-0.5 ${
                activeId === h.id
                  ? "text-primary border-primary font-bold"
                  : "text-muted-foreground border-transparent hover:border-border"
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
