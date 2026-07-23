import { createClient } from "@libsql/client";
import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
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

loadEnv();

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

async function run() {
  if (!dbUrl) throw new Error("No TURSO_CONNECTION_URL");
  const client = createClient({ url: dbUrl, authToken: dbToken });
  const res = await client.execute("SELECT slug, title, category FROM articles ORDER BY publishedAt DESC LIMIT 20");
  const outPath = path.join(__dirname, "..", "public", "live_urls_export.txt");
  const lines = [`TOTAL: ${res.rows.length}`];
  res.rows.forEach((r, idx) => {
    lines.push(`${idx + 1}. [${r.category}] https://kampusfilter.com/articles/${r.slug}`);
  });
  fs.writeFileSync(outPath, lines.join("\n"), "utf8");
  client.close();
}

run().catch(err => {
  const outPath = path.join(__dirname, "..", "public", "live_urls_export.txt");
  fs.writeFileSync(outPath, "ERR: " + err.message, "utf8");
});
