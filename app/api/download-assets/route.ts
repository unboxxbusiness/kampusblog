import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import https from "https";

const assets = [
  // Normal mapping matching filenames to cloudinary roles
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769401433/logo_Kampus_Filter_gync6j.webp',
    dest: 'public/logo-light.webp'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769402686/Logo_voqhtq.png',
    dest: 'public/logo-dark.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/favicon.ico'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/icon-192.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/icon-512.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/icon-maskable.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'app/favicon.ico'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'app/icon.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'app/apple-icon.png'
  }
];

function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: HTTP Status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (key !== process.env.KAMPUSFILTER_API_KEY) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const rootDir = process.cwd();
  const results: string[] = [];

  for (const asset of assets) {
    const fullDest = path.join(rootDir, asset.dest);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    try {
      await download(asset.url, fullDest);
      results.push(`Success: ${asset.dest}`);
    } catch (e: any) {
      results.push(`Failed ${asset.dest}: ${e.message}`);
    }
  }

  return NextResponse.json({ ok: true, results });
}
