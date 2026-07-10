"use client";

import React from "react";
import * as Lucide from "lucide-react";

type EditorialHeroProps = {
  articleId?: string;
  title: string;
  category: string;
  metadataStr?: string | null;
  readingTime?: number;
  updatedAt?: number;
  author?: string;
  contentType?: string;
};

type FieldConfig = {
  label: string;
  key: string;
};

type CategoryConfig = {
  themeName: string;
  folder: string;
  bg: string;               // Tailwind bg for the banner
  badgeColor: string;       // Small category badge
  fields: FieldConfig[];
};

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  "Scholarships": {
    themeName: "Scholarships",
    folder: "scholarships",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    fields: [
      { label: "Scholarship Amount", key: "amount" },
      { label: "Application Deadline", key: "deadline" },
      { label: "Academic Eligibility", key: "eligibility" },
      { label: "Application Mode", key: "mode" }
    ]
  },
  "Admissions": {
    themeName: "Admissions",
    folder: "admissions",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    fields: [
      { label: "Admission Status", key: "status" },
      { label: "Last Date to Apply", key: "deadline" },
      { label: "Application Fee", key: "fee" },
      { label: "Accepted Exams", key: "exams" }
    ]
  },
  "University Admissions": {
    themeName: "Admissions",
    folder: "admissions",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    fields: [
      { label: "Admission Status", key: "status" },
      { label: "Last Date to Apply", key: "deadline" },
      { label: "Application Fee", key: "fee" },
      { label: "Accepted Exams", key: "exams" }
    ]
  },
  "Internships": {
    themeName: "Internships",
    folder: "internships",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300",
    fields: [
      { label: "Stipend (Monthly)", key: "stipend" },
      { label: "Duration", key: "duration" },
      { label: "Work Location", key: "location" },
      { label: "Application Deadline", key: "deadline" }
    ]
  },
  "Career Signals": {
    themeName: "Career Signals",
    folder: "career",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    fields: [
      { label: "Average Salary", key: "salary" },
      { label: "Prerequisite Skills", key: "skills" },
      { label: "Future Outlook", key: "demand" },
      { label: "Trending Career", key: "career" }
    ]
  },
  "Career": {
    themeName: "Career Signals",
    folder: "career",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    fields: [
      { label: "Average Salary", key: "salary" },
      { label: "Prerequisite Skills", key: "skills" },
      { label: "Future Outlook", key: "demand" },
      { label: "Trending Career", key: "career" }
    ]
  },
  "Education News": {
    themeName: "Education News",
    folder: "education",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    fields: [
      { label: "Official Source", key: "source" },
      { label: "Impact Level", key: "impact" },
      { label: "Target Audience", key: "target" },
      { label: "Category", key: "news_category" }
    ]
  },
  "Education": {
    themeName: "Education News",
    folder: "education",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    fields: [
      { label: "Official Source", key: "source" },
      { label: "Impact Level", key: "impact" },
      { label: "Target Audience", key: "target" },
      { label: "Category", key: "news_category" }
    ]
  },
  "Universities": {
    themeName: "Universities",
    folder: "universities",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    fields: [
      { label: "University", key: "university" },
      { label: "Location", key: "location" },
      { label: "Established", key: "established" }
    ]
  },
  "Competitive Exams": {
    themeName: "Competitive Exams",
    folder: "exams",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    fields: [
      { label: "Exam Date", key: "exam_date" },
      { label: "Registration Last Date", key: "deadline" },
      { label: "Official Portal", key: "portal" }
    ]
  },
  "Study Abroad": {
    themeName: "Study Abroad",
    folder: "abroad",
    bg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeColor: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/60 dark:text-cyan-300",
    fields: [
      { label: "Destination Country", key: "country" },
      { label: "Intake Term", key: "intake" },
      { label: "Required Test", key: "test" }
    ]
  },
  "Students": {
    themeName: "Students Life",
    folder: "students",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    fields: [
      { label: "Topic", key: "topic" },
      { label: "Target Age", key: "age_group" }
    ]
  },
  "Graduation": {
    themeName: "Graduation",
    folder: "graduation",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    fields: [
      { label: "Passing Out Year", key: "year" },
      { label: "Degree Level", key: "degree" }
    ]
  },
  "Books": {
    themeName: "Books & Reading",
    folder: "books",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    fields: [
      { label: "Recommended For", key: "recommended_for" },
      { label: "Topic", key: "topic" }
    ]
  },
  "Learning": {
    themeName: "Learning Path",
    folder: "learning",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    fields: [
      { label: "Difficulty", key: "difficulty" },
      { label: "Duration", key: "duration" }
    ]
  },
  "Opportunities": {
    themeName: "Opportunities",
    folder: "opportunities",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    fields: [
      { label: "Reward / Prize", key: "reward" },
      { label: "Deadline", key: "deadline" }
    ]
  },
  "Skill Development": {
    themeName: "Skills",
    folder: "skills",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    fields: [
      { label: "Focus Skill", key: "skill" },
      { label: "Pre-requisites", key: "prerequisites" }
    ]
  },
  "Future Skills": {
    themeName: "Skills",
    folder: "skills",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    fields: [
      { label: "Focus Skill", key: "skill" },
      { label: "Pre-requisites", key: "prerequisites" }
    ]
  },
  "AI in Education": {
    themeName: "AI & Tech",
    folder: "ai",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    fields: [
      { label: "AI Tool", key: "tool" },
      { label: "Domain", key: "domain" }
    ]
  },
  "AI": {
    themeName: "AI & Tech",
    folder: "ai",
    bg: "bg-purple-50 dark:bg-purple-950/40",
    badgeColor: "bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300",
    fields: [
      { label: "AI Tool", key: "tool" },
      { label: "Domain", key: "domain" }
    ]
  },
  "Campus Life": {
    themeName: "Campus Life",
    folder: "campus",
    bg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeColor: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300",
    fields: [
      { label: "Institution", key: "institution" },
      { label: "Event Type", key: "event_type" }
    ]
  },
  "Certifications": {
    themeName: "Certifications",
    folder: "certifications",
    bg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeColor: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300",
    fields: [
      { label: "Provider", key: "provider" },
      { label: "Validity", key: "validity" }
    ]
  },
  "Placements": {
    themeName: "Placements",
    folder: "placements",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    badgeColor: "bg-orange-100 text-orange-700 dark:bg-orange-900/60 dark:text-orange-300",
    fields: [
      { label: "Average CTC", key: "ctc" },
      { label: "Hiring Sector", key: "sector" }
    ]
  },
  "Research": {
    themeName: "Research",
    folder: "research",
    bg: "bg-blue-50 dark:bg-blue-950/40",
    badgeColor: "bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300",
    fields: [
      { label: "Research Field", key: "field" },
      { label: "Publication", key: "publication" }
    ]
  },
  "Productivity": {
    themeName: "Productivity",
    folder: "productivity",
    bg: "bg-slate-100 dark:bg-slate-900/40",
    badgeColor: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    fields: [
      { label: "Method / Rule", key: "method" },
      { label: "Target Area", key: "target" }
    ]
  }
};

const DEFAULT_CONFIG: CategoryConfig = {
  themeName: "Briefing",
  folder: "education",
  bg: "bg-slate-100 dark:bg-slate-900/40",
  badgeColor: "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  fields: [
    { label: "Status", key: "status" },
    { label: "Impact", key: "impact" }
  ]
};

// Folders with multiple variations (01, 02, 03)
const MULTI_VARIATION_FOLDERS = [
  "admissions", "scholarships", "universities", "career", "internships",
  "education", "exams", "abroad", "students", "graduation",
  "books", "learning", "opportunities", "skills", "ai"
];

function getIllustrationVariation(title: string, folder: string): string {
  if (!MULTI_VARIATION_FOLDERS.includes(folder)) {
    return "01";
  }
  
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Choose dynamically between 1, 2, or 3
  const variation = (Math.abs(hash) % 3) + 1;
  return `0${variation}`;
}

export function EditorialHero({
  articleId,
  title,
  category,
  metadataStr,
  readingTime = 5,
  updatedAt,
  author = "Kampus Filter Editorial",
  contentType = "news"
}: EditorialHeroProps) {
  let metadata: Record<string, string> = {};
  try {
    if (metadataStr) metadata = JSON.parse(metadataStr);
  } catch {}

  const config = CATEGORY_MAP[category] || DEFAULT_CONFIG;

  const updatedString = updatedAt
    ? new Date(updatedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";

  // Try to parse illustration_tag from metadataStr if present
  let smartFolder: string | undefined = undefined;
  if (metadataStr) {
    try {
      const parsed = JSON.parse(metadataStr);
      if (parsed.illustration_tag) {
        smartFolder = parsed.illustration_tag.toLowerCase().trim();
      }
    } catch {}
  }

  const folder = smartFolder || config.folder;

  // Resolve dynamic variation path
  const variation = getIllustrationVariation(title, folder);
  const illustrationSrc = `/api/illustrations?folder=${folder}&variation=${variation}`;

  return (
    <div className="w-full mb-10">
      {/* ─── BLOG BANNER ─── */}
      <div className={`relative w-full rounded-2xl overflow-hidden border border-border ${config.bg}`}>
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:20px_20px] text-foreground pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 px-8 md:px-12 py-10 md:py-14">
          {/* Left — text content */}
          <div className="flex-1 flex flex-col gap-4 max-w-2xl">
            {/* Category badge */}
            <span className={`self-start text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${config.badgeColor}`}>
              {config.themeName}
            </span>

            {/* Article title */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground leading-[1.15] tracking-tight">
              {title}
            </h1>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{author}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Lucide.Clock className="w-3.5 h-3.5" />
                {readingTime} min read
              </span>
              <span>·</span>
              <span>Updated {updatedString}</span>
            </div>
          </div>

          {/* Right — dynamic editorial SVG illustration */}
          <div className="hidden md:flex items-center justify-center relative w-60 h-48 flex-shrink-0">
            <img 
              src={illustrationSrc}
              alt={title}
              className="w-full h-full object-contain max-h-[170px]"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.getAttribute("data-fallback")) {
                  target.setAttribute("data-fallback", "true");
                  target.src = "/api/illustrations?folder=education&variation=01";
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── METADATA GRID (below banner) ─── */}
      {config.fields.some(f => metadata[f.key]) && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {config.fields.slice(0, 4).map((field, idx) => {
            const val = metadata[field.key];
            if (!val) return null;
            return (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl px-4 py-3 flex flex-col gap-1"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
                  {field.label}
                </span>
                <span className="text-sm font-semibold text-foreground leading-snug">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── AUDIENCE PROFILER (below metadata) ─── */}
      {(metadata.who_should_read || metadata.who_should_skip) && (
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
          {metadata.who_should_read && (
            <div className="flex gap-2.5 items-start bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl px-4 py-3">
              <span className="text-emerald-600 font-bold text-sm mt-0.5">✓</span>
              <p className="text-sm text-foreground leading-snug">
                <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Read if:</strong>{" "}
                {metadata.who_should_read}
              </p>
            </div>
          )}
          {metadata.who_should_skip && (
            <div className="flex gap-2.5 items-start bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 rounded-xl px-4 py-3">
              <span className="text-rose-500 font-bold text-sm mt-0.5">✗</span>
              <p className="text-sm text-foreground leading-snug">
                <strong className="text-rose-600 dark:text-rose-400 font-semibold">Skip if:</strong>{" "}
                {metadata.who_should_skip}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
