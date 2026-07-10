import { NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.KAMPUSFILTER_API_KEY) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return new Promise<NextResponse>((resolve) => {
    exec("pnpm build", { cwd: process.cwd() }, (error, stdout, stderr) => {
      resolve(
        NextResponse.json({
          ok: !error,
          error: error ? error.message : null,
          stdout,
          stderr
        })
      );
    });
  });
}
