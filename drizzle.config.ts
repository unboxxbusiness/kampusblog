import { defineConfig } from "drizzle-kit";
import * as fs from "fs";
import * as path from "path";

// Zero-dependency manual parser to load .env.local variables into process.env for Drizzle Kit CLI
const envPath = path.resolve(process.cwd(), ".env.local");
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

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
});
