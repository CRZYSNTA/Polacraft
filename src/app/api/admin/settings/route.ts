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
