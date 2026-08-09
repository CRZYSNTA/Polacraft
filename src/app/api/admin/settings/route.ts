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
      
      // Enterprise Variable Unit Expenses
      costA5: body.costA5 !== undefined ? parseFloat(body.costA5) : 15.0,
      costA4: body.costA4 !== undefined ? parseFloat(body.costA4) : 28.0,
      costA3: body.costA3 !== undefined ? parseFloat(body.costA3) : 52.0,
      costA2: body.costA2 !== undefined ? parseFloat(body.costA2) : 100.0,
      costCanvas: body.costCanvas !== undefined ? parseFloat(body.costCanvas) : 200.0,
      costBlackFrame: body.costBlackFrame !== undefined ? parseFloat(body.costBlackFrame) : 120.0,
      costWoodFrame: body.costWoodFrame !== undefined ? parseFloat(body.costWoodFrame) : 150.0,
      packagingCostPerOrder: body.packagingCostPerOrder !== undefined ? parseFloat(body.packagingCostPerOrder) : 18.0,
      gatewayFeePercent: body.gatewayFeePercent !== undefined ? parseFloat(body.gatewayFeePercent) : 2.0,
      gstTaxPercent: body.gstTaxPercent !== undefined ? parseFloat(body.gstTaxPercent) : 18.0,

      aiEnabled: body.aiEnabled !== undefined ? Boolean(body.aiEnabled) : true,
      aiProvider: body.aiProvider || "openai",
      aiVisionEnabled: body.aiVisionEnabled !== undefined ? Boolean(body.aiVisionEnabled) : true,
      aiMetadataEnabled: body.aiMetadataEnabled !== undefined ? Boolean(body.aiMetadataEnabled) : true,
      aiSocialCaptionsEnabled: body.aiSocialCaptionsEnabled !== undefined ? Boolean(body.aiSocialCaptionsEnabled) : true,
      aiDefaultTone: body.aiDefaultTone || "Collector Focused",
      aiDefaultLanguage: body.aiDefaultLanguage || "English",
      aiMaxDescriptionLength: body.aiMaxDescriptionLength !== undefined ? parseInt(body.aiMaxDescriptionLength) : 120,

      // Custom Print Studio Live Pricing Controls
      customBasePriceA5: body.customBasePriceA5 !== undefined ? parseFloat(body.customBasePriceA5) : 45.0,
      customBasePriceA4: body.customBasePriceA4 !== undefined ? parseFloat(body.customBasePriceA4) : 70.0,
      customBasePriceA3: body.customBasePriceA3 !== undefined ? parseFloat(body.customBasePriceA3) : 100.0,
      customMultSingle: body.customMultSingle !== undefined ? parseFloat(body.customMultSingle) : 1.0,
      customMultSplit3: body.customMultSplit3 !== undefined ? parseFloat(body.customMultSplit3) : 2.5,
      customMultSplit2x2: body.customMultSplit2x2 !== undefined ? parseFloat(body.customMultSplit2x2) : 3.2,
      customMultRetro: body.customMultRetro !== undefined ? parseFloat(body.customMultRetro) : 1.5,
      customMultPocket: body.customMultPocket !== undefined ? parseFloat(body.customMultPocket) : 0.8,
      customMultPhotobooth: body.customMultPhotobooth !== undefined ? parseFloat(body.customMultPhotobooth) : 0.9,
      customFrameAddonA5: body.customFrameAddonA5 !== undefined ? parseFloat(body.customFrameAddonA5) : 155.0,
      customFrameAddonA4: body.customFrameAddonA4 !== undefined ? parseFloat(body.customFrameAddonA4) : 180.0,
      customFrameAddonA3: body.customFrameAddonA3 !== undefined ? parseFloat(body.customFrameAddonA3) : 200.0,

      // Originkit Hero Carousel Controls
      heroSelectedPosterIds: Array.isArray(body.heroSelectedPosterIds) ? body.heroSelectedPosterIds : [],
      heroSelectedPosterIdsMobile: Array.isArray(body.heroSelectedPosterIdsMobile) ? body.heroSelectedPosterIdsMobile : [],
      heroSelectedPosterIdsDesktop: Array.isArray(body.heroSelectedPosterIdsDesktop) ? body.heroSelectedPosterIdsDesktop : [],
      heroSpeedMobile: body.heroSpeedMobile !== undefined ? parseFloat(body.heroSpeedMobile) : 4.0,
      heroSpeedDesktop: body.heroSpeedDesktop !== undefined ? parseFloat(body.heroSpeedDesktop) : 2.7,
      heroCircleInnerRadius: body.heroCircleInnerRadius !== undefined ? parseFloat(body.heroCircleInnerRadius) : 25.0,
      heroCircleRingGap: body.heroCircleRingGap !== undefined ? parseFloat(body.heroCircleRingGap) : 95.0,
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

    // Append to ExpenseSettingHistory for version control
    await prisma.expenseSettingHistory.create({
      data: {
        costA5: dataToUpdate.costA5,
        costA4: dataToUpdate.costA4,
        costA3: dataToUpdate.costA3,
        costA2: dataToUpdate.costA2,
        costCanvas: dataToUpdate.costCanvas,
        costBlackFrame: dataToUpdate.costBlackFrame,
        costWoodFrame: dataToUpdate.costWoodFrame,
        packagingCostPerOrder: dataToUpdate.packagingCostPerOrder,
        gatewayFeePercent: dataToUpdate.gatewayFeePercent,
        gstTaxPercent: dataToUpdate.gstTaxPercent,
        note: "Saved via Admin Settings control panel."
      }
    });

    return NextResponse.json({ settings, success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
