"use server";

import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import { checkRateLimit } from "@/utils/rate-limiter";

const deleteSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export async function deleteUserDataAction(data: { email: string }) {
  const isAllowed = await checkRateLimit(5, 60000);
  if (!isAllowed) {
    return { success: false, error: "Too many requests. Please wait a minute and try again." };
  }

  const result = deleteSchema.safeParse(data);
  if (!result.success) {
    const errorMsg = result.error.errors[0]?.message || "Validation error";
    return { success: false, error: errorMsg };
  }

  const { email } = result.data;
  const cleanEmail = email.toLowerCase().trim();

  if (!adminDb) {
    return { success: false, error: "Database service is currently offline. Please try again later." };
  }

  try {
    let deletedCount = 0;

    // 1. Delete from newsletter subscription
    const newsletterQuery = await adminDb
      .collection("newsletter")
      .where("email", "==", cleanEmail)
      .get();

    const newsletterBatch = adminDb.batch();
    newsletterQuery.forEach((doc) => {
      newsletterBatch.delete(doc.ref);
      deletedCount++;
    });
    if (!newsletterQuery.empty) {
      await newsletterBatch.commit();
    }

    // 2. Delete from contact leads
    const contactQuery = await adminDb
      .collection("contact_leads")
      .where("email", "==", cleanEmail)
      .get();

    const contactBatch = adminDb.batch();
    contactQuery.forEach((doc) => {
      contactBatch.delete(doc.ref);
      deletedCount++;
    });
    if (!contactQuery.empty) {
      await contactBatch.commit();
    }

    return { success: true, deletedCount };
  } catch (error: any) {
    console.error("[Data Deletion Request] Error deleting user logs:", error);
    return { success: false, error: "Failed to delete data. Server error." };
  }
}
