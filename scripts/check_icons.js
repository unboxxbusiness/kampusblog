const http = require('http');
const fs = require('fs');
const path = require('path');

http.get('http://localhost:3001/', (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    const startIdx = html.indexOf('<head>');
    const endIdx = html.indexOf('</head>');
    if (startIdx >= 0 && endIdx >= 0) {
      const head = html.substring(startIdx, endIdx + 7);
      fs.writeFileSync(path.join(__dirname, 'head_check.txt'), head);
      console.log('Successfully wrote head section.');
    } else {
      console.log('Could not find head section.');
    }
  });
}).on('error', (err) => {
  fs.writeFileSync(path.join(__dirname, 'head_check.txt'), 'ERR: ' + err.message);
});
