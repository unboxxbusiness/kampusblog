import { NextRequest, NextResponse } from "next/server";
import { adminDb, adminMessaging } from "@/lib/firebase-admin";
import { z } from "zod";

const notifySchema = z.object({
  title: z.string().min(1),
  excerpt: z.string().min(1),
  image: z.string().url(),
  slug: z.string().min(1),
});

export async function POST(req: NextRequest) {
  // 1. Authenticate secret token from caller
  const apiKey = req.headers.get("x-api-key");
  const localSecret = process.env.KAMPUSFILTER_API_KEY;

  if (!localSecret || !apiKey || apiKey !== localSecret) {
    return NextResponse.json({ error: "Unauthorized access: invalid or missing API key." }, { status: 401 });
  }

  // 2. Validate article metadata payload
  try {
    const body = await req.json();
    const result = notifySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid metadata payload.", details: result.error.format() }, { status: 400 });
    }

    const { title, excerpt, image, slug } = result.data;

    const db = adminDb;
    const messaging = adminMessaging;

    if (!db || !messaging) {
      return NextResponse.json(
        { error: "Firebase Service Accounts not initialized. Check your environment keys." },
        { status: 500 }
      );
    }

    // 3. Fetch active subscriber tokens
    const snapshot = await db
      .collection("notifications")
      .where("is_active", "==", true)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ success: true, sent_count: 0, msg: "No active push notification subscribers found." });
    }

    const tokens: string[] = [];
    const docIdsMap: Record<string, string> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.fcm_token) {
        tokens.push(data.fcm_token);
        docIdsMap[data.fcm_token] = doc.id;
      }
    });

    // Clean domains and ensure url structures
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://kampusfilter.com";
    const articleUrl = `${baseUrl.replace(/\/$/, "")}/articles/${slug}`;

    // 4. Send multicast messages (Data-only payload to prevent duplicate notifications)
    const response = await messaging.sendEachForMulticast({
      tokens: tokens,
      data: {
        title: title,
        body: excerpt,
        image: image,
        click_action: articleUrl,
      },
      webpush: {
        headers: {
          TTL: "86400", // Keep notification for 24 hours max
        },
        fcmOptions: {
          link: articleUrl,
        },
      },
    });

    // 5. Clean up failed or expired tokens (Registration failures)
    const deadTokensDocIds: string[] = [];
    response.responses.forEach((res, index) => {
      if (!res.success) {
        const error = res.error;
        if (
          error &&
          (error.code === "messaging/registration-token-not-registered" ||
            error.code === "messaging/invalid-registration-token")
        ) {
          const failedToken = tokens[index];
          if (failedToken && docIdsMap[failedToken]) {
            deadTokensDocIds.push(docIdsMap[failedToken]);
          }
        }
      }
    });

    if (deadTokensDocIds.length > 0) {
      console.log(`[FCM Notification Webhook] Cleaning up ${deadTokensDocIds.length} stale tokens.`);
      const batch = db.batch();
      deadTokensDocIds.forEach((id) => {
        const docRef = db.collection("notifications").doc(id);
        // Soft delete: set active status to false
        batch.update(docRef, { is_active: false, deactivated_at: new Date().toISOString() });
      });
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      sent_count: response.successCount,
      failed_count: response.failureCount,
      cleaned_subscribers: deadTokensDocIds.length,
    });
  } catch (err: any) {
    console.error("FCM Webhook handler exception:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
