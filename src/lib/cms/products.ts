/* ==========================================================================
   POLACRAFT BRAND CATALOG DATABASE (Tailwind v4 & Inventory Enabled)
   ========================================================================== */

import { Product } from "../../types";

export const posters: Product[] = [
  {
    id: "manichitrathazhu",
    slug: "manichitrathazhu",
    title: "Manichitrathazhu",
    film: "Manichitrathazhu (1993)",
    tagline: "Oru Madhurakili Snehaseema Kadannu...",
    year: 1993,
    director: "Fazil",
    cast: ["Mohanlal", "Shobhana", "Suresh Gopi"],
    collection: "Classic Malayalam",
    genre: "Psychological Thriller",
    palette: { primary: "#E6C15C", accent: "#802720", bg: "#FAFAF8", text: "#1A1A1A" },
    story: "Fazil's psychological thriller masterpiece Manichitrathazhu redefined the depiction of mental health, split personality, and folklore in Indian cinema. It explores Ganga's psychological splitting under the influence of Nagavalli, a tragic classical dancer from a royal past. The film is widely considered the greatest Malayalam movie of all time, blending suspense, humor, and classical music seamlessly.",
    designNotes: "The artwork isolates the golden key lock ('Manichitrathazhu') of the forbidden room of Madampally Mansion, rendered in high-contrast vector minimalism. In the background, a gold filigree mandala echoes Nagavalli's dancing jewelry, set against a rich, turmeric-yellow paper grain texture.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1499,
    
    // Inventory & operational parameters
    inventory: 24,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 150, // total prints
    isSoldOut: false,
    
    seoTitle: "Manichitrathazhu Archival Poster | Polacraft Studio",
    seoDescription: "Archival fine art print celebrating Ganga and Nagavalli's split-personality dance in Fazil's psychological classic.",
    galleryImages: ["/assets/posters/manichitrathazhu-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "kumbalangi-nights",
    slug: "kumbalangi-nights",
    title: "Kumbalangi Nights",
    film: "Kumbalangi Nights (2019)",
    tagline: "Shammi Hero aada, Hero!",
    year: 2019,
    director: "Madhu C. Narayanan",
    cast: ["Fahadh Faasil", "Shane Nigam", "Soubin Shahir", "Sreenath Bhasi"],
    collection: "Modern Malayalam",
    genre: "Family Drama",
    palette: { primary: "#0E1C26", accent: "#47D5C6", bg: "#FAFAF8", text: "#FAFAF8" },
    story: "A landmark family drama set in the marshy backwaters of Kumbalangi. The film tracks the lives of four dysfunctional brothers sharing a half-built house on the water. It explores toxic masculinity, brotherly reconciliation, and the quiet magic of the backwaters, culminating in Shammi's spine-chilling descent into psychological control.",
    designNotes: "An atmospheric poster capturing the bioluminescent cyan glow of the backwater lagoons. The glowing outline of the suspended lightbulb represents hope, contrasted against the chillingly perfect symmetry of Shammi's hair comb and mustache.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1399,
    
    // Inventory
    inventory: 4, // Trigger low stock warning!
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 100,
    isSoldOut: false,
    
    seoTitle: "Kumbalangi Nights Bioluminescent Art Poster | Polacraft Studio",
    seoDescription: "Premium matte print depicting the bioluminescent backwaters and the eerie mustache of Shammi from Kumbalangi Nights.",
    galleryImages: ["/assets/posters/kumbalangi-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "aavesham",
    slug: "aavesham",
    title: "Aavesham",
    film: "Aavesham (2024)",
    tagline: "Eda Mone! Happy Aayitto?",
    year: 2024,
    director: "Jithu Madhavan",
    cast: ["Fahadh Faasil", "Sajin Gopu", "Hipzster"],
    collection: "Character Series",
    genre: "Action Comedy",
    palette: { primary: "#FAFAF8", accent: "#E01A22", bg: "#FAFAF8", text: "#111111" },
    story: "A high-octane comedy tracking three college students in Bangalore who find protection in Ranga, a local gangster dressed entirely in white. Ranga's unhinged energy, golden chains, and pure-hearted loyalty turned this action comedy into a cultural phenomenon, introducing the global Malayalam movie lexicon to the phrase 'Eda Mone!'.",
    designNotes: "A typography-first layout showcasing 'EDA MONE!' styled in custom distressed slab-serif fonts. Interwoven with Ranga's signature aviator sunglasses, nested gold chain loops, and raw crimson ink spatters, capturing the unbridled chaos of Bangalore's underworld.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1599,
    
    // Inventory
    inventory: 12,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 200,
    isSoldOut: false,
    
    seoTitle: "Aavesham Eda Mone Gangster Poster | Polacraft Studio",
    seoDescription: "High-contrast typographic screen print tribute to Fahadh Faasil's legendary gangster Ranga from Aavesham.",
    galleryImages: ["/assets/posters/aavesham-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "thoovanathumbikal",
    slug: "thoovanathumbikal",
    title: "Thoovanathumbikal",
    film: "Thoovanathumbikal (1987)",
    tagline: "Orthirikkan Oru Sravanamegham...",
    year: 1987,
    director: "P. Padmarajan",
    cast: ["Mohanlal", "Sumalatha", "Parvathy"],
    collection: "Classic Malayalam",
    genre: "Romantic Drama",
    palette: { primary: "#5C6B64", accent: "#D35400", bg: "#FAFAF8", text: "#EFECE6" },
    story: "Padmarajan's romantic drama stands as a peaks-and-valleys masterpiece. It traces the dual life of Jayakrishnan and his love for two women: Radha, a structured match, and Clara, an independent woman of choices. The film features the Thrissur monsoon as a physical character, acting as an emotional reflection of Clara and Jayakrishnan's connection.",
    designNotes: "An atmospheric mist-grey layout representing the monsoons of Thrissur. A single golden dragonfly (thoovanathumbika) is trapped inside a raindrop landing on the curved arc of a black canvas umbrella.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1499,
    
    // Inventory
    inventory: 0, // Trigger preorder or sold out states!
    lowStockThreshold: 5,
    isPreorder: true, // preorder allowed
    limitedEditionCount: 75,
    isSoldOut: false,
    
    seoTitle: "Thoovanathumbikal Monsoon Art Poster | Polacraft Studio",
    seoDescription: "Archival print celebrating Padmarajan's romantic masterpiece and the iconic Thrissur monsoons.",
    galleryImages: ["/assets/posters/thoovanathumbikal-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "spadikam",
    slug: "spadikam",
    title: "Spadikam",
    film: "Spadikam (1995)",
    tagline: "Ethra Bheekaranan Ee Aadu Thoma!",
    year: 1995,
    director: "Bhadran",
    cast: ["Mohanlal", "Thilakan", "Urvashi"],
    collection: "Character Series",
    genre: "Action Drama",
    palette: { primary: "#8B1218", accent: "#E5A93C", bg: "#FAFAF8", text: "#FAFAF8" },
    story: "Aadu Thoma remains the quintessential symbol of alpha rebellion in Malayalam cinema. The movie tracks a mathematics genius youth whose childhood potential is crushed under his schoolmaster father's academic weight, leading to rebellion, Ray-Ban sunglasses, and folded mundu whips.",
    designNotes: "High-contrast crimson and gold vector layout. The reflection in Aadu Thoma's signature Ray-Ban aviators details the shattering glass (spadikam) motif, set above his folded red mundu belt.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1499,
    
    // Inventory
    inventory: 30,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 150,
    isSoldOut: false,
    
    seoTitle: "Spadikam Aadu Thoma Rayban Poster | Polacraft Studio",
    seoDescription: "Classic action drama print showing the Ray-Ban reflection and folded mundu of Aadu Thoma from Spadikam.",
    galleryImages: ["/assets/posters/spadikam-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "premam",
    slug: "premam",
    title: "Premam",
    film: "Premam (2015)",
    tagline: "Kodaveriyil Minnum Premam...",
    year: 2015,
    director: "Alphonse Puthren",
    cast: ["Nivin Pauly", "Sai Pallavi", "Madonna Sebastian"],
    collection: "Minimal Collection",
    genre: "Romantic Comedy",
    palette: { primary: "#D5DEC6", accent: "#4B7A47", bg: "#FAFAF8", text: "#2C2C2A" },
    story: "Premam traces George's coming-of-age romance across three distinct life segments (school, college, and maturity). It became a cultural wave across South India, popularizing lungi-clad college entries and celebrating the silent charm of Malar Teacher.",
    designNotes: "A delicate pastel canvas tracking the stages of romance through three morphing butterflies that glide diagonally upward, shifting from pastel pink to rich red-violet and finally gold.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1399,
    
    // Inventory
    inventory: 40,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 200,
    isSoldOut: false,
    
    seoTitle: "Premam Butterflies Romance Poster | Polacraft Studio",
    seoDescription: "Minimalist pastel print documenting Nivin Pauly's romance stages in Alphonse Puthren's Premam.",
    galleryImages: ["/assets/posters/premam-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "sandesham",
    slug: "sandesham",
    title: "Sandesham",
    film: "Sandesham (1991)",
    tagline: "Polandine patti oru aksharam parayaruthu!",
    year: 1991,
    director: "Sathyan Anthikad",
    cast: ["Sreenivasan", "Jayaram", "Thilakan"],
    collection: "Typography Posters",
    genre: "Political Satire",
    palette: { primary: "#EFECE6", accent: "#C0392B", bg: "#FAFAF8", text: "#2C2C2A" },
    story: "A time-tested political satire that details how political extremism and party affiliations split a household, as two brothers argue over global and local ideologies while their retired father watches in despair. Sreenivasan's scripts highlight the comedic absurdity of domestic party politics.",
    designNotes: "A retro newsprint layout featuring a megaphone shouting out the dialogue, styled with two tied flagpoles (red and green) that form a knot representing political gridlock.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1399,
    
    // Inventory
    inventory: 0,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 100,
    isSoldOut: true, // Trigger SOLD OUT overlays!
    
    seoTitle: "Sandesham Poland Dialog Poster | Polacraft Studio",
    seoDescription: "Vintage editorial poster depicting Sathyan Anthikad's political satire Sandesham and the famous Poland debate.",
    galleryImages: ["/assets/posters/sandesham-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "mathilukal",
    slug: "mathilukal",
    title: "Mathilukal",
    film: "Mathilukal (1990)",
    tagline: "Mathilukalkkappuram Oru Sughandha Pushpam...",
    year: 1990,
    director: "Adoor Gopalakrishnan",
    cast: ["Mammootty", "K. P. A. C. Lalitha"],
    collection: "Limited Edition",
    genre: "Romantic Biography",
    palette: { primary: "#D2C5B4", accent: "#B03A2E", bg: "#FAFAF8", text: "#1C1C1C" },
    story: "Adoor Gopalakrishnan's film adaptation of Vaikom Muhammad Basheer's novel details Basheer's political imprisonment. Over the prison wall, he builds a deep romantic relationship with Narayani, a female inmate. They communicate solely through voices and small gifts thrown over the wall, never once seeing each other.",
    designNotes: "A textured concrete-colored poster depicting a heavy wall outline at the bottom. Emerging above the wall is a single delicate blood-red rose silhouette, representing Basheer and Narayani's voice romance.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1699,
    
    // Inventory
    inventory: 10,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 50,
    isSoldOut: false,
    
    seoTitle: "Mathilukal Adoor Gopalakrishnan Poster | Polacraft Studio",
    seoDescription: "Archival fine art print celebrating Adoor Gopalakrishnan's adaptation of Vaikom Muhammad Basheer's novel Mathilukal.",
    galleryImages: ["/assets/posters/mathilukal-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  },
  {
    id: "kireedam",
    slug: "kireedam",
    title: "Kireedam",
    film: "Kireedam (1989)",
    tagline: "Ninte Achanada Parayunne, Kathi Thazhe Idada...",
    year: 1989,
    director: "Sibi Malayil",
    cast: ["Mohanlal", "Thilakan", "Karthika"],
    collection: "Classic Malayalam",
    genre: "Tragic Drama",
    palette: { primary: "#1E1E1E", accent: "#C39B4B", bg: "#FAFAF8", text: "#FAFAF8" },
    story: "Kireedam details the tragic shattering of a young man's dreams. Sethumadhavan, an aspiring police officer, is forced by local gang dynamics and circumstances to protect his constable father, descending into rowdyism. The movie represents Thilakan and Mohanlal's emotional father-son peak.",
    designNotes: "Chiaroscuro-heavy poster with a slate-black textured background. A golden crown splits and fractures into thorns, casting the shadow of a dagger representing Sethu's tragic fate.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "wood", "black", "gold"],
    paperType: "Fine Art Cotton Archival",
    gsm: 250,
    finish: "Ultra-Matte Giclée",
    price: 1499,
    
    // Inventory
    inventory: 8,
    lowStockThreshold: 5,
    isPreorder: false,
    limitedEditionCount: 100,
    isSoldOut: false,
    
    seoTitle: "Kireedam Tragic Crown Poster | Polacraft Studio",
    seoDescription: "Premium print of Sibi Malayil's tragedy Kireedam, illustrating Sethu's broken crown and dagger shadow.",
    galleryImages: ["/assets/posters/kireedam-original-polacraft.png"],
    wallMockups: ["/assets/living_room_mockup.png"]
  }
];

export const collections = [
  "All Collections",
  "Classic Malayalam",
  "Modern Malayalam",
  "Character Series",
  "Typography Posters",
  "Minimal Collection",
  "Limited Edition"
];

export interface SizeOption {
  id: string;
  label: string;
  priceModifier: number;
}

export const sizes: SizeOption[] = [
  { id: "A5", label: "A5 (14.8 x 21.0 cm)", priceModifier: 0 },
  { id: "A4", label: "A4 (21.0 x 29.7 cm)", priceModifier: 300 },
  { id: "A3", label: "A3 (29.7 x 42.0 cm)", priceModifier: 600 }
];

export interface FrameOption {
  id: string;
  label: string;
  priceModifier: number;
  class: string;
}

export const frames: FrameOption[] = [
  { id: "unframed", label: "Unframed (Print Only)", priceModifier: 0, class: "" },
  { id: "wood", label: "Classic Oak Wood Frame", priceModifier: 500, class: "poster-framed-wood" },
  { id: "black", label: "Sleek Matte Black Frame", priceModifier: 400, class: "poster-framed-black" },
  { id: "gold", label: "Ornate Gallery Gold Frame", priceModifier: 600, class: "poster-framed-gold" }
];
