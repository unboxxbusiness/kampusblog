const fs = require('fs');
const path = require('path');

let logs = [];
const originalLog = console.log;
const originalErr = console.error;
console.log = (...args) => logs.push("[LOG] " + args.join(' '));
console.error = (...args) => logs.push("[ERR] " + args.join(' '));

try {
  require('E:/brandapp/kampusfilter/validate_draft.js');
} catch (e) {
  logs.push("[EXC] " + e.message);
}

const outDir = "C:/Users/Admin/.gemini/antigravity/brain/fce01f4b-9b57-4b52-9044-1a0f0ab08850/scratch";
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'val_res2.txt'), logs.join('\n'));
