export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  img: string;
  content: string;
}

export const articles: JournalArticle[] = [
  {
    id: "color-theory",
    slug: "color-theory-in-classic-malayalam-cinema",
    title: "Color Theory in Classic Malayalam Cinema",
    date: "July 12, 2026",
    readTime: "6 Min Read",
    category: "Cinematography Studies",
    excerpt: "Analyzing the psychological weight of Fazil's turmeric yellow and Padmarajan's monsoonal grey-green palettes in the golden era.",
    img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000",
    content: "Malayalam cinema of the 80s and 90s made deliberate choices in environmental set design. Fazil's use of deep ochre, turmeric yellows, and red oxides in Madampally Mansion established an unsettling warmth representing Ganga's Nagavalli splitting identity. Conversely, Padmarajan captured the misty, grey-blue hues of the Thrissur monsoon, turning precipitation into an actor representing Clara's shifting decisions..."
  },
  {
    id: "slab-typography",
    slug: "evolution-of-slab-serif-typography",
    title: "The Raw Power of Distressed Slab Typography",
    date: "June 28, 2026",
    readTime: "4 Min Read",
    category: "Design Process",
    excerpt: "Behind the scenes of our unhinged Bangalore gangster typography tributes using slab serifs and ink splats.",
    img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1000",
    content: "Slab serifs convey heavy structural weight and raw authority. For Aavesham's typography tribute, we selected geometric block slabs, distressing the edges with dynamic digital brush ink spatters. The goal is to reflect the loud, violent action comedy beats of Bangalore's underbelly alongside Ranga's pure-hearted loyalty..."
  }
];
