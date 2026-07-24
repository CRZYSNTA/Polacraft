import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
        user: { select: { id: true, email: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    let orderId = searchParams.get("id");

    if (!orderId) {
      const body = await req.json().catch(() => ({}));
      orderId = body.id;
    }

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json({ success: true, deletedId: orderId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete order" }, { status: 500 });
  }
}
