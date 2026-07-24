import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createCustomerSession } from "@/lib/session/customerSession";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { credential, gProfile } = body;

    let email = "";
    let name = "";
    let avatar = "";

    // 1. Verify Google ID token if provided
    if (credential) {
      try {
        const verifyRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`);
        if (verifyRes.ok) {
          const payload = await verifyRes.json();
          email = payload.email;
          name = payload.name || payload.given_name || "Google User";
          avatar = payload.picture || "";
        }
      } catch (e) {
        console.warn("[Google Token Verify Warning]:", e);
      }
    }

    // 2. Fallback to passed profile payload if token verification fallback is used
    if (!email && gProfile && gProfile.email) {
      email = gProfile.email;
      name = gProfile.name || "Google Collector";
      avatar = gProfile.picture || "";
    }

    if (!email) {
      return NextResponse.json(
        { error: "Failed to retrieve valid email from Google Sign-In." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    // 3. Upsert user in database
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
        avatar: avatar || null,
        role: "CUSTOMER",
        emailVerified: new Date(),
      },
    });

    if (user.isBlocked) {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    // 4. Establish Customer Session Cookie
    await createCustomerSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error("[Google Auth Error]:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during Google authentication." },
      { status: 500 }
    );
  }
}
