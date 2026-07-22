import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STORE_SETTINGS } from "@/services/promotionEngine";

export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst();

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          shippingFee: DEFAULT_STORE_SETTINGS.shippingFee,
          freeShippingThreshold: DEFAULT_STORE_SETTINGS.freeShippingThreshold,
          collectorRewardThreshold: DEFAULT_STORE_SETTINGS.collectorRewardThreshold,
          premiumRewardThreshold: DEFAULT_STORE_SETTINGS.premiumRewardThreshold,
          loyaltyPointsRatio: DEFAULT_STORE_SETTINGS.loyaltyPointsRatio,
          heroTitle: DEFAULT_STORE_SETTINGS.heroTitle,
          heroSubtitle: DEFAULT_STORE_SETTINGS.heroSubtitle,
          rewardsEnabled: DEFAULT_STORE_SETTINGS.rewardsEnabled,
          limitedEditionsEnabled: DEFAULT_STORE_SETTINGS.limitedEditionsEnabled,
          supportEmail: "support@polacraft.com"
        }
      });
    } else if (settings.freeShippingThreshold === 3000 || settings.freeShippingThreshold > 499) {
      // Force sync legacy 3000 threshold to 499 in Neon PostgreSQL Database
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          freeShippingThreshold: 499.0,
          shippingFee: 60.0,
          collectorRewardThreshold: 899.0,
          premiumRewardThreshold: 1499.0
        }
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ settings: DEFAULT_STORE_SETTINGS, fallback: true });
  }
}
