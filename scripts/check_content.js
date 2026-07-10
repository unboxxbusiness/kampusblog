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
    fs.writeFileSync(path.join(__dirname, '..', 'db_content.txt'), 'Error: Connection URL is missing', 'utf8');
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
      fs.writeFileSync(path.join(__dirname, '..', 'db_content.txt'), 'Article not found', 'utf8');
    } else {
      fs.writeFileSync(path.join(__dirname, '..', 'db_content.txt'), result.rows[0].content, 'utf8');
    }
  } catch (err) {
    fs.writeFileSync(path.join(__dirname, '..', 'db_content.txt'), 'Error: ' + err.message, 'utf8');
  } finally {
    client.close();
  }
}

main();
