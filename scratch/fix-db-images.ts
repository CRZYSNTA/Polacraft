import { prisma } from "../src/lib/prisma";

const REAL_POSTER_URLS: Record<string, string> = {
  manichitrathazhu: "/assets/posters/manichitrathazhu-original-polacraft.png",
  "kumbalangi-nights": "/assets/posters/kumbalangi-original-polacraft.png",
  aavesham: "/assets/posters/aavesham-original-polacraft.png",
  thoovanathumbikal: "/assets/posters/thoovanathumbikal-original-polacraft.png",
  spadikam: "/assets/posters/spadikam-original-polacraft.png",
  premam: "/assets/posters/premam-original-polacraft.png",
  sandesham: "/assets/posters/sandesham-original-polacraft.png",
  mathilukal: "/assets/posters/mathilukal-original-polacraft.png",
  kireedam: "/assets/posters/kireedam-original-polacraft.png",
};

async function fixDb() {
  const products = await prisma.product.findMany({
    include: { images: true },
  });

  for (const p of products) {
    const realUrl = REAL_POSTER_URLS[p.slug] || REAL_POSTER_URLS[p.slug.toLowerCase()];
    
    // If images have fake demo 404 URLs, update them to real asset URLs
    for (const img of p.images) {
      if (img.url.includes("cloudinary.com/demo/image/upload") && realUrl) {
        console.log(`Updating fake demo image for product "${p.title}" -> ${realUrl}`);
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: realUrl },
        });
      }
    }

    // If product has 0 images and has a static fallback, create an image record
    if (p.images.length === 0 && realUrl) {
      console.log(`Creating missing image record for "${p.title}" -> ${realUrl}`);
      await prisma.productImage.create({
        data: {
          productId: p.id,
          url: realUrl,
          alt: p.title,
          type: "HERO",
          sortOrder: 0,
        },
      });
    }
  }

  console.log("Database image cleanup complete!");
}

fixDb().catch(console.error).finally(() => prisma.$disconnect());
