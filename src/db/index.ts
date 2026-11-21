import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb() {
  // Server-only: EVENT_BUTLER_DATABASE_URL is never exposed to the browser.
  const databaseUrl = process.env.EVENT_BUTLER_DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("EVENT_BUTLER_DATABASE_URL is not set. See .env.example.");
  }
  return drizzle(neon(databaseUrl), { schema });
}

let instance: ReturnType<typeof createDb> | undefined;

/**
 * The database client. Created on first use, so builds without a database
 * (CI) can still import modules that use it.
 */
export function getDb() {
  instance ??= createDb();
  return instance;
}
