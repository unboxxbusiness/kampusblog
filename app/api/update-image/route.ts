import { NextResponse } from "next/server";
import { db, articles } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const image = searchParams.get("image");
  const key = searchParams.get("key");

  if (key !== process.env.KAMPUSFILTER_API_KEY) {
    return new NextResponse("Forbidden", { status: 403 });
  }
  if (!slug || !image) {
    return NextResponse.json({ error: "slug and image params required" }, { status: 400 });
  }

  await db.update(articles).set({ image }).where(eq(articles.slug, slug));
  return NextResponse.json({ ok: true, slug, image });
}
