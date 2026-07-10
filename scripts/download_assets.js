const fs = require('fs');
const path = require('path');
const https = require('https');

const logFile = path.join(__dirname, '..', 'download_log.txt');
let logContent = '';

function log(msg) {
  console.log(msg);
  logContent += msg + '\n';
  fs.writeFileSync(logFile, logContent);
}

const assets = [
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769401433/logo_Kampus_Filter_gync6j.webp',
    dest: 'public/logo-light.webp'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769402686/Logo_voqhtq.png',
    dest: 'public/logo-dark.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/favicon.ico'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/icon-192.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/icon-512.png'
  },
  {
    url: 'https://res.cloudinary.com/dhrigocvd/image/upload/v1769405441/android-chrome-512x512_aqb44d.png',
    dest: 'public/icon-maskable.png'
  }
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: HTTP Status ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  const rootDir = path.join(__dirname, '..');
  log(`Starting downloads relative to ${rootDir}...`);
  for (const asset of assets) {
    const fullDest = path.join(rootDir, asset.dest);
    const dir = path.dirname(fullDest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    log(`Downloading ${asset.url} -> ${asset.dest}`);
    try {
      await download(asset.url, fullDest);
      log(`[+] Downloaded ${asset.dest}`);
    } catch (e) {
      log(`[!] Failed to download ${asset.dest}: ${e.message}`);
    }
  }
  log('All downloads completed.');
}

main().catch(err => {
  log('FATAL ERROR: ' + err.message);
});
