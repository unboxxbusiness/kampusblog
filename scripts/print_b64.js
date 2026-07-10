const fs = require('fs');
const path = require('path');

const draftPath = path.join(__dirname, '..', 'draft_article.json');
const raw = fs.readFileSync(draftPath, 'utf8');
const b64 = Buffer.from(raw).toString('base64');

fs.writeFileSync(path.join(__dirname, '..', 'b64.txt'), b64, 'utf8');
console.log('Base64 generated successfully');
