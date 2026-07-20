import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/session";

/**
 * Next.js 16 Edge Proxy to enforce authentication and authorization for admin routes.
 * Executed before rendering any /admin/* route.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  // Route 1: /admin/login
  if (pathname === "/admin/login") {
    // If user is already authenticated as ADMIN, redirect to /admin dashboard
    if (session && (session.role === "ADMIN" || session.role === "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Allow login page access
    return NextResponse.next();
  }

  // Route 2: Any other /admin/* route
  // Unauthenticated user -> redirect to /admin/login
  if (!session) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated non-admin user (e.g. CUSTOMER) -> redirect to storefront /
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Authorized ADMIN user -> allow access
  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/admin/:path*"],
};
