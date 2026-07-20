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

    // Resolve every item to a valid Prisma Product ID and include product details
    const resolvedItems = [];
    const formattedItemDetails = [];

    for (const item of items) {
      const rawId = String(item.productId || "");
      const title = String(item.productTitle || item.title || "Malayalam Art Poster");

      let product = null;

      // 1. Try finding product by slug, title, or film
      try {
        product = await prisma.product.findFirst({
          where: {
            OR: [
              { slug: rawId.toLowerCase() },
              { title: { contains: title, mode: "insensitive" } },
              { film: { contains: title, mode: "insensitive" } },
            ],
          },
        });
      } catch (err) {
        console.warn("[Checkout Product Lookup Warning]:", err);
      }

      // 2. Fallback to first available product in DB if specific title isn't seeded yet
      if (!product) {
        product = await prisma.product.findFirst();
      }

      // 3. If DB has zero products, dynamically seed this poster into DB
      if (!product) {
        const cleanSlug = (rawId || title)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        product = await prisma.product.create({
          data: {
            title,
            slug: cleanSlug || "manichitrathazhu",
            film: title,
            year: 1993,
            director: "Polacraft Master Series",
            genre: "Classics",
            price: Number(item.price) || 1799,
            inventory: 50,
            primaryColor: "#1E1E1E",
            accentColor: "#10B981",
            bgColor: "#FAFAF8",
            textColor: "#1E1E1E",
            tagline: "Fine Art Malayalam Cinema Poster",
            story: "Handcrafted museum-quality archival print.",
            designNotes: "Archival 250 GSM cotton paper.",
            collection: {
              connectOrCreate: {
                where: { name: "Classics" },
                create: { name: "Classics", description: "Iconic Malayalam Cinema Posters" },
              },
            },
          },
        });
      }

      resolvedItems.push({
        productId: product.id,
        quantity: Number(item.quantity),
        price: Number(item.price),
        size: item.size,
        frame: item.frame,
      });

      const desc = product.tagline || product.story || `${product.film} (${product.year})`;
      formattedItemDetails.push({
        title: product.title,
        desc,
        size: item.size,
        frame: item.frame,
        qty: item.quantity,
        price: item.price,
      });
    }

    // Generate unique order number format: POLA-YYYYMMDD-XXX
    const todayStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const orderNumber = `POLA-${todayStr}-${randomSuffix}`;

    const whatsappPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "919496682919";

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
          create: resolvedItems,
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

    // Format WhatsApp Message with Product Details & Descriptions
    let itemsFormattedText = formattedItemDetails
      .map((item, idx) => {
        return `${idx + 1}. *${item.title}*\n   _"${item.desc}"_\n   • Size: ${item.size}\n   • Frame: ${item.frame}\n   • Quantity: ${item.qty}\n   • Price: ₹${item.price}`;
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

Items Ordered:

${itemsFormattedText}

--------------------------------

Subtotal: ₹${subtotal}
${couponCode ? `Coupon: ${couponCode}\nDiscount: -₹${discount}\n` : ""}Shipping: ${shippingCost === 0 ? "FREE" : `₹${shippingCost}`}

Total:
₹${total}

Please confirm my order & send payment details.`;

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
