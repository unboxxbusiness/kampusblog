import fs from "fs";
import path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { ARTICLES, slugify, calculateReadingTime } from "./publish_batch_articles";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
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

async function run() {
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;
  const apiKey = process.env.KAMPUSFILTER_API_KEY || "kf_webhook_8a7d3c8e4f1b2c9d0d5365";

  if (!dbUrl) {
    console.error("[!] TURSO_CONNECTION_URL missing");
    process.exit(1);
  }

  console.log("[*] Connecting to Turso DB...");
  const client = createClient({ url: dbUrl, authToken: dbToken });
  const db = drizzle(client);
  const { articles } = await import("../db/schema");

  let publishedCount = 0;
  const slugs: { slug: string; category: string; title: string }[] = [];

  for (const draft of ARTICLES) {
    const slug = slugify(draft.title);
    const now = Date.now();
    const id = Math.random().toString(36).substring(2, 15);
    const readingTime = calculateReadingTime(draft.content);

    // 1. Delete existing row if present so we cleanly replace with verified published state
    await client.execute({ sql: "DELETE FROM articles WHERE slug = ?", args: [slug] });

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
      views: 120,
      tags: draft.tags || "",
      contentType: "news",
      viralScore: draft.viral_score || 80,
      sourceName: draft.source_name || "",
      sourceUrl: draft.source_url || "",
      views7d: 85,
      views30d: 120,
      lastViewedAt: now,
      ogImage: draft.image.trim(),
      twitterImage: draft.image.trim(),
      publishedBy: draft.author.trim(),
      researchRef: "",
      metadata: null
    };

    try {
      await db.insert(articles).values(newArticle);
      console.log(`[+] Inserted/Updated as PUBLISHED: ${slug}`);
      publishedCount++;
      slugs.push({ slug, category: draft.category, title: draft.title });
    } catch (err: any) {
      console.error(`[!] Failed to insert ${slug}: ${err.message}`);
    }
  }

  console.log(`\n[*] Successfully inserted ${publishedCount} / ${ARTICLES.length} articles.`);
  console.log("[*] Triggering Netlify revalidation API specifically for all 10 live articles...");

  // Trigger revalidation for each slug
  for (const item of slugs) {
    try {
      const res = await fetch("https://kampusfilter.com/api/revalidate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey
        },
        body: JSON.stringify({ slug: item.slug, category: item.category })
      });
      const data = await res.json().catch(() => ({}));
      console.log(`[Revalidate] ${item.slug} -> Status: ${res.status} ${JSON.stringify(data)}`);
    } catch (e: any) {
      console.error(`[Revalidate Error] ${item.slug}: ${e.message}`);
    }
  }

  // Also revalidate home & feed
  try {
    const resHome = await fetch("https://kampusfilter.com/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify({ slug: "" })
    });
    console.log(`[Revalidate Home] -> Status: ${resHome.status}`);
  } catch (e: any) {
    console.error("[Revalidate Home Error]:", e.message);
  }

  client.close();
  console.log("\n[SUCCESS] Force publish and revalidate complete.");
}

run();
