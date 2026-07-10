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
    fs.writeFileSync('db_output.txt', 'Error: TURSO_CONNECTION_URL is missing', 'utf8');
    process.exit(1);
  }

  const client = createClient({ url: dbUrl, authToken: dbToken });
  try {
    const result = await client.execute('SELECT id, title, slug, category FROM articles ORDER BY published_at DESC LIMIT 5');
    fs.writeFileSync('db_output.txt', JSON.stringify(result.rows, null, 2), 'utf8');
  } catch (err) {
    fs.writeFileSync('db_output.txt', 'Error querying database: ' + err.message + '\n' + err.stack, 'utf8');
  } finally {
    client.close();
  }
}

main();
