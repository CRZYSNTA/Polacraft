import { prisma } from "../prisma";
import { verifyPassword } from "./password";
import { Role } from "@prisma/client";

export interface AuthUserResult {
  id: string;
  email: string;
  name: string | null;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthUserResult;
  error?: string;
}

/**
 * Authenticates an administrator using email and password.
 * Enforces ADMIN or SUPER_ADMIN role authorization.
 * Never exposes or stores plain-text passwords.
 */
export async function authenticateAdmin(
  emailInput: string,
  passwordInput: string
): Promise<AuthResponse> {
  if (!emailInput || !passwordInput) {
    return { success: false, error: "Email and password are required." };
  }

  const email = emailInput.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    if (user.isBlocked) {
      return { success: false, error: "This account has been suspended." };
    }

    // Authorization check: Only ADMIN or SUPER_ADMIN users can authenticate
    if (user.role !== Role.ADMIN && user.role !== Role.SUPER_ADMIN) {
      return {
        success: false,
        error: "Access denied. Administrator privileges required.",
      };
    }

    if (!user.password) {
      return { success: false, error: "Password login not enabled for this account." };
    }

    const isValidPassword = await verifyPassword(passwordInput, user.password);
    if (!isValidPassword) {
      return { success: false, error: "Invalid email or password." };
    }

    // Update last login timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  } catch (err) {
    console.error("[Auth Admin Error]:", err);
    return { success: false, error: "An unexpected error occurred during authentication." };
  }
}
