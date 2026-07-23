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

async function run() {
  const client = createClient({
    url: process.env.TURSO_CONNECTION_URL,
    authToken: process.env.TURSO_AUTH_TOKEN
  });

  const res = await client.execute("SELECT slug, title, category FROM articles ORDER BY publishedAt DESC LIMIT 20");
  const output = [];
  output.push(`Total Articles Fetched: ${res.rows.length}`);
  res.rows.forEach((r, idx) => {
    output.push(`${idx + 1}. [${r.category}] https://kampusfilter.com/articles/${r.slug}`);
  });

  fs.writeFileSync(path.join(__dirname, '..', 'live_urls.txt'), output.join('\n'));
  client.close();
}

run().catch(err => {
  fs.writeFileSync(path.join(__dirname, '..', 'live_urls.txt'), 'Error: ' + err.message);
});
