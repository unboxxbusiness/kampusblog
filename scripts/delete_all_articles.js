/**
 * delete_all_articles.js
 * Wipes the 'articles' table clean in the remote Turso database for Kampus Filter.
 */

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

if (!dbUrl) {
  console.error("[!] Error: TURSO_CONNECTION_URL not found in env files");
  process.exit(1);
}

async function wipeDatabase() {
  console.log(`[*] Connecting to Turso database: ${dbUrl}`);
  const client = createClient({ url: dbUrl, authToken: dbToken });

  try {
    console.log("[!] Wiping all rows from the 'articles' table...");
    const result = await client.execute("DELETE FROM articles");
    
    console.log("[✓] Database reset successful! All articles deleted.");
  } catch (error) {
    console.error("[!] Database wipe failed:", error.message);
  } finally {
    client.close();
  }
}

wipeDatabase();
