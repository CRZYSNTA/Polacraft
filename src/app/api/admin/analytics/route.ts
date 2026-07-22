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

    const settings = await prisma.siteSettings.findFirst();
    const freeShipThreshold = settings?.freeShippingThreshold ?? 499;
    const collectorThreshold = settings?.collectorRewardThreshold ?? 899;

    const allOrders = await prisma.order.findMany({
      include: {
        rewards: true
      }
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

    let freeShippingUnlockedCount = 0;
    let rewardUnlockedCount = 0;
    let totalRewardCost = 0;

    allOrders.forEach((order) => {
      const isPaid =
        order.paymentStatus === "VERIFIED" ||
        order.paymentStatus === "PAID" ||
        order.shippingStatus === "PAID" ||
        order.shippingStatus === "CONFIRMED" ||
        order.shippingStatus === "PACKED" ||
        order.shippingStatus === "SHIPPED" ||
        order.shippingStatus === "DELIVERED";

      if (order.total >= freeShipThreshold) freeShippingUnlockedCount++;
      if (order.total >= collectorThreshold) rewardUnlockedCount++;

      // Compute estimated reward cost
      if (order.rewards && order.rewards.length > 0) {
        order.rewards.forEach(r => {
          totalRewardCost += r.estimatedCost > 0 ? r.estimatedCost : 120.0;
        });
      }

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
    const freeShippingPercentage = ordersCreated > 0 ? Math.round((freeShippingUnlockedCount / ordersCreated) * 100) : 0;
    const rewardUnlockPercentage = ordersCreated > 0 ? Math.round((rewardUnlockedCount / ordersCreated) * 100) : 0;
    const rewardCostPercentage = revenueCollected > 0 ? Math.round((totalRewardCost / revenueCollected) * 100) : 0;

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

    // Low stock alerts
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
        freeShippingUnlockedCount,
        freeShippingPercentage,
        rewardUnlockedCount,
        rewardUnlockPercentage,
        totalRewardCost,
        rewardCostPercentage
      },
      topSellingProducts,
      lowStockAlerts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
