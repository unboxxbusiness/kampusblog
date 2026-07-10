import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID?.replace(/(^["']|["']$)/g, "");
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.replace(/(^["']|["']$)/g, "");
    let privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/(^["']|["']$)/g, "");
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    if (projectId && clientEmail && privateKey) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      // Local fallback for build environment or mock testing
      if (process.env.NODE_ENV === "development") {
        console.warn("Firebase Admin SDK credentials not fully provided. Messaging and admin operations will fail.");
      }
      admin.initializeApp();
    }
  } catch (error) {
    console.error("Firebase Admin SDK failed to initialize:", error);
  }
}

const adminDb = admin.apps.length ? admin.firestore() : null;
const adminMessaging = admin.apps.length ? admin.messaging() : null;

export { adminDb, adminMessaging };
export default admin;
