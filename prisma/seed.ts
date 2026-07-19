import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.collection.create({
    data: {
      name: "Classic Malayalam",
      description: "Timeless Malayalam cinema artwork"
    }
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });