import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Hourly Cron / API Endpoint to expire unpaid WhatsApp orders older than 24 hours.
 */
export async function POST(req: Request) {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find all WHATSAPP_PENDING orders older than 24 hours
    const expiredOrders = await prisma.order.findMany({
      where: {
        shippingStatus: "WHATSAPP_PENDING",
        createdAt: { lt: twentyFourHoursAgo },
      },
      select: { id: true, orderNumber: true },
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No pending WhatsApp orders to expire.",
        expiredCount: 0,
      });
    }

    // Update statuses to EXPIRED and log audit history
    let count = 0;
    for (const ord of expiredOrders) {
      await prisma.order.update({
        where: { id: ord.id },
        data: {
          shippingStatus: "EXPIRED",
          statusHistory: {
            create: {
              status: "EXPIRED",
              comment: "Expired because payment was not received within 24 hours.",
            },
          },
        },
      });
      count++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully expired ${count} unpaid WhatsApp order(s).`,
      expiredCount: count,
    });
  } catch (error: any) {
    console.error("[Auto Expiration API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process auto expiration." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return POST(req);
}
