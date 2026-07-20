import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { getSession } from "@/lib/session";

/**
 * GET /api/admin/me
 * Protected API endpoint returning verified admin session details.
 * Enforces server-side authentication & ADMIN role authorization.
 */
export async function GET(req: Request) {
  // Server-side authorization check
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  const session = await getSession();

  return NextResponse.json({
    success: true,
    user: {
      id: session?.userId,
      email: session?.email,
      role: session?.role,
      name: session?.name,
    },
  });
}
