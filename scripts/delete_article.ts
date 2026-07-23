import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';

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

async function deleteArticle() {
  const targetSlug = process.argv[2] || "unesco-coursera-launch-free-global-ai-ethics-course";

  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl || !dbToken) {
    console.error("[-] Error: Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN in .env.local");
    process.exit(1);
  }

  const client = createClient({ url: dbUrl, authToken: dbToken });

  console.log(`[*] Target slug to delete: "${targetSlug}"`);

  const checkRes = await client.execute({
    sql: "SELECT id, title, slug FROM articles WHERE slug = ? OR id = ?",
    args: [targetSlug, targetSlug]
  });

  if (checkRes.rows.length === 0) {
    console.log(`[i] Info: No article found matching slug/id "${targetSlug}". Nothing deleted.`);
    client.close();
    return;
  }

  const foundArticle = checkRes.rows[0];
  console.log(`[*] Found article: "${foundArticle.title}" (ID: ${foundArticle.id}, Slug: ${foundArticle.slug})`);

  const deleteRes = await client.execute({
    sql: "DELETE FROM articles WHERE slug = ? OR id = ?",
    args: [foundArticle.slug, foundArticle.id]
  });

  console.log(`[+] SUCCESS! Deleted article "${foundArticle.title}". (Rows affected: ${deleteRes.rowsAffected})`);
  client.close();
}

deleteArticle().catch(err => {
  console.error("[-] Error deleting article:", err);
  process.exit(1);
});
