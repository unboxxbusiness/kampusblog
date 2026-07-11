import { headers } from "next/headers";

const rateLimitCache = new Map<string, { count: number; resetTime: number }>();

/**
 * Checks if the request exceeds a submission limit from the client IP.
 * Defaults to 5 submissions per 60 seconds (1 minute).
 */
export async function checkRateLimit(limit = 5, windowMs = 60000): Promise<boolean> {
  const headerList = await headers();
  const rawIp = headerList.get("x-forwarded-for") || headerList.get("x-real-ip") || "127.0.0.1";
  const ip = rawIp.split(",")[0].trim();

  const now = Date.now();
  const record = rateLimitCache.get(ip);

  // If no record or time window expired, reset limit window
  if (!record || now > record.resetTime) {
    rateLimitCache.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  // Block if limit exceeded
  if (record.count >= limit) {
    return false;
  }

  record.count++;
  return true;
}
