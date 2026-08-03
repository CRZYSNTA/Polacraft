"use server";

import { prisma } from "@/lib/prisma";
import { OrderSource, OrderType, PaymentMode, PaymentStatus, ShippingStatus, OrderTag } from "@prisma/client";
import { calculateOrderProfitMetrics, calculateItemUnitBreakdown } from "@/lib/profitEngine";

export interface OrderItemInput {
  productId?: string;
  isCustomItem?: boolean;
  title: string;
  description?: string;
  size: string;
  frame: string;
  sku?: string;
  productSlug?: string;
  thumbnailUrl?: string;
  originalPrice: number;
  unitPrice: number;
  unitCost?: number;
  discount?: number;
  quantity: number;
}

export interface CreateOrderOrQuoteInput {
  orderType: "ORDER" | "QUOTE" | "DRAFT";
  orderSource: "WEBSITE" | "WHATSAPP" | "INSTAGRAM" | "PHONE" | "DIRECT_SALE";
  customerName: string;
  phone: string;
  email: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string;
  shippingZip: string;
  shippingCountry?: string;
  items: OrderItemInput[];
  shippingCost?: number;
  shippingType?: string;
  discountAmount?: number;
  discountType?: "PERCENTAGE" | "FIXED";
  paymentMethod?: string;
  paymentMode?: "UPI" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "COD";
  amountPaidNow?: number;
  transactionRef?: string;
  tags?: OrderTag[];
  notes?: string;
  attachmentUrls?: { url: string; name: string; fileType: string }[];
}

// ----------------------------------------------------
// 1. Atomic Concurrency-Safe Sequence Locks
// ----------------------------------------------------
export async function getNextOrderNumber(orderType: "ORDER" | "QUOTE" | "DRAFT", client: any = prisma): Promise<string> {
  const currentYear = new Date().getFullYear();
  const prefix = orderType === "QUOTE" ? "QUO" : "ORD";

  const seq = await client.orderSequence.upsert({
    where: { year: currentYear },
    update: { lastValue: { increment: 1 } },
    create: { year: currentYear, lastValue: 1 },
  });
  const formattedNum = String(seq.lastValue).padStart(6, "0");
  return `${prefix}-${currentYear}-${formattedNum}`;
}

export async function getNextInvoiceNumber(client: any = prisma): Promise<string> {
  const currentYear = new Date().getFullYear();

  const seq = await client.invoiceSequence.upsert({
    where: { year: currentYear },
    update: { lastValue: { increment: 1 } },
    create: { year: currentYear, lastValue: 1 },
  });
  const formattedNum = String(seq.lastValue).padStart(6, "0");
  return `POL-${currentYear}-${formattedNum}`;
}

// ----------------------------------------------------
// 2. Customer Lookup & Dynamic Creation
// ----------------------------------------------------
export async function lookupCustomerByPhoneAction(queryPhone: string) {
  try {
    const cleanPhone = queryPhone.replace(/\D/g, "");
    if (!cleanPhone) return { success: false, error: "Invalid phone number" };

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: { contains: cleanPhone } },
          { orders: { some: { phone: { contains: cleanPhone } } } },
        ],
      },
      include: {
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
          include: { items: true },
        },
        addresses: true,
      },
    });

    if (!user) {
      // Search orders directly if user record is missing
      const recentOrder = await prisma.order.findFirst({
        where: { phone: { contains: cleanPhone } },
        orderBy: { createdAt: "desc" },
        include: { items: true },
      });

      if (recentOrder) {
        return {
          success: true,
          customer: {
            name: recentOrder.shippingName,
            phone: recentOrder.phone,
            email: recentOrder.email,
            street: recentOrder.shippingStreet,
            city: recentOrder.shippingCity,
            state: recentOrder.shippingState,
            zip: recentOrder.shippingZip,
            totalOrders: 1,
            lifetimeValue: recentOrder.total,
          },
        };
      }

      return { success: false, customer: null };
    }

    const totalOrders = user.orders.length;
    const lifetimeValue = user.orders.reduce((acc, o) => acc + o.total, 0);

    return {
      success: true,
      customer: {
        id: user.id,
        name: user.name || "Customer",
        phone: user.phone || cleanPhone,
        email: user.email,
        street: user.addresses[0]?.street || user.orders[0]?.shippingStreet || "",
        city: user.addresses[0]?.city || user.orders[0]?.shippingCity || "",
        state: user.addresses[0]?.state || user.orders[0]?.shippingState || "",
        zip: user.addresses[0]?.zip || user.orders[0]?.shippingZip || "",
        totalOrders,
        lifetimeValue,
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 3. Multi-Field Product Search Action
// ----------------------------------------------------
export async function searchProductsForOrderAction(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      const popular = await prisma.product.findMany({
        take: 12,
        orderBy: { reviewCount: "desc" },
        include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
      });
      return { success: true, products: popular };
    }

    const q = query.trim();
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { film: { contains: q, mode: "insensitive" } },
          { director: { contains: q, mode: "insensitive" } },
          { cast: { hasSome: [q] } },
          { collectionName: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
          { id: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 20,
      include: { images: { take: 1, orderBy: { sortOrder: "asc" } } },
    });

    return { success: true, products };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 4. Create Order / Quote Action (Atomic Engine)
// ----------------------------------------------------
export async function createOrderOrQuoteAction(input: CreateOrderOrQuoteInput) {
  try {
    // Perform Atomic Transaction with extended timeout for serverless DB
    const newOrder = await prisma.$transaction(
      async (tx) => {
        const orderNumber = await getNextOrderNumber(input.orderType, tx);
        const siteSettings = await tx.siteSettings.findFirst();

        const expenseCfg = siteSettings ? {
          costA5: siteSettings.costA5,
          costA4: siteSettings.costA4,
          costA3: siteSettings.costA3,
          costA2: siteSettings.costA2,
          costCanvas: siteSettings.costCanvas,
          costBlackFrame: siteSettings.costBlackFrame,
          costWoodFrame: siteSettings.costWoodFrame,
          packagingCostPerOrder: siteSettings.packagingCostPerOrder,
          gatewayFeePercent: siteSettings.gatewayFeePercent,
          gstTaxPercent: siteSettings.gstTaxPercent,
        } : undefined;

        let calculatedSubtotal = 0;
        const itemsData = input.items.map((item) => {
          const lineTotal = item.unitPrice * item.quantity;
          calculatedSubtotal += lineTotal;
          const breakdown = calculateItemUnitBreakdown(item.size, item.frame, expenseCfg);

          return {
            productId: item.productId || null,
            isCustomItem: item.isCustomItem ?? !item.productId,
            title: item.title,
            description: item.description || null,
            size: item.size || "A4",
            frame: item.frame || "UNFRAMED",
            sku: item.sku || null,
            productSlug: item.productSlug || null,
            thumbnailUrl: item.thumbnailUrl || null,
            originalPrice: item.originalPrice || item.unitPrice,
            price: item.unitPrice,
            printCost: breakdown.printCost,
            frameCost: breakdown.frameCost,
            unitCost: breakdown.unitCost,
            discount: item.discount || 0,
            quantity: item.quantity,
          };
        });

        const shippingCost = input.shippingCost || 0;
        const discountAmount = input.discountAmount || 0;
        const grandTotal = Math.max(0, calculatedSubtotal + shippingCost - discountAmount);

        let initialShippingStatus: ShippingStatus = "WHATSAPP_PENDING";
        if (input.orderType === "QUOTE") {
          initialShippingStatus = "QUOTE";
        } else if (input.orderType === "DRAFT") {
          initialShippingStatus = "DRAFT";
        } else if ((input.amountPaidNow || 0) >= grandTotal) {
          initialShippingStatus = "CONFIRMED";
        }

        const initialPaymentStatus: PaymentStatus =
          (input.amountPaidNow || 0) >= grandTotal
            ? "PAID"
            : (input.amountPaidNow || 0) > 0
            ? "PARTIALLY_PAID"
            : "PENDING";

        const profitMetrics = calculateOrderProfitMetrics(
          input.items,
          shippingCost,
          input.shippingType || "Standard",
          discountAmount,
          0,
          expenseCfg
        );

        // 1. Create User if email doesn't exist
        let userId: string | null = null;
        if (input.email) {
          const existingUser = await tx.user.findUnique({ where: { email: input.email } });
          if (existingUser) {
            userId = existingUser.id;
          } else {
            const createdUser = await tx.user.create({
              data: {
                email: input.email,
                name: input.customerName,
                phone: input.phone,
              },
            });
            userId = createdUser.id;
          }
        }

        const isStockApproved =
          (initialShippingStatus as ShippingStatus) === "CONFIRMED" ||
          (initialShippingStatus as ShippingStatus) === "PAID";

        // 2. Reserve / Deduct Stock ONLY IF CONFIRMED or PAID
        if (isStockApproved) {
          for (const item of input.items) {
            if (item.productId && !item.isCustomItem) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  inventory: { decrement: item.quantity },
                  editionSold: { increment: item.quantity },
                },
              });
            }
          }
        }

        // 3. Create Order Record
        const createdOrder = await tx.order.create({
          data: {
            orderNumber,
            orderType: input.orderType as OrderType,
            orderSource: input.orderSource as OrderSource,
            userId,
            email: input.email,
            phone: input.phone,
            shippingName: input.customerName,
            shippingStreet: input.shippingStreet,
            shippingCity: input.shippingCity,
            shippingState: input.shippingState || null,
            shippingZip: input.shippingZip,
            shippingCountry: input.shippingCountry || "India",
            shippingCost,
            shippingType: input.shippingType || "Standard",
            discount: discountAmount,
            discountType: input.discountType || "FIXED",
            subtotal: calculatedSubtotal,
            total: grandTotal,
            printingCost: profitMetrics.printingCost,
            frameCost: profitMetrics.frameCost,
            packagingCost: profitMetrics.packagingCost,
            gatewayFee: profitMetrics.gatewayFee,
            rewardCost: profitMetrics.rewardCost,
            gstAmount: profitMetrics.gstAmount,
            totalCost: profitMetrics.totalExpense,
            netProfit: profitMetrics.netProfit,
            profitMargin: profitMetrics.profitMargin,
            paymentMethod: input.paymentMethod || "UPI",
            paymentStatus: initialPaymentStatus,
            shippingStatus: initialShippingStatus,
            inventoryDeductedAt: isStockApproved ? new Date() : null,
            tags: input.tags || [],
            items: {
              create: itemsData,
            },
            statusHistory: {
              create: {
                status: initialShippingStatus,
                comment: `Order initialized via ${input.orderSource} as ${input.orderType}.`,
              },
            },
            auditEvents: {
              create: {
                event: "ORDER_CREATED",
                details: `Order #${orderNumber} created via ${input.orderSource}. Initial Status: ${initialShippingStatus}`,
                performedBy: "Admin",
              },
            },
          },
          include: {
            items: { include: { product: true } },
            payments: true,
            invoices: true,
            auditEvents: true,
          },
        });

        // 4. Record Initial Payment if amount > 0
        if ((input.amountPaidNow || 0) > 0) {
          await tx.orderPayment.create({
            data: {
              orderId: createdOrder.id,
              amount: input.amountPaidNow!,
              paymentMode: (input.paymentMode as PaymentMode) || "UPI",
              transactionRef: input.transactionRef || null,
              recordedBy: "Admin",
              notes: "Initial payment recorded during order creation.",
            },
          });
        }

        // 5. Generate Immutable Invoice if Order is CONFIRMED or PAID
        if (
          input.orderType === "ORDER" &&
          (initialPaymentStatus === "PAID" || initialShippingStatus === "CONFIRMED")
        ) {
          const invNumber = await getNextInvoiceNumber(tx);
          const siteSettings = await tx.siteSettings.findFirst();

          await tx.invoice.create({
            data: {
              invoiceNumber: invNumber,
              version: 1,
              orderId: createdOrder.id,
              subtotal: calculatedSubtotal,
              discount: discountAmount,
              tax: 0,
              total: grandTotal,
              businessSnapshot: {
                businessName: siteSettings?.heroTitle ? "Polacraft Studio" : "Polacraft",
                gstin: siteSettings?.gstNumber || "32AABCP1234F1ZP",
                supportEmail: siteSettings?.supportEmail || "support@polacraft.com",
                logoUrl: siteSettings?.logo || "/images/polacraft-logo.png",
                address: "Kochi, Kerala, India - 682001",
              },
            },
          });
        }

        // 6. Record Initial Note if provided
        if (input.notes) {
          await tx.orderNote.create({
            data: {
              orderId: createdOrder.id,
              author: "Admin",
              content: input.notes,
            },
          });
        }

        return createdOrder;
      },
      { maxWait: 10000, timeout: 25000 }
    );

    return { success: true, order: newOrder };
  } catch (err: any) {
    console.error("[Create Order Error]:", err);
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 5. One-Click Convert Quotation to Order
// ----------------------------------------------------
export async function convertQuoteToOrderAction(quoteId: string) {
  try {
    const quote = await prisma.order.findUnique({
      where: { id: quoteId },
      include: { items: true },
    });

    if (!quote || quote.orderType !== "QUOTE") {
      return { success: false, error: "Valid quotation not found." };
    }

    const orderNumber = await getNextOrderNumber("ORDER");

    const updated = await prisma.$transaction(
      async (tx) => {
        // Reserve inventory for catalog items
        for (const item of quote.items) {
          if (item.productId && !item.isCustomItem) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                inventory: { decrement: item.quantity },
                editionSold: { increment: item.quantity },
              },
            });
          }
        }

        const order = await tx.order.update({
          where: { id: quoteId },
          data: {
            orderNumber,
            orderType: "ORDER",
            shippingStatus: "CONFIRMED",
            paymentStatus: "PENDING",
            inventoryDeductedAt: new Date(),
            convertedFromQuoteId: quoteId,
            auditEvents: {
              create: {
                event: "QUOTE_CONVERTED_TO_ORDER",
                details: `Quotation #${quote.orderNumber} successfully converted to official Order #${orderNumber}. Inventory reserved.`,
                performedBy: "Admin",
              },
            },
          },
          include: { items: true, payments: true, invoices: true, auditEvents: true },
        });

        // Issue Immutable Invoice
        const invNumber = await getNextInvoiceNumber(tx);
        const siteSettings = await tx.siteSettings.findFirst();

        await tx.invoice.create({
          data: {
            invoiceNumber: invNumber,
            version: 1,
            orderId: order.id,
            subtotal: order.subtotal,
            discount: order.discount,
            tax: 0,
            total: order.total,
            businessSnapshot: {
              businessName: "Polacraft Studio",
              gstin: siteSettings?.gstNumber || "32AABCP1234F1ZP",
              supportEmail: siteSettings?.supportEmail || "support@polacraft.com",
              logoUrl: siteSettings?.logo || "/images/polacraft-logo.png",
            },
          },
        });

        return order;
      },
      { maxWait: 10000, timeout: 25000 }
    );

    return { success: true, order: updated };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

// ----------------------------------------------------
// 6. Record Multi-Payment Entry Action
// ----------------------------------------------------
export async function recordOrderPaymentAction(
  orderId: string,
  amount: number,
  mode: "UPI" | "CASH" | "BANK_TRANSFER" | "CREDIT_CARD" | "DEBIT_CARD" | "COD",
  transactionRef?: string,
  paymentProofUrl?: string,
  notes?: string
) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payments: true, items: true },
    });

    if (!order) return { success: false, error: "Order not found." };

    const result = await prisma.$transaction(
      async (tx) => {
        // Create Payment Ledger Entry
        const payment = await tx.orderPayment.create({
          data: {
            orderId,
            amount,
            paymentMode: mode as PaymentMode,
            transactionRef: transactionRef || null,
            paymentProof: paymentProofUrl || null,
            recordedBy: "Admin",
            notes: notes || `Recorded ₹${amount} payment via ${mode}.`,
          },
        });

        const totalPaid = order.payments.reduce((sum, p) => sum + p.amount, 0) + amount;
        const newPaymentStatus: PaymentStatus =
          totalPaid >= order.total
            ? "PAID"
            : totalPaid > 0
            ? "PARTIALLY_PAID"
            : "PENDING";

        const newShippingStatus: ShippingStatus =
          newPaymentStatus === "PAID" && order.shippingStatus === "WHATSAPP_PENDING"
            ? "CONFIRMED"
            : order.shippingStatus;

        // Reserve stock if newly confirmed
        if (
          (newPaymentStatus === "PAID" || newShippingStatus === "CONFIRMED") &&
          !order.inventoryDeductedAt
        ) {
          for (const item of order.items) {
            if (item.productId && !item.isCustomItem) {
              await tx.product.update({
                where: { id: item.productId },
                data: {
                  inventory: { decrement: item.quantity },
                  editionSold: { increment: item.quantity },
                },
              });
            }
          }
        }

        // Update Order Status
        const updatedOrder = await tx.order.update({
          where: { id: orderId },
          data: {
            paymentStatus: newPaymentStatus,
            shippingStatus: newShippingStatus,
            inventoryDeductedAt:
              !order.inventoryDeductedAt && (newPaymentStatus === "PAID" || newShippingStatus === "CONFIRMED")
                ? new Date()
                : order.inventoryDeductedAt,
            paymentVerifiedAt: newPaymentStatus === "PAID" ? new Date() : order.paymentVerifiedAt,
            auditEvents: {
              create: {
                event: "PAYMENT_RECORDED",
                details: `Payment of ₹${amount} (${mode}) recorded. Total Paid: ₹${totalPaid}/${order.total}. Status: ${newPaymentStatus}`,
                performedBy: "Admin",
              },
            },
          },
          include: { payments: true, items: true, invoices: true, auditEvents: true },
        });

        // Auto-issue Invoice if order just reached PAID and has no invoice yet
        const existingInvoices = await tx.invoice.findMany({ where: { orderId } });
        if (newPaymentStatus === "PAID" && existingInvoices.length === 0) {
          const invNumber = await getNextInvoiceNumber(tx);
          const siteSettings = await tx.siteSettings.findFirst();

          await tx.invoice.create({
            data: {
              invoiceNumber: invNumber,
              version: 1,
              orderId,
              subtotal: order.subtotal,
              discount: order.discount,
              tax: 0,
              total: order.total,
              businessSnapshot: {
                businessName: "Polacraft Studio",
                gstin: siteSettings?.gstNumber || "32AABCP1234F1ZP",
                supportEmail: siteSettings?.supportEmail || "support@polacraft.com",
              },
            },
          });
        }

        return updatedOrder;
      },
      { maxWait: 10000, timeout: 25000 }
    );

    return { success: true, order: result };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
