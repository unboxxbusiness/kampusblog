const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '..', 'debug_log.txt');

try {
  const out = execSync('pnpm exec tsx scripts/publish_article.ts', {
    cwd: path.join(__dirname, '..'),
    encoding: 'utf8',
    env: process.env
  });
  fs.writeFileSync(logFile, "SUCCESS STDOUT:\n" + out, 'utf8');
} catch (err) {
  const msg = [
    "ERROR OCCURRED:",
    "MESSAGE: " + err.message,
    "STDOUT: " + (err.stdout || ""),
    "STDERR: " + (err.stderr || "")
  ].join('\n\n');
  fs.writeFileSync(logFile, msg, 'utf8');
}
