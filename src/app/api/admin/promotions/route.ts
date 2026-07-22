import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ promotions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { name, startDate, endDate, freeShippingThreshold, collectorRewardThreshold, premiumRewardThreshold, bannerText } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json({ error: "Name, start date, and end date are required" }, { status: 400 });
    }

    const promotion = await prisma.promotion.create({
      data: {
        name,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        isActive: true,
        freeShippingThreshold: freeShippingThreshold ? parseFloat(freeShippingThreshold) : null,
        collectorRewardThreshold: collectorRewardThreshold ? parseFloat(collectorRewardThreshold) : null,
        premiumRewardThreshold: premiumRewardThreshold ? parseFloat(premiumRewardThreshold) : null,
        bannerText: bannerText || null
      }
    });

    return NextResponse.json({ promotion, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
