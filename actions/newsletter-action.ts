"use server";

import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";

const newsletterSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
  mobileNumber: z.string().optional().refine((val) => {
    if (!val) return true;
    // Standard phone validation (E.164-ish regex allowing optional +, space, dashes, 7-15 digits)
    const phoneDigits = val.replace(/[\s\-\(\)]/g, "");
    return /^\+?[1-9]\d{6,14}$/.test(phoneDigits);
  }, { message: "Invalid phone number format. Please check and try again." }),
  sourcePage: z.string().default("/"),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

export async function submitNewsletterAction(data: {
  name: string;
  email: string;
  mobileNumber?: string;
  sourcePage: string;
}) {
  const result = newsletterSchema.safeParse(data);
  if (!result.success) {
    const errorMsg = result.error.errors[0]?.message || "Validation error";
    return { success: false, error: errorMsg };
  }

  const { name, email, mobileNumber, sourcePage } = result.data;

  if (!adminDb) {
    return { success: false, error: "Database service is currently unavailable. Please try again later." };
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = mobileNumber ? mobileNumber.replace(/[\s\-\(\)]/g, "") : "";

    // 1. Prevent duplicate email
    const emailQuery = await adminDb
      .collection("newsletter")
      .where("email", "==", cleanEmail)
      .limit(1)
      .get();

    if (!emailQuery.empty) {
      return { success: false, error: "This email address is already subscribed to our newsletter." };
    }

    // 2. Prevent duplicate phone number if provided
    if (cleanPhone) {
      const phoneQuery = await adminDb
        .collection("newsletter")
        .where("mobile_number", "==", cleanPhone)
        .limit(1)
        .get();

      if (!phoneQuery.empty) {
        return { success: false, error: "This mobile number is already registered for newsletter updates." };
      }
    }

    // 3. Add subscriber
    await adminDb.collection("newsletter").add({
      name: name.trim(),
      email: cleanEmail,
      mobile_number: cleanPhone,
      source_page: sourcePage,
      created_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting newsletter sign-up:", error);
    return { success: false, error: "Failed to complete subscription. Server error." };
  }
}
