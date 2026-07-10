import React from "react";

type IntelligenceSnapshotProps = {
  category: string;
  metadataStr?: string | null;
  readingTime?: number;
  updatedAt?: number;
};

type FieldConfig = {
  label: string;
  key: string;
};

type CategoryConfig = {
  themeName: string;
  themeGradient: string;
  themeBorder: string;
  themeText: string;
  themeBadgeBg: string;
  fields: FieldConfig[];
};

const CATEGORY_MAP: Record<string, CategoryConfig> = {
  "Scholarships": {
    themeName: "Scholarships",
    themeGradient: "from-emerald-600/20 to-teal-500/10",
    themeBorder: "border-emerald-500/20 hover:border-emerald-500/40",
    themeText: "text-emerald-400",
    themeBadgeBg: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    fields: [
      { label: "Sponsor / Company", key: "sponsor" },
      { label: "Scholarship Amount", key: "amount" },
      { label: "Application Deadline", key: "deadline" },
      { label: "Academic Eligibility", key: "eligibility" },
      { label: "Application Mode", key: "mode" }
    ]
  },
  "Admissions": {
    themeName: "Admissions",
    themeGradient: "from-indigo-600/20 to-violet-500/10",
    themeBorder: "border-indigo-500/20 hover:border-indigo-500/40",
    themeText: "text-indigo-400",
    themeBadgeBg: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    fields: [
      { label: "University", key: "university" },
      { label: "Admission Status", key: "status" },
      { label: "Last Date to Apply", key: "deadline" },
      { label: "Application Fee", key: "fee" },
      { label: "Accepted Exams", key: "exams" }
    ]
  },
  "Internships": {
    themeName: "Internships",
    themeGradient: "from-cyan-600/20 to-sky-500/10",
    themeBorder: "border-cyan-500/20 hover:border-cyan-500/40",
    themeText: "text-cyan-400",
    themeBadgeBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
    fields: [
      { label: "Hiring Company", key: "company" },
      { label: "Stipend (Monthly)", key: "stipend" },
      { label: "Duration", key: "duration" },
      { label: "Work Location", key: "location" },
      { label: "Application Deadline", key: "deadline" }
    ]
  },
  "Career Signals": {
    themeName: "Career Signals",
    themeGradient: "from-orange-600/20 to-amber-500/10",
    themeBorder: "border-orange-500/20 hover:border-orange-500/40",
    themeText: "text-orange-400",
    themeBadgeBg: "bg-orange-500/10 text-orange-300 border-orange-500/20",
    fields: [
      { label: "Trending Career", key: "career" },
      { label: "Average Salary", key: "salary" },
      { label: "Prerequisite Skills", key: "skills" },
      { label: "Future Outlook / Demand", key: "demand" }
    ]
  },
  "Education News": {
    themeName: "Education News",
    themeGradient: "from-blue-600/20 to-sky-500/10",
    themeBorder: "border-blue-500/20 hover:border-blue-500/40",
    themeText: "text-blue-400",
    themeBadgeBg: "bg-blue-500/10 text-blue-300 border-blue-500/20",
    fields: [
      { label: "Official Source", key: "source" },
      { label: "News Category", key: "news_category" },
      { label: "Impact Severity", key: "impact" },
      { label: "Target Audience", key: "target" }
    ]
  }
};

const DEFAULT_CONFIG: CategoryConfig = {
  themeName: "Intelligence Report",
  themeGradient: "from-slate-600/20 to-slate-500/10",
  themeBorder: "border-slate-500/20 hover:border-slate-500/40",
  themeText: "text-slate-400",
  themeBadgeBg: "bg-slate-500/10 text-slate-300 border-slate-500/20",
  fields: [
    { label: "Status", key: "status" },
    { label: "Category", key: "category" },
    { label: "Impact", key: "impact" }
  ]
};

export function IntelligenceSnapshot({
  category,
  metadataStr,
  readingTime = 5,
  updatedAt
}: IntelligenceSnapshotProps) {
  // Parse metadata JSON
  let metadata: Record<string, string> = {};
  try {
    if (metadataStr) {
      metadata = JSON.parse(metadataStr);
    }
  } catch (e) {
    console.error("Failed to parse article metadata:", e);
  }

  const config = CATEGORY_MAP[category] || DEFAULT_CONFIG;

  // Format date if provided
  const updatedString = updatedAt 
    ? new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : "Recently";

  // Who should care info
  const whoRead = metadata.who_should_read || "Students pursuing admissions or scholarship opportunities.";
  const whoSkip = metadata.who_should_skip || "Students not matching the specific criteria or deadlines.";
  const urgency = metadata.urgency || "Normal";
  const actionText = metadata.action_text || "Apply Online";
  const actionUrl = metadata.action_url;

  return (
    <div className="w-full flex flex-col gap-6 mb-8 mt-2">
      {/* Dynamic Snapshot Card */}
      <div 
        className={`relative w-full rounded-2xl border ${config.themeBorder} p-6 md:p-8 bg-slate-950/80 overflow-hidden transition-all duration-300 shadow-2xl`}
      >
        {/* Dynamic Glowing Blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden rounded-2xl opacity-40">
          <div className={`absolute -top-12 -left-12 w-64 h-64 bg-gradient-to-br ${config.themeGradient} rounded-full blur-[80px] animate-pulse`} />
          <div className={`absolute -bottom-16 -right-16 w-80 h-80 bg-gradient-to-tr ${config.themeGradient} rounded-full blur-[90px]`} />
        </div>

        {/* Dynamic Dot Pattern Overlay */}
        <div 
          className="absolute inset-0 -z-10 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"
        />

        {/* Top Header Badge & Read Time */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${config.themeBadgeBg}`}>
              {config.themeName}
            </span>
            <span className="flex items-center text-xs text-muted-foreground gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Verified Briefing
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {readingTime} Min Read
            </span>
            <span>•</span>
            <span>Updated {updatedString}</span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <svg className={`w-5 h-5 ${config.themeText}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Intelligence Snapshot
          </h3>
          <p className="text-xs text-muted-foreground mt-1">Structured snapshot synthesized directly from verified data sources.</p>
        </div>

        {/* Key Information Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 border-t border-white/5 pt-6">
          {config.fields.map((field, index) => {
            const val = metadata[field.key] || "N/A";
            return (
              <div 
                key={index}
                className="bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] p-4 rounded-xl flex flex-col gap-1 transition-colors duration-200"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                  {field.label}
                </span>
                <span className="text-sm font-semibold text-white truncate-2-lines leading-snug">
                  {val}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Should You Care section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Who Should Read & Who Can Skip */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col gap-4">
          <h4 className="text-xs uppercase font-extrabold tracking-widest text-muted-foreground flex items-center gap-1.5">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Audience Profiler
          </h4>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2.5 items-start">
              <span className="text-emerald-400 mt-0.5 font-bold">✓</span>
              <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-emerald-400 font-semibold">Read:</strong> {whoRead}</p>
            </div>
            <div className="flex gap-2.5 items-start">
              <span className="text-rose-400 mt-0.5 font-bold">✗</span>
              <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-rose-400 font-semibold">Skip:</strong> {whoSkip}</p>
            </div>
          </div>
        </div>

        {/* Action Required Box */}
        <div className="bg-slate-950/40 border border-white/5 rounded-2xl p-5 md:p-6 flex flex-col justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs uppercase font-extrabold tracking-widest text-muted-foreground flex items-center gap-1.5">
                <svg className="w-4 h-4 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Action Required
              </h4>
              <span className={`px-2 py-0.5 text-[9px] uppercase font-black rounded-md tracking-wider border ${
                urgency.toLowerCase() === "high" 
                  ? "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }`}>
                {urgency} Priority
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              If you meet the requirements, submit your registration before the deadline. Missing dates will result in application rejection.
            </p>
          </div>
          {actionUrl ? (
            <a 
              href={actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 px-4 rounded-xl text-xs font-bold bg-white text-black hover:bg-slate-100 transition-colors duration-200"
            >
              ⚡ {actionText}
            </a>
          ) : (
            <div className="w-full text-center py-2 px-4 rounded-xl text-xs font-bold bg-slate-900 border border-white/10 text-slate-400">
              🔒 Registration details inside article
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
