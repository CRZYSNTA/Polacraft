import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { DEFAULT_STORE_SETTINGS } from "@/services/promotionEngine";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    let settings = await prisma.siteSettings.findFirst();

    const dataToUpdate = {
      shippingFee: body.shippingFee !== undefined ? parseFloat(body.shippingFee) : DEFAULT_STORE_SETTINGS.shippingFee,
      freeShippingThreshold: body.freeShippingThreshold !== undefined ? parseFloat(body.freeShippingThreshold) : DEFAULT_STORE_SETTINGS.freeShippingThreshold,
      collectorRewardThreshold: body.collectorRewardThreshold !== undefined ? parseFloat(body.collectorRewardThreshold) : DEFAULT_STORE_SETTINGS.collectorRewardThreshold,
      premiumRewardThreshold: body.premiumRewardThreshold !== undefined ? parseFloat(body.premiumRewardThreshold) : DEFAULT_STORE_SETTINGS.premiumRewardThreshold,
      loyaltyPointsRatio: body.loyaltyPointsRatio !== undefined ? parseFloat(body.loyaltyPointsRatio) : DEFAULT_STORE_SETTINGS.loyaltyPointsRatio,
      heroTitle: body.heroTitle || DEFAULT_STORE_SETTINGS.heroTitle,
      heroSubtitle: body.heroSubtitle || DEFAULT_STORE_SETTINGS.heroSubtitle,
      rewardsEnabled: body.rewardsEnabled !== undefined ? Boolean(body.rewardsEnabled) : true,
      limitedEditionsEnabled: body.limitedEditionsEnabled !== undefined ? Boolean(body.limitedEditionsEnabled) : true,
      supportEmail: body.supportEmail || "support@polacraft.com",
      gstNumber: body.gstNumber || null,
      instagramUrl: body.instagramUrl || null,
      aiEnabled: body.aiEnabled !== undefined ? Boolean(body.aiEnabled) : true,
      aiProvider: body.aiProvider || "openai",
      aiVisionEnabled: body.aiVisionEnabled !== undefined ? Boolean(body.aiVisionEnabled) : true,
      aiMetadataEnabled: body.aiMetadataEnabled !== undefined ? Boolean(body.aiMetadataEnabled) : true,
      aiSocialCaptionsEnabled: body.aiSocialCaptionsEnabled !== undefined ? Boolean(body.aiSocialCaptionsEnabled) : true,
      aiDefaultTone: body.aiDefaultTone || "Collector Focused",
      aiDefaultLanguage: body.aiDefaultLanguage || "English",
      aiMaxDescriptionLength: body.aiMaxDescriptionLength !== undefined ? parseInt(body.aiMaxDescriptionLength) : 120
    };

    if (settings) {
      settings = await prisma.siteSettings.update({
        where: { id: settings.id },
        data: dataToUpdate
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: dataToUpdate
      });
    }

    return NextResponse.json({ settings, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
