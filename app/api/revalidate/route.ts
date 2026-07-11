import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  const secret = process.env.KAMPUSFILTER_API_KEY;

  if (!secret || apiKey !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { slug, category } = await req.json();

    // Revalidate home page
    revalidatePath("/");

    // Revalidate category page if provided
    if (category) {
      const categorySlug = category.toLowerCase().replace(/\s+/g, "-");
      revalidatePath(`/${categorySlug}`);
    }

    // Revalidate specific article page if provided
    if (slug) {
      revalidatePath(`/articles/${slug}`);
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: any) {
    console.error("Cache revalidation error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
