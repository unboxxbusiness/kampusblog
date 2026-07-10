const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

async function main() {
  try {
    const envPath = path.join(__dirname, '..', '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        env[key] = val;
      }
    });

    const client = createClient({
      url: env.TURSO_CONNECTION_URL,
      authToken: env.TURSO_AUTH_TOKEN
    });

    // Valid Unsplash scholarship/education photo (graduation students)
    const newImageUrl = "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=800&auto=format&fit=crop";
    const targetSlug = "national-scholarship-portal-nsp-2026-top-government-scholarships-for-college-students-how-to-apply";

    const check = await client.execute({
      sql: "SELECT id, title, image FROM articles WHERE slug = ?",
      args: [targetSlug]
    });

    let result = "";
    if (check.rows.length === 0) {
      result = "Article NOT found. Listing all slugs:\n";
      const all = await client.execute("SELECT slug FROM articles ORDER BY id DESC LIMIT 10");
      all.rows.forEach(r => { result += ` - ${r.slug}\n`; });
    } else {
      result += `Found: ${check.rows[0].title}\nOld image: ${check.rows[0].image}\n`;
      await client.execute({
        sql: "UPDATE articles SET image = ? WHERE slug = ?",
        args: [newImageUrl, targetSlug]
      });
      result += `Updated image to: ${newImageUrl}\n`;
    }

    fs.writeFileSync(path.join(__dirname, 'fix_image_result.txt'), result);
    client.close();
  } catch (e) {
    fs.writeFileSync(path.join(__dirname, 'fix_image_result.txt'), "ERROR: " + e.message + "\n" + e.stack);
  }
}

main();
