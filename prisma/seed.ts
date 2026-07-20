import { PrismaClient, Role, ImageType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const actualPosters = [
  { id: "manichitrathazhu", slug: "manichitrathazhu", title: "Manichitrathazhu", film: "Manichitrathazhu (1993)", year: 1993, director: "Fazil", cast: ["Mohanlal", "Shobhana", "Suresh Gopi"], collectionName: "Classic Malayalam", genre: "Psychological Thriller", price: 45, inventory: 24, tagline: "Oru Madhurakili Snehaseema Kadannu...", story: "Fazil's psychological thriller masterpiece.", designNotes: "Golden key lock ('Manichitrathazhu') minimal vector.", primaryColor: "#E6C15C", accentColor: "#802720", bgColor: "#FAFAF8", textColor: "#1A1A1A" },
  { id: "kumbalangi-nights", slug: "kumbalangi-nights", title: "Kumbalangi Nights", film: "Kumbalangi Nights (2019)", year: 2019, director: "Madhu C. Narayanan", cast: ["Fahadh Faasil", "Shane Nigam"], collectionName: "Modern Malayalam", genre: "Family Drama", price: 45, inventory: 18, tagline: "Shammi Hero aada, Hero!", story: "Landmark backwater family drama.", designNotes: "Cyan bioluminescent backwaters glow.", primaryColor: "#0E1C26", accentColor: "#47D5C6", bgColor: "#FAFAF8", textColor: "#FAFAF8" },
  { id: "aavesham", slug: "aavesham", title: "Aavesham", film: "Aavesham (2024)", year: 2024, director: "Jithu Madhavan", cast: ["Fahadh Faasil"], collectionName: "Character Series", genre: "Action Comedy", price: 45, inventory: 15, tagline: "Eda Mone! Happy Aayitto?", story: "Bangalore gangster action comedy.", designNotes: "Distressed typography with gold chain loops.", primaryColor: "#FAFAF8", accentColor: "#E01A22", bgColor: "#FAFAF8", textColor: "#111111" },
  { id: "thoovanathumbikal", slug: "thoovanathumbikal", title: "Thoovanathumbikal", film: "Thoovanathumbikal (1987)", year: 1987, director: "P. Padmarajan", cast: ["Mohanlal", "Sumalatha"], collectionName: "Classic Malayalam", genre: "Romantic Drama", price: 45, inventory: 12, tagline: "Orthirikkan Oru Sravanamegham...", story: "Padmarajan's romantic monsoon tragedy.", designNotes: "Mist grey rain layout with dragonfly.", primaryColor: "#5C6B64", accentColor: "#D35400", bgColor: "#FAFAF8", textColor: "#EFECE6" },
  { id: "spadikam", slug: "spadikam", title: "Spadikam", film: "Spadikam (1995)", year: 1995, director: "Bhadran", cast: ["Mohanlal", "Thilakan"], collectionName: "Character Series", genre: "Action Drama", price: 45, inventory: 30, tagline: "Ethra Bheekaranan Ee Aadu Thoma!", story: "Aadu Thoma alpha rebellion.", designNotes: "Ray-Ban reflection with shattered glass.", primaryColor: "#8B1218", accentColor: "#E5A93C", bgColor: "#FAFAF8", textColor: "#FAFAF8" },
  { id: "premam", slug: "premam", title: "Premam", film: "Premam (2015)", year: 2015, director: "Alphonse Puthren", cast: ["Nivin Pauly", "Sai Pallavi"], collectionName: "Minimal Collection", genre: "Romantic Comedy", price: 45, inventory: 40, tagline: "Kodaveriyil Minnum Premam...", story: "Three-stage coming-of-age romance.", designNotes: "Pastel canvas with 3 morphing butterflies.", primaryColor: "#D5DEC6", accentColor: "#4B7A47", bgColor: "#FAFAF8", textColor: "#2C2C2A" },
  { id: "sandesham", slug: "sandesham", title: "Sandesham", film: "Sandesham (1991)", year: 1991, director: "Sathyan Anthikad", cast: ["Sreenivasan", "Jayaram"], collectionName: "Typography Posters", genre: "Political Satire", price: 45, inventory: 20, tagline: "Polandine patti oru aksharam parayaruthu!", story: "Classic political satire.", designNotes: "Newsprint typography with megaphone.", primaryColor: "#EFECE6", accentColor: "#C0392B", bgColor: "#FAFAF8", textColor: "#2C2C2A" },
  { id: "mathilukal", slug: "mathilukal", title: "Mathilukal", film: "Mathilukal (1990)", year: 1990, director: "Adoor Gopalakrishnan", cast: ["Mammootty"], collectionName: "Limited Edition", genre: "Romantic Biography", price: 45, inventory: 10, tagline: "Mathilukalkkappuram Oru Sughandha Pushpam...", story: "Basheer's prison wall romance.", designNotes: "Concrete texture with blood-red rose silhouette.", primaryColor: "#D2C5B4", accentColor: "#B03A2E", bgColor: "#FAFAF8", textColor: "#1C1C1C" },
  { id: "kireedam", slug: "kireedam", title: "Kireedam", film: "Kireedam (1989)", year: 1989, director: "Sibi Malayil", cast: ["Mohanlal", "Thilakan"], collectionName: "Classic Malayalam", genre: "Tragic Drama", price: 45, inventory: 8, tagline: "Ninte Achanada Parayunne, Kathi Thazhe Idada...", story: "Sethu's tragic fall.", designNotes: "Fractured crown with dagger shadow.", primaryColor: "#1E1E1E", accentColor: "#C39B4B", bgColor: "#FAFAF8", textColor: "#FAFAF8" }
];

async function main() {
  console.log("[Seed] Starting Poster Base Price Update (Base A5 = ₹45)...");

  // Admin Account
  const adminEmail = "admin@polacraft.in";
  const rawPassword = "ChangeMe123!";
  const hashedPassword = await bcrypt.hash(rawPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword, role: Role.ADMIN, isBlocked: false },
    create: { email: adminEmail, password: hashedPassword, name: "Polacraft Admin", role: Role.ADMIN },
  });

  // Collections
  const collections = ["Classic Malayalam", "Modern Malayalam", "Character Series", "Typography Posters", "Minimal Collection", "Limited Edition"];
  for (const name of collections) {
    await prisma.collection.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} Fine Art Posters` },
    });
  }

  // Upsert products with base price 45
  for (const p of actualPosters) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { price: 45, title: p.title, film: p.film },
      create: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        film: p.film,
        year: p.year,
        director: p.director,
        cast: p.cast,
        collectionName: p.collectionName,
        genre: p.genre,
        price: 45,
        inventory: p.inventory,
        tagline: p.tagline,
        story: p.story,
        designNotes: p.designNotes,
        primaryColor: p.primaryColor,
        accentColor: p.accentColor,
        bgColor: p.bgColor,
        textColor: p.textColor,
      },
    });
  }

  console.log("[Seed] Updated base prices for all posters to ₹45!");
}

main()
  .catch((e) => {
    console.error("[Seed Error]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });