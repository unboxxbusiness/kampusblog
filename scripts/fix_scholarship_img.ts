import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

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

// Load .env.local
loadEnv();

const dbUrl = process.env.TURSO_CONNECTION_URL!;
const dbToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url: dbUrl, authToken: dbToken });

async function main() {
  // New valid working Unsplash education photo
  const newImage = "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?q=80&w=800&auto=format&fit=crop";
  const slug = "national-scholarship-portal-nsp-2026-top-government-scholarships-for-college-students-how-to-apply";

  console.log("[*] Connecting to Turso...");

  // First see all recent articles
  const list = await client.execute("SELECT slug, image FROM articles ORDER BY published_at DESC LIMIT 5");
  console.log("[*] Recent articles:");
  list.rows.forEach(r => console.log(`  slug: ${r.slug}  |  image: ${r.image}`));

  // Update the target article
  const result = await client.execute({
    sql: "UPDATE articles SET image = ? WHERE slug = ?",
    args: [newImage, slug]
  });
  console.log(`[+] Update complete. Rows affected: ${result.rowsAffected}`);
  console.log(`[+] New image: ${newImage}`);

  client.close();
}

main().catch(e => {
  console.error("[!] ERROR:", e.message);
  client.close();
  process.exit(1);
});
