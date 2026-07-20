import { prisma } from "./prisma";
import { posters as staticPosters } from "./cms/products";
import { Product } from "../types";

export function mapDbProductToPoster(p: any): Product {
  const heroImage =
    p.images?.find((img: any) => img.type === "HERO")?.url ||
    p.images?.[0]?.url ||
    "/assets/posters/manichitrathazhu-original-polacraft.png";

  const galleryImages = p.images?.length
    ? p.images.map((img: any) => img.url)
    : [heroImage];

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
    galleryImages: galleryImages,
    wallMockups: ["/assets/living_room_mockup.png"],
  };
}

export async function getPosters(): Promise<Product[]> {
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collection: true,
      },
      orderBy: { createdAt: "desc" },
    });

    if (dbProducts.length > 0) {
      const livePosters = dbProducts.map(mapDbProductToPoster);
      const liveSlugs = new Set(livePosters.map((p) => p.slug));
      return [
        ...livePosters,
        ...staticPosters.filter((sp) => !liveSlugs.has(sp.slug)),
      ];
    }
  } catch (e) {
    console.warn("Database lookup failed in getPosters, falling back to static:", e);
  }

  return staticPosters;
}

export async function getPosterBySlug(slug: string): Promise<Product | null> {
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

    if (dbProduct) {
      return mapDbProductToPoster(dbProduct);
    }
  } catch (e) {
    console.warn("Database lookup failed in getPosterBySlug, falling back to static:", e);
  }

  return staticPosters.find((p) => p.slug === slug || p.slug === slug.toLowerCase().replace(/[^a-z0-9]+/g, "-")) || null;
}

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
