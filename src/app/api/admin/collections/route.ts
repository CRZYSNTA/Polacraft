import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const collections = await prisma.collection.findMany({
      include: {
        parent: { select: { id: true, name: true } },
        subCollections: {
          select: {
            id: true,
            name: true,
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true } },
        products: {
          select: {
            id: true,
            title: true,
            film: true,
            images: { select: { url: true }, take: 1, orderBy: { sortOrder: "asc" } },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ collections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
