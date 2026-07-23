const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

// Parse env
const envPath = path.join(__dirname, '..', '.env.local');
const raw = fs.readFileSync(envPath, 'utf8');
let dbUrl = '', dbToken = '';
raw.split('\n').forEach(line => {
  const t = line.trim();
  if (t.startsWith('TURSO_CONNECTION_URL=')) dbUrl = t.split('=').slice(1).join('=').trim();
  if (t.startsWith('TURSO_AUTH_TOKEN=')) dbToken = t.split('=').slice(1).join('=').trim();
});

const outPath = path.join(__dirname, '..', 'db_article_count.txt');
const client = createClient({ url: dbUrl, authToken: dbToken });

client.execute("SELECT category, COUNT(*) as cnt FROM articles GROUP BY category ORDER BY category")
  .then(r => {
    const lines = ['=== Articles by Category ==='];
    let total = 0;
    r.rows.forEach(row => {
      lines.push(`  ${row.category}: ${row.cnt}`);
      total += Number(row.cnt);
    });
    lines.push(`\n  TOTAL: ${total}`);
    fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
    client.close();
  })
  .catch(e => {
    fs.writeFileSync(outPath, 'ERROR: ' + e.message, 'utf8');
    client.close();
  });
