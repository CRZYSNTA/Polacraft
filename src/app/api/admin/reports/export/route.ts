import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guards";

export async function GET(request: Request) {
  try {
    await requireAdminSession();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "PL"; // "PL" | "SALES" | "GST" | "EXPENSES"

    let csvContent = "";
    let filename = `polacraft-report-${type.toLowerCase()}-${Date.now()}.csv`;

    if (type === "SALES") {
      const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
      });

      csvContent = "Order Ref,Date,Customer,Source,Order Type,Subtotal,Discount,Shipping,Total Revenue,Printing Cost,Frame Cost,Packaging Cost,Gateway Fee,Net Profit,Margin %,Fulfillment Status,Payment Status\n";

      orders.forEach((o) => {
        const row = [
          `"${o.orderNumber}"`,
          `"${new Date(o.createdAt).toISOString().split("T")[0]}"`,
          `"${o.shippingName}"`,
          `"${o.orderSource}"`,
          `"${o.orderType}"`,
          o.subtotal,
          o.discount,
          o.shippingCost,
          o.total,
          o.printingCost,
          o.frameCost,
          o.packagingCost,
          o.gatewayFee,
          o.netProfit,
          `"${o.profitMargin}%"`,
          `"${o.shippingStatus}"`,
          `"${o.paymentStatus}"`,
        ].join(",");
        csvContent += row + "\n";
      });
    } else if (type === "EXPENSES") {
      const expenses = await prisma.operatingExpense.findMany({
        orderBy: { date: "desc" },
      });

      csvContent = "ID,Date,Title,Category,Amount (INR),Description,Logged By\n";
      expenses.forEach((e) => {
        const row = [
          `"${e.id}"`,
          `"${new Date(e.date).toISOString().split("T")[0]}"`,
          `"${e.title}"`,
          `"${e.category}"`,
          e.amount,
          `"${e.description || ""}"`,
          `"${e.loggedBy}"`,
        ].join(",");
        csvContent += row + "\n";
      });
    } else if (type === "GST") {
      const orders = await prisma.order.findMany({
        where: { paymentStatus: "PAID" },
        orderBy: { createdAt: "desc" },
      });

      csvContent = "Invoice Ref,Order Ref,Date,Customer,Gross Total (INR),Taxable Amount,GST Tax (18% Included),Payment Mode\n";
      orders.forEach((o) => {
        const taxable = Number((o.total / 1.18).toFixed(2));
        const gst = Number((o.total - taxable).toFixed(2));
        const row = [
          `"INV-${o.orderNumber}"`,
          `"${o.orderNumber}"`,
          `"${new Date(o.createdAt).toISOString().split("T")[0]}"`,
          `"${o.shippingName}"`,
          o.total,
          taxable,
          gst,
          `"${o.paymentMethod}"`,
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      // P&L Statement Report
      const orders = await prisma.order.findMany({ where: { paymentStatus: "PAID" } });
      const expenses = await prisma.operatingExpense.findMany();

      const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
      const totalPrinting = orders.reduce((sum, o) => sum + o.printingCost, 0);
      const totalFraming = orders.reduce((sum, o) => sum + o.frameCost, 0);
      const totalPackaging = orders.reduce((sum, o) => sum + o.packagingCost, 0);
      const totalGatewayFees = orders.reduce((sum, o) => sum + o.gatewayFee, 0);
      const totalDiscounts = orders.reduce((sum, o) => sum + o.discount, 0);

      const totalOrderNetProfits = orders.reduce((sum, o) => sum + o.netProfit, 0);
      const totalOperatingExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
      const businessNetProfit = totalOrderNetProfits - totalOperatingExpenses;

      csvContent = "POLACRAFT ENTERPRISE PROFIT & LOSS STATEMENT\n";
      csvContent += `Generated On,${new Date().toLocaleString("en-IN")}\n\n`;
      csvContent += "Financial Metric,Amount (INR)\n";
      csvContent += `Gross Sales Revenue,${totalRevenue}\n`;
      csvContent += `Total Discounts Offered,-${totalDiscounts}\n`;
      csvContent += `Total Printing Expenses,-${totalPrinting}\n`;
      csvContent += `Total Framing Expenses,-${totalFraming}\n`;
      csvContent += `Total Packaging Expenses,-${totalPackaging}\n`;
      csvContent += `Payment Gateway Fees,-${totalGatewayFees}\n`;
      csvContent += `Total Order Gross Profits,${totalOrderNetProfits}\n`;
      csvContent += `Total Operational Expenses,-${totalOperatingExpenses}\n`;
      csvContent += `ACTUAL BUSINESS NET PROFIT,${businessNetProfit}\n`;
    }

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
