import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theme = searchParams.get("theme") || "dark";

  const manifest = {
    name: `${siteConfig.name} - Student Intelligence`,
    short_name: siteConfig.name,
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: theme === "light" ? "#ffffff" : "#0a0a0c",
    theme_color: theme === "light" ? "#6d28d9" : "#8b5cf6",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Scholarships",
        short_name: "Scholarships",
        description: "Explore the latest student scholarship opportunities",
        url: "/scholarships",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Internships",
        short_name: "Internships",
        description: "Browse corporate and research internships",
        url: "/internships",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
