import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        total: true,
        createdAt: true,
        shippingStatus: true,
        paymentStatus: true,
      },
    });

    let revenueToday = 0;
    let revenueThisMonth = 0;
    let revenueCollected = 0;
    let pendingPaymentValue = 0;

    let ordersCreated = allOrders.length;
    let ordersPaid = 0;
    let ordersPendingPayment = 0;
    let cancelledOrders = 0;
    let expiredOrders = 0;

    allOrders.forEach((order) => {
      const isPaid =
        order.paymentStatus === "VERIFIED" ||
        order.paymentStatus === "PAID" ||
        order.shippingStatus === "PAID" ||
        order.shippingStatus === "CONFIRMED" ||
        order.shippingStatus === "PACKED" ||
        order.shippingStatus === "SHIPPED" ||
        order.shippingStatus === "DELIVERED";

      if (isPaid) {
        revenueCollected += order.total;
        ordersPaid++;

        if (new Date(order.createdAt) >= startOfToday) {
          revenueToday += order.total;
        }
        if (new Date(order.createdAt) >= startOfMonth) {
          revenueThisMonth += order.total;
        }
      } else if (order.shippingStatus === "EXPIRED") {
        expiredOrders++;
      } else if (order.shippingStatus === "CANCELLED" || order.paymentStatus === "FAILED") {
        cancelledOrders++;
      } else if (order.shippingStatus === "WHATSAPP_PENDING" || order.paymentStatus === "PENDING") {
        pendingPaymentValue += order.total;
        ordersPendingPayment++;
      }
    });

    const averageOrderValue = ordersPaid > 0 ? Math.round(revenueCollected / ordersPaid) : 0;

    // Fetch top best-selling products from OrderItems
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: { select: { id: true, title: true, price: true, collectionName: true } },
      },
    });

    const productSalesMap: Record<string, { product: any; unitsSold: number; revenue: number }> = {};

    orderItems.forEach((item) => {
      if (!item.product) return;
      const id = item.productId;
      if (!productSalesMap[id]) {
        productSalesMap[id] = { product: item.product, unitsSold: 0, revenue: 0 };
      }
      productSalesMap[id].unitsSold += item.quantity;
      productSalesMap[id].revenue += item.price * item.quantity;
    });

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    // Low stock & sold out alerts
    const allProducts = await prisma.product.findMany({
      select: {
        id: true,
        title: true,
        inventory: true,
        lowStockThreshold: true,
        isSoldOut: true,
        isPreorder: true,
      },
    });

    const lowStockAlerts = allProducts.filter(
      (p) => p.inventory <= p.lowStockThreshold
    );

    return NextResponse.json({
      metrics: {
        ordersCreated,
        ordersPendingPayment,
        ordersPaid,
        cancelledOrders,
        expiredOrders,
        revenueToday,
        revenueThisMonth,
        revenueCollected,
        pendingPaymentValue,
        averageOrderValue,
      },
      topSellingProducts,
      lowStockAlerts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
