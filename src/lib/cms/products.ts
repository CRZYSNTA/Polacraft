/* ==========================================================================
   POLACRAFT BRAND CATALOG DATABASE (Database & Admin Panel Managed)
   ========================================================================== */

import { Product } from "../../types";

// All posters are managed dynamically via the PostgreSQL database & Admin Panel
export const posters: Product[] = [];

export const collections = [
  "All Collections",
  "Actor Legends",
  "Football Legends",
  "Sports Icons",
  "Classic Malayalam",
  "Modern Malayalam",
  "Tamil Cinema",
  "Character Series",
  "Typography Posters",
  "Minimal Collection",
  "Limited Edition"
];

export interface SizeOption {
  id: string;
  label: string;
  priceModifier: number;
}

export const sizes: SizeOption[] = [
  { id: "A5", label: "A5 (14.8 x 21.0 cm)", priceModifier: 0 },
  { id: "A4", label: "A4 (21.0 x 29.7 cm)", priceModifier: 30 },
  { id: "A3", label: "A3 (29.7 x 42.0 cm)", priceModifier: 70 }
];

export interface FrameOption {
  id: string;
  label: string;
  priceModifier: number;
  class: string;
}

export const frames: FrameOption[] = [
  { id: "unframed", label: "Unframed (Print Only)", priceModifier: 0, class: "" },
  { id: "black", label: "Sleek Matte Black Frame", priceModifier: 155, class: "poster-framed-black" },
  { id: "white", label: "Minimal Studio White Frame", priceModifier: 155, class: "poster-framed-white" }
];

export const FRAME_COST_BY_SIZE: Record<string, number> = {
  A5: 155,
  A4: 180,
  A3: 200,
};

export function calculateProductPrice(basePrice: number, sizeId: string, frameId: string): number {
  const sizeObj = sizes.find((s) => s.id === sizeId);
  const sizeModifier = sizeObj ? sizeObj.priceModifier : 0;
  const printPrice = basePrice + sizeModifier;

  if (frameId === "unframed") {
    return printPrice;
  }

  const frameCost = FRAME_COST_BY_SIZE[sizeId] ?? 155;
  return printPrice + frameCost;
}
