import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Please provide a valid coupon code." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    // Query Prisma for active coupon
    let coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

    // Seed default coupons if database has none
    if (!coupon && (cleanCode === "WELCOME10" || cleanCode === "POLA10")) {
      coupon = await prisma.coupon.create({
        data: {
          code: cleanCode,
          discountType: "percentage",
          value: 10, // 10% discount
          active: true,
        },
      });
    }

    if (!coupon || !coupon.active) {
      return NextResponse.json(
        { error: `Coupon code "${cleanCode}" is invalid or expired.` },
        { status: 404 }
      );
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { error: `Coupon code "${cleanCode}" has expired.` },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = Math.round((subtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(subtotal, coupon.value);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      value: coupon.value,
      discountAmount,
    });
  } catch (error: any) {
    console.error("[Coupon Validate Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to validate coupon." },
      { status: 500 }
    );
  }
}
