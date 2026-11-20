import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// Locally, DATABASE_URL comes from .env.local. On Vercel it is set as an
// environment variable, so the file does not exist there.
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
  strict: true,
  verbose: true,
});
