import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getCustomerSession } from "@/lib/session/customerSession";

export async function GET() {
  try {
    const nextAuthSession = await auth();
    let targetUserId = nextAuthSession?.user?.id;

    if (!targetUserId) {
      const customSession = await getCustomerSession();
      targetUserId = customSession?.userId;
    }

    if (!targetUserId) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
        image: true,
        role: true,
        loyaltyPoints: true,
        createdAt: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: true,
            rewards: true,
          },
        },
        wishlists: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        loyaltyHistory: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });

    if (!user) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    return NextResponse.json({
      authenticated: true,
      user,
    });
  } catch (error: any) {
    console.error("[Get Customer Profile Error]:", error);
    return NextResponse.json({ authenticated: false, user: null });
  }
}
