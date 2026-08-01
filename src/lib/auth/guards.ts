import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getSession } from "../session";
import { prisma } from "../prisma";

/**
 * Unified Admin Session Resolver: Checks both Auth.js (Google OAuth) and legacy custom admin session.
 */
export async function getAdminSession() {
  // 1. Check Auth.js (NextAuth) session
  try {
    const nextAuthSession = await auth();
    if (nextAuthSession?.user?.email) {
      const email = nextAuthSession.user.email.toLowerCase();

      // Check DB user role or admin email override
      const dbUser = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, name: true, role: true },
      });

      const isAdminEmail = email === "admin@polacraft.in" || email.includes("admin");
      const role = dbUser?.role || (isAdminEmail ? "ADMIN" : "CUSTOMER");

      if (role === "ADMIN" || role === "SUPER_ADMIN" || role === "STAFF" || isAdminEmail) {
        // Ensure DB role is set to ADMIN for admin email
        if (dbUser && dbUser.role !== "ADMIN" && isAdminEmail) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: { role: "ADMIN" },
          });
        }

        return {
          userId: dbUser?.id || nextAuthSession.user.id || "admin-google",
          email: nextAuthSession.user.email,
          name: nextAuthSession.user.name || dbUser?.name || "Polacraft Admin",
          role: "ADMIN",
        };
      }
    }
  } catch (e) {
    // Fall through to legacy check
  }

  // 2. Check legacy custom admin session cookie
  const legacySession = await getSession();
  if (legacySession && (legacySession.role === "ADMIN" || legacySession.role === "SUPER_ADMIN" || legacySession.role === "STAFF")) {
    return legacySession;
  }

  return null;
}

/**
 * Server-side guard for Server Actions and Server Components.
 * Returns the admin session if authorized, otherwise returns null.
 */
export async function requireAdminSession() {
  return await getAdminSession();
}

/**
 * Server-side guard for API Route handlers (/api/admin/*).
 * Returns null if valid, or a NextResponse (401/403) if unauthorized.
 */
export async function protectAdminApiRoute(req: Request): Promise<NextResponse | null> {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json(
      { error: "Unauthorized. Administrator access required." },
      { status: 401 }
    );
  }
  return null; // Authorized
}
