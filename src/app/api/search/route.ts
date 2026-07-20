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
      // Return all products and collections when query is empty
      const products = await prisma.product.findMany({
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          collection: true,
        },
        orderBy: { createdAt: "desc" },
      });

      const collections = await prisma.collection.findMany({
        orderBy: { name: "asc" },
      });

      return NextResponse.json({ products, collections });
    }

    // Query products across title, film, director, genre, and collection
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { film: { contains: query, mode: "insensitive" } },
          { director: { contains: query, mode: "insensitive" } },
          { genre: { contains: query, mode: "insensitive" } },
          { collectionName: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        collection: true,
      },
      take: 20,
    });

    const collections = await prisma.collection.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    return NextResponse.json({ products, collections });
  } catch (error: any) {
    console.error("[Search API Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
