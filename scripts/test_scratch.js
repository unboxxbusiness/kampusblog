const fs = require('fs');
const path = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\fce01f4b-9b57-4b52-9044-1a0f0ab08850\\scratch\\test_scratch.txt';
fs.mkdirSync(path.replace(/test_scratch\.txt$/, ''), { recursive: true });
fs.writeFileSync(path, 'Hello from scratch file write');
console.log('Wrote to scratch');
