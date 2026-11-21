import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

/**
 * Admin login with GitHub, restricted to one account (ADMIN_GITHUB_ID).
 * Sessions are signed JWT cookies: nothing is stored in the database.
 *
 * Environment: AUTH_SECRET, AUTH_GITHUB_ID, AUTH_GITHUB_SECRET,
 * ADMIN_GITHUB_ID, and on previews AUTH_REDIRECT_PROXY_URL.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  session: { strategy: "jwt" },
  trustHost: true,
  pages: { signIn: "/admin/login", error: "/admin/login" },
  callbacks: {
    // Only the owner's GitHub account may sign in.
    signIn({ profile }) {
      const adminId = process.env.ADMIN_GITHUB_ID;
      return Boolean(adminId) && String(profile?.id) === adminId;
    },
    jwt({ token, profile }) {
      if (profile?.id !== undefined) token.githubId = String(profile.id);
      return token;
    },
    session({ session, token }) {
      return { ...session, githubId: token.githubId };
    },
  },
});

/** True only for a signed-in session of the owner's GitHub account. */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;
  return (
    Boolean(adminId) &&
    (session as { githubId?: unknown } | null)?.githubId === adminId
  );
}
