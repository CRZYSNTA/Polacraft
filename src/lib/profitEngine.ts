export interface ItemCostInput {
  size: string;
  frame: string;
  unitPrice: number;
  unitCost?: number;
  printCost?: number;
  frameCost?: number;
  quantity: number;
}

export interface BusinessExpenseSettings {
  costA5: number;
  costA4: number;
  costA3: number;
  costA2: number;
  costCanvas: number;
  costBlackFrame: number;
  costWoodFrame: number;
  packagingCostPerOrder: number;
  gatewayFeePercent: number;
  gstTaxPercent: number;
}

export const DEFAULT_BUSINESS_EXPENSE_SETTINGS: BusinessExpenseSettings = {
  costA5: 15,
  costA4: 28,
  costA3: 52,
  costA2: 100,
  costCanvas: 200,
  costBlackFrame: 120,
  costWoodFrame: 150,
  packagingCostPerOrder: 18,
  gatewayFeePercent: 2.0,
  gstTaxPercent: 18.0,
};

export interface OrderProfitMetrics {
  totalRevenue: number;
  subtotalRevenue: number;
  printingCost: number;
  frameCost: number;
  packagingCost: number;
  shippingExpense: number;
  gatewayFee: number;
  gstAmount: number;
  discountAmount: number;
  rewardCost: number;
  totalExpense: number;
  netProfit: number;
  profitMargin: number; // Percentage 0-100
  profitRating: "HIGH_PROFIT" | "HEALTHY_PROFIT" | "LOW_MARGIN" | "LOSS";
}

/**
 * Calculates print and frame costs based on configured Expense Settings
 */
export function calculateItemUnitBreakdown(
  size: string,
  frame: string,
  settings: Partial<BusinessExpenseSettings> = DEFAULT_BUSINESS_EXPENSE_SETTINGS
) {
  const cfg = { ...DEFAULT_BUSINESS_EXPENSE_SETTINGS, ...settings };
  const upperSize = (size || "A4").toUpperCase();
  const upperFrame = (frame || "UNFRAMED").toUpperCase();

  let printCost = cfg.costA4;
  if (upperSize === "A5") printCost = cfg.costA5;
  else if (upperSize === "A3") printCost = cfg.costA3;
  else if (upperSize === "A2") printCost = cfg.costA2;
  else if (upperSize === "CANVAS") printCost = cfg.costCanvas;

  let frameCost = 0;
  if (upperFrame.includes("BLACK")) frameCost = cfg.costBlackFrame;
  else if (upperFrame.includes("WOOD") || upperFrame.includes("TEAK")) frameCost = cfg.costWoodFrame;

  return {
    printCost,
    frameCost,
    unitCost: printCost + frameCost,
  };
}

/**
 * Calculates complete enterprise order profit & cost breakdown
 * Formula: Net Profit = Revenue - Printing - Frame - Packaging - Shipping - GatewayFee - RewardCost - GST
 */
export function calculateOrderProfitMetrics(
  items: ItemCostInput[],
  shippingCost: number,
  shippingType: string = "Standard",
  discountAmount: number = 0,
  rewardCost: number = 0,
  settings: Partial<BusinessExpenseSettings> = DEFAULT_BUSINESS_EXPENSE_SETTINGS
): OrderProfitMetrics {
  const cfg = { ...DEFAULT_BUSINESS_EXPENSE_SETTINGS, ...settings };

  let subtotalRevenue = 0;
  let totalPrintingCost = 0;
  let totalFrameCost = 0;

  items.forEach((item) => {
    const lineRevenue = item.unitPrice * item.quantity;
    subtotalRevenue += lineRevenue;

    const breakdown = calculateItemUnitBreakdown(item.size, item.frame, cfg);
    const itemPrintCost = item.printCost !== undefined ? item.printCost : breakdown.printCost;
    const itemFrameCost = item.frameCost !== undefined ? item.frameCost : breakdown.frameCost;

    totalPrintingCost += itemPrintCost * item.quantity;
    totalFrameCost += itemFrameCost * item.quantity;
  });

  const shippingExpense = shippingCost > 0 ? shippingCost : shippingType === "Express" ? 80 : shippingType === "Pickup" ? 0 : 40;
  const totalRevenue = Math.max(0, subtotalRevenue + shippingCost - discountAmount);

  const packagingCost = items.length > 0 ? cfg.packagingCostPerOrder : 0;
  const gatewayFee = Number(((totalRevenue * cfg.gatewayFeePercent) / 100).toFixed(2));
  const gstAmount = Number(((totalRevenue * cfg.gstTaxPercent) / (100 + cfg.gstTaxPercent)).toFixed(2));

  const totalExpense = totalPrintingCost + totalFrameCost + packagingCost + shippingExpense + gatewayFee + rewardCost;
  const netProfit = Number((totalRevenue - totalExpense).toFixed(2));
  const profitMargin = totalRevenue > 0 ? Number(((netProfit / totalRevenue) * 100).toFixed(1)) : 0;

  let profitRating: OrderProfitMetrics["profitRating"] = "HEALTHY_PROFIT";
  if (netProfit < 0) {
    profitRating = "LOSS";
  } else if (profitMargin >= 50) {
    profitRating = "HIGH_PROFIT";
  } else if (profitMargin >= 25) {
    profitRating = "HEALTHY_PROFIT";
  } else {
    profitRating = "LOW_MARGIN";
  }

  return {
    totalRevenue,
    subtotalRevenue,
    printingCost: totalPrintingCost,
    frameCost: totalFrameCost,
    packagingCost,
    shippingExpense,
    gatewayFee,
    gstAmount,
    discountAmount,
    rewardCost,
    totalExpense: Number(totalExpense.toFixed(2)),
    netProfit,
    profitMargin,
    profitRating,
  };
}
