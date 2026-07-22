import { prisma } from "../src/lib/prisma";

async function main() {
  const products = await prisma.product.findMany({
    include: {
      images: true,
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("Total products in database:", products.length);
  for (const p of products) {
    console.log(`Product: "${p.title}" | Slug: "${p.slug}" | Images count: ${p.images.length}`);
    for (const img of p.images) {
      console.log(`   - Image URL: "${img.url}" | Type: ${img.type}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
