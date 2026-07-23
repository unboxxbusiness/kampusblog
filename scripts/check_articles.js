const fs = require('fs');
const path = require('path');
const { createClient } = require('@libsql/client');

function loadEnv() {
  const envPaths = ['.env.local', '.env'];
  for (const envFile of envPaths) {
    const fullPath = path.join(__dirname, '..', envFile);
    if (fs.existsSync(fullPath)) {
      const lines = fs.readFileSync(fullPath, 'utf8').split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('#') || !line.includes('=')) continue;
        const index = line.indexOf('=');
        const key = line.slice(0, index).trim();
        let value = line.slice(index + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) process.env[key] = value;
      }
    }
  }
}

loadEnv();

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

async function check() {
  const client = createClient({ url: dbUrl, authToken: dbToken });
  const res = await client.execute("SELECT category, COUNT(*) as cnt FROM articles GROUP BY category");
  const logData = res.rows.map(r => `${r.category}: ${r.cnt}`).join('\n');
  fs.writeFileSync(path.join(__dirname, '..', 'publish_status_check.txt'), logData);
  client.close();
}

check().catch(err => {
  fs.writeFileSync(path.join(__dirname, '..', 'publish_status_check.txt'), 'ERR: ' + err.message);
});
