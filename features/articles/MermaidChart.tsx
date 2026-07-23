"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Plus, Minus, RotateCcw } from "lucide-react";

interface MermaidChartProps {
  chart: string;
  category?: string;
}

// ── Singleton CDN loader ──────────────────────────────────────────────────────
// Injects mermaid.min.js from the local public directory.
// Bypasses CSP network blocks and Webpack dynamic chunk errors entirely.
let mermaidPromise: Promise<void> | null = null;

function loadMermaid(): Promise<void> {
  if (mermaidPromise) return mermaidPromise;

  mermaidPromise = new Promise<void>((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("SSR"));

    if ((window as any).mermaid?.render) {
      resolve();
      return;
    }

    if (document.querySelector('script[data-mermaid-cdn]')) {
      const poll = setInterval(() => {
        if ((window as any).mermaid?.render) {
          clearInterval(poll);
          resolve();
        }
      }, 50);
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-mermaid-cdn", "true");
    script.src = "/mermaid.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => {
      if (e && typeof (e as any).preventDefault === "function") {
        (e as any).preventDefault();
      }
      reject(new Error("Local static Mermaid script failed to load"));
    };
    document.head.appendChild(script);
  });

  return mermaidPromise;
}

let chartIdCounter = 0;

export default function MermaidChart({ chart, category }: MermaidChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError]     = useState<string | null>(null);
  const [rendered, setRendered] = useState(false);
  const [zoom, setZoom]       = useState(0.4); // Default to 40% view

  const idRef = useRef(
    `mchart-${++chartIdCounter}-${Math.random().toString(36).slice(2, 7)}`
  );

  const zoomIn    = () => setZoom((z) => Math.min(2.5, +(z + 0.15).toFixed(2)));
  const zoomOut   = () => setZoom((z) => Math.max(0.4, +(z - 0.15).toFixed(2)));
  const zoomReset = () => setZoom(0.4);

  useEffect(() => {
    if (!rendered || !containerRef.current) return;
    const svg = containerRef.current.querySelector("svg");
    if (svg) {
      svg.style.width      = `${zoom * 100}%`;
      svg.style.transition = "width 0.2s ease-out";
    }
  }, [zoom, rendered]);

  useEffect(() => {
    if (!chart?.trim() || !containerRef.current) return;
    let cancelled = false;

    async function render() {
      try {
        await loadMermaid();
        const mermaid = (window as any).mermaid;
        if (!mermaid) throw new Error("Mermaid not available");

        const isDark =
          document.documentElement.classList.contains("dark") ||
          document.documentElement.getAttribute("data-theme") === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          fontSize: 13,
          flowchart: {
            curve: "basis",
            padding: 20,
            nodeSpacing: 60,
            rankSpacing: 100,
            htmlLabels: true,
            useMaxWidth: false,
          },
          sequence: { diagramMarginX: 20, diagramMarginY: 10, useMaxWidth: false },
          themeVariables: isDark
            ? {
                primaryColor: "#1e293b",
                primaryTextColor: "#e2e8f0",
                primaryBorderColor: "#334155",
                lineColor: "#64748b",
                secondaryColor: "#0f172a",
                tertiaryColor: "#1e293b",
                edgeLabelBackground: "#1e293b",
                clusterBkg: "#0f172a",
                titleColor: "#94a3b8",
              }
            : {
                primaryColor: "#eff6ff",
                primaryTextColor: "#1e3a5f",
                primaryBorderColor: "#bfdbfe",
                lineColor: "#6b7280",
                secondaryColor: "#f0fdf4",
                tertiaryColor: "#faf5ff",
                edgeLabelBackground: "#f8fafc",
                clusterBkg: "#f1f5f9",
                titleColor: "#64748b",
              },
        });

        // Force TD (vertical layout) by default to prevent overflow
        const normalized = chart
          .trim()
          .replace(/^(flowchart|graph)\s+LR/im, "flowchart TD")
          .replace(/^(flowchart|graph)\s+RL/im, "flowchart TD")
          .replace(/^(flowchart|graph)\s+BT/im, "flowchart TD");

        const { svg } = await mermaid.render(idRef.current, normalized);

        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.width    = `${zoom * 100}%`;
            svgEl.style.height   = "auto";
            svgEl.style.maxWidth = "none";
            svgEl.style.display  = "block";
            svgEl.style.margin   = "0 auto";
            svgEl.removeAttribute("height");
          }
          setRendered(true);
          setError(null);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("[MermaidChart]", err);
          setError(err?.message ?? "Failed to render diagram.");
          mermaidPromise = null;
        }
      }
    }

    render();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart]);

  return (
    <div className="my-6 space-y-3">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Terminal className="h-3.5 w-3.5" />
          Interactive Diagram
        </span>

        <div className="flex items-center gap-3">
          {category && (
            <span className="text-[10px] bg-secondary text-muted-foreground font-semibold px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}

          {/* Zoom controls */}
          <div className="flex items-center border border-border/60 rounded-lg overflow-hidden bg-background shadow-sm h-7">
            <button onClick={zoomOut}
              className="px-2 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-r border-border/60 flex items-center cursor-pointer"
              title="Zoom Out">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] px-2.5 font-mono text-muted-foreground select-none min-w-[44px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button onClick={zoomIn}
              className="px-2 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-l border-border/60 flex items-center cursor-pointer"
              title="Zoom In">
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button onClick={zoomReset}
              className="px-2 h-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors border-l border-border/60 flex items-center cursor-pointer"
              title="Reset Zoom">
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div
        className="w-full border border-border/60 rounded-xl overflow-auto bg-background relative shadow-sm"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div className="p-4 sm:p-8 min-h-[200px] flex items-center justify-center">
          {error ? (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-4 font-mono w-full">
              <p className="font-bold mb-2">Diagram Error: {error}</p>
              <pre className="text-[10px] opacity-60 whitespace-pre-wrap break-all leading-relaxed">
                {chart}
              </pre>
            </div>
          ) : (
            <>
              {!rendered && (
                <div className="flex items-center gap-2 text-muted-foreground text-xs animate-pulse">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Rendering diagram…
                </div>
              )}
              <div
                ref={containerRef}
                className="w-full [&_svg]:mx-auto"
                style={{ display: rendered ? "block" : "none" }}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
