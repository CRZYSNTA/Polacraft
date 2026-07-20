import { cookies } from "next/headers";

export interface AdminSessionPayload {
  userId: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN" | string;
  name?: string | null;
  issuedAt: number;
  expiresAt: number;
}

export const SESSION_COOKIE_NAME = "polacraft_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

const DEFAULT_SECRET = "polacraft-super-secure-admin-session-secret-2026-key-prod";

function getSecretKey(): string {
  return process.env.SESSION_SECRET || process.env.JWT_SECRET || DEFAULT_SECRET;
}

/**
 * Base64URL encode buffer/string
 */
function base64UrlEncode(str: string): string {
  return btoa(str)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Base64URL decode string
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

/**
 * Sign data using Web Crypto API HMAC-SHA256 (compatible with Edge Runtime & Node.js)
 */
async function signData(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    encoder.encode(data)
  );
  const hashArray = Array.from(new Uint8Array(signature));
  const base64Sig = btoa(String.fromCharCode(...hashArray))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  return base64Sig;
}

/**
 * Creates a signed JWT session token
 */
export async function createSessionToken(
  data: Omit<AdminSessionPayload, "issuedAt" | "expiresAt">
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_MAX_AGE;

  const payload: AdminSessionPayload = {
    ...data,
    issuedAt: now,
    expiresAt,
  };

  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const dataToSign = `${header}.${encodedPayload}`;
  
  const signature = await signData(dataToSign, getSecretKey());
  return `${dataToSign}.${signature}`;
}

/**
 * Verifies a signed session token. Works in Edge Middleware and Server Components.
 */
export async function verifySessionToken(token: string): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, payloadStr, signature] = parts;
  const dataToSign = `${header}.${payloadStr}`;
  const expectedSig = await signData(dataToSign, getSecretKey());

  if (signature !== expectedSig) {
    return null; // Tampered session token
  }

  try {
    const payload: AdminSessionPayload = JSON.parse(base64UrlDecode(payloadStr));
    const now = Math.floor(Date.now() / 1000);

    if (payload.expiresAt && payload.expiresAt < now) {
      return null; // Expired session
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Creates a secure HTTP-only session cookie for authenticated admin user
 */
export async function createSession(user: {
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
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/**
 * Retrieves the current verified session from server cookies
 */
export async function getSession(): Promise<AdminSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Server-side authorization check enforcing ADMIN or SUPER_ADMIN role.
 */
export async function verifyAdminSession(): Promise<AdminSessionPayload | null> {
  const session = await getSession();
  if (!session) return null;
  if (session.role !== "ADMIN" && session.role !== "SUPER_ADMIN") {
    return null;
  }
  return session;
}

/**
 * Destroys current session and clears HTTP-only cookie
 */
export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
