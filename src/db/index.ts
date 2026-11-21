import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Server-only: EVENT_BUTLER_DATABASE_URL is never exposed to the browser.
const databaseUrl = process.env.EVENT_BUTLER_DATABASE_URL;
if (!databaseUrl) {
  throw new Error("EVENT_BUTLER_DATABASE_URL is not set. See .env.example.");
}

export const db = drizzle(neon(databaseUrl), { schema });
