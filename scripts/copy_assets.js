const fs = require("fs");
const path = require("path");

const source = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\3fac9e3c-51dd-4344-a291-4b096750be3c\\theaskt_logo_1783576008747.png";
const destinations = [
  "e:\\brandapp\\theaskt\\app\\favicon.ico",
  "e:\\brandapp\\theaskt\\public\\favicon.ico",
  "e:\\brandapp\\theaskt\\app\\icon.png",
  "e:\\brandapp\\theaskt\\public\\icon-192.png",
  "e:\\brandapp\\theaskt\\public\\icon-512.png",
  "e:\\brandapp\\theaskt\\public\\icon-maskable.png"
];

console.log("Source exists:", fs.existsSync(source));

destinations.forEach(dest => {
  try {
    const dir = path.dirname(dest);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(source, dest);
    console.log("Copied: " + dest + " (Size: " + fs.statSync(dest).size + " bytes)");
  } catch (err) {
    console.error("Failed to copy to " + dest + ": " + err.message);
  }
});
