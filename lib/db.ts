import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const url = process.env.TURSO_CONNECTION_URL?.replace(/(^["']|["']$)/g, "");
const authToken = process.env.TURSO_AUTH_TOKEN?.replace(/(^["']|["']$)/g, "");

if (!url) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("CRITICAL ERROR: TURSO_CONNECTION_URL environment variable is missing in production!");
  }
  console.warn("Warning: TURSO_CONNECTION_URL environment variable is missing.");
}

export const client = createClient({
  url: url || "libsql://placeholder.db",
  authToken: authToken || "",
});

export const db = drizzle(client, { schema });
export * from "../db/schema";
