import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      shippingName,
      email,
      phone = "",
      shippingStreet,
      shippingCity,
      shippingState,
      shippingZip,
      shippingCountry = "India",
      paymentMethod = "WHATSAPP_UPI",
      couponCode = "",
      discount = 0,
      subtotal,
      shippingCost,
      total,
      items,
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Generate unique order number format: POLA-YYYYMMDD-XXX
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `POLA-${todayStr}-${randomSuffix}`;

    const settings = await prisma.siteSettings.findFirst();
    const whatsappPhone = "919845678910";

    // Format human-readable date (e.g. 20 Jul 2026 3:45 PM)
    const formattedDate = new Date().toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Create Order in Prisma with WHATSAPP_PENDING status
    // Note: Stock inventory is NOT reduced yet until admin approves payment!
    const order = await prisma.order.create({
      data: {
        orderNumber,
        shippingName,
        email,
        phone,
        shippingStreet,
        shippingCity,
        shippingState,
        shippingZip,
        shippingCountry,
        paymentMethod,
        paymentStatus: "PENDING",
        shippingStatus: "WHATSAPP_PENDING",
        subtotal: Number(subtotal),
        shippingCost: Number(shippingCost),
        taxAmount: 0,
        discount: Number(discount),
        total: Number(total),
        notes: couponCode ? `Coupon applied: ${couponCode}` : undefined,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            price: Number(item.price),
            size: item.size,
            frame: item.frame,
          })),
        },
        statusHistory: {
          create: {
            status: "WHATSAPP_PENDING",
            comment: `Order created via WhatsApp Checkout (Ref #${orderNumber}). Stock pending admin payment verification.`,
          },
        },
      },
      include: {
        items: { include: { product: true } },
      },
    });

    // Improved WhatsApp Message Format
    let itemsFormattedText = items
      .map((item: any, idx: number) => {
        const title = item.productTitle || item.product?.title || "Poster Print";
        return `${idx + 1}. ${title}\n• Size: ${item.size}\n• Frame: ${item.frame}\n• Qty: ${item.quantity}\n• Price: ₹${item.price}`;
      })
      .join("\n\n");

    const messageText = `🛍️ *New Polacraft Order*

Order:
${orderNumber}

Date:
${formattedDate}

Customer:
${shippingName}

Phone:
${phone || "Not provided"}

Address:
${shippingStreet}
${shippingCity}, ${shippingState} - ${shippingZip}

--------------------------------

Items:

${itemsFormattedText}

--------------------------------

Subtotal: ₹${subtotal}
${couponCode ? `Coupon: ${couponCode}\nDiscount: -₹${discount}\n` : ""}Shipping: ${shippingCost === 0 ? "FREE" : `₹${shippingCost}`}

Total:
₹${total}

Please confirm my order.`;

    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;

    return NextResponse.json({ success: true, order, whatsappUrl });
  } catch (error: any) {
    console.error("[Checkout API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process order" },
      { status: 500 }
    );
  }
}
