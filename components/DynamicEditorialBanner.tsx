import React from "react";
import { Award, GraduationCap, Terminal, TrendingUp, Cpu, Newspaper, Sparkles } from "lucide-react";

type DynamicEditorialBannerProps = {
  title: string;
  category: string;
  className?: string;
};

export function DynamicEditorialBanner({ title, category = "", className = "" }: DynamicEditorialBannerProps) {
  // Select configuration based on category keywords
  const categoryLower = (category || "").toLowerCase();
  
  let gradient = "from-slate-600 via-slate-700 to-slate-900";
  let badgeBg = "bg-white/10 text-slate-200 border-white/20";
  let accentColor = "text-slate-300";
  let themeLabel = "EDITORIAL BRIEF";
  let icon = <Sparkles className="h-4 w-4" />;
  
  // Custom abstract CSS graphic
  let abstractCard = (
    <div className="relative w-44 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl">
      <div className="h-3 w-16 bg-white/20 rounded" />
      <div className="space-y-2">
        <div className="h-2 w-full bg-white/25 rounded" />
        <div className="h-2 w-5/6 bg-white/25 rounded" />
      </div>
      <div className="h-1.5 w-1/2 bg-white/20 rounded" />
    </div>
  );

  if (categoryLower.includes("scholarship")) {
    gradient = "from-emerald-500 via-teal-600 to-cyan-950";
    badgeBg = "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
    accentColor = "text-emerald-300";
    themeLabel = "SCHOLARSHIP ALERT";
    icon = <Award className="h-4 w-4" />;
    abstractCard = (
      <div className="relative w-48 h-32 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 group-hover:scale-[1.03]">
        <div className="flex items-center justify-between">
          <div className="h-5 w-12 bg-white/20 rounded-md" />
          <div className="h-5 w-5 rounded-full bg-emerald-400/80 animate-pulse flex items-center justify-center">
            <span className="text-[8px] text-emerald-950 font-bold">₹</span>
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 w-4/5 bg-white/25 rounded" />
          <div className="h-2 w-3/5 bg-white/20 rounded" />
        </div>
        <div className="h-7 w-full bg-emerald-500/40 border border-emerald-400/30 rounded-lg flex items-center justify-center text-[8px] font-bold text-white tracking-widest uppercase">
          Apply Online
        </div>
      </div>
    );
  } else if (categoryLower.includes("admission") || categoryLower.includes("university") || categoryLower.includes("college")) {
    gradient = "from-indigo-600 via-purple-700 to-pink-950";
    badgeBg = "bg-purple-500/20 text-purple-300 border-purple-500/30";
    accentColor = "text-purple-300";
    themeLabel = "CAMPUS ADMISSION";
    icon = <GraduationCap className="h-4 w-4" />;
    abstractCard = (
      <div className="relative w-44 h-36 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 group-hover:scale-[1.03]">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded-full bg-purple-400" />
          <div className="h-2 w-20 bg-white/20 rounded" />
        </div>
        <div className="space-y-2 my-2">
          <div className="h-1.5 w-full bg-white/25 rounded" />
          <div className="h-1.5 w-11/12 bg-white/25 rounded" />
          <div className="h-1.5 w-2/3 bg-white/20 rounded" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="h-4.5 w-20 bg-pink-500/30 border border-pink-400/20 rounded-full flex items-center justify-center text-[7px] text-pink-200 font-bold">
            CUET Cutoff
          </div>
          <div className="h-3 w-8 bg-white/20 rounded" />
        </div>
      </div>
    );
  } else if (categoryLower.includes("internship")) {
    gradient = "from-cyan-500 via-blue-600 to-slate-950";
    badgeBg = "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
    accentColor = "text-cyan-300";
    themeLabel = "HOT OPPORTUNITY";
    icon = <Terminal className="h-4 w-4" />;
    abstractCard = (
      <div className="relative w-48 h-32 bg-slate-900/90 border border-white/15 rounded-xl p-3 flex flex-col justify-between shadow-2xl font-mono text-[9px] text-cyan-300/90 transition-all duration-300 group-hover:scale-[1.03]">
        <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1">
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-white/40 text-[7px]">terminal</span>
        </div>
        <div className="flex-1 space-y-1 text-left pt-1">
          <div><span className="text-pink-400">$</span> isro --apply</div>
          <div className="text-emerald-400">&gt; verifying noc... ok</div>
          <div className="text-white/50">&gt; stipend: active</div>
        </div>
        <div className="flex items-center gap-1.5 pt-1 border-t border-white/5 text-[7px] text-white/50">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>location: bengaluru</span>
        </div>
      </div>
    );
  } else if (categoryLower.includes("career") || categoryLower.includes("signal") || categoryLower.includes("placement")) {
    gradient = "from-orange-500 via-amber-600 to-red-950";
    badgeBg = "bg-orange-500/20 text-orange-300 border-orange-500/30";
    accentColor = "text-orange-300";
    themeLabel = "CAREER SIGNAL";
    icon = <TrendingUp className="h-4 w-4" />;
    abstractCard = (
      <div className="relative w-44 h-34 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 group-hover:scale-[1.03]">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold text-white uppercase tracking-wider">Salary Trends</span>
          <span className="text-[7px] px-1.5 py-0.5 rounded bg-orange-500 text-white font-bold animate-pulse">High Demand</span>
        </div>
        <div className="flex items-end gap-2.5 h-14 my-2 justify-center">
          <div className="w-3.5 bg-white/20 rounded-t h-4" />
          <div className="w-3.5 bg-white/30 rounded-t h-8" />
          <div className="w-3.5 bg-white/40 rounded-t h-6" />
          <div className="w-3.5 bg-orange-400 rounded-t h-12" />
        </div>
        <div className="h-1.5 w-full bg-white/20 rounded" />
      </div>
    );
  } else if (categoryLower.includes("skill") || categoryLower.includes("future")) {
    gradient = "from-purple-500 via-fuchsia-600 to-indigo-950";
    badgeBg = "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30";
    accentColor = "text-fuchsia-300";
    themeLabel = "FUTURE SKILLS";
    icon = <Cpu className="h-4 w-4" />;
    abstractCard = (
      <div className="relative w-44 h-34 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex flex-col justify-between shadow-2xl transition-all duration-300 group-hover:scale-[1.03]">
        <div className="flex justify-between items-center">
          <div className="h-4 w-12 bg-fuchsia-500/40 rounded-full border border-fuchsia-400/20" />
          <div className="h-1.5 w-8 bg-white/20 rounded" />
        </div>
        <div className="flex items-center justify-center gap-3 my-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-purple-600 flex items-center justify-center shadow-md animate-pulse">
            <span className="text-[10px] text-white font-extrabold">&lt;/&gt;</span>
          </div>
          <div className="space-y-1 flex-1">
            <div className="h-1.5 w-full bg-white/25 rounded" />
            <div className="h-1.5 w-2/3 bg-white/20 rounded" />
          </div>
        </div>
        <div className="h-1.5 w-full bg-white/15 rounded" />
      </div>
    );
  } else if (categoryLower.includes("news") || categoryLower.includes("board")) {
    gradient = "from-blue-500 via-indigo-600 to-slate-950";
    badgeBg = "bg-blue-500/20 text-blue-300 border-blue-500/30";
    accentColor = "text-blue-300";
    themeLabel = "EDUCATION BRIEFING";
    icon = <Newspaper className="h-4 w-4" />;
    abstractCard = (
      <div className="relative w-46 h-34 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex flex-col justify-between shadow-2xl transition-all duration-300 group-hover:scale-[1.03]">
        <div className="border-b border-white/10 pb-1.5 mb-1.5 flex justify-between items-center">
          <span className="text-[8px] font-bold text-white tracking-widest uppercase">Latest Bulletin</span>
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
        </div>
        <div className="space-y-2">
          <div className="h-2 w-full bg-white/25 rounded" />
          <div className="h-2 w-11/12 bg-white/20 rounded" />
          <div className="h-2 w-5/6 bg-white/20 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br ${gradient} overflow-hidden ${className}`}
    >
      {/* Dynamic inline styles for float animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        .animate-float {
          animation: float 5s ease-in-out infinite;
        }
      `}} />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Ambient glowing orb in background */}
      <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5 blur-2xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/10 blur-2xl pointer-events-none" />

      {/* Decorative Brand Watermark */}
      <div className="absolute bottom-4 right-4 text-[9px] font-extrabold tracking-widest text-white/10 select-none">
        KAMPUS FILTER EDITORIAL
      </div>

      {/* Abstract Dynamic CSS Graphic container with float animation */}
      <div className="animate-float z-10 my-auto flex items-center justify-center">
        {abstractCard}
      </div>

      {/* Dynamic Badge row at the bottom */}
      <div className="z-10 mt-auto flex items-center gap-1.5 px-3 py-1 rounded-full border backdrop-blur-sm shadow-sm transition-all duration-300 hover:bg-white/5 text-[9px] font-extrabold uppercase tracking-widest select-none bg-black/10 border-white/10 text-white/80">
        {icon}
        <span>{themeLabel}</span>
      </div>
    </div>
  );
}
