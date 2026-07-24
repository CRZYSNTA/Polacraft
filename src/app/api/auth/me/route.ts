import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/session/customerSession";

export async function GET() {
  try {
    const session = await getCustomerSession();

    if (!session || !session.userId) {
      return NextResponse.json({ authenticated: false, user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        avatar: true,
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
