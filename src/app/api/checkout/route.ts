import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProductPrice, frames, sizes } from "@/lib/cms/products";
import { evaluatePromotionEngine, DEFAULT_STORE_SETTINGS, REWARD_OPTIONS_LIST } from "@/services/promotionEngine";

const MAX_ITEMS_PER_ORDER = 20;
const MAX_QUANTITY_PER_ITEM = 10;

type CheckoutItem = {
  productId?: unknown;
  quantity?: unknown;
  size?: unknown;
  frame?: unknown;
};

function asRequiredText(value: unknown, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${field} is required.`);
  }
  return value.trim();
}

function orderNumber(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  return `POLA-${date}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items = body.items as CheckoutItem[];
    const selectedRewardIds = Array.isArray(body.selectedRewards) ? body.selectedRewards : [];

    if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS_PER_ORDER) {
      return NextResponse.json({ error: "Your cart must contain between 1 and 20 items." }, { status: 400 });
    }

    const shippingName = typeof body.shippingName === "string" && body.shippingName.trim() ? body.shippingName.trim() : "Valued Customer";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : "Not Provided";
    const shippingStreet = typeof body.shippingStreet === "string" && body.shippingStreet.trim() ? body.shippingStreet.trim() : "Address Pending";
    const shippingCity = typeof body.shippingCity === "string" && body.shippingCity.trim() ? body.shippingCity.trim() : "Kochi";
    const shippingState = typeof body.shippingState === "string" && body.shippingState.trim() ? body.shippingState.trim() : "Kerala";
    const shippingZip = typeof body.shippingZip === "string" && body.shippingZip.trim() ? body.shippingZip.trim() : "682001";
    const shippingCountry = typeof body.shippingCountry === "string" && body.shippingCountry.trim()
      ? body.shippingCountry.trim()
      : "India";

    const resolvedItems = [] as Array<{
      productId: string | null;
      isCustomItem: boolean;
      quantity: number;
      price: number;
      size: string;
      frame: string;
      title: string;
      description: string;
    }>;

    for (const item of items) {
      const productId = typeof item.productId === "string" && item.productId.trim() ? item.productId.trim() : "poster-print";
      const rawSize = typeof item.size === "string" ? item.size.trim() : "A4";
      const rawFrame = typeof item.frame === "string" ? item.frame.trim() : "unframed";
      const size = sizes.some((s) => s.id === rawSize) ? rawSize : "A4";
      const frame = frames.some((f) => f.id === rawFrame) ? rawFrame : "unframed";
      const quantity = Math.max(1, Math.min(MAX_QUANTITY_PER_ITEM, Number(item.quantity) || 1));

      // Try database lookup first by id or slug
      const product = await prisma.product.findFirst({
        where: { OR: [{ id: productId }, { slug: productId.toLowerCase() }] },
      });

      if (product) {
        const price = calculateProductPrice(product.price, size, frame);
        resolvedItems.push({
          productId: product.id,
          isCustomItem: false,
          quantity,
          price,
          size,
          frame,
          title: product.title,
          description: product.tagline || product.story || `${product.film} (${product.year})`,
        });
      } else {
        // Fallback resolution for Custom Print Studio & static CMS catalog items
        const customTitle = (item as any).productTitle || (item as any).title || productId || "Custom Cinema Poster Print";
        const itemPrice = Number((item as any).price) || calculateProductPrice(499, size, frame);

        resolvedItems.push({
          productId: null,
          isCustomItem: true,
          quantity,
          price: itemPrice,
          size,
          frame,
          title: customTitle,
          description: "Archival Fine Art Cinema Print",
        });
      }
    }

    const subtotal = resolvedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    let couponCode: string | undefined;
    if (typeof body.couponCode === "string" && body.couponCode.trim()) {
      const code = body.couponCode.trim().toUpperCase();
      const coupon = await prisma.coupon.findUnique({ where: { code } });
      if (!coupon || !coupon.active || (coupon.expiryDate && coupon.expiryDate < new Date())) {
        return NextResponse.json({ error: "Coupon is invalid or expired." }, { status: 400 });
      }
      discount = coupon.discountType === "percentage"
        ? Math.round((subtotal * coupon.value) / 100)
        : Math.min(subtotal, coupon.value);
      couponCode = coupon.code;
    }

    const settingsFromDb = await prisma.siteSettings.findFirst();
    const siteSettings = {
      shippingFee: settingsFromDb?.shippingFee ?? DEFAULT_STORE_SETTINGS.shippingFee,
      freeShippingThreshold: settingsFromDb?.freeShippingThreshold ?? DEFAULT_STORE_SETTINGS.freeShippingThreshold,
      collectorRewardThreshold: settingsFromDb?.collectorRewardThreshold ?? DEFAULT_STORE_SETTINGS.collectorRewardThreshold,
      premiumRewardThreshold: settingsFromDb?.premiumRewardThreshold ?? DEFAULT_STORE_SETTINGS.premiumRewardThreshold,
      loyaltyPointsRatio: settingsFromDb?.loyaltyPointsRatio ?? DEFAULT_STORE_SETTINGS.loyaltyPointsRatio,
      heroTitle: settingsFromDb?.heroTitle || DEFAULT_STORE_SETTINGS.heroTitle,
      heroSubtitle: settingsFromDb?.heroSubtitle || DEFAULT_STORE_SETTINGS.heroSubtitle,
      rewardsEnabled: settingsFromDb?.rewardsEnabled !== undefined ? Boolean(settingsFromDb.rewardsEnabled) : true,
      limitedEditionsEnabled: settingsFromDb?.limitedEditionsEnabled !== undefined ? Boolean(settingsFromDb.limitedEditionsEnabled) : true
    };

    const promo = evaluatePromotionEngine(subtotal, siteSettings);
    const shippingCost = subtotal >= siteSettings.freeShippingThreshold ? 0 : siteSettings.shippingFee;
    const total = Math.max(0, subtotal - discount) + shippingCost;
    const number = orderNumber();

    // Prepare OrderRewards to create
    const orderRewardsToCreate = [] as Array<{ rewardType: string; rewardOption: string; quantity: number; estimatedCost: number }>;
    if (promo.unlockedRewardCount > 0 && selectedRewardIds.length > 0) {
      selectedRewardIds.slice(0, promo.unlockedRewardCount).forEach((rid: string) => {
        const optionObj = REWARD_OPTIONS_LIST.find(o => o.id === rid) || REWARD_OPTIONS_LIST[0];
        orderRewardsToCreate.push({
          rewardType: promo.unlockedRewardCount === 2 ? "PREMIUM" : "COLLECTOR",
          rewardOption: optionObj.label,
          quantity: 1,
          estimatedCost: 155.0
        });
      });
    }

    const order = await prisma.order.create({
      data: {
        orderNumber: number,
        shippingName,
        email,
        phone,
        shippingStreet,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
        paymentMethod: "WHATSAPP_UPI",
        paymentStatus: "PENDING",
        shippingStatus: "WHATSAPP_PENDING",
        subtotal,
        shippingCost,
        taxAmount: 0,
        discount,
        total,
        notes: couponCode ? `Coupon applied: ${couponCode}` : undefined,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            isCustomItem: item.isCustomItem,
            title: item.title,
            description: item.description,
            size: item.size,
            frame: item.frame,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        rewards: { create: orderRewardsToCreate },
        statusHistory: { create: { status: "WHATSAPP_PENDING", comment: "Order created via WhatsApp checkout. Payment is pending verification." } },
      },
    });

    const formattedItems = resolvedItems.map((item, index) =>
      `${index + 1}. *${item.title}*\n   _"${item.description}"_\n   • Size: ${item.size}\n   • Frame: ${item.frame}\n   • Quantity: ${item.quantity}\n   • Price: ₹${item.price}`
    ).join("\n\n");

    let rewardsFormattedSection = "";
    let totalSaved = discount + (shippingCost === 0 ? siteSettings.shippingFee : 0);

    if (promo.unlockedRewardCount > 0) {
      rewardsFormattedSection = `\n\n🎉 *UNLOCKED REWARDS*\n` +
        `• FREE Shipping Saved: ₹${siteSettings.shippingFee}\n` +
        orderRewardsToCreate.map(r => `• ${r.rewardType} REWARD: ${r.rewardOption}`).join("\n") +
        `\n• *Total Value Saved:* ₹${totalSaved + (orderRewardsToCreate.length * 155)}`;
    }

    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919496682919";
    const message = `🛍️ *New Polacraft Order*\n\nOrder: ${number}\n\nCustomer: ${shippingName}\nPhone: ${phone}\n\nAddress:\n${shippingStreet}\n${shippingCity}, ${shippingState} - ${shippingZip}\n\nItems Ordered:\n\n${formattedItems}${rewardsFormattedSection}\n\nSubtotal: ₹${subtotal}\n${couponCode ? `Coupon: ${couponCode}\nDiscount: -₹${discount}\n` : ""}Shipping: ${shippingCost === 0 ? "FREE" : `₹${shippingCost}`}\n\nTotal: ₹${total}\n\nPlease confirm my order & send payment details.`;

    return NextResponse.json({
      success: true,
      order,
      whatsappUrl: `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`,
    });
  } catch (error: any) {
    console.error("[Checkout API Error]:", error);
    return NextResponse.json({ error: error.message || "Failed to process order" }, { status: 400 });
  }
}
