import React from "react";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

interface PolicyLayoutProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-semibold text-foreground">{title}</span>
      </nav>

      {/* Header */}
      <header className="border-b border-border pb-6 space-y-3">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-md">
          <Shield className="h-3.5 w-3.5" />
          Legal Policy Documentation
        </span>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
          Effective Date: {lastUpdated}
        </p>
      </header>

      {/* Content */}
      <div className="prose prose-purple dark:prose-invert max-w-none text-sm leading-relaxed text-foreground/90 space-y-5">
        {children}
      </div>
    </div>
  );
}
