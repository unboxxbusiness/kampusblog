"use client";

import React, { useState, useEffect } from "react";
import { sanitizeHTML } from "@/utils/sanitizer";
import { Copy } from "lucide-react";
import dynamic from "next/dynamic";
import "@/styles/article.css";

// Load MermaidChart dynamically on the client side only to bypass server-side bundling
const MermaidChart = dynamic(() => import("./MermaidChart"), { ssr: false });

// --- COMPONENT 1: Tabbed Code Panel (Smashing-style) ---
interface TabbedCodePanelProps {
  code: string;
}

export function TabbedCodePanel({ code }: TabbedCodePanelProps) {
  const [activeTab, setActiveTab] = useState<"setup" | "logic" | "output">("logic");

  const cleanCode = code
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const detectLanguage = (c: string) => {
    if (c.includes("import ") || c.includes("def ") || c.includes("print(")) return "Python";
    if (c.includes("const ") || c.includes("let ") || c.includes("function ") || c.includes("require")) return "JavaScript";
    return "Code";
  };

  const getStaticOutput = (c: string) => {
    if (c.includes("numpy") && c.includes("linalg.solve")) {
      return "Determinant = 5\nSolution Vector [x, y] = [1.00, 3.00]\n\n[Process completed successfully]";
    }
    if (c.includes("calculate_ai_roi")) {
      return "Monthly API Bill: $312.50\nProjected ROI: 380.0%\n\n[Process completed successfully]";
    }
    if (c.includes("calculate_fact_density")) {
      return "Analyzing content text...\nWords counted: 8\nMatches found: 3\nFact Density Metric: 37.50%\n\n[Process completed successfully]";
    }
    if (c.includes("clerk-expo")) {
      return "[Expo] Project started successfully.\n[Clerk] Loaded authentication configuration.\n[Console] Active Session: Signed Out.";
    }
    if (c.includes("muse-spark-1.1")) {
      return "Connecting to api.meta.ai...\nStatus: 200 OK\nResponse: {\"tool_calls\": [{\"name\": \"file_reader\", \"args\": {\"path\": \"research.json\"}}]}\n\n[Execution completed successfully]";
    }
    return "[System] Compilation successful.\n[Console] Executed workflow step.\nExit code: 0 (Success)";
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(cleanCode);
    } catch (e) {
      console.warn("Failed to copy", e);
    }
  };

  const splitCode = (c: string) => {
    const lines = c.split("\n");
    const configLines: string[] = [];
    const logicLines: string[] = [];

    let inConfig = true;
    for (const line of lines) {
      if (inConfig) {
        if (
          line.trim().startsWith("import ") ||
          line.trim().startsWith("const ") ||
          line.trim().startsWith("let ") ||
          line.trim() === "" ||
          line.trim().startsWith("//") ||
          line.trim().startsWith("#")
        ) {
          configLines.push(line);
        } else {
          inConfig = false;
          logicLines.push(line);
        }
      } else {
        logicLines.push(line);
      }
    }

    if (logicLines.length === 0) {
      return { config: configLines.join("\n").trim(), logic: "// Executed core script" };
    }

    return {
      config: configLines.join("\n").trim(),
      logic: logicLines.join("\n").trim(),
    };
  };

  const lang = detectLanguage(cleanCode);
  const { config, logic } = splitCode(cleanCode);
  const output = getStaticOutput(cleanCode);

  return (
    <div className="my-6 border border-border/80 rounded-xl overflow-hidden shadow-sm bg-neutral-950 text-neutral-200 font-mono text-xs sm:text-sm">
      {/* Tabs Header Bar */}
      <div className="flex items-center justify-between border-b border-border/40 bg-neutral-900/60 select-none">
        <div className="flex border-r border-border/30">
          <button
            onClick={() => setActiveTab("setup")}
            className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${activeTab === "setup" ? "border-primary text-foreground bg-neutral-900" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            1. Setup
          </button>
          <button
            onClick={() => setActiveTab("logic")}
            className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${activeTab === "logic" ? "border-primary text-foreground bg-neutral-900" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            2. Logic ({lang})
          </button>
          <button
            onClick={() => setActiveTab("output")}
            className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer border-b-2 ${activeTab === "output" ? "border-primary text-foreground bg-neutral-900" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            3. Output
          </button>
        </div>
        <button
          onClick={handleCopy}
          className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer flex items-center gap-1"
        >
          <Copy className="h-3.5 w-3.5" />
          <span>Copy</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 overflow-x-auto text-xs leading-relaxed text-left">
        {activeTab === "setup" && (
          <pre><code>{config || "# No setup libraries required."}</code></pre>
        )}
        {activeTab === "logic" && (
          <pre><code>{logic}</code></pre>
        )}
        {activeTab === "output" && (
          <pre className="text-green-400"><code>{output}</code></pre>
        )}
      </div>
    </div>
  );
}

// --- COMPONENT 2: Interactive Progress Checklist ---
interface InteractiveChecklistProps {
  items: string[];
}

export function InteractiveChecklist({ items }: InteractiveChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const total = items.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="my-6 border border-border/60 bg-card rounded-xl p-5 shadow-sm space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-border/40 pb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Action Checklist</span>
        <span className="text-xs font-bold text-primary">
          {completed} of {total} completed ({pct}%)
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>

      <div className="space-y-3">
        {items.map((item, idx) => {
          const cleanText = item.replace(/^\d+\.\s*(Step\s*\d+\s*\(Action\):\s*)?/i, "");
          const isDone = !!checkedItems[idx];
          return (
            <label key={idx} className="flex items-start gap-3 cursor-pointer select-none group text-xs sm:text-sm">
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggleItem(idx)}
                className="mt-0.5 h-4 w-4 rounded border-border/80 text-primary focus:ring-primary/20 accent-primary cursor-pointer"
              />
              <span
                className={`leading-normal transition-all duration-200 ${isDone ? "text-muted-foreground line-through" : "text-foreground group-hover:text-primary"}`}
              >
                {cleanText}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// --- MAIN BODY COMPONENT ---
interface ArticleBodyProps {
  htmlContent: string;
  category: string;
}

export default function ArticleBody({ htmlContent, category }: ArticleBodyProps) {
  const sanitized = sanitizeHTML(htmlContent);

  // 1. Click-to-Enlarge Lightbox Setup
  useEffect(() => {
    const articleBody = document.querySelector(".article-body");
    if (!articleBody) return;

    let lightbox: HTMLDivElement | null = null;

    const openLightbox = (src: string, alt: string) => {
      if (lightbox) return;

      lightbox = document.createElement("div");
      lightbox.className = "article-image-lightbox";
      lightbox.setAttribute("role", "dialog");
      lightbox.setAttribute("aria-modal", "true");
      lightbox.setAttribute("aria-label", `Image: ${alt}`);

      const closeBtn = document.createElement("button");
      closeBtn.className = "article-image-lightbox-close";
      closeBtn.innerHTML = "&#x2715;";
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

  // Split by <div class="geo-code">...</div> blocks first to support optional TabbedCodePanels
  const parts = sanitized.split(/(<div\s+class=["']geo-code["']\s*>[\s\S]*?<\/div>)/g);

  // Recursive renderer — handles Mermaid diagrams and checklists
  const renderHTMLBlock = (html: string, baseIndex: number): React.ReactNode => {
    // 1. Mermaid diagram parser — detects <div class="geo-mermaid">...</div>
    const hasMermaid =
      html.includes('class="geo-mermaid"') || html.includes("class='geo-mermaid'");

    if (hasMermaid) {
      const mermaidSubparts = html.split(/<div\s+class=["']geo-mermaid["']\s*>[\s\S]*?<\/div>/gi);
      const mermaidMatches: string[] = [];
      let m;
      const mermaidRxClone = /<div\s+class=["']geo-mermaid["']\s*>([\s\S]*?)<\/div>/gi;
      while ((m = mermaidRxClone.exec(html)) !== null) {
        const decoded = m[1]
          .replace(/&amp;/g, "&")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
        mermaidMatches.push(decoded.trim());
      }

      return (
        <React.Fragment key={baseIndex}>
          {mermaidSubparts.map((subpart, subIdx) => {
            const chartDef = mermaidMatches[subIdx];
            return (
              <React.Fragment key={`${baseIndex}-m-${subIdx}`}>
                {subpart && renderHTMLBlock(subpart, baseIndex + 100 + subIdx)}
                {chartDef && (
                  <MermaidChart chart={chartDef} category={category} />
                )}
              </React.Fragment>
            );
          })}
        </React.Fragment>
      );
    }

    // 2. Checklist Parser — detects "1. Step 1 (Action): ..." patterns
    const stepPattern =
      /<p>\s*(1\.\s*(?:Step\s*1\s*\(Action\):\s*)?[\s\S]*?)<\/p>\s*<p>\s*(2\.\s*(?:Step\s*2\s*\(Action\):\s*)?[\s\S]*?)<\/p>\s*<p>\s*(3\.\s*(?:Step\s*3\s*\(Action\):\s*)?[\s\S]*?)<\/p>/gi;
    const match = stepPattern.exec(html);

    if (match) {
      const items: string[] = [match[1].trim(), match[2].trim(), match[3].trim()];
      const checklistHTML = match[0];
      const subparts = html.split(checklistHTML);

      return (
        <React.Fragment key={baseIndex}>
          {subparts[0] && renderHTMLBlock(subparts[0], baseIndex + 1)}
          {items.length > 0 && <InteractiveChecklist items={items} />}
          {subparts[1] && renderHTMLBlock(subparts[1], baseIndex + 2)}
        </React.Fragment>
      );
    }

    // 3. Fallback: render sanitized HTML
    return (
      <div
        key={baseIndex}
        className="article-text-section"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  };

  return (
    <div className="article-body">
      {parts.map((part, index) => {
        const isGeoCode =
          (part.startsWith('<div class="geo-code">') || part.startsWith("<div class='geo-code'>")) &&
          part.endsWith("</div>");

        if (isGeoCode) {
          // Extract the code content inside <pre><code> block if present
          const codeMatch = part.match(/<pre><code>([\s\S]*?)<\/code><\/pre>/i);
          const codeContent = codeMatch ? codeMatch[1] : part.replace(/<[^>]+>/g, "");
          return <TabbedCodePanel key={index} code={codeContent} />;
        }

        return renderHTMLBlock(part, index * 1000);
      })}
    </div>
  );
}
