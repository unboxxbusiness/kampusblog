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

async function check() {
  if (!dbUrl) throw new Error("No TURSO_CONNECTION_URL");
  const client = createClient({ url: dbUrl, authToken: dbToken });
  const res = await client.execute("SELECT category, COUNT(*) as cnt FROM articles GROUP BY category");
  console.log("=== DB ARTICLES BY CATEGORY ===");
  res.rows.forEach(r => console.log(`${r.category}: ${r.cnt}`));
  client.close();
}

check().catch(console.error);
