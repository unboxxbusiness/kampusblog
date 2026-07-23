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

let dbUrl = process.env.TURSO_CONNECTION_URL || '';
if (dbUrl.startsWith('libsql://')) {
  dbUrl = dbUrl.replace('libsql://', 'https://');
}

console.log("Connecting using HTTPS URL:", dbUrl);
const client = createClient({
  url: dbUrl,
  authToken: process.env.TURSO_AUTH_TOKEN
});

async function main() {
  const logFile = path.join(__dirname, '..', 'db_query_https.txt');
  try {
    const res = await client.execute("SELECT slug, category, status FROM articles ORDER BY publishedAt DESC");
    const out = ["TOTAL ARTICLES: " + res.rows.length];
    res.rows.forEach(r => {
      out.push(`SLUG: ${r.slug} | CAT: ${r.category} | STATUS: ${r.status}`);
    });
    fs.writeFileSync(logFile, out.join('\n'), 'utf8');
    console.log("SUCCESS! Wrote to db_query_https.txt");
  } catch (err) {
    fs.writeFileSync(logFile, "ERR: " + err.message, 'utf8');
    console.error("ERR:", err.message);
  } finally {
    client.close();
  }
}

main();
