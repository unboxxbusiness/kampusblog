"use client";

import React, { useState } from "react";
import { Download, FileText, Printer, CheckCircle, Loader2 } from "lucide-react";

interface DownloadNotesProps {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string | number;
  takeaways: string[];
  content: string;
}

export default function DownloadNotes({
  title,
  slug,
  excerpt,
  category,
  author,
  publishedAt,
  takeaways,
  content
}: DownloadNotesProps) {
  const [downloadingMd, setDownloadingMd] = useState(false);
  const [printingPdf, setPrintingPdf] = useState(false);

  const handleExportMarkdown = () => {
    setDownloadingMd(true);
    
    try {
      let md = `# ${title}\n\n`;
      md += `*Category: ${category} | Author: ${author} | Published: ${new Date(publishedAt).toLocaleDateString()}*\n\n`;
      md += `## Overview\n${excerpt}\n\n`;

      if (takeaways && takeaways.length > 0) {
        md += `## Key Takeaways (TL;DR)\n`;
        takeaways.forEach(t => {
          md += `- ${t}\n`;
        });
        md += `\n`;
      }

      md += `## Detailed Notes & Guide\n`;
      
      // Convert HTML formatting to Markdown formatting
      let bodyMd = content
        // Headers
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n## $1\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n### $1\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '\n#### $1\n')
        // Paragraphs & lines
        .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
        .replace(/<br\s*\/?>/gi, '\n')
        // Lists
        .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1')
        .replace(/<ul[^>]*>/gi, '\n')
        .replace(/<\/ul>/gi, '\n')
        .replace(/<ol[^>]*>/gi, '\n')
        .replace(/<\/ol>/gi, '\n')
        // Bold/Italics
        .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*')
        // Code
        .replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n')
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        // Blockquotes
        .replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, '\n> $1\n')
        // Links
        .replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)')
        // Strip other tags
        .replace(/<[^>]*>/g, '')
        // Clean multiple newlines
        .replace(/\n{3,}/g, '\n\n')
        .trim();

      md += bodyMd;

      // Add a footer citation
      md += `\n\n---\n*Notes generated from [Kampus Filter](https://kampusfilter.com/articles/${slug})*`;

      // Trigger browser download
      const blob = new Blob([md], { type: "text/markdown;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${slug}-study-notes.md`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Markdown export failed:", e);
    } finally {
      setTimeout(() => setDownloadingMd(false), 800);
    }
  };

  const handlePrintPdf = () => {
    setPrintingPdf(true);
    try {
      window.print();
    } catch (e) {
      console.error("PDF printing failed:", e);
    } finally {
      setTimeout(() => setPrintingPdf(false), 800);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm hover:border-primary/20 hover:shadow-md transition-all">
      <div>
        <h4 className="font-heading text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Study Companion
        </h4>
        <p className="text-[10px] text-muted-foreground leading-normal mt-1">
          Download clean study notes to import into Notion/Obsidian, or print/save as a distraction-free PDF.
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        {/* Markdown Download */}
        <button
          onClick={handleExportMarkdown}
          disabled={downloadingMd}
          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold py-2.5 rounded-xl border border-border transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-75"
        >
          {downloadingMd ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
          )}
          Export Markdown (.md)
        </button>

        {/* PDF Print/Download */}
        <button
          onClick={handlePrintPdf}
          disabled={printingPdf}
          className="w-full flex items-center justify-center gap-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-xs font-semibold py-2.5 rounded-xl border border-border transition-all duration-200 shadow-sm cursor-pointer disabled:opacity-75"
        >
          {printingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Printer className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
          )}
          Print / Save PDF
        </button>
      </div>
    </div>
  );
}
