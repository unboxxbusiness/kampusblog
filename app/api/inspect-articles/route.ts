import { NextResponse } from "next/server";
import { client } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const slug = "isro-ursc-research-internship-2026-complete-guide-eligibility";
  
  try {
    const selectResult = await client.execute({
      sql: "SELECT id, content FROM articles WHERE slug = ?",
      args: [slug]
    });

    if (selectResult.rows.length === 0) {
      return NextResponse.json({ error: "Article not found in database" }, { status: 404 });
    }

    let content = selectResult.rows[0].content as string;
    
    // Perform string replacements to clean up literal hashes
    const originalContent = content;
    content = content.replace(/## /g, ""); // Remove double hashes followed by space
    content = content.replace(/### /g, ""); // Remove triple hashes followed by space

    const changed = originalContent !== content;

    if (changed) {
      await client.execute({
        sql: "UPDATE articles SET content = ? WHERE slug = ?",
        args: [content, slug]
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database cleanup completed successfully",
      changed,
      updatedContent: content.substring(0, 500)
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
