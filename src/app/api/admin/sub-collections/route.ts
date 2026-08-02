import { NextResponse } from "next/server";
import { protectAdminApiRoute, requireAdminSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

const subCollectionSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Sub collection name must be at least 2 characters."),
  collectionId: z.string().min(1, "Parent collection is required."),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  slug: z.string().optional(),
});

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// GET /api/admin/sub-collections?collectionId=...
export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const collectionId = searchParams.get("collectionId");

    const whereClause = collectionId ? { collectionId } : {};

    const subCollections = await prisma.subCollection.findMany({
      where: whereClause,
      include: {
        collection: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ subCollections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/admin/sub-collections (Create)
export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const parsed = subCollectionSchema.parse(body);

    // Ensure parent collection exists
    const collection = await prisma.collection.findUnique({
      where: { id: parsed.collectionId },
    });

    if (!collection) {
      return NextResponse.json({ error: "Parent collection not found." }, { status: 404 });
    }

    // Check duplicate name within the same collection
    const existingName = await prisma.subCollection.findFirst({
      where: {
        collectionId: parsed.collectionId,
        name: { equals: parsed.name, mode: "insensitive" },
      },
    });

    if (existingName) {
      return NextResponse.json(
        { error: `Sub collection "${parsed.name}" already exists in ${collection.name}.` },
        { status: 400 }
      );
    }

    let baseSlug = parsed.slug ? generateSlug(parsed.slug) : generateSlug(parsed.name);
    if (!baseSlug) baseSlug = `subcol-${Date.now()}`;

    // Ensure unique slug
    let uniqueSlug = baseSlug;
    let count = 1;
    while (await prisma.subCollection.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}-${count}`;
      count++;
    }

    const subCollection = await prisma.subCollection.create({
      data: {
        name: parsed.name,
        slug: uniqueSlug,
        description: parsed.description || null,
        coverImage: parsed.coverImage || null,
        collectionId: parsed.collectionId,
      },
      include: {
        collection: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });

    revalidatePath("/admin/collections");
    revalidatePath("/shop");

    return NextResponse.json({ success: true, subCollection }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create sub collection" },
      { status: 400 }
    );
  }
}

// PATCH /api/admin/sub-collections (Update)
export async function PATCH(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { id, ...data } = body;
    if (!id) {
      return NextResponse.json({ error: "Sub collection ID is required" }, { status: 400 });
    }

    const existing = await prisma.subCollection.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Sub collection not found" }, { status: 404 });
    }

    const parsed = subCollectionSchema.partial().parse(data);

    const targetCollectionId = parsed.collectionId || existing.collectionId;
    const targetName = parsed.name || existing.name;

    // Check duplicate name inside same collection if name or collection changed
    if (parsed.name || parsed.collectionId) {
      const duplicate = await prisma.subCollection.findFirst({
        where: {
          collectionId: targetCollectionId,
          name: { equals: targetName, mode: "insensitive" },
          id: { not: id },
        },
      });

      if (duplicate) {
        return NextResponse.json(
          { error: `A sub collection named "${targetName}" already exists in this collection.` },
          { status: 400 }
        );
      }
    }

    let updatedSlug = existing.slug;
    if (parsed.name && parsed.name !== existing.name) {
      let baseSlug = generateSlug(parsed.name);
      let uniqueSlug = baseSlug;
      let count = 1;
      while (
        await prisma.subCollection.findFirst({
          where: { slug: uniqueSlug, id: { not: id } },
        })
      ) {
        uniqueSlug = `${baseSlug}-${count}`;
        count++;
      }
      updatedSlug = uniqueSlug;
    }

    const subCollection = await prisma.subCollection.update({
      where: { id },
      data: {
        name: parsed.name ?? existing.name,
        slug: updatedSlug,
        description: parsed.description !== undefined ? parsed.description : existing.description,
        coverImage: parsed.coverImage !== undefined ? parsed.coverImage : existing.coverImage,
        collectionId: targetCollectionId,
      },
      include: {
        collection: { select: { id: true, name: true, slug: true } },
        _count: { select: { products: true } },
      },
    });

    revalidatePath("/admin/collections");
    revalidatePath("/shop");

    return NextResponse.json({ success: true, subCollection });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update sub collection" },
      { status: 400 }
    );
  }
}

// DELETE /api/admin/sub-collections (Delete)
export async function DELETE(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Sub collection ID parameter is required" }, { status: 400 });
    }

    // Unassign products from this subCollection without deleting products
    await prisma.product.updateMany({
      where: { subCollectionId: id },
      data: { subCollectionId: null },
    });

    await prisma.subCollection.delete({ where: { id } });

    revalidatePath("/admin/collections");
    revalidatePath("/shop");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete sub collection" },
      { status: 400 }
    );
  }
}
