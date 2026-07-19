import { Product } from "../types";

export function checkLowStock(product: Product): boolean {
  return product.inventory > 0 && product.inventory <= product.lowStockThreshold;
}

export function isSoldOut(product: Product): boolean {
  return product.isSoldOut || (product.inventory === 0 && !product.isPreorder);
}

export function getSerialNumber(product: Product): string | null {
  if (!product.limitedEditionCount) return null;
  const currentNo = product.limitedEditionCount - product.inventory + 1;
  return `Print No. ${currentNo} of ${product.limitedEditionCount}`;
}
