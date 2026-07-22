-- Bring the original production migration in line with the current Prisma schema.

ALTER TYPE "PaymentStatus" ADD VALUE IF NOT EXISTS 'VERIFIED';
ALTER TYPE "ShippingStatus" ADD VALUE IF NOT EXISTS 'WHATSAPP_PENDING';
ALTER TYPE "ShippingStatus" ADD VALUE IF NOT EXISTS 'PAID';
ALTER TYPE "ShippingStatus" ADD VALUE IF NOT EXISTS 'CANCELLED';
ALTER TYPE "ShippingStatus" ADD VALUE IF NOT EXISTS 'EXPIRED';

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "password" TEXT;
ALTER TABLE "product_images" ADD COLUMN IF NOT EXISTS "publicId" TEXT;

ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "upiTransactionId" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paymentProofImage" TEXT;
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "paymentVerifiedAt" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "inventoryDeductedAt" TIMESTAMP(3);
ALTER TABLE "orders" ADD COLUMN IF NOT EXISTS "confirmedByAdminId" TEXT;

ALTER TABLE "site_settings" ALTER COLUMN "shippingFee" SET DEFAULT 60.0;
ALTER TABLE "site_settings" ALTER COLUMN "freeShippingThreshold" SET DEFAULT 800.0;
