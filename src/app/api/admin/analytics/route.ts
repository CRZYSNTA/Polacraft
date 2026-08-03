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

    // Compute Enterprise Net Profit & Expense Metrics
    let netProfitToday = 0;
    let netProfitThisMonth = 0;
    let totalNetProfit = 0;
    let totalOrderCost = 0;

    const operatingExpenses = await prisma.operatingExpense.findMany();
    const totalOperatingExpenses = operatingExpenses.reduce((sum, e) => sum + e.amount, 0);

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
        order.rewards.forEach((r) => {
          totalRewardCost += r.estimatedCost > 0 ? r.estimatedCost : 120.0;
        });
      }

      if (isPaid) {
        revenueCollected += order.total;
        totalOrderCost += order.totalCost;
        totalNetProfit += order.netProfit;
        ordersPaid++;

        if (new Date(order.createdAt) >= startOfToday) {
          revenueToday += order.total;
          netProfitToday += order.netProfit;
        }
        if (new Date(order.createdAt) >= startOfMonth) {
          revenueThisMonth += order.total;
          netProfitThisMonth += order.netProfit;
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

    const actualBusinessNetProfit = Number((totalNetProfit - totalOperatingExpenses).toFixed(2));
    const overallProfitMargin = revenueCollected > 0 ? Number(((totalNetProfit / revenueCollected) * 100).toFixed(1)) : 0;
    const averageOrderValue = ordersPaid > 0 ? Math.round(revenueCollected / ordersPaid) : 0;
    const freeShippingPercentage = ordersCreated > 0 ? Math.round((freeShippingUnlockedCount / ordersCreated) * 100) : 0;
    const rewardUnlockPercentage = ordersCreated > 0 ? Math.round((rewardUnlockedCount / ordersCreated) * 100) : 0;

    // Fetch products with Inventory Valuation & Unit Economics
    const allProducts = await prisma.product.findMany({
      include: {
        wishlistedBy: { select: { id: true } },
      },
    });

    let inventoryValuationTotal = 0;
    allProducts.forEach((p) => {
      const unitCost = p.costPrice > 0 ? p.costPrice : 60;
      inventoryValuationTotal += p.inventory * unitCost;
    });

    // Fetch OrderItems for Product Unit Economics
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: { select: { id: true, title: true, price: true, costPrice: true, collectionName: true } },
      },
    });

    const productSalesMap: Record<
      string,
      { product: any; unitsSold: number; revenue: number; cost: number; profit: number; margin: number }
    > = {};

    orderItems.forEach((item) => {
      if (!item.product) return;
      const id = item.productId;
      const unitCost = item.unitCost > 0 ? item.unitCost : item.product.costPrice > 0 ? item.product.costPrice : 60;
      const itemRev = item.price * item.quantity;
      const itemCost = unitCost * item.quantity;

      if (!productSalesMap[id]) {
        productSalesMap[id] = { product: item.product, unitsSold: 0, revenue: 0, cost: 0, profit: 0, margin: 0 };
      }
      productSalesMap[id].unitsSold += item.quantity;
      productSalesMap[id].revenue += itemRev;
      productSalesMap[id].cost += itemCost;
      productSalesMap[id].profit += itemRev - itemCost;
      productSalesMap[id].margin =
        productSalesMap[id].revenue > 0
          ? Number(((productSalesMap[id].profit / productSalesMap[id].revenue) * 100).toFixed(1))
          : 0;
    });

    const topProfitableProducts = Object.values(productSalesMap)
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 10);

    const lowStockAlerts = allProducts.filter((p) => p.inventory <= p.lowStockThreshold);

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
        netProfitToday,
        netProfitThisMonth,
        totalNetProfit,
        totalOperatingExpenses,
        actualBusinessNetProfit,
        overallProfitMargin,
        inventoryValuationTotal,
        pendingPaymentValue,
        averageOrderValue,
        freeShippingUnlockedCount,
        freeShippingPercentage,
        rewardUnlockedCount,
        rewardUnlockPercentage,
        totalRewardCost,
      },
      topProfitableProducts,
      lowStockAlerts,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
