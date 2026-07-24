import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { protectAdminApiRoute } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const authError = await protectAdminApiRoute(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    const users = await prisma.user.findMany({
      where: query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
            ],
          }
        : undefined,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        image: true,
        provider: true,
        role: true,
        emailVerified: true,
        loyaltyPoints: true,
        createdAt: true,
        lastLogin: true,
        addresses: {
          orderBy: { isDefault: "desc" },
        },
        orders: {
          select: {
            id: true,
            total: true,
            paymentStatus: true,
            shippingStatus: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedCustomers = users.map((u) => {
      const totalSpent = u.orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
      const defaultAddress = u.addresses.find((a) => a.isDefault) || u.addresses[0] || null;

      return {
        id: u.id,
        name: u.name || "Anonymous Collector",
        email: u.email,
        phone: u.phone || null,
        avatar: u.avatar || u.image || null,
        provider: u.provider || "email",
        role: u.role,
        emailVerified: Boolean(u.emailVerified),
        loyaltyPoints: u.loyaltyPoints,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin,
        ordersCount: u.orders.length,
        totalSpent: totalSpent,
        formattedSpent: `₹${totalSpent.toLocaleString("en-IN")}`,
        defaultAddress: defaultAddress
          ? `${defaultAddress.street}, ${defaultAddress.city}, ${defaultAddress.state || ""} ${defaultAddress.zip}`
          : "No address saved",
      };
    });

    return NextResponse.json({ success: true, customers: formattedCustomers });
  } catch (error: any) {
    console.error("[Admin Customers Fetch Error]:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
