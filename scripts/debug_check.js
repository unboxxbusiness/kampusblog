const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const logFile = path.join(__dirname, '..', 'debug_check_output.txt');
fs.writeFileSync(logFile, "=== STARTING CHECK ===\n");

function log(msg) {
  fs.appendFileSync(logFile, msg + "\n");
}

// 1. Git info
try {
  const status = execSync('git status', { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
  const gitlog = execSync('git log -n 3 --oneline', { cwd: path.join(__dirname, '..'), encoding: 'utf8' });
  log("=== GIT STATUS ===\n" + status + "\n=== GIT LOG ===\n" + gitlog);
} catch (e) {
  log("GIT ERROR: " + e.message);
}

// 2. Check live HTTP status of articles using https module
const SLUGS = [
  "du-csas-ug-2026-round-2-seat-allocation-on-july-25-fee-deadline-july-28",
  "bitsat-2026-iteration-iv-allotment-out-today-fee-deadline-july-25-classes-start-august-2",
  "rhodes-scholarship-2027-india-fully-funded-oxford-apply-by-july-23"
];

log("\n=== LIVE HTTP CHECK ===");
let completed = 0;
SLUGS.forEach((slug, i) => {
  const url = `https://kampusfilter.com/articles/${slug}`;
  https.get(url, (res) => {
    log(`${i + 1}. [Status: ${res.statusCode}] ${url}`);
  }).on('error', (err) => {
    log(`${i + 1}. [Error: ${err.message}] ${url}`);
  });
});
