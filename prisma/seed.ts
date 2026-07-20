import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@polacraft.in";
  const rawPassword = "ChangeMe123!";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: hashedPassword,
      role: Role.ADMIN,
      name: "Polacraft Admin",
      isBlocked: false,
    },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Polacraft Admin",
      role: Role.ADMIN,
      emailVerified: true,
    },
  });

  console.log(`[Seed] Default Administrator Account ready: ${adminUser.email} (Role: ${adminUser.role})`);

  // Ensure default collection exists
  await prisma.collection.upsert({
    where: { name: "Classic Malayalam" },
    update: {},
    create: {
      name: "Classic Malayalam",
      description: "Timeless Malayalam cinema artwork",
    },
  });
}

main()
  .catch((e) => {
    console.error("[Seed Error]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });