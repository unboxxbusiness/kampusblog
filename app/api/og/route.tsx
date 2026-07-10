import { ImageResponse } from "next/og";
import { db, articles } from "@/lib/db";
import { eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return new Response("Missing slug parameter", { status: 400 });
    }

    // Query database for article title, category, and metadata
    const article = await db
      .select({
        title: articles.title,
        category: articles.category,
        metadata: articles.metadata,
      })
      .from(articles)
      .where(eq(articles.slug, slug))
      .get();

    if (!article) {
      return new Response("Article not found", { status: 404 });
    }

    // Parse metadata
    let metadata: Record<string, string> = {};
    if (article.metadata) {
      try {
        metadata = JSON.parse(article.metadata);
      } catch (e) {
        console.error("Failed to parse metadata in OG generator", e);
      }
    }

    // Category styling mapping
    const themes: Record<string, { bg: string; text: string; label: string; items: string[] }> = {
      Scholarships: {
        bg: "rgb(16, 185, 129)", // emerald 500
        text: "text-emerald-400",
        label: "SCHOLARSHIP VERIFIED BRIEFING",
        items: ["sponsor", "amount", "deadline", "eligibility"]
      },
      Admissions: {
        bg: "rgb(99, 102, 241)", // indigo 500
        text: "text-indigo-400",
        label: "UNIVERSITY ADMISSIONS BRIEFING",
        items: ["university", "status", "deadline", "exams"]
      },
      Internships: {
        bg: "rgb(6, 182, 212)", // cyan 500
        text: "text-cyan-400",
        label: "STUDENT INTERNSHIP ALERT",
        items: ["company", "stipend", "duration", "location"]
      },
      "Career Signals": {
        bg: "rgb(249, 115, 22)", // orange 500
        text: "text-orange-400",
        label: "CAREER MARKET INTELLIGENCE",
        items: ["career", "salary", "skills", "demand"]
      },
      "Education News": {
        bg: "rgb(59, 130, 246)", // blue 500
        text: "text-blue-400",
        label: "CRITICAL EDUCATION NEWS",
        items: ["source", "news_category", "impact", "target"]
      }
    };

    const theme = themes[article.category] || {
      bg: "rgb(100, 116, 139)",
      text: "text-slate-400",
      label: "KAMPUS FILTER INTELLIGENCE BRIEFING",
      items: ["status", "category", "impact"]
    };

    // Label names mapping for display in the grid
    const labelNames: Record<string, string> = {
      sponsor: "SPONSOR / COMPANY",
      amount: "SCHOLARSHIP AMOUNT",
      deadline: "APPLICATION DEADLINE",
      eligibility: "ACADEMIC ELIGIBILITY",
      mode: "APPLICATION MODE",
      university: "UNIVERSITY",
      status: "ADMISSION STATUS",
      fee: "APPLICATION FEE",
      exams: "ACCEPTED EXAMS",
      company: "HIRING COMPANY",
      stipend: "STIPEND (MONTHLY)",
      duration: "DURATION",
      location: "WORK LOCATION",
      career: "TRENDING CAREER",
      salary: "AVERAGE SALARY",
      skills: "PREREQUISITE SKILLS",
      demand: "FUTURE OUTLOOK",
      source: "OFFICIAL SOURCE",
      news_category: "NEWS CATEGORY",
      impact: "IMPACT SEVERITY",
      target: "TARGET AUDIENCE"
    };

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#030712", // slate 950
            padding: "50px 60px",
            fontFamily: "sans-serif",
            position: "relative",
            justifyContent: "space-between"
          }}
        >
          {/* Subtle Dynamic Ambient Background Glow */}
          <div
            style={{
              position: "absolute",
              top: "-150px",
              left: "-150px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.bg.replace(")", ", 0.15)")} 0%, rgba(3,7,18,0) 70%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-150px",
              right: "-150px",
              width: "500px",
              height: "500px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${theme.bg.replace(")", ", 0.12)")} 0%, rgba(3,7,18,0) 70%)`,
            }}
          />

          {/* Header row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* Brand Logo Text */}
              <span style={{ fontSize: "22px", fontWeight: "bold", color: "#ffffff", letterSpacing: "-0.5px" }}>
                Kampus<span style={{ color: theme.bg }}>Filter</span>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                backgroundColor: theme.bg.replace(")", ", 0.1)"),
                border: `1px solid ${theme.bg.replace(")", ", 0.2)")}`,
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#ffffff",
                letterSpacing: "1px",
              }}
            >
              {theme.label}
            </div>
          </div>

          {/* Title and Excerpt */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "20px" }}>
            <div
              style={{
                fontSize: "38px",
                fontWeight: "800",
                color: "#ffffff",
                lineHeight: "1.25",
                maxHeight: "150px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                letterSpacing: "-1px"
              }}
            >
              {article.title}
            </div>
            <div style={{ fontSize: "16px", color: "#9ca3af" }}>
              Verified intelligence briefing and application steps compiled inside.
            </div>
          </div>

          {/* Metadata Grid */}
          <div
            style={{
              display: "flex",
              width: "100%",
              gap: "20px",
              marginTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              paddingTop: "24px",
            }}
          >
            {theme.items.map((key, idx) => {
              const val = metadata[key] || "N/A";
              const label = labelNames[key] || key.toUpperCase();
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: "1",
                    backgroundColor: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "16px",
                    gap: "4px"
                  }}
                >
                  <span style={{ fontSize: "10px", fontWeight: "bold", color: "#9ca3af", letterSpacing: "0.5px" }}>
                    {label}
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: "bold",
                      color: "#ffffff",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {val}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    return new Response(`Failed to generate OG Image: ${error.message}`, { status: 500 });
  }
}
