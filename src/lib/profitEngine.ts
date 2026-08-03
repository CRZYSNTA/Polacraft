export interface ItemCostInput {
  size: string;
  frame: string;
  unitPrice: number;
  unitCost?: number;
  quantity: number;
}

export interface OrderProfitMetrics {
  totalRevenue: number;
  totalExpense: number;
  itemExpense: number;
  shippingExpense: number;
  netProfit: number;
  profitMargin: number; // Percentage 0-100
  profitRating: "HIGH_PROFIT" | "HEALTHY_PROFIT" | "LOW_MARGIN" | "LOSS";
}

// Production Cost Reference Matrix (Paper, Ink, Packaging, Framing)
export const BASE_PRODUCTION_COSTS: Record<string, number> = {
  A5: 35,       // Paper + Ink + Archival Envelope
  A4: 60,       // Paper + Ink + Hardboard Backing
  A3: 110,      // Paper + Ink + Packaging Tube
  A2: 220,      // Paper + Ink + Heavy Tube
  CANVAS: 350,   // Archival Canvas Giclée
  CUSTOM: 80,   // Fallback
};

export const FRAME_PRODUCTION_COSTS: Record<string, number> = {
  UNFRAMED: 0,
  BLACK_FRAME: 120, // Wood/MDF Frame + Acrylic Glass + Fitting
  WOOD_FRAME: 150,  // Premium Teak Wood Frame + Acrylic Glass
  CUSTOM: 100,
};

export const ESTIMATED_SHIPPING_EXPENSE: Record<string, number> = {
  Standard: 40,
  Express: 80,
  Pickup: 0,
  Custom: 40,
};

/**
 * Calculates item-level estimated unit production expense
 */
export function calculateItemUnitCost(size: string, frame: string, customUnitCost?: number): number {
  if (customUnitCost && customUnitCost > 0) return customUnitCost;

  const printCost = BASE_PRODUCTION_COSTS[size.toUpperCase()] || BASE_PRODUCTION_COSTS["A4"];
  const frameCost = FRAME_PRODUCTION_COSTS[frame.toUpperCase()] || 0;

  return printCost + frameCost;
}

/**
 * Calculates complete order revenue, total production/shipping expenses, net profit, and profit margin percentage
 */
export function calculateOrderProfitMetrics(
  items: ItemCostInput[],
  shippingCost: number,
  shippingType: string = "Standard",
  discountAmount: number = 0
): OrderProfitMetrics {
  let subtotalRevenue = 0;
  let itemExpense = 0;

  items.forEach((item) => {
    const lineRevenue = item.unitPrice * item.quantity;
    subtotalRevenue += lineRevenue;

    const unitCost = calculateItemUnitCost(item.size, item.frame, item.unitCost);
    itemExpense += unitCost * item.quantity;
  });

  const shippingExpense = ESTIMATED_SHIPPING_EXPENSE[shippingType] ?? 40;
  const totalRevenue = Math.max(0, subtotalRevenue + shippingCost - discountAmount);
  const totalExpense = itemExpense + shippingExpense;
  const netProfit = totalRevenue - totalExpense;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

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
    totalExpense,
    itemExpense,
    shippingExpense,
    netProfit,
    profitMargin: Number(profitMargin.toFixed(1)),
    profitRating,
  };
}
