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
      return NextResponse.json({ wishlists: [] });
    }

    const wishlists = await prisma.wishlist.findMany({
      where: { userId: targetUserId },
      include: {
        product: true
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ wishlists });
  } catch (error: any) {
    console.error("[Wishlist GET Error]:", error);
    return NextResponse.json({ wishlists: [] });
  }
}

export async function POST(req: Request) {
  try {
    const nextAuthSession = await auth();
    let targetUserId = nextAuthSession?.user?.id;

    if (!targetUserId) {
      const customSession = await getCustomerSession();
      targetUserId = customSession?.userId;
    }

    if (!targetUserId) {
      return NextResponse.json({ success: true, guest: true });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_productId: {
          userId: targetUserId,
          productId: productId
        }
      }
    });

    if (existing) {
      await prisma.wishlist.delete({
        where: { id: existing.id }
      });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      await prisma.wishlist.create({
        data: {
          userId: targetUserId,
          productId: productId
        }
      });
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch (error: any) {
    console.error("[Wishlist POST Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
