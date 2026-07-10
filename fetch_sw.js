const http = require('http');

http.get('http://localhost:3001/firebase-messaging-sw.js', (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('BODY:', data.substring(0, 1000));
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
