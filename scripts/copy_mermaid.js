/**
 * postinstall: copy_mermaid.js
 * Copies mermaid.min.js from node_modules into public/ so it can be served
 * as a local static asset (/mermaid.min.js) in kampusfilter.
 */
const fs   = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src  = path.join(root, "node_modules", "mermaid", "dist", "mermaid.min.js");
const dest = path.join(root, "public", "mermaid.min.js");

try {
  if (!fs.existsSync(src)) {
    console.warn("[postinstall] mermaid.min.js not found – skipping copy.");
    process.exit(0);
  }

  fs.copyFileSync(src, dest);
  const kb = (fs.statSync(dest).size / 1024).toFixed(0);
  console.log(`[postinstall] ✓ Copied mermaid.min.js → public/mermaid.min.js (${kb} KB)`);
} catch (err) {
  console.error("[postinstall] Failed to copy mermaid.min.js:", err.message);
  process.exit(0);
}
