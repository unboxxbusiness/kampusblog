"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, GraduationCap, Cpu, Layers, BarChart, Briefcase, BookOpen, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

// Map icons to categories for visual appeal
const iconMap: Record<string, React.ReactNode> = {
  "University Admissions": <GraduationCap className="h-5 w-5 text-purple-500" />,
  "Scholarships": <BookOpen className="h-5 w-5 text-indigo-500" />,
  "Internships": <Briefcase className="h-5 w-5 text-emerald-500" />,
  "Student Opportunities": <Sparkles className="h-5 w-5 text-amber-500" />,
  "Education News": <Layers className="h-5 w-5 text-rose-500" />,
  "Career Signals": <BarChart className="h-5 w-5 text-cyan-500" />,
  "Future Skills": <Cpu className="h-5 w-5 text-teal-500" />,
};

export default function LearnHubDropdown({ activeCategories = [] }: { activeCategories?: string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredCategories = siteConfig.learnHubCategories.filter((category) =>
    activeCategories.includes(category.dbCategory)
  );

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2 px-1 focus:outline-none"
        aria-expanded={isOpen}
        suppressHydrationWarning
      >
        Categories
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full z-50 w-[480px] pt-2">
          <div className="glass rounded-xl shadow-xl border border-border p-4 grid grid-cols-2 gap-2 animate-fade-in-up">
            {filteredCategories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className="group flex items-start gap-3 p-2 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="p-2 rounded-md bg-secondary group-hover:bg-background/20 transition-colors flex items-center justify-center">
                  {iconMap[category.name] || <Sparkles className="h-5 w-5 text-primary" />}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-accent-foreground transition-colors">{category.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 group-hover:text-accent-foreground/80 transition-colors">
                    {category.name === "University Admissions" && "Track admission updates & processes"}
                    {category.name === "Scholarships" && "Find student aid & grant opportunities"}
                    {category.name === "Internships" && "Discover placement & training programs"}
                    {category.name === "Student Opportunities" && "Fellowships, hackathons & competitions"}
                    {category.name === "Education News" && "Latest educational news & updates"}
                    {category.name === "Career Signals" && "Emerging career paths & hiring updates"}
                    {category.name === "Future Skills" && "High-demand tech, coding & AI skills"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
