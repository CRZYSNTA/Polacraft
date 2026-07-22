/**
 * Polacraft v1.0 Centralized Commerce & Business Logic Utilities
 */

export const FREE_SHIPPING_THRESHOLD = 499;
export const STANDARD_SHIPPING_FEE = 60;
export const POLACRAFT_WHATSAPP_PHONE = "919496682919";

export const SHIPPING_STATUS_METADATA: Record<
  string,
  { label: string; bg: string; color: string }
> = {
  WHATSAPP_PENDING: { label: "WhatsApp Pending", bg: "#DBEAFE", color: "#2563EB" },
  PENDING: { label: "Pending Verification", bg: "#FEF3C7", color: "#B45309" },
  CONFIRMED: { label: "Confirmed", bg: "#E0E7FF", color: "#4338CA" },
  PAID: { label: "Paid & Verified", bg: "#ECFDF5", color: "#047857" },
  PACKED: { label: "Packed", bg: "#F3E8FF", color: "#6B21A8" },
  SHIPPED: { label: "Shipped", bg: "#EFF6FF", color: "#1D4ED8" },
  OUT_FOR_DELIVERY: { label: "Out For Delivery", bg: "#FEF3C7", color: "#D97706" },
  DELIVERED: { label: "Delivered", bg: "#D1FAE5", color: "#065F46" },
  RETURNED: { label: "Returned", bg: "#F3F4F6", color: "#4B5563" },
  CANCELLED: { label: "Cancelled", bg: "#FEE2E2", color: "#DC2626" },
  EXPIRED: { label: "Expired (24h Unpaid)", bg: "#F1F5F9", color: "#64748B" },
};

/**
 * Generate unique Order Number format: POLA-YYYYMMDD-XXX
 */
export function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `POLA-${dateStr}-${randomSuffix}`;
}

/**
 * Calculate Shipping Fee based on Subtotal
 */
export function calculateShippingFee(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

/**
 * Format Pre-filled WhatsApp Order Message
 */
export function formatWhatsAppMessage(order: {
  orderNumber: string;
  createdAt?: Date | string;
  shippingName: string;
  phone?: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState?: string;
  shippingZip: string;
  items: Array<{ title?: string; productTitle?: string; size: string; frame: string; quantity: number; price: number }>;
  subtotal: number;
  couponCode?: string;
  discount?: number;
  shippingCost: number;
  total: number;
}): string {
  const dateStr = new Date(order.createdAt || Date.now()).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const formattedItems = order.items
    .map((item, idx) => {
      const name = item.title || item.productTitle || "Art Poster";
      return `${idx + 1}. ${name}\n• Size: ${item.size}\n• Frame: ${item.frame}\n• Qty: ${item.quantity}\n• Price: ₹${item.price}`;
    })
    .join("\n\n");

  return `🛍️ *New Polacraft Order*

Order:
${order.orderNumber}

Date:
${dateStr}

Customer:
${order.shippingName}

Phone:
${order.phone || "Not provided"}

Address:
${order.shippingStreet}
${order.shippingCity}, ${order.shippingState || ""} - ${order.shippingZip}

--------------------------------

Items:

${formattedItems}

--------------------------------

Subtotal: ₹${order.subtotal}
${order.couponCode && order.discount ? `Coupon: ${order.couponCode}\nDiscount: -₹${order.discount}\n` : ""}Shipping: ${order.shippingCost === 0 ? "FREE" : `₹${order.shippingCost}`}

Total:
₹${order.total}

Please confirm my order.`;
}
