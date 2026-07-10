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
    
    const res = await client.execute("SELECT slug, contentType, category FROM articles");
    fs.writeFileSync(path.join(__dirname, 'res.json'), JSON.stringify(res.rows, null, 2));
    client.close();
  } catch (e) {
    fs.writeFileSync(path.join(__dirname, 'err.txt'), e.stack);
  }
}

main();
