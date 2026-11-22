import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/**
 * Invisible spam protection for the sign-up form, without cookies or
 * third parties: a signed "form opened at" time (bots submit too fast) and
 * an anonymous, daily-changing connection id for rate limiting.
 */

/** Humans need longer than this to fill in the form. */
const MIN_FILL_MS = 3_000;
/** Older tokens (a page left open very long) ask for a refresh. */
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

function secret(): string {
  const value = process.env.VISIT_HASH_SECRET ?? process.env.AUTH_SECRET;
  if (!value) throw new Error("VISIT_HASH_SECRET (or AUTH_SECRET) is not set.");
  return value;
}

function sign(payload: string): string {
  return createHmac("sha256", secret())
    .update(`form|${payload}`)
    .digest("base64url");
}

/** A token with the current time, signed so it cannot be forged. */
export function createFormToken(now: number = Date.now()): string {
  const issued = String(now);
  return `${issued}.${sign(issued)}`;
}

export type FormTokenCheck = "ok" | "too-fast" | "expired" | "invalid";

export function checkFormToken(
  token: string | null,
  now: number = Date.now(),
): FormTokenCheck {
  if (!token) return "invalid";
  const [issued, signature] = token.split(".");
  if (!issued || !signature || !/^\d{10,16}$/.test(issued)) return "invalid";

  const expected = Buffer.from(sign(issued));
  const given = Buffer.from(signature);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return "invalid";
  }

  const age = now - Number(issued);
  if (age < MIN_FILL_MS) return "too-fast";
  if (age > MAX_AGE_MS) return "expired";
  return "ok";
}

/**
 * Anonymous id of the connection, for rate limiting. It changes every day
 * and the IP address itself is never stored.
 */
export function connectionHash(ip: string, day: string): string {
  return createHash("sha256")
    .update(`${secret()}|ratelimit|${day}|${ip}`)
    .digest("hex")
    .slice(0, 32);
}
