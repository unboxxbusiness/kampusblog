const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

const envPath = path.join(__dirname, '..', '.env.local');
const lines = fs.readFileSync(envPath, 'utf8').split('\n');
lines.forEach(l => {
  const p = l.trim().split('=');
  if (p.length >= 2 && !p[0].startsWith('#')) {
    process.env[p[0].trim()] = p.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
  }
});

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  const logFile = path.join(__dirname, '..', 'db_query.txt');
  try {
    const res = await client.execute("SELECT slug, category, status FROM articles ORDER BY publishedAt DESC");
    const out = ["TOTAL ARTICLES: " + res.rows.length];
    res.rows.forEach(r => {
      out.push(`SLUG: ${r.slug} | CAT: ${r.category} | STATUS: ${r.status}`);
    });
    fs.writeFileSync(logFile, out.join('\n'), 'utf8');
  } catch (err) {
    fs.writeFileSync(logFile, "ERR: " + err.message, 'utf8');
  } finally {
    client.close();
  }
}

main();
