import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
