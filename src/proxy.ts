import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/session";

/**
 * Next.js 16 Edge Proxy to enforce authentication and authorization for account and admin routes.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Session tokens check
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isAccountRoute = pathname.startsWith("/account");
  const isAdminRoute = pathname.startsWith("/admin");

  // 1. Protect /account customer routes
  if (isAccountRoute && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Protect /admin routes
  if (isAdminRoute) {
    if (pathname === "/admin/login") {
      const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      const session = token ? await verifySessionToken(token) : null;
      if (session && (session.role === "ADMIN" || session.role === "SUPER_ADMIN" || session.role === "STAFF")) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    if (!sessionToken) {
      const adminLoginUrl = new URL("/admin/login", request.url);
      adminLoginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/account/:path*", "/admin/:path*"],
};
