import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} - Student Intelligence`,
    short_name: siteConfig.name,
    description: siteConfig.tagline,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0c",
    theme_color: "#8b5cf6",
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
}
