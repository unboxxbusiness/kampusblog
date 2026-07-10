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

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

const client = createClient({ url: dbUrl, authToken: dbToken });

async function verify() {
  const slug = "ugc-online-degree-equivalence-guidelines-2026-what-students-must-know";
  const logPath = path.join(__dirname, '..', 'verification_output.txt');
  
  try {
    const result = await client.execute({
      sql: "SELECT slug, title, category FROM articles WHERE slug = ?",
      args: [slug]
    });
    
    if (result.rows && result.rows.length > 0) {
      const row = result.rows[0];
      fs.writeFileSync(logPath, `SUCCESS: Found article!\nSlug: ${row.slug}\nTitle: ${row.title}\nCategory: ${row.category}`, 'utf8');
    } else {
      // Print the top 3 articles to see what is there
      const list = await client.execute("SELECT slug, title FROM articles ORDER BY published_at DESC LIMIT 3");
      let listText = "";
      list.rows.forEach(r => listText += `  - ${r.slug} (${r.title})\n`);
      fs.writeFileSync(logPath, `FAILED: Article not found. Recent articles:\n${listText}`, 'utf8');
    }
  } catch (err) {
    fs.writeFileSync(logPath, `ERROR: ${err.message}\n${err.stack}`, 'utf8');
  } finally {
    client.close();
  }
}

verify();
