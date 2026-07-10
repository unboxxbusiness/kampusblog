const { cert, initializeApp, getApps } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    envContent.split("\n").forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0]?.trim();
        const value = parts.slice(1).join("=").trim().replace(/(^["']|["']$)/g, "");
        if (key) process.env[key] = value;
      }
    });
  }
}

loadEnv();

const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!projectId || !clientEmail || !privateKey) {
  console.error("Error: Missing Firebase credentials.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
}

const db = getFirestore();

async function main() {
  const snapshot = await db.collection("notifications").get();
  console.log(`Total subscriber documents in Firestore: ${snapshot.size}`);
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log(`- Doc ID: ${doc.id}`);
    console.log(`  Platform: ${data.platform || "unknown"}`);
    console.log(`  Browser: ${data.browser || "unknown"}`);
    console.log(`  Is Active: ${data.is_active}`);
    console.log(`  Token (first 20 chars): ${data.fcm_token?.slice(0, 20)}...`);
    console.log("------------------------");
  });
}

main();
