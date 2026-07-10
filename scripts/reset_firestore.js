const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, "..", ".env.local");
  const env = {};
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const parts = trimmed.split("=");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join("=").trim().replace(/(^["']|["']$)/g, "");
        env[key] = value;
      }
    }
  }
  return env;
}

async function deleteCollection(db, collectionRef) {
  const snapshot = await collectionRef.get();
  if (snapshot.size === 0) return 0;

  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  return snapshot.size;
}

async function main() {
  const env = loadEnv();

  // Support both standard environment or loaded .env.local
  const projectId = env.FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  const clientEmail = env.FIREBASE_CLIENT_EMAIL || process.env.FIREBASE_CLIENT_EMAIL;
  const privateKeyRaw = env.FIREBASE_PRIVATE_KEY || process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = privateKeyRaw ? privateKeyRaw.replace(/\\n/g, "\n") : undefined;

  if (!projectId || !clientEmail || !privateKey) {
    console.error("\n[!] Error: Firebase Admin SDK credentials missing from .env.local.");
    console.error("Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set.\n");
    process.exit(1);
  }

  try {
    const admin = require("firebase-admin");

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    const db = admin.firestore();
    
    console.log("\n[*] Fetching all collections in your Firestore database...");
    const collections = await db.listCollections();
    
    if (collections.length === 0) {
      console.log("[+] Database is already completely empty.");
      return;
    }

    console.log("────────────────────────────────────────────────────────────");
    for (const coll of collections) {
      const collectionId = coll.id;
      process.stdout.write(`[*] Wiping collection: ${collectionId} ... `);
      const deletedCount = await deleteCollection(db, coll);
      console.log(`✅ Cleared ${deletedCount} documents.`);
    }
    console.log("────────────────────────────────────────────────────────────");
    console.log("[+] Firestore Database completely reset successfully!\n");
  } catch (err) {
    console.error("\n[!] Reset operation failed:", err.message);
    process.exit(1);
  }
}

main();
