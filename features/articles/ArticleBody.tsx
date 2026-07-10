"use client";

import React, { useEffect } from "react";
import { sanitizeHTML } from "@/utils/sanitizer";
import "@/styles/article.css";

interface ArticleBodyProps {
  htmlContent: string;
}

export default function ArticleBody({ htmlContent }: ArticleBodyProps) {
  const sanitized = sanitizeHTML(htmlContent);

  useEffect(() => {
    // --- Image Lightbox / Click-to-Enlarge ---
    const articleBody = document.querySelector(".article-body");
    if (!articleBody) return;

    let lightbox: HTMLDivElement | null = null;

    const openLightbox = (src: string, alt: string) => {
      // Prevent duplicate lightboxes
      if (lightbox) return;

      lightbox = document.createElement("div");
      lightbox.className = "article-image-lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", `Image: ${alt}`);

      const closeBtn = document.createElement("button");
      closeBtn.className = "article-image-lightbox-close";
      closeBtn.innerHTML = "&#x2715;"; // × character
      closeBtn.setAttribute("aria-label", "Close image");

      const img = document.createElement("img");
      img.src = src;
      img.alt = alt;

      const closeLightbox = () => {
        if (lightbox) {
          lightbox.remove();
          lightbox = null;
          document.removeEventListener("keydown", handleKeydown);
        }
      };

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") closeLightbox();
      };

      lightbox.addEventListener("click", (e) => {
        // Close if clicking the backdrop or the image itself (zoom-out behavior)
        if (e.target === lightbox || e.target === img) closeLightbox();
      });
      closeBtn.addEventListener("click", closeLightbox);
      document.addEventListener("keydown", handleKeydown);

      lightbox.appendChild(closeBtn);
      lightbox.appendChild(img);
      document.body.appendChild(lightbox);
    };

    const handleImgClick = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        const img = target as HTMLImageElement;
        // Only open lightbox for article body images (not icons)
        if (img.naturalWidth > 100) {
          openLightbox(img.src, img.alt || "Article image");
        }
      }
    };

    articleBody.addEventListener("click", handleImgClick);
    return () => {
      articleBody.removeEventListener("click", handleImgClick);
      if (lightbox) {
        lightbox.remove();
        lightbox = null;
      }
    };
  }, [htmlContent]);

  return (
    <div
      className="article-body"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
