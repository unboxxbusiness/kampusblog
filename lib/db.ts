import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../db/schema";

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url && process.env.NODE_ENV !== "production") {
  console.warn("Warning: TURSO_CONNECTION_URL environment variable is missing.");
}

export const client = createClient({
  url: url || "libsql://placeholder.db",
  authToken: authToken || "",
});

export const db = drizzle(client, { schema });
export * from "../db/schema";
