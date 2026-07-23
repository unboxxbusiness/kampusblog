const { createClient } = require('@libsql/client');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const raw = fs.readFileSync(envPath, 'utf8');
let dbUrl = '', dbToken = '';
raw.split('\n').forEach(line => {
  const t = line.trim();
  if (t.startsWith('TURSO_CONNECTION_URL=')) dbUrl = t.split('=').slice(1).join('=').replace(/(^["']|["']$)/g, '');
  if (t.startsWith('TURSO_AUTH_TOKEN=')) dbToken = t.split('=').slice(1).join('=').replace(/(^["']|["']$)/g, '');
});

console.log('DB URL:', dbUrl ? dbUrl.substring(0, 40) + '...' : 'MISSING');
const client = createClient({ url: dbUrl, authToken: dbToken });
client.execute("SELECT COUNT(*) as total FROM articles").then(r => {
  console.log('Total articles in DB:', r.rows[0].total);
  return client.execute("SELECT category, COUNT(*) as cnt FROM articles GROUP BY category");
}).then(r => {
  r.rows.forEach(row => console.log(' ', row.category, ':', row.cnt));
  client.close();
}).catch(e => {
  console.error('ERROR:', e.message);
  client.close();
});
