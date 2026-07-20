import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ products: [], collections: [] });
  }

  try {
    const query = q.trim();

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
      },
      take: 10,
    });

    const collections = await prisma.collection.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    });

    return NextResponse.json({ products, collections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
