import { NextResponse } from "next/server";
import { client } from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return new NextResponse("Forbidden", { status: 403 });
}
