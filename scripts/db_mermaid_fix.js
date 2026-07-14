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
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim().replace(/(^["']|["']$)/g, '');
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

const dbUrl = process.env.TURSO_CONNECTION_URL;
const dbToken = process.env.TURSO_AUTH_TOKEN;

if (!dbUrl) {
  console.error('[!] Error: TURSO_CONNECTION_URL is missing in env');
  process.exit(1);
}

const httpUrl = dbUrl.replace('libsql://', 'https://');
const pipelineUrl = `${httpUrl}/v2/pipeline`;

// Search for NEET UG article
const selectPayload = {
  "requests": [
    {
      "type": "execute",
      "stmt": {
        "sql": "SELECT id, slug, title, content FROM articles WHERE slug LIKE '%neet-ug%'"
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

console.log('[*] Querying database for NEET UG articles...');
const req = https.request(pipelineUrl, options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    try {
      const resJson = JSON.parse(body);
      const rows = resJson.results[0].response.result.rows;
      if (rows && rows.length > 0) {
        console.log(`[+] Found ${rows.length} matching articles:`);
        for (const row of rows) {
          const id = row[0].value;
          const slug = row[1].value;
          const title = row[2].value;
          let content = row[3].value;
          
          console.log(`    - ID: ${id} | Slug: ${slug} | Title: "${title}"`);
          
          const brokenText = "D -->|No (No Bio/Physics/Chem)| Reject";
          const fixedText = "D -->|No Bio or Physics or Chem| Reject";
          
          if (content.includes(brokenText)) {
            console.log(`[*] Broken Mermaid notation found in "${title}". Fixing...`);
            const updatedContent = content.replace(brokenText, fixedText);
            
            // Perform database UPDATE
            const updatePayload = {
              "requests": [
                {
                  "type": "execute",
                  "stmt": {
                    "sql": "UPDATE articles SET content = ? WHERE id = ?",
                    "args": [
                      { "type": "text", "value": updatedContent },
                      { "type": "text", "value": id }
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
                console.log(`[+] Success: Corrected Mermaid diagram saved to database for "${title}"!`);
                
                // Trigger Cache Revalidation for this article
                triggerRevalidation(slug);
              });
            });
            updateReq.write(updateStr);
            updateReq.end();
            
          } else {
            console.log(`[i] Article "${title}" does not contain the broken Mermaid diagram.`);
          }
        }
      } else {
        console.log('[!] No NEET UG articles found in database.');
      }
    } catch (err) {
      console.error('[!] Error parsing response:', err.message, '\nResponse Body:', body);
    }
  });
});

req.on('error', (e) => {
  console.error('[!] Request Error:', e.message);
});

req.write(payloadStr);
req.end();

function triggerRevalidation(slug) {
  const notifySecret = process.env.KAMPUSFILTER_API_KEY;
  if (!notifySecret) {
    console.log('[!] KAMPUSFILTER_API_KEY is missing. Skipping cache invalidation.');
    return;
  }
  const revalidatePayload = { slug, category: 'Education News' };
  const baseUrls = ['http://localhost:3000', 'http://localhost:3001'];
  
  console.log(`[*] Triggering local cache invalidations for /articles/${slug}...`);
  for (const base of baseUrls) {
    const revalidateWebhookUrl = `${base}/api/revalidate`;
    const revalidateReq = https.request(revalidateWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': notifySecret
      }
    }, (res) => {
      if (res.statusCode === 200) {
        console.log(`[+] Revalidation succeeded on ${base}`);
      } else {
        console.log(`[i] Revalidation on ${base} returned status ${res.statusCode}`);
      }
    });
    revalidateReq.on('error', () => {});
    revalidateReq.write(JSON.stringify(revalidatePayload));
    revalidateReq.end();
  }
}
