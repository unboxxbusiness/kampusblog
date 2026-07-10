import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") || "education";
  const variation = searchParams.get("variation") || "01";

  // Sanitize input to prevent directory traversal
  const cleanFolder = folder.replace(/[^a-zA-Z0-9_\-]/g, "");
  const cleanVariation = variation.replace(/[^a-zA-Z0-9_\-]/g, "");

  const filePath = path.join(process.cwd(), "public", "illustrations", cleanFolder, `${cleanFolder}-${cleanVariation}.svg`);
  const fallbackPath = path.join(process.cwd(), "public", "illustrations", "education", "education-01.svg");

  let svgContent: string;
  let status = 200;

  try {
    if (fs.existsSync(filePath)) {
      svgContent = fs.readFileSync(filePath, "utf8");
    } else if (fs.existsSync(fallbackPath)) {
      svgContent = fs.readFileSync(fallbackPath, "utf8");
    } else {
      svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50">SVG Not Found</text></svg>`;
      status = 404;
    }
  } catch (err) {
    svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="50">Error Loading SVG</text></svg>`;
    status = 500;
  }

  return new NextResponse(svgContent, {
    status,
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
