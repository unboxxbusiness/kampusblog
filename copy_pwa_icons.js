const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\3fac9e3c-51dd-4344-a291-4b096750be3c\\kampus_filter_logo_kf_1783599334830.png';
const destinations = [
  'public\\icon-192.png',
  'public\\icon-512.png',
  'public\\icon-maskable.png',
  'public\\favicon.ico',
  'app\\icon.png',
  'app\\favicon.ico'
];

if (!fs.existsSync(src)) {
  console.error(`Error: Source logo file not found at ${src}`);
  process.exit(1);
}

console.log(`Source logo found: ${fs.statSync(src).size} bytes.`);

destinations.forEach(relativeDest => {
  const dest = path.join(__dirname, relativeDest);
  try {
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Force write by unlinking existing file if present
    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
    
    fs.copyFileSync(src, dest);
    console.log(`✅ Copied to ${relativeDest} (${fs.statSync(dest).size} bytes)`);
  } catch (err) {
    console.error(`❌ Failed to write to ${relativeDest}:`, err.message);
  }
});

console.log('\nAll PWA icons synced successfully! Please clear your browser cache and reload.');
