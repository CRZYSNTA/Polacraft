import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CollectionClient from "./CollectionClient";
import { Product } from "@/types";

export const revalidate = 60; // 1 min ISR

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sub?: string }>;
}

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

function mapDbProductToPoster(p: any): Product {
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
    price: p.price || 49,
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

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { sub } = await searchParams;

  const collection = await prisma.collection.findFirst({
    where: {
      OR: [
        { slug: { equals: slug, mode: "insensitive" } },
        { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" } },
      ],
    },
  });

  if (!collection) {
    return {
      title: "Collection Not Found | Polacraft Studio",
    };
  }

  if (sub) {
    const subCol = await prisma.subCollection.findFirst({
      where: {
        collectionId: collection.id,
        OR: [
          { slug: { equals: sub, mode: "insensitive" } },
          { name: { equals: sub.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    });

    if (subCol) {
      const title = `${subCol.name} Movie Posters | ${collection.name} Collection | Polacraft`;
      const description =
        subCol.description || `Premium ${subCol.name} movie posters printed on high-quality art paper. Handcrafted in India.`;
      return {
        title,
        description,
        openGraph: {
          title,
          description,
          url: `https://polacraft.com/collections/${slug}?sub=${subCol.slug}`,
          siteName: "Polacraft Studio",
          images: subCol.coverImage ? [{ url: subCol.coverImage }] : [],
        },
        twitter: {
          card: "summary_large_image",
          title,
          description,
        },
        alternates: {
          canonical: `https://polacraft.com/collections/${slug}/${subCol.slug}`,
        },
      };
    }
  }

  const title = `${collection.name} Movie Posters & Fine Art Prints | Polacraft`;
  const description =
    collection.description || `Browse handcrafted fine art cinema prints in the ${collection.name} collection on 250 GSM cotton paper.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://polacraft.com/collections/${slug}`,
      siteName: "Polacraft Studio",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://polacraft.com/collections/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const collections = await prisma.collection.findMany({ select: { slug: true, name: true } });
  return collections.map((c) => ({
    slug: c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  }));
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sub } = await searchParams;

  // 1. Fetch Collection with SubCollections
  const collection = await prisma.collection.findFirst({
    where: {
      OR: [
        { slug: { equals: slug, mode: "insensitive" } },
        { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" } },
      ],
    },
    include: {
      subCollections: {
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  // 2. Prisma Database-Level Query Filtering for Products
  const subColNames = collection.subCollections.map((s) => s.name);
  const allowedColNames = [collection.name, ...subColNames];

  let productWhereClause: any = {
    OR: [
      { collectionName: { in: allowedColNames, mode: "insensitive" } },
      { subCollection: { collectionId: collection.id } },
    ],
  };

  // If specific sub collection is specified in query URL ?sub=mohanlal
  if (sub) {
    const subCol = collection.subCollections.find(
      (s) => s.slug.toLowerCase() === sub.toLowerCase() || s.name.toLowerCase() === sub.toLowerCase()
    );

    if (subCol) {
      productWhereClause = {
        OR: [
          { subCollectionId: subCol.id },
          { collectionName: { contains: subCol.name, mode: "insensitive" } },
        ],
      };
    }
  }

  const rawProducts = await prisma.product.findMany({
    where: productWhereClause,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      collection: true,
      subCollection: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const initialPosters = rawProducts.map(mapDbProductToPoster);

  const formattedCollection = {
    id: collection.id,
    name: collection.name,
    slug: collection.slug || collection.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: collection.description,
    coverImage: collection.coverImage,
    subCollections: collection.subCollections.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      description: s.description,
      coverImage: s.coverImage,
      _count: s._count,
    })),
  };

  return (
    <CollectionClient
      collection={formattedCollection}
      initialPosters={initialPosters}
      activeSubSlug={sub || "all"}
    />
  );
}
