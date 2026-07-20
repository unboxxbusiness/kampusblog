const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

function loadEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const parts = trimmed.split('=');
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

async function check() {
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;
  const client = createClient({ url: dbUrl, authToken: dbToken });

  const slug = "unesco-coursera-launch-free-global-ai-ethics-course";
  const res = await client.execute({
    sql: "SELECT title, content FROM articles WHERE slug = ?",
    args: [slug]
  });

  if (res.rows.length === 0) {
    console.log("ARTICLE NOT FOUND IN DB!");
  } else {
    const content = res.rows[0].content;
    console.log("=== DB CONTENT CHECK ===");
    console.log("Length:", content.length);
    console.log("Has geo-mermaid?", content.includes("geo-mermaid"));
    console.log("Has geo-dates-table?", content.includes("geo-dates-table"));
    console.log("Content Snippet:\n", content);
  }
  client.close();
}

check();
