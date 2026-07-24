import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSession } from "@/lib/session/customerSession";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const host = req.headers.get("host") || "polacraft-1.vercel.app";
  const protocol = req.headers.get("x-forwarded-proto") || "https";
  const baseUrl = `${protocol}://${host}`;

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_auth_failed`);
  }

  try {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "";
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
    const redirectUri = `${baseUrl}/api/auth/google/callback`;

    // Exchange authorization code for tokens with Google
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-parse-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("[Google Token Exchange Failed]:", await tokenRes.text());
      return NextResponse.redirect(`${baseUrl}/login?error=token_exchange_failed`);
    }

    const tokens = await tokenRes.json();
    const idToken = tokens.id_token;

    // Verify ID Token
    const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
    if (!verifyRes.ok) {
      return NextResponse.redirect(`${baseUrl}/login?error=invalid_token`);
    }

    const payload = await verifyRes.json();
    const email = payload.email;
    const name = payload.name || payload.given_name || "Google User";
    const avatar = payload.picture || null;

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=no_email`);
    }

    const cleanEmail = email.trim().toLowerCase();

    // Upsert User in Database
    const user = await prisma.user.upsert({
      where: { email: cleanEmail },
      update: {
        name: name ? name.trim() : undefined,
        avatar: avatar || undefined,
        lastLogin: new Date(),
      },
      create: {
        email: cleanEmail,
        name: name ? name.trim() : "Google Collector",
        avatar: avatar,
        role: "CUSTOMER",
        emailVerified: true,
      },
    });

    // Establish Customer Session Cookie
    await createCustomerSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.redirect(`${baseUrl}/profile`);
  } catch (err: any) {
    console.error("[Google Callback Exception]:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=callback_exception`);
  }
}
