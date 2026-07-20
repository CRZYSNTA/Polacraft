import { NextResponse } from "next/server";
import { getSession, verifySessionToken, SESSION_COOKIE_NAME } from "../session";

/**
 * Server-side guard for Server Actions and Server Components.
 * Returns the admin session if authorized, otherwise throws an Unauthorized error or returns null.
 */
export async function requireAdminSession() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return null;
  }
  return session;
}

/**
 * Server-side guard for API Route handlers (/api/admin/*).
 * Verifies session cookie and ADMIN role.
 * Returns null if valid, or a NextResponse (401/403) if unauthorized.
 */
export async function protectAdminApiRoute(req: Request): Promise<NextResponse | null> {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : null;

  if (!token) {
    return NextResponse.json(
      { error: "Unauthorized. Admin session token missing." },
      { status: 401 }
    );
  }

  const session = await verifySessionToken(token);

  if (!session) {
    return NextResponse.json(
      { error: "Unauthorized. Invalid or expired admin session." },
      { status: 401 }
    );
  }

  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { error: "Forbidden. Administrator role required." },
      { status: 403 }
    );
  }

  return null; // Authorized
}
