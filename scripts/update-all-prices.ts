import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("[DB Update] Updating all product base prices in Neon PostgreSQL Database to ₹49...");

  const result = await prisma.product.updateMany({
    data: {
      price: 49.0
    }
  });

  console.log(`[DB Update] Successfully updated ${result.count} products to base price ₹49!`);
}

main()
  .catch((e) => {
    console.error("[DB Update Error]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
