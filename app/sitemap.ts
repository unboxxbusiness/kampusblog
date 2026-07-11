import { MetadataRoute } from "next";
import { db, articles } from "@/lib/db";
import { eq } from "drizzle-orm";
import { siteConfig } from "@/config/site";

// Helper to prevent database queries from hanging the production build process
function withTimeout<T>(promise: Promise<T>, timeoutMs = 5000, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs))
  ]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // 1. Fetch all published articles from Turso
  let articleUrls: { url: string; lastModified: Date; changeFrequency: "daily" | "weekly" | "monthly"; priority: number }[] = [];
  try {
    const dbArticles = await withTimeout(
      db
        .select({ slug: articles.slug, updatedAt: articles.updatedAt })
        .from(articles)
        .where(eq(articles.status, "published")),
      5000,
      []
    );

    articleUrls = dbArticles.map((art) => ({
      url: `${baseUrl}/articles/${art.slug}`,
      lastModified: new Date(art.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap generation error while fetching articles:", error);
  }

  // 2. Fetch active categories and generate category URLs dynamically
  let activeCategoryPaths: string[] = [];
  try {
    const list = await withTimeout(
      db
        .select({ category: articles.category })
        .from(articles)
        .where(eq(articles.status, "published")),
      5000,
      []
    );

    const categoriesSet = new Set<string>();
    list.forEach((item) => {
      if (item.category) {
        categoriesSet.add(item.category.trim());
      }
    });

    Array.from(categoriesSet).forEach((cat) => {
      // Find URLs mapping to this category in siteConfig.categoryMapping
      const matchingSlugs = Object.entries(siteConfig.categoryMapping)
        .filter(([_, dbCat]) => dbCat === cat)
        .map(([slug]) => `/${slug}`);

      if (matchingSlugs.length > 0) {
        matchingSlugs.forEach((s) => activeCategoryPaths.push(s));
      } else {
        activeCategoryPaths.push(`/${cat.toLowerCase().replace(/\s+/g, "-")}`);
      }
    });
  } catch (error) {
    console.error("Sitemap generation error while fetching active categories:", error);
  }

  // 3. Define general static base paths
  const baseStaticPaths = [
    "",
    "/about",
    "/contact",
    "/privacy-policy",
    "/terms",
    "/disclaimer",
    "/editorial-policy",
    "/cookie-policy",
    "/education-news",
    "/scholarships",
  ];

  const allStaticPaths = [...new Set([...baseStaticPaths, ...activeCategoryPaths])];

  const staticUrls = allStaticPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1.0 : 0.6,
  }));

  return [...staticUrls, ...articleUrls];
}
