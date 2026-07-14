import { NextRequest, NextResponse } from "next/server";
import { db, articles } from "@/lib/db";
import { eq, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    // 1. Fetch matching articles from Turso using Drizzle
    const matches = await db
      .select({
        id: articles.id,
        slug: articles.slug,
        title: articles.title,
        content: articles.content,
      })
      .from(articles)
      .where(like(articles.slug, "%neet-ug%"));

    if (matches.length === 0) {
      return NextResponse.json({ msg: "No NEET UG articles found in database." });
    }

    const results = [];
    const brokenText = "D -->|No (No Bio/Physics/Chem)| Reject";
    const fixedText = "D -->|No Bio or Physics or Chem| Reject";

    for (const article of matches) {
      if (article.content.includes(brokenText)) {
        const updatedContent = article.content.replace(brokenText, fixedText);

        // 2. Perform database UPDATE
        await db
          .update(articles)
          .set({ content: updatedContent })
          .where(eq(articles.id, article.id));

        // 3. Clear cache
        try {
          revalidatePath(`/articles/${article.slug}`);
          revalidatePath("/");
        } catch (e) {}

        results.push({
          slug: article.slug,
          status: "Fixed",
        });
      } else {
        results.push({
          slug: article.slug,
          status: "Already clean / No change needed",
        });
      }
    }

    return NextResponse.json({
      success: true,
      msg: "Database repair finished successfully!",
      results,
    });
  } catch (err: any) {
    console.error("Temp repair exception:", err);
    return NextResponse.json({ error: "Internal Server Error", details: err.message }, { status: 500 });
  }
}
