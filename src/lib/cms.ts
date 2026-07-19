import { posters } from "./cms/products";
import { Product } from "../types";

// Helper to simulate network latency for a realistic loading sequence
const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPosters(): Promise<Product[]> {
  await delay(100);
  return posters;
}

export async function getPosterBySlug(slug: string): Promise<Product | null> {
  await delay(80);
  return posters.find((p) => p.slug === slug) || null;
}

export async function getFeaturedPosters(): Promise<Product[]> {
  await delay(120);
  return posters.slice(0, 3); // mock slice
}

export async function getNewArrivals(): Promise<Product[]> {
  await delay(90);
  return posters.slice(3, 6); // mock slice
}

export async function getPostersByCollection(collection: string): Promise<Product[]> {
  await delay(100);
  if (collection === "All Collections") return posters;
  return posters.filter((p) => p.collection === collection);
}
