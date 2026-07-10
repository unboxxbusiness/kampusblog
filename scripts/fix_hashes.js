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

async function main() {
  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    console.error('Connection URL is missing');
    process.exit(1);
  }

  const client = createClient({ url: dbUrl, authToken: dbToken });
  try {
    const slug = 'isro-ursc-research-internship-2026-complete-guide-eligibility';
    const result = await client.execute({
      sql: 'SELECT id, content FROM articles WHERE slug = ?',
      args: [slug]
    });

    if (result.rows.length === 0) {
      console.log('Article not found.');
      process.exit(0);
    }

    let content = result.rows[0].content;
    
    // Clean up literal markdown header symbols inside HTML tags
    content = content.replace(/<h2>## /g, '<h2>');
    content = content.replace(/<h3>### /g, '<h3>');

    await client.execute({
      sql: 'UPDATE articles SET content = ? WHERE slug = ?',
      args: [content, slug]
    });

    console.log('Successfully cleaned up heading hashes in database!');
  } catch (err) {
    console.error('Error updating database:', err.message);
  } finally {
    client.close();
  }
}

main();
