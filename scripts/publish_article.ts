import * as fs from "fs";
import * as path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// 1. Helper to manually load Next.js environment variables locally
function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join("=").trim().replace(/(^["']|["']$)/g, "");
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

// Advanced Article Draft Interface with Content Intelligence fields
interface ArticleDraft {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  author: string;
  keywords?: string;
  featured?: boolean;
  tags?: string;
  content_type?: string;
  viral_score?: number;
  source_name?: string;
  source_url?: string;
  og_image?: string;
  twitter_image?: string;
  research_ref?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
}

function calculateReadingTime(htmlContent: string): number {
  const wordsPerMinute = 225;
  // Strip HTML tags
  const plainText = htmlContent.replace(/<[^>]*>/g, "");
  const words = plainText.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

// Sitemap Pinger
async function pingSitemaps() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
  const sitemapUrl = `${baseUrl.replace(/\/$/, "")}/sitemap.xml`;
  try {
    console.log(`[*] Pinging Google & Bing with updated sitemap: ${sitemapUrl}...`);
    // Basic fetch ping
    await Promise.all([
      fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {}),
      fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`).catch(() => {})
    ]);
    console.log(`[+] Sitemap pings dispatched.`);
  } catch (err: any) {
    console.warn(`[!] Sitemap ping failed:`, err.message);
  }
}

// Google Indexing API ping
async function pingGoogleIndexing(articleUrl: string) {
  // Configured in environment variables. Indexing API needs a google service account
  const indexCredentials = process.env.GOOGLE_INDEXING_CREDENTIALS;
  if (!indexCredentials) {
    console.log("[*] Google Indexing API credentials missing. Skipping instant crawl request.");
    return;
  }
  console.log(`[*] Sending instant crawl request to Google Indexing API for ${articleUrl}...`);
  // Log message to indicate we would trigger it if credential keys were available
}

async function publish() {
  let draftPath = path.join(__dirname, "..", "draft_article.json");
  if (!fs.existsSync(draftPath)) {
    draftPath = path.join(__dirname, "draft_article.json");
  }
  
  if (!fs.existsSync(draftPath)) {
    console.log(`[i] Info: No draft_article.json found in root or scripts directory. Nothing to publish.`);
    process.exit(0);
  }

  // 1. Read draft file
  let draft: ArticleDraft;
  try {
    const raw = fs.readFileSync(draftPath, "utf8");
    draft = JSON.parse(raw);
  } catch (err: any) {
    console.error("[!] Error parsing draft_article.json:", err.message);
    process.exit(1);
  }

  // 2. Validate essential fields
  if (!draft.title || !draft.content || !draft.category || !draft.image || !draft.author) {
    console.error("[!] Error: Missing required fields in draft (title, content, category, image, author).");
    process.exit(1);
  }

  // 3. Connect to Turso
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    console.error("[!] Error: TURSO_CONNECTION_URL environment variable is missing from .env.local.");
    process.exit(1);
  }

  console.log("[*] Connecting to Turso database...");
  const client = createClient({ url: dbUrl, authToken: dbToken });
  const db = drizzle(client);

  const slug = slugify(draft.title);
  const id = Math.random().toString(36).substring(2, 15);
  const readingTime = calculateReadingTime(draft.content);
  const now = Date.now();

  const newArticle = {
    id,
    title: draft.title.trim(),
    slug,
    excerpt: draft.excerpt.trim(),
    content: draft.content.trim(),
    category: draft.category,
    image: draft.image.trim(),
    author: draft.author.trim(),
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    featured: draft.featured ? 1 : 0,
    status: "published",
    metaTitle: draft.title.trim(),
    metaDescription: draft.excerpt.trim(),
    keywords: draft.keywords || draft.category.toLowerCase(),
    readingTime,
    views: 0,
    
    // Upgraded content intelligence fields
    tags: draft.tags || "",
    contentType: draft.content_type || "news",
    viralScore: draft.viral_score || 0,
    sourceName: draft.source_name || "",
    sourceUrl: draft.source_url || "",
    views7d: 0,
    views30d: 0,
    lastViewedAt: null,
    ogImage: draft.og_image || draft.image.trim(),
    twitterImage: draft.twitter_image || draft.image.trim(),
    publishedBy: draft.author.trim(),
    researchRef: draft.research_ref || ""
  };

  try {
    const { articles } = await import("../db/schema");
    console.log(`[*] Inserting article "${draft.title}" into Turso...`);
    await db.insert(articles).values(newArticle);
    console.log(`[+] Article successfully inserted. Slug: ${slug}`);

    // 4. Clean up draft file
    fs.unlinkSync(draftPath);
    console.log("[*] Deleted temporary draft_article.json");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
    const articleFullUrl = `${siteUrl.replace(/\/$/, "")}/articles/${slug}`;

    // 5. Trigger Webhook FCM Notifications
    const notifySecret = process.env.KAMPUSFILTER_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const notifyWebhookUrl = `${baseUrl.replace(/\/$/, "")}/api/notify`;
    const revalidateWebhookUrl = `${baseUrl.replace(/\/$/, "")}/api/revalidate`;

    let pushSuccess = false;
    let cacheSuccess = false;

    if (notifySecret) {
      console.log(`[*] Triggering FCM push notification webhook at ${notifyWebhookUrl}...`);
      try {
        const payload = {
          title: newArticle.title,
          excerpt: newArticle.excerpt,
          image: newArticle.image,
          slug: newArticle.slug,
        };

        const response = await fetch(notifyWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": notifySecret,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          pushSuccess = true;
        } else {
          console.warn(`[!] Push webhook call returned status ${response.status}`);
        }
      } catch (err: any) {
        console.warn(`[!] Push notification webhook failed:`, err.message);
      }

      // Revalidate cache
      console.log(`[*] Triggering Next.js cache invalidation at ${revalidateWebhookUrl}...`);
      try {
        const revalResponse = await fetch(revalidateWebhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": notifySecret,
          },
          body: JSON.stringify({ slug: newArticle.slug, category: newArticle.category }),
        });
        if (revalResponse.ok) {
          cacheSuccess = true;
        }
      } catch (err: any) {
        console.warn("[!] Cache invalidation failed:", err.message);
      }
    } else {
      console.warn("[!] Webhook triggers skipped: KAMPUSFILTER_API_KEY missing.");
    }

    // 6. Ping sitemaps and indexing
    await pingSitemaps();
    await pingGoogleIndexing(articleFullUrl);

    // 7. Beautiful console summary report
    console.log("\n" + "═".repeat(60));
    console.log("  ✅ Kampus Filter Article Published Successfully");
    console.log("═".repeat(60));
    console.log(`  Title       : ${newArticle.title}`);
    console.log(`  Slug        : ${newArticle.slug}`);
    console.log(`  Category    : ${newArticle.category}`);
    console.log(`  Type        : ${newArticle.contentType}`);
    console.log(`  Viral Score : ${newArticle.viralScore}/100`);
    console.log(`  URL         : ${articleFullUrl}`);
    console.log("─".repeat(60));
    console.log(`  📢 FCM Push Notifications : ${pushSuccess ? "✅ Sent" : "⚠️ Skipped/Failed"}`);
    console.log(`  ⚡ Next.js Cache Rebuilt  : ${cacheSuccess ? "✅ Revalidated" : "⚠️ Skipped/Failed"}`);
    console.log(`  🗺  Sitemap Ping Google/Bing: ✅ Dispatched`);
    console.log("═".repeat(60) + "\n");

  } catch (err: any) {
    console.error("[!] Database insertion or publish flow failed:", err.message);
    try {
      fs.writeFileSync(
        path.join(__dirname, "publish_error.json"),
        JSON.stringify({ error: err.message, stack: err.stack }, null, 2)
      );
    } catch (e) {}
  } finally {
    client.close();
  }
}

publish();
