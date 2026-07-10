const fs = require("fs");
const path = require("path");
const { createClient } = require("@libsql/client");

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

if (!dbUrl) {
  console.error("[!] Error: TURSO_CONNECTION_URL missing from .env.local");
  process.exit(1);
}

const client = createClient({ url: dbUrl, authToken: dbToken });

async function cleanDatabase() {
  console.log("[*] Connecting to Turso database...");
  try {
    const allowedCategories = [
      "University Admissions",
      "Scholarships",
      "Internships",
      "Student Opportunities",
      "Education News",
      "Career Signals",
      "Future Skills"
    ];
    
    // Query all articles first
    const res = await client.execute("SELECT id, title, category FROM articles");
    const toDelete = [];
    
    res.rows.forEach(row => {
      const category = row.category;
      if (!allowedCategories.includes(category)) {
        toDelete.push({ id: row.id, title: row.title, category });
      }
    });
    
    if (toDelete.length === 0) {
      console.log("[+] No legacy articles found. Database is already clean!");
      return;
    }
    
    console.log(`[*] Found ${toDelete.length} legacy articles to delete.`);
    for (const article of toDelete) {
      console.log(`[-] Deleting: "${article.title}" (Category: ${article.category})`);
      await client.execute({
        sql: "DELETE FROM articles WHERE id = ?",
        args: [article.id]
      });
    }
    console.log("[+] Legacy articles successfully deleted!");
  } catch (err) {
    console.error("[!] Database cleaning failed:", err.message);
  } finally {
    client.close();
  }
}

cleanDatabase();
