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

    const shippingName = asRequiredText(body.shippingName, "Shipping name");
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = asRequiredText(body.phone, "Phone number");
    const shippingStreet = asRequiredText(body.shippingStreet, "Shipping address");
    const shippingCity = asRequiredText(body.shippingCity, "Shipping city");
    const shippingState = asRequiredText(body.shippingState, "Shipping state");
    const shippingZip = asRequiredText(body.shippingZip, "Shipping postal code");
    const shippingCountry = typeof body.shippingCountry === "string" && body.shippingCountry.trim()
      ? body.shippingCountry.trim()
      : "India";

    const resolvedItems = [] as Array<{ productId: string; quantity: number; price: number; size: string; frame: string; title: string; description: string }>;

    for (const item of items) {
      const productId = asRequiredText(item.productId, "Product");
      const size = asRequiredText(item.size, "Size");
      const frame = asRequiredText(item.frame, "Frame");
      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1 || quantity > MAX_QUANTITY_PER_ITEM) {
        return NextResponse.json({ error: "Each item quantity must be between 1 and 10." }, { status: 400 });
      }
      if (!sizes.some((option) => option.id === size) || !frames.some((option) => option.id === frame)) {
        return NextResponse.json({ error: "An unsupported product option was selected." }, { status: 400 });
      }

      const product = await prisma.product.findFirst({
        where: { OR: [{ id: productId }, { slug: productId.toLowerCase() }] },
      });
      if (!product || product.isSoldOut || (!product.isPreorder && product.inventory < quantity)) {
        return NextResponse.json({ error: `"${productId}" is unavailable in the requested quantity.` }, { status: 409 });
      }

      const price = calculateProductPrice(product.price, size, frame);
      resolvedItems.push({
        productId: product.id,
        quantity,
        price,
        size,
        frame,
        title: product.title,
        description: product.tagline || product.story || `${product.film} (${product.year})`,
      });
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
        items: { create: resolvedItems.map(({ title: _title, description: _description, ...item }) => item) },
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
