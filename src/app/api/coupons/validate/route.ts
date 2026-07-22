import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { code, subtotal } = await req.json();

    if (!code || !code.trim()) {
      return NextResponse.json({ error: "Please provide a valid coupon code." }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();

    const normalizedSubtotal = Number(subtotal);
    if (!Number.isFinite(normalizedSubtotal) || normalizedSubtotal < 0) {
      return NextResponse.json({ error: "A valid subtotal is required." }, { status: 400 });
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

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
      discountAmount = Math.round((normalizedSubtotal * coupon.value) / 100);
    } else {
      discountAmount = Math.min(normalizedSubtotal, coupon.value);
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
