import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  try {
    const query = q.trim();

    if (!query) {
      // Return all products, collections, and sub-collections when query is empty
      const products = await prisma.product.findMany({
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          collection: true,
          subCollection: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const collections = await prisma.collection.findMany({
        include: {
          subCollections: true,
        },
        orderBy: { name: "asc" },
      });

      const subCollections = await prisma.subCollection.findMany({
        include: {
          collection: { select: { id: true, name: true, slug: true } },
          _count: { select: { products: true } },
        },
        orderBy: { name: "asc" },
      });

      return NextResponse.json({ products, collections, subCollections });
    }

    // Query products across title, film, director, genre, collectionName, and subCollection name
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { film: { contains: query, mode: "insensitive" } },
          { director: { contains: query, mode: "insensitive" } },
          { genre: { contains: query, mode: "insensitive" } },
          { collectionName: { contains: query, mode: "insensitive" } },
          { subCollection: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collection: true,
        subCollection: true,
      },
      take: 30,
    });

    const collections = await prisma.collection.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        subCollections: true,
      },
      take: 10,
    });

    const subCollections = await prisma.subCollection.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { slug: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        collection: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
      take: 10,
    });

    return NextResponse.json({ products, collections, subCollections });
  } catch (error: any) {
    console.error("[Search API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
