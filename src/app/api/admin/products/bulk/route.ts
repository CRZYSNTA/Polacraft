import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ImageType } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { products } = body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "No poster products provided for bulk save." }, { status: 400 });
    }

    const createdProducts = [];
    const errors = [];

    for (let i = 0; i < products.length; i++) {
      const input = products[i];

      try {
        // 1. Guarantee Collection foreign key exists in PostgreSQL database
        const targetCollectionName = input.collectionName || "Classic Malayalam";
        await prisma.collection.upsert({
          where: { name: targetCollectionName },
          update: {},
          create: { name: targetCollectionName, description: `${targetCollectionName} Poster Collection` },
        });

        // 2. Guarantee Unique Slug in PostgreSQL
        let baseSlug = input.slug
          ? input.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
          : input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        if (!baseSlug) {
          baseSlug = "poster-" + Date.now().toString(36);
        }

        let finalSlug = baseSlug;
        let existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
        let counter = 1;
        while (existing) {
          finalSlug = `${baseSlug}-${counter}-${Math.random().toString(36).substring(2, 6)}`;
          existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
          counter++;
        }

        const dataPayload = {
          title: input.title || "Untitled Poster Art",
          slug: finalSlug,
          film: input.film || input.title || "Archival Cinema",
          year: Number(input.year) || 2020,
          director: input.director || "Polacraft Studio",
          collectionName: targetCollectionName,
          genre: input.genre || "Drama",
          price: Number(input.price) || 49,
          inventory: Number(input.inventory) || 25,
          lowStockThreshold: 5,
          isPreorder: false,
          isSoldOut: false,
          featured: false,
          newArrival: true,
          bestSeller: false,
          primaryColor: input.primaryColor || "#1E1E1E",
          accentColor: input.accentColor || "#10B981",
          bgColor: input.bgColor || "#FAFAF8",
          textColor: input.textColor || "#1E1E1E",
          gsm: Number(input.gsm) || 300,
          finish: input.finish || "Ultra-Matte Giclée",
          paperType: input.paperType || "Fine Art Cotton Archival",
          tagline: input.tagline || "",
          story: input.story || "",
          designNotes: input.designNotes || "",
        };

        const created = await prisma.product.create({
          data: {
            ...dataPayload,
            images: input.images?.length
              ? {
                  create: input.images.map((img: any, idx: number) => ({
                    url: img.url,
                    publicId: img.publicId || null,
                    alt: img.alt || input.title,
                    type: (img.type as ImageType) || ImageType.HERO,
                    sortOrder: img.sortOrder ?? idx,
                  })),
                }
              : undefined,
          },
          include: {
            images: true,
          },
        });

        createdProducts.push(created);
      } catch (err: any) {
        console.error(`[Bulk Save Error Item ${i}]:`, err);
        errors.push(`Item ${i + 1} (${input.title}): ${err.message}`);
      }
    }

    if (createdProducts.length === 0 && errors.length > 0) {
      return NextResponse.json({ success: false, error: errors.join("; ") }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: createdProducts.length,
      products: createdProducts,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error("[Bulk Save API Route Error]:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to execute bulk save" }, { status: 500 });
  }
}
