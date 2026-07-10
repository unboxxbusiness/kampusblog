import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

let globalLog = "No log received yet";

export async function POST(request: NextRequest) {
  try {
    const { log } = await request.json();
    globalLog = log || "Empty log received";
    // Also try to write to a temp file in the container
    try {
      fs.writeFileSync(path.join(process.cwd(), "container_log.txt"), globalLog, "utf8");
    } catch (e) {}
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    globalLog = "Error parsing POST body: " + err.message;
    return NextResponse.json({ ok: false, error: err.message });
  }
}

export async function GET(request: NextRequest) {
  // Try to read from file if it exists, otherwise return in-memory log
  const filePath = path.join(process.cwd(), "container_log.txt");
  let fileLog = "";
  if (fs.existsSync(filePath)) {
    try {
      fileLog = fs.readFileSync(filePath, "utf8");
    } catch (e) {}
  }
  return new NextResponse(fileLog || globalLog, {
    headers: { "Content-Type": "text/plain" }
  });
}
