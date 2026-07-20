import { PrismaClient, Role, ImageType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const actualPosters = [
  {
    id: "manichitrathazhu",
    slug: "manichitrathazhu",
    title: "Manichitrathazhu",
    film: "Manichitrathazhu (1993)",
    year: 1993,
    director: "Fazil",
    cast: ["Mohanlal", "Shobhana", "Suresh Gopi"],
    collectionName: "Classic Malayalam",
    genre: "Psychological Thriller",
    price: 1499,
    inventory: 24,
    lowStockThreshold: 5,
    tagline: "Oru Madhurakili Snehaseema Kadannu...",
    story: "Fazil's psychological thriller masterpiece Manichitrathazhu redefined the depiction of mental health, split personality, and folklore in Indian cinema. It explores Ganga's psychological splitting under the influence of Nagavalli, a tragic classical dancer from a royal past.",
    designNotes: "The artwork isolates the golden key lock ('Manichitrathazhu') of the forbidden room of Madampally Mansion, rendered in high-contrast vector minimalism. In the background, a gold filigree mandala echoes Nagavalli's dancing jewelry.",
    primaryColor: "#E6C15C",
    accentColor: "#802720",
    bgColor: "#FAFAF8",
    textColor: "#1A1A1A",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/manichitrathazhu.png", alt: "Manichitrathazhu Archival Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "kumbalangi-nights",
    slug: "kumbalangi-nights",
    title: "Kumbalangi Nights",
    film: "Kumbalangi Nights (2019)",
    year: 2019,
    director: "Madhu C. Narayanan",
    cast: ["Fahadh Faasil", "Shane Nigam", "Soubin Shahir", "Sreenath Bhasi"],
    collectionName: "Modern Malayalam",
    genre: "Family Drama",
    price: 1399,
    inventory: 18,
    lowStockThreshold: 5,
    tagline: "Shammi Hero aada, Hero!",
    story: "A landmark family drama set in the marshy backwaters of Kumbalangi. The film tracks the lives of four dysfunctional brothers sharing a half-built house on the water, exploring toxic masculinity and reconciliation.",
    designNotes: "An atmospheric poster capturing the bioluminescent cyan glow of the backwater lagoons. The glowing outline of the lightbulb represents hope, contrasted against Shammi's hair comb and mustache.",
    primaryColor: "#0E1C26",
    accentColor: "#47D5C6",
    bgColor: "#FAFAF8",
    textColor: "#FAFAF8",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/kumbalangi.png", alt: "Kumbalangi Nights Bioluminescent Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "aavesham",
    slug: "aavesham",
    title: "Aavesham",
    film: "Aavesham (2024)",
    year: 2024,
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil", "Sajin Gopu", "Hipzster"],
    collectionName: "Character Series",
    genre: "Action Comedy",
    price: 1599,
    inventory: 15,
    lowStockThreshold: 5,
    tagline: "Eda Mone! Happy Aayitto?",
    story: "A high-octane comedy tracking three college students in Bangalore who find protection in Ranga, a local gangster dressed entirely in white. Ranga's unhinged energy and golden chains turned this action comedy into a cultural phenomenon.",
    designNotes: "A typography-first layout showcasing 'EDA MONE!' styled in custom distressed slab-serif fonts, interwoven with Ranga's signature aviator sunglasses and gold chain loops.",
    primaryColor: "#FAFAF8",
    accentColor: "#E01A22",
    bgColor: "#FAFAF8",
    textColor: "#111111",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/aavesham.png", alt: "Aavesham Eda Mone Poster", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "thoovanathumbikal",
    slug: "thoovanathumbikal",
    title: "Thoovanathumbikal",
    film: "Thoovanathumbikal (1987)",
    year: 1987,
    director: "P. Padmarajan",
    cast: ["Mohanlal", "Sumalatha", "Parvathy"],
    collectionName: "Classic Malayalam",
    genre: "Romantic Drama",
    price: 1499,
    inventory: 12,
    lowStockThreshold: 5,
    tagline: "Orthirikkan Oru Sravanamegham...",
    story: "Padmarajan's romantic drama stands as a peaks-and-valleys masterpiece tracing the dual life of Jayakrishnan and his love for Radha and Clara. The film features the Thrissur monsoon as a physical character.",
    designNotes: "An atmospheric mist-grey layout representing the monsoons of Thrissur. A single golden dragonfly (thoovanathumbika) is trapped inside a raindrop landing on a black canvas umbrella.",
    primaryColor: "#5C6B64",
    accentColor: "#D35400",
    bgColor: "#FAFAF8",
    textColor: "#EFECE6",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/thoovanathumbikal.png", alt: "Thoovanathumbikal Monsoon Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "spadikam",
    slug: "spadikam",
    title: "Spadikam",
    film: "Spadikam (1995)",
    year: 1995,
    director: "Bhadran",
    cast: ["Mohanlal", "Thilakan", "Urvashi"],
    collectionName: "Character Series",
    genre: "Action Drama",
    price: 1499,
    inventory: 30,
    lowStockThreshold: 5,
    tagline: "Ethra Bheekaranan Ee Aadu Thoma!",
    story: "Aadu Thoma remains the quintessential symbol of alpha rebellion in Malayalam cinema. The movie tracks a mathematics genius youth who rebels with Ray-Ban sunglasses and folded mundu whips.",
    designNotes: "High-contrast crimson and gold vector layout. The reflection in Aadu Thoma's signature Ray-Ban aviators details the shattering glass (spadikam) motif.",
    primaryColor: "#8B1218",
    accentColor: "#E5A93C",
    bgColor: "#FAFAF8",
    textColor: "#FAFAF8",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/spadikam.png", alt: "Spadikam Aadu Thoma Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "premam",
    slug: "premam",
    title: "Premam",
    film: "Premam (2015)",
    year: 2015,
    director: "Alphonse Puthren",
    cast: ["Nivin Pauly", "Sai Pallavi", "Madonna Sebastian"],
    collectionName: "Minimal Collection",
    genre: "Romantic Comedy",
    price: 1399,
    inventory: 40,
    lowStockThreshold: 5,
    tagline: "Kodaveriyil Minnum Premam...",
    story: "Premam traces George's coming-of-age romance across three distinct life segments (school, college, and maturity), popularizing lungi-clad entries and Malar Teacher.",
    designNotes: "A delicate pastel canvas tracking the stages of romance through three morphing butterflies that glide diagonally upward, shifting from pastel pink to rich red-violet and gold.",
    primaryColor: "#D5DEC6",
    accentColor: "#4B7A47",
    bgColor: "#FAFAF8",
    textColor: "#2C2C2A",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/premam.png", alt: "Premam Butterflies Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "sandesham",
    slug: "sandesham",
    title: "Sandesham",
    film: "Sandesham (1991)",
    year: 1991,
    director: "Sathyan Anthikad",
    cast: ["Sreenivasan", "Jayaram", "Thilakan"],
    collectionName: "Typography Posters",
    genre: "Political Satire",
    price: 1399,
    inventory: 20,
    lowStockThreshold: 5,
    tagline: "Polandine patti oru aksharam parayaruthu!",
    story: "A time-tested political satire detailing how party affiliations split a household, as two brothers argue over global ideologies while their retired father watches in despair.",
    designNotes: "A retro newsprint layout featuring a megaphone shouting out the dialogue, styled with two tied flagpoles that form a knot representing political gridlock.",
    primaryColor: "#EFECE6",
    accentColor: "#C0392B",
    bgColor: "#FAFAF8",
    textColor: "#2C2C2A",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/sandesham.png", alt: "Sandesham Poland Dialog Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "mathilukal",
    slug: "mathilukal",
    title: "Mathilukal",
    film: "Mathilukal (1990)",
    year: 1990,
    director: "Adoor Gopalakrishnan",
    cast: ["Mammootty", "K. P. A. C. Lalitha"],
    collectionName: "Limited Edition",
    genre: "Romantic Biography",
    price: 1699,
    inventory: 10,
    lowStockThreshold: 5,
    tagline: "Mathilukalkkappuram Oru Sughandha Pushpam...",
    story: "Adoor Gopalakrishnan's film adaptation of Vaikom Muhammad Basheer's novel details Basheer's political imprisonment and his voice romance with Narayani over the prison wall.",
    designNotes: "A textured concrete-colored poster depicting a heavy wall outline at the bottom. Emerging above the wall is a single delicate blood-red rose silhouette.",
    primaryColor: "#D2C5B4",
    accentColor: "#B03A2E",
    bgColor: "#FAFAF8",
    textColor: "#1C1C1C",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/mathilukal.png", alt: "Mathilukal Rose Wall Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  },
  {
    id: "kireedam",
    slug: "kireedam",
    title: "Kireedam",
    film: "Kireedam (1989)",
    year: 1989,
    director: "Sibi Malayil",
    cast: ["Mohanlal", "Thilakan", "Karthika"],
    collectionName: "Classic Malayalam",
    genre: "Tragic Drama",
    price: 1499,
    inventory: 8,
    lowStockThreshold: 5,
    tagline: "Ninte Achanada Parayunne, Kathi Thazhe Idada...",
    story: "Kireedam details the tragic shattering of a young man's dreams. Sethumadhavan, an aspiring police officer, is forced by gang dynamics to protect his constable father.",
    designNotes: "Chiaroscuro-heavy poster with a slate-black textured background. A golden crown splits and fractures into thorns, casting the shadow of a dagger.",
    primaryColor: "#1E1E1E",
    accentColor: "#C39B4B",
    bgColor: "#FAFAF8",
    textColor: "#FAFAF8",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    paperType: "Fine Art Cotton Archival",
    images: [
      { url: "https://res.cloudinary.com/demo/image/upload/v1680000000/kireedam.png", alt: "Kireedam Broken Crown Print", type: ImageType.HERO, sortOrder: 0 }
    ]
  }
];

async function main() {
  console.log("[Seed] Starting Polacraft Actual Poster Seeding...");

  // 1. Admin Account
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

  console.log(`[Seed] Admin ready: ${adminUser.email}`);

  // 2. Collections
  const collectionNames = [
    "Classic Malayalam",
    "Modern Malayalam",
    "Character Series",
    "Typography Posters",
    "Minimal Collection",
    "Limited Edition",
  ];

  for (const name of collectionNames) {
    await prisma.collection.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} Fine Art Posters` },
    });
  }

  // 3. Seed Actual Posters
  for (const p of actualPosters) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        film: p.film,
        year: p.year,
        director: p.director,
        cast: p.cast,
        collectionName: p.collectionName,
        genre: p.genre,
        price: p.price,
        inventory: p.inventory,
        lowStockThreshold: p.lowStockThreshold,
        tagline: p.tagline,
        story: p.story,
        designNotes: p.designNotes,
        primaryColor: p.primaryColor,
        accentColor: p.accentColor,
        bgColor: p.bgColor,
        textColor: p.textColor,
        gsm: p.gsm,
        finish: p.finish,
        paperType: p.paperType,
      },
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
        price: p.price,
        inventory: p.inventory,
        lowStockThreshold: p.lowStockThreshold,
        tagline: p.tagline,
        story: p.story,
        designNotes: p.designNotes,
        primaryColor: p.primaryColor,
        accentColor: p.accentColor,
        bgColor: p.bgColor,
        textColor: p.textColor,
        gsm: p.gsm,
        finish: p.finish,
        paperType: p.paperType,
        images: {
          create: p.images,
        },
      },
    });
    console.log(`[Seed] Poster seeded: ${p.title} (${p.slug})`);
  }

  console.log("[Seed] Successfully seeded all 9 actual Malayalam cinema posters!");
}

main()
  .catch((e) => {
    console.error("[Seed Error]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });