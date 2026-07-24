import { cookies } from "next/headers";
import { createSessionToken, verifySessionToken } from "./index";

export const CUSTOMER_SESSION_COOKIE_NAME = "polacraft_customer_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days in seconds for customers

export interface CustomerSessionPayload {
  userId: string;
  email: string;
  role: string;
  name?: string | null;
  issuedAt?: number;
  expiresAt?: number;
}

/**
 * Creates a secure HTTP-only session cookie for authenticated customer
 */
export async function createCustomerSession(user: {
  id: string;
  email: string;
  role: string;
  name?: string | null;
}) {
  const token = await createSessionToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  const cookieStore = await cookies();
  cookieStore.set(CUSTOMER_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Retrieves the current verified customer session from server cookies
 */
export async function getCustomerSession(): Promise<CustomerSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(CUSTOMER_SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return (await verifySessionToken(token)) as CustomerSessionPayload | null;
  } catch {
    return null;
  }
}

/**
 * Destroys current customer session and clears HTTP-only cookie
 */
export async function destroyCustomerSession() {
  const cookieStore = await cookies();
  cookieStore.delete(CUSTOMER_SESSION_COOKIE_NAME);
}
