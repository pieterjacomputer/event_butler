import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * First line of defence for /admin: send visitors without the owner's
 * session to the login page. Every admin page and download checks again
 * on the server (see isAdmin in src/auth.ts).
 */
export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();

  const githubId = (request.auth as { githubId?: unknown } | null)?.githubId;
  const adminId = process.env.ADMIN_GITHUB_ID;
  if (!adminId || githubId !== adminId) {
    return NextResponse.redirect(new URL("/admin/login", request.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};
