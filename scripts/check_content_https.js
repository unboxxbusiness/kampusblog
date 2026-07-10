const fs = require('fs');
const path = require('path');
const https = require('https');

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

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

const logPath = path.join(__dirname, '..', 'public', 'db_exact.txt');

if (!dbUrl) {
  fs.writeFileSync(logPath, 'Error: TURSO_CONNECTION_URL is missing', 'utf8');
  process.exit(1);
}

const httpUrl = dbUrl.replace('libsql://', 'https://');
const pipelineUrl = `${httpUrl}/v2/pipeline`;

const payload = {
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "SELECT content FROM articles WHERE slug = 'isro-ursc-research-internship-2026-complete-guide-eligibility'"
      }
    },
    {
      "type": "close"
    }
  ]
};

const payloadStr = JSON.stringify(payload);

const options = {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${dbToken}`,
    'Content-Type': 'application/json',
    'Content-Length': payloadStr.length
  }
};

const req = https.request(pipelineUrl, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const resJson = JSON.parse(body);
      const rows = resJson.results[0].response.result.rows;
      if (rows && rows.length > 0) {
        const content = rows[0][0].value;
        fs.writeFileSync(logPath, content, 'utf8');
      } else {
        fs.writeFileSync(logPath, 'No article found', 'utf8');
      }
    } catch (err) {
      fs.writeFileSync(logPath, 'Error parsing: ' + err.message + '\n' + body, 'utf8');
    }
  });
});

req.on('error', (e) => {
  fs.writeFileSync(logPath, 'Request Error: ' + e.message, 'utf8');
});

req.write(payloadStr);
req.end();
