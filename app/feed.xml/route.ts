import { db, articles } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { siteConfig } from "@/config/site";

export async function GET() {
  try {
    // 1. Fetch 20 latest published articles
    const latestArticles = await db
      .select()
      .from(articles)
      .where(eq(articles.status, "published"))
      .orderBy(desc(articles.publishedAt))
      .limit(20);

    const baseUrl = siteConfig.url;

    // 2. Generate XML items
    const itemsXml = latestArticles
      .map((art) => {
        const itemUrl = `${baseUrl}/articles/${art.slug}`;
        const pubDate = new Date(art.publishedAt).toUTCString();
        // Safe string excerpt clean
        const cleanDesc = (art.metaDescription || art.excerpt || "")
          .replace(/<[^>]*>/g, "")
          .trim();

        return `
    <item>
      <title><![CDATA[${art.title}]]></title>
      <link>${itemUrl}</link>
      <guid isPermaLink="true">${itemUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${cleanDesc}]]></description>
      <category><![CDATA[${art.category}]]></category>
    </item>`;
      })
      .join("");

    // 3. Compile full RSS Channel XML
    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig.name} - ${siteConfig.tagline}</title>
    <link>${baseUrl}</link>
    <description>${siteConfig.description}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXml}
  </channel>
</rss>`;

    return new Response(rssXml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=1800, must-revalidate", // cache for 30 mins
      },
    });
  } catch (error: any) {
    console.error("Failed to generate RSS Feed route:", error);
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>RSS Generation Failed</title></channel></rss>`, {
      status: 500,
      headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
  }
}
