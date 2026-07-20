"use server";

import { authenticateAdmin } from "@/lib/auth";
import { createSession, destroySession, getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export interface ActionState {
  success?: boolean;
  error?: string;
}

/**
 * Server action for admin authentication.
 * Verifies credentials, hashes, ADMIN role, and sets HTTP-only cookie.
 */
export async function loginAdminAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "Email and password are required." };
  }

  const result = await authenticateAdmin(email, password);

  if (!result.success || !result.user) {
    return {
      success: false,
      error: result.error || "Invalid email or password.",
    };
  }

  // Create secure HTTP-only session cookie
  await createSession({
    id: result.user.id,
    email: result.user.email,
    role: result.user.role,
    name: result.user.name,
  });

  return { success: true };
}

/**
 * Server action for admin logout.
 * Destroys session, clears cookies, and redirects to /admin/login.
 */
export async function logoutAdminAction() {
  await destroySession();
  redirect("/admin/login");
}

/**
 * Server action to fetch current authenticated admin profile.
 */
export async function getAdminProfileAction() {
  const session = await getSession();
  if (!session || (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN")) {
    return null;
  }
  return session;
}
