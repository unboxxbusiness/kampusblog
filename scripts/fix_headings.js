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
  const logPath = path.join(__dirname, '..', 'fetch_output.txt');
  let log = '\n\n--- Database Heading Cleanup Log ---\n';

  const dbUrl = process.env.TURSO_CONNECTION_URL;
  const dbToken = process.env.TURSO_AUTH_TOKEN;

  if (!dbUrl) {
    log += 'Error: TURSO_CONNECTION_URL is missing\n';
    fs.appendFileSync(logPath, log, 'utf8');
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
      log += 'Article not found in database\n';
    } else {
      let content = result.rows[0].content;
      log += 'Original content snippet: ' + content.substring(0, 150) + '\n';
      
      const original = content;
      // Replace markdown symbols inside HTML tags
      content = content.replace(/<h2>## /g, '<h2>');
      content = content.replace(/<h3>### /g, '<h3>');
      
      if (original !== content) {
        await client.execute({
          sql: 'UPDATE articles SET content = ? WHERE slug = ?',
          args: [content, slug]
        });
        log += 'Success: Heading hashes cleaned and saved to database!\n';
      } else {
        log += 'No changes needed, hashes already cleaned.\n';
      }
    }
  } catch (err) {
    log += 'Database Error: ' + err.message + '\n' + err.stack + '\n';
  } finally {
    client.close();
    fs.appendFileSync(logPath, log, 'utf8');
  }
}

main();
