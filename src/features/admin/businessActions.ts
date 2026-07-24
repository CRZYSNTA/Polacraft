"use server";

import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth/guards";
import { deleteCloudinaryAsset } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";
import { ShippingStatus, PaymentStatus, ImageType } from "@prisma/client";

// ==========================================
// 1. PRODUCT MANAGEMENT SERVER ACTIONS
// ==========================================

export interface ProductInput {
  id?: string;
  title: string;
  slug: string;
  film: string;
  year: number;
  director: string;
  collectionName: string;
  genre: string;
  price: number;
  inventory: number;
  lowStockThreshold?: number;
  isPreorder?: boolean;
  limitedEditionCount?: number;
  featured?: boolean;
  newArrival?: boolean;
  bestSeller?: boolean;
  primaryColor?: string;
  accentColor?: string;
  bgColor?: string;
  textColor?: string;
  gsm?: number;
  finish?: string;
  paperType?: string;
  tagline?: string;
  story?: string;
  designNotes?: string;
  images?: { url: string; publicId?: string; alt: string; type: ImageType; sortOrder?: number }[];
}

export async function saveProductAction(input: ProductInput) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const isEdit = Boolean(input.id);
    const lowStockThreshold = input.lowStockThreshold ?? 5;
    const isSoldOut = input.inventory === 0 && !input.isPreorder;

    let baseSlug = input.slug
      ? input.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
      : input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    if (!baseSlug) {
      baseSlug = "poster-" + Date.now().toString(36);
    }

    // Guarantee Unique Slug in PostgreSQL
    let finalSlug = baseSlug;
    if (!isEdit) {
      let existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
      let counter = 1;
      while (existing) {
        finalSlug = `${baseSlug}-${counter}-${Math.random().toString(36).substring(2, 6)}`;
        existing = await prisma.product.findUnique({ where: { slug: finalSlug } });
        counter++;
      }
    }

    // Guarantee Collection foreign key exists in PostgreSQL
    const targetCollectionName = input.collectionName || "Classic Malayalam";
    await prisma.collection.upsert({
      where: { name: targetCollectionName },
      update: {},
      create: { name: targetCollectionName, description: `${targetCollectionName} Poster Collection` },
    });

    const dataPayload = {
      title: input.title,
      slug: finalSlug,
      film: input.film,
      year: Number(input.year),
      director: input.director,
      collectionName: targetCollectionName,
      genre: input.genre,
      price: Number(input.price),
      inventory: Number(input.inventory),
      lowStockThreshold: Number(lowStockThreshold),
      isPreorder: Boolean(input.isPreorder),
      isSoldOut,
      limitedEditionCount: input.limitedEditionCount ? Number(input.limitedEditionCount) : null,
      featured: Boolean(input.featured),
      newArrival: Boolean(input.newArrival),
      bestSeller: Boolean(input.bestSeller),
      primaryColor: input.primaryColor || "#1E1E1E",
      accentColor: input.accentColor || "#10B981",
      bgColor: input.bgColor || "#FAFAF8",
      textColor: input.textColor || "#1E1E1E",
      gsm: input.gsm ? Number(input.gsm) : 300,
      finish: input.finish || "Ultra-Matte Giclée",
      paperType: input.paperType || "Fine Art Cotton Archival",
      tagline: input.tagline || "",
      story: input.story || "",
      designNotes: input.designNotes || "",
    };

    let product;

    if (isEdit && input.id) {
      const oldImages = await prisma.productImage.findMany({
        where: { productId: input.id },
      });

      const newPublicIds = new Set(input.images?.map((i) => i.publicId).filter(Boolean));

      for (const oldImg of oldImages) {
        if (oldImg.publicId && !newPublicIds.has(oldImg.publicId)) {
          await deleteCloudinaryAsset(oldImg.publicId);
        }
      }

      await prisma.productImage.deleteMany({ where: { productId: input.id } });

      product = await prisma.product.update({
        where: { id: input.id },
        data: {
          ...dataPayload,
          images: input.images?.length
            ? {
                create: input.images.map((img, idx) => ({
                  url: img.url,
                  publicId: img.publicId || null,
                  alt: img.alt || input.title,
                  type: img.type || ImageType.GALLERY,
                  sortOrder: img.sortOrder ?? idx,
                })),
              }
            : undefined,
        },
      });
    } else {
      product = await prisma.product.create({
        data: {
          ...dataPayload,
          images: input.images?.length
            ? {
                create: input.images.map((img, idx) => ({
                  url: img.url,
                  publicId: img.publicId || null,
                  alt: img.alt || input.title,
                  type: img.type || ImageType.GALLERY,
                  sortOrder: img.sortOrder ?? idx,
                })),
              }
            : undefined,
        },
      });
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return { success: true, product };
  } catch (error: any) {
    console.error("[saveProductAction Error]:", error);
    return { success: false, error: error.message || "Failed to save product" };
  }
}

export async function deleteProductAction(productId: string) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const images = await prisma.productImage.findMany({ where: { productId } });

    for (const img of images) {
      if (img.publicId) {
        await deleteCloudinaryAsset(img.publicId);
      }
    }

    await prisma.product.delete({ where: { id: productId } });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete product" };
  }
}

export async function updateStockAction(productId: string, delta: number) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return { success: false, error: "Product not found" };

    const newInventory = Math.max(0, product.inventory + delta);
    const isSoldOut = newInventory === 0 && !product.isPreorder;

    await prisma.product.update({
      where: { id: productId },
      data: {
        inventory: newInventory,
        isSoldOut,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    return { success: true, newInventory };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update stock" };
  }
}

// ==========================================
// 2. MANUAL PAYMENT VERIFICATION & PRISMA TRANSACTION
// ==========================================

export async function verifyAndApprovePaymentAction(
  orderId: string,
  upiTransactionId?: string,
  paymentProofImage?: string,
  comment?: string
) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const now = new Date();

    // Claim the order and reduce stock in one transaction. The conditional update makes
    // repeated clicks/concurrent requests idempotent.
    const updatedOrder = await prisma.$transaction(async (tx) => {
      const claimed = await tx.order.updateMany({
        where: {
          id: orderId,
          paymentStatus: PaymentStatus.PENDING,
          inventoryDeductedAt: null,
        },
        data: {
          paymentStatus: PaymentStatus.VERIFIED,
          shippingStatus: ShippingStatus.PAID,
          paymentVerifiedAt: now,
          inventoryDeductedAt: now,
          upiTransactionId: upiTransactionId || undefined,
          paymentProofImage: paymentProofImage || undefined,
          confirmedByAdminId: session.userId,
        },
      });

      if (claimed.count !== 1) {
        throw new Error("Order is missing, no longer pending, or has already been verified.");
      }

      const existingOrder = await tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: { items: true },
      });

      // 1. Reduce inventory for every order item safely (preventing negative inventory)
      for (const item of existingOrder.items) {
        const prod = await tx.product.findUnique({ where: { id: item.productId } });
        if (prod) {
          const newInv = Math.max(0, prod.inventory - item.quantity);
          await tx.product.update({
            where: { id: item.productId },
            data: {
              inventory: newInv,
              isSoldOut: newInv === 0 && !prod.isPreorder,
            },
          });
        }
      }

      // 2. Record the state transition after the one-time claim above.
      const updated = await tx.order.update({
        where: { id: orderId },
        data: {
          statusHistory: {
            create: {
              status: ShippingStatus.PAID,
              comment: comment || `Payment verified by admin (${session.email}). UPI Ref: ${upiTransactionId || "N/A"}. Inventory deducted.`,
            },
          },
        },
        include: {
          items: { include: { product: true } },
          statusHistory: { orderBy: { createdAt: "desc" } },
        },
      });

      return updated;
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/analytics");
    revalidatePath("/admin/products");

    return { success: true, order: updatedOrder };
  } catch (error: any) {
    console.error("[verifyAndApprovePaymentAction Error]:", error);
    return { success: false, error: error.message || "Failed to verify payment and reduce stock." };
  }
}

export async function rejectPaymentAction(orderId: string, reason?: string) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.FAILED,
        shippingStatus: ShippingStatus.CANCELLED,
        statusHistory: {
          create: {
            status: ShippingStatus.CANCELLED,
            comment: reason || "Payment rejected by admin. Order cancelled.",
          },
        },
      },
      include: {
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/analytics");

    return { success: true, order: updatedOrder };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to reject payment." };
  }
}

export async function updateOrderStatusAction(
  orderId: string,
  shippingStatus: ShippingStatus,
  trackingNumber?: string,
  paymentStatus?: PaymentStatus,
  comment?: string,
  paymentReference?: string
) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  // If transitioning to PAID, delegate to verifyAndApprovePaymentAction for atomic transaction & stock deduction
  if (shippingStatus === "PAID" || paymentStatus === "VERIFIED") {
    return verifyAndApprovePaymentAction(orderId, paymentReference, undefined, comment);
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        shippingStatus,
        trackingNumber: trackingNumber ?? undefined,
        paymentStatus: paymentStatus ?? undefined,
        paymentReference: paymentReference ?? undefined,
        statusHistory: {
          create: {
            status: shippingStatus,
            comment: comment || `Status updated to ${shippingStatus}`,
          },
        },
      },
      include: {
        items: { include: { product: true } },
        statusHistory: { orderBy: { createdAt: "desc" } },
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/analytics");
    return { success: true, order: updatedOrder };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update order status" };
  }
}

// ==========================================
// 3. COLLECTION MANAGEMENT SERVER ACTIONS
// ==========================================

export async function saveCollectionAction(name: string, description?: string, id?: string) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    let collection;
    if (id) {
      collection = await prisma.collection.update({
        where: { id },
        data: { name, description },
      });
    } else {
      collection = await prisma.collection.create({
        data: { name, description },
      });
    }

    revalidatePath("/admin/collections");
    return { success: true, collection };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save collection" };
  }
}

export async function deleteCollectionAction(id: string) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.collection.delete({ where: { id } });
    revalidatePath("/admin/collections");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete collection" };
  }
}

// ==========================================
// 4. BLOG / JOURNAL SERVER ACTIONS
// ==========================================

export interface BlogPostInput {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  img: string;
  readTime?: string;
  categoryName: string;
  authorName: string;
}

export async function saveBlogPostAction(input: BlogPostInput) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const category = await prisma.blogCategory.upsert({
      where: { name: input.categoryName },
      update: {},
      create: { name: input.categoryName },
    });

    let author = await prisma.author.findFirst({
      where: { name: input.authorName },
    });
    if (!author) {
      author = await prisma.author.create({
        data: { name: input.authorName },
      });
    }

    const slug = input.slug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    let post;
    if (input.id) {
      post = await prisma.journalPost.update({
        where: { id: input.id },
        data: {
          title: input.title,
          slug,
          excerpt: input.excerpt,
          content: input.content,
          img: input.img,
          readTime: input.readTime || "5 min read",
          categoryId: category.id,
          authorId: author.id,
        },
      });
    } else {
      post = await prisma.journalPost.create({
        data: {
          title: input.title,
          slug,
          excerpt: input.excerpt,
          content: input.content,
          img: input.img,
          readTime: input.readTime || "5 min read",
          publishedAt: new Date(),
          categoryId: category.id,
          authorId: author.id,
        },
      });
    }

    revalidatePath("/admin/blog");
    revalidatePath("/journal");
    return { success: true, post };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save blog post" };
  }
}

export async function deleteBlogPostAction(id: string) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    await prisma.journalPost.delete({ where: { id } });
    revalidatePath("/admin/blog");
    revalidatePath("/journal");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete blog post" };
  }
}

// ==========================================
// 5. SITE SETTINGS SERVER ACTIONS
// ==========================================

export interface SiteSettingsInput {
  shippingFee: number;
  freeShippingThreshold: number;
  supportEmail: string;
  gstNumber?: string;
  instagramUrl?: string;
  logo?: string;
  maintenanceMode?: boolean;
}

export async function saveSiteSettingsAction(input: SiteSettingsInput) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const firstSetting = await prisma.siteSettings.findFirst();

    let settings;
    if (firstSetting) {
      settings = await prisma.siteSettings.update({
        where: { id: firstSetting.id },
        data: {
          shippingFee: Number(input.shippingFee),
          freeShippingThreshold: Number(input.freeShippingThreshold),
          supportEmail: input.supportEmail,
          gstNumber: input.gstNumber || null,
          instagramUrl: input.instagramUrl || null,
          logo: input.logo || null,
          maintenanceMode: Boolean(input.maintenanceMode),
        },
      });
    } else {
      settings = await prisma.siteSettings.create({
        data: {
          shippingFee: Number(input.shippingFee),
          freeShippingThreshold: Number(input.freeShippingThreshold),
          supportEmail: input.supportEmail,
          gstNumber: input.gstNumber || null,
          instagramUrl: input.instagramUrl || null,
          logo: input.logo || null,
          maintenanceMode: Boolean(input.maintenanceMode),
        },
      });
    }

    revalidatePath("/admin/settings");
    return { success: true, settings };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to save site settings" };
  }
}

export async function deleteOrderAction(orderId: string) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized" };

  try {
    const existing = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!existing) {
      return { success: false, error: "Order not found" };
    }

    await prisma.order.delete({
      where: { id: orderId },
    });

    revalidatePath("/admin/orders");
    revalidatePath("/admin/analytics");
    revalidatePath("/admin/customers");

    return { success: true, deletedId: orderId };
  } catch (error: any) {
    console.error("[deleteOrderAction Error]:", error);
    return { success: false, error: error.message || "Failed to delete order." };
  }
}

export async function bulkSaveProductsAction(inputs: ProductInput[]) {
  const session = await requireAdminSession();
  if (!session) return { success: false, error: "Unauthorized session" };

  try {
    const createdProducts = [];
    const errors: string[] = [];

    for (const input of inputs) {
      const res = await saveProductAction(input);
      if (res.success && res.product) {
        createdProducts.push(res.product);
      } else if (res.error) {
        errors.push(res.error);
      }
    }

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    if (createdProducts.length === 0 && errors.length > 0) {
      return { success: false, error: errors[0], count: 0, products: [] };
    }

    return { success: true, count: createdProducts.length, products: createdProducts };
  } catch (error: any) {
    console.error("[bulkSaveProductsAction Error]:", error);
    return { success: false, error: error.message || "Failed to bulk save products" };
  }
}
