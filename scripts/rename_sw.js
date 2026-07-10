const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js');
const backupPath = path.join(__dirname, '..', 'public', 'firebase-messaging-sw.js.bak');

if (fs.existsSync(targetPath)) {
  fs.renameSync(targetPath, backupPath);
  console.log('Successfully backed up firebase-messaging-sw.js');
} else {
  console.log('firebase-messaging-sw.js does not exist, no action needed');
}
