import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SubCollectionClient from "./SubCollectionClient";
import { Product } from "@/types";

export const revalidate = 60; // 1 min ISR

interface PageProps {
  params: Promise<{ slug: string; subSlug: string }>;
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subSlug } = await params;

  const subCollection = await prisma.subCollection.findFirst({
    where: {
      OR: [
        { slug: { equals: subSlug, mode: "insensitive" } },
        { name: { equals: subSlug.replace(/-/g, " "), mode: "insensitive" } },
      ],
      collection: {
        OR: [
          { slug: { equals: slug, mode: "insensitive" } },
          { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    },
    include: { collection: true },
  });

  if (!subCollection) {
    return {
      title: "Sub Collection Not Found | Polacraft Studio",
    };
  }

  const title = `${subCollection.name} Movie Posters | Polacraft`;
  const description =
    subCollection.description ||
    `Premium ${subCollection.name} movie posters printed on high-quality art paper. Handcrafted fine art cinema collection.`;
  const canonical = `https://polacraft.com/collections/${slug}/${subSlug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Polacraft Studio",
      images: subCollection.coverImage ? [{ url: subCollection.coverImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical,
    },
  };
}

export async function generateStaticParams() {
  const subCollections = await prisma.subCollection.findMany({
    include: { collection: true },
  });

  return subCollections.map((sub) => ({
    slug: sub.collection.slug || sub.collection.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    subSlug: sub.slug,
  }));
}

export default async function SubCollectionPage({ params }: PageProps) {
  const { slug, subSlug } = await params;

  // Fetch SubCollection with Parent Collection
  const subCollection = await prisma.subCollection.findFirst({
    where: {
      OR: [
        { slug: { equals: subSlug, mode: "insensitive" } },
        { name: { equals: subSlug.replace(/-/g, " "), mode: "insensitive" } },
      ],
      collection: {
        OR: [
          { slug: { equals: slug, mode: "insensitive" } },
          { name: { equals: slug.replace(/-/g, " "), mode: "insensitive" } },
        ],
      },
    },
    include: {
      collection: true,
    },
  });

  if (!subCollection) {
    notFound();
  }

  // Database-Level Prisma Query Filtering for Products
  const rawProducts = await prisma.product.findMany({
    where: {
      OR: [
        { subCollectionId: subCollection.id },
        { collectionName: { contains: subCollection.name, mode: "insensitive" } },
      ],
    },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      collection: true,
      subCollection: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const initialPosters = rawProducts.map(mapDbProductToPoster);

  const formattedSubCollection = {
    id: subCollection.id,
    name: subCollection.name,
    slug: subCollection.slug,
    description: subCollection.description,
    coverImage: subCollection.coverImage,
    parentCollection: {
      id: subCollection.collection.id,
      name: subCollection.collection.name,
      slug: subCollection.collection.slug,
    },
  };

  // JSON-LD Schema.org Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${subCollection.name} Movie Posters`,
    description: subCollection.description || `Premium ${subCollection.name} cinema poster collection.`,
    url: `https://polacraft.com/collections/${slug}/${subSlug}`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://polacraft.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: subCollection.collection.name,
          item: `https://polacraft.com/collections/${slug}`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: subCollection.name,
          item: `https://polacraft.com/collections/${slug}/${subSlug}`,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubCollectionClient
        subCollection={formattedSubCollection}
        initialPosters={initialPosters}
      />
    </>
  );
}
