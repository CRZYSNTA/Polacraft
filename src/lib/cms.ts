import { prisma } from "./prisma";
import { posters as staticPosters } from "./cms/products";
import { Product } from "../types";

const STATIC_POSTER_MAP: Record<string, string> = {
  manichitrathazhu: "/assets/posters/manichitrathazhu-original-polacraft.png",
  "kumbalangi-nights": "/assets/posters/kumbalangi-original-polacraft.png",
  aavesham: "/assets/posters/aavesham-original-polacraft.png",
  thoovanathumbikal: "/assets/posters/thoovanathumbikal-original-polacraft.png",
  spadikam: "/assets/posters/spadikam-original-polacraft.png",
  premam: "/assets/posters/premam-original-polacraft.png",
  sandesham: "/assets/posters/sandesham-original-polacraft.png",
  mathilukal: "/assets/posters/mathilukal-original-polacraft.png",
  kireedam: "/assets/posters/kireedam-original-polacraft.png",
};

export function mapDbProductToPoster(p: any): Product {
  const staticFallback = STATIC_POSTER_MAP[p.slug] || STATIC_POSTER_MAP[p.slug?.toLowerCase()];
  
  const heroImage =
    p.images?.find((img: any) => img.type === "HERO")?.url ||
    p.images?.[0]?.url ||
    staticFallback ||
    null;

  const galleryImages = p.images?.length
    ? p.images.map((img: any) => img.url)
    : heroImage
    ? [heroImage]
    : [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    film: p.film || p.title,
    tagline: p.tagline || "Handcrafted Archival Cinema Print",
    year: p.year || 1993,
    director: p.director || "Polacraft Studio",
    cast: Array.isArray(p.cast) && p.cast.length > 0 ? p.cast : ["Mohanlal"],
    collection: p.collectionName || p.collection?.name || "Classic Malayalam",
    genre: p.genre || "Drama",
    palette: {
      primary: p.primaryColor || "#E6C15C",
      accent: p.accentColor || "#802720",
      bg: p.bgColor || "#FAFAF8",
      text: p.textColor || "#1A1A1A",
    },
    story: p.story || "Museum-quality archival fine art poster print.",
    designNotes: p.designNotes || "High contrast archival cotton paper print.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "black", "white"],
    paperType: p.paperType || "Fine Art Cotton Archival",
    gsm: p.gsm || 250,
    finish: p.finish || "Ultra-Matte Giclée",
    price: p.price || 45,
    inventory: p.inventory ?? 25,
    lowStockThreshold: p.lowStockThreshold || 5,
    isPreorder: Boolean(p.isPreorder),
    limitedEditionCount: p.limitedEditionCount || 150,
    isSoldOut: p.inventory === 0 && !p.isPreorder,
    seoTitle: `${p.title} Poster | Polacraft Studio`,
    seoDescription: p.story || `Fine art poster of ${p.title}`,
    heroImage: heroImage || undefined,
    galleryImages: galleryImages,
    wallMockups: ["/assets/living_room_mockup.png"],
  };
}

import { cache } from "react";

export const getPosters = cache(async (): Promise<Product[]> => {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collection: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts) {
      return dbProducts.map(mapDbProductToPoster);
    }
  } catch (e) {
    console.warn("Database lookup failed in getPosters:", e);
    return [];
  }

  return [];
});

export const getHeroPosters = cache(async (): Promise<Product[]> => {
  try {
    const heroDbProducts = await prisma.product.findMany({
      where: { isHero: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collection: true,
      },
      orderBy: [{ heroOrder: "asc" }, { updatedAt: "desc" }],
      take: 6,
    });

    if (heroDbProducts && heroDbProducts.length > 0) {
      const heroPosters = heroDbProducts.map(mapDbProductToPoster);
      if (heroPosters.length < 6) {
        const allPosters = await getPosters();
        const existingIds = new Set(heroPosters.map((p) => p.id));
        const extra = allPosters.filter((p) => !existingIds.has(p.id)).slice(0, 6 - heroPosters.length);
        return [...heroPosters, ...extra];
      }
      return heroPosters;
    }
  } catch (e) {
    console.warn("Failed to fetch hero posters:", e);
  }

  const allPosters = await getPosters();
  return allPosters.slice(0, 6);
});

export const getPosterBySlug = cache(async (slug: string): Promise<Product | null> => {
  try {
    const normalizedSlug = slug.toLowerCase().trim();

    const dbProduct = await prisma.product.findFirst({
      where: {
        OR: [
          { slug: normalizedSlug },
          { slug: normalizedSlug.replace(/[^a-z0-9]+/g, "-") },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collection: true,
      },
    });

    return dbProduct ? mapDbProductToPoster(dbProduct) : null;
  } catch (e) {
    console.warn("Database lookup failed in getPosterBySlug:", e);
    return null;
  }
});

export async function getFeaturedPosters(): Promise<Product[]> {
  const all = await getPosters();
  return all.slice(0, 4);
}

export async function getNewArrivals(): Promise<Product[]> {
  const all = await getPosters();
  return all.slice(0, 6);
}

export async function getPostersByCollection(collection: string): Promise<Product[]> {
  const all = await getPosters();
  if (collection === "All Collections") return all;
  return all.filter((p) => p.collection.toLowerCase().includes(collection.split(" ")[0].toLowerCase()));
}

export interface StoreCollectionItem {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  parent?: { id: string; name: string } | null;
  subCollections?: { id: string; name: string }[];
}

export const getStoreCollections = cache(async (): Promise<StoreCollectionItem[]> => {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        subCollections: {
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });
    return collections || [];
  } catch (e) {
    console.warn("Database lookup failed in getStoreCollections:", e);
    return [];
  }
});

export const getSiteSettings = cache(async () => {
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings) return settings;
  } catch (e) {
    console.warn("Database lookup failed in getSiteSettings:", e);
  }
  return {
    heroTitle: "Bring Cinema Home.",
    heroSubtitle: "Museum-Quality Malayalam Cinema Posters Crafted For Collectors.",
    freeShippingThreshold: 499,
    collectorRewardThreshold: 899,
    premiumRewardThreshold: 1499,
  };
});
