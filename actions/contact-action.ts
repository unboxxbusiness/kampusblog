"use server";

import { adminDb } from "@/lib/firebase-admin";
import { z } from "zod";
import { checkRateLimit } from "@/utils/rate-limiter";

const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }).max(50),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Phone number is required." }).refine((val) => {
    const phoneDigits = val.replace(/[\s\-\(\)]/g, "");
    return /^\+?[1-9]\d{6,14}$/.test(phoneDigits);
  }, { message: "Invalid phone number format." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000),
});

export type ContactInput = z.infer<typeof contactSchema>;

export async function submitContactAction(data: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const isAllowed = await checkRateLimit(5, 60000);
  if (!isAllowed) {
    return { success: false, error: "Too many requests. Please wait a minute and try again." };
  }

  const result = contactSchema.safeParse(data);
  if (!result.success) {
    const errorMsg = result.error.errors[0]?.message || "Validation error";
    return { success: false, error: errorMsg };
  }

  const { name, email, phone, message } = result.data;

  if (!adminDb) {
    return { success: false, error: "Database service is currently offline. Please try again later." };
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");

    // Add lead record
    await adminDb.collection("contact_leads").add({
      name: name.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      message: message.trim(),
      created_at: new Date().toISOString(),
    });

    return { success: true };
  } catch (error: any) {
    console.error("Error submitting contact lead:", error);
    return { success: false, error: "Failed to submit message. Server error." };
  }
}
