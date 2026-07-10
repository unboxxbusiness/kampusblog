const fs = require('fs');
const path = require('path');
const https = require('https');

function loadEnv() {
  // Try both parent paths to be absolutely sure we load .env.local
  const paths = [
    path.join(__dirname, '..', '.env.local'),
    path.join(__dirname, '..', '..', '.env.local'),
    path.join(__dirname, '.env.local')
  ];
  
  for (const envPath of paths) {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      envContent.split('\n').forEach(line => {
        const trimmed = line.strip ? line.strip() : line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
          if (key) process.env[key] = value;
        }
      });
      break;
    }
  }
}

loadEnv();

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

// Write logs to parent e:\brandapp\publish_log.txt
const logPath = path.join(__dirname, '..', 'publish_log.txt');
const logPathParent = path.join(__dirname, '..', '..', 'publish_log.txt');

function writeLog(msg) {
  try {
    fs.writeFileSync(logPath, msg, 'utf8');
  } catch {}
  try {
    fs.writeFileSync(logPathParent, msg, 'utf8');
  } catch {}
}

if (!dbUrl) {
  writeLog('Error: TURSO_CONNECTION_URL is missing in env');
  process.exit(1);
}

const httpUrl = dbUrl.replace('libsql://', 'https://');
const pipelineUrl = `${httpUrl}/v2/pipeline`;

const selectPayload = {
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

const payloadStr = JSON.stringify(selectPayload);

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
        let content = rows[0][0].value;
        const original = content;
        
        // Clean up the heading hashes in JavaScript
        content = content.replace(/<h2>##\s*/g, '<h2>');
        content = content.replace(/<h3>###\s*/g, '<h3>');
        
        if (original === content) {
          writeLog('No changes needed. Heading hashes are already cleaned in DB.');
          return;
        }

        // Perform UPDATE
        const updatePayload = {
          "requests": [
            {
              "type": "execute",
              "stmt": {
                "sql": "UPDATE articles SET content = ? WHERE slug = ?",
                "args": [
                  { "type": "text", "value": content },
                  { "type": "text", "value": "isro-ursc-research-internship-2026-complete-guide-eligibility" }
                ]
              }
            },
            {
              "type": "close"
            }
          ]
        };

        const updateStr = JSON.stringify(updatePayload);
        const updateOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${dbToken}`,
            'Content-Type': 'application/json',
            'Content-Length': updateStr.length
          }
        };

        const updateReq = https.request(pipelineUrl, updateOptions, (updateRes) => {
          let updateBody = '';
          updateRes.on('data', (c) => updateBody += c);
          updateRes.on('end', () => {
            writeLog('Success: Article headings cleaned in database!\n' + updateBody);
          });
        });
        updateReq.write(updateStr);
        updateReq.end();

      } else {
        writeLog('Error: Article slug not found in database');
      }
    } catch (err) {
      writeLog('Error parsing response: ' + err.message + '\n' + body);
    }
  });
});

req.on('error', (e) => {
  writeLog('Request Error: ' + e.message);
});

req.write(payloadStr);
req.end();
