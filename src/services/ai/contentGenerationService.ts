/**
 * Polacraft v1.2 AI Content Generation Service
 */

import { getVerifiedMovieMetadata, VerifiedMovieMetadata } from "../movieMetadata/verifiedMetadataService";
import { VisionResult } from "./types";

export interface AIProductDraftPayload {
  // Fact-checked metadata
  movie: string;
  year: number | null;
  director: string | null;
  cast: string[];
  genre: string | null;
  language: string;

  // Generated product content
  title: string;
  shortDescription: string;
  longDescription: string;
  tagline: string;
  highlights: string[];
  careInstructions: string[];

  // SEO & Metadata
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  ogDescription: string;
  imageAltText: string;

  // Collections & Tags
  suggestedCollections: string[];
  tags: string[];

  // Social Media Captions
  socialCaptions: {
    instagram: string;
    facebook: string;
    twitter: string;
  };

  // Confidence & Verification Status
  confidence: {
    movie: number;
    actor: number;
    character: number;
  };
  reviewRequired: boolean;
  generatedAt: string;
}

export async function generateFullAIProductDraft(
  vision: VisionResult,
  options?: { tone?: string; language?: string; maxLength?: number }
): Promise<AIProductDraftPayload> {
  // 1. Fetch Verified Movie Metadata
  const movieQuery = vision.movie || "";
  const verifiedMeta: VerifiedMovieMetadata | null = await getVerifiedMovieMetadata(movieQuery);

  const movieName = verifiedMeta?.movie || vision.movie || "Malayalam Cinema";
  const year = verifiedMeta?.year || null;
  const director = verifiedMeta?.director || "";
  const cast = verifiedMeta?.cast || (vision.actor ? [vision.actor] : []);
  const genre = verifiedMeta?.genre || "Drama";
  const actorName = cast[0] || vision.actor || "";
  const charName = vision.character || "";

  // 2. Format Product Title: Lucifer – Stephen Nedumpally Premium Poster
  const titlePart = charName ? `${movieName} – ${charName}` : movieName;
  const productTitle = `${titlePart} Premium Poster`;

  // 3. Short Description (max 160 chars)
  const shortDescRaw = `Handcrafted 300 GSM fine art print celebrating ${movieName}${actorName ? ` starring ${actorName}` : ""}. Archival pigment print with rigid backing protection.`;
  const shortDescription = shortDescRaw.length > 160 ? shortDescRaw.substring(0, 157) + "..." : shortDescRaw;

  // 4. Long Description (max 120 words)
  const longDescription = `Immortalize the cinematic aura of ${movieName}${year ? ` (${year})` : ""}. Directed by ${director || "acclaimed creators"}, this collectible fine art poster captures ${charName || "the film's defining moment"} in a high-contrast minimalist aesthetic. Crafted specifically for film enthusiasts and interior curators, it serves as an elegant focal point for modern living rooms, study spaces, and creative studios. Printed on heavy-weight 300 GSM premium matte paper with archival pigment inks for vibrant color fidelity and zero glare. Protected in a clear moisture sleeve with a rigid backing board for pristine unboxing.`;

  // 5. Tagline & Highlights
  const tagline = `Archival Fine Art Print celebrating ${movieName}.`;
  const highlights = [
    "Printed on 300 GSM Premium Matte Heavyweight Paper",
    "High-contrast fade-resistant archival pigment Giclée print",
    "Protected in clear sleeve with rigid backing board",
    "Individually quality-checked & shipped in durable Kraft envelope"
  ];

  const careInstructions = [
    "Display away from direct sunlight to preserve pigment richness",
    "Handle with clean cotton gloves when framing to avoid surface oils",
    "Keep in dry, low-humidity indoor environments"
  ];

  // 6. SEO & Metadata
  const seoTitle = `${movieName} Poster | Polacraft Studio`;
  const seoDescription = `Archival 300 GSM fine art poster of ${movieName}${actorName ? ` featuring ${actorName}` : ""}. Premium matte print with protective sleeve & rigid backing board.`;
  const keywords = [
    `${movieName} poster`,
    `${movieName} Malayalam poster`,
    ...(actorName ? [`${actorName} poster`] : []),
    "300 GSM poster",
    "Polacraft cinema print",
    "Malayalam movie poster",
    "Archival wall art"
  ];

  const ogDescription = `Bring Malayalam cinema heritage home with this 300 GSM fine art print of ${movieName}.`;
  const imageAltText = `Minimalist archival fine art poster print of ${movieName}${actorName ? ` featuring ${actorName}` : ""}`;

  // 7. Suggested Collections & Tags
  const suggestedCollections = verifiedMeta?.collectionSuggestions || [
    ...(actorName ? [actorName] : []),
    genre,
    "Malayalam Cinema",
    "Classic Curation"
  ];

  const tags = verifiedMeta?.tags || [
    movieName,
    ...(actorName ? [actorName] : []),
    genre,
    "300 GSM",
    "Minimalist",
    "Archival"
  ];

  // 8. Social Captions
  const socialCaptions = {
    instagram: `✨ Celebrate the spirit of ${movieName} with our newly pressed 300 GSM Archival Poster 🖼️\n\nPrinted on heavy matte paper & packed with rigid backing protection. Free nationwide shipping on ₹499+ 🚚\n\nTap the link in bio to claim your print.\n\n#Polacraft #${movieName.replace(/\s+/g, "")} ${actorName ? `#${actorName.replace(/\s+/g, "")}` : ""} #MalayalamCinema #MoviePoster #CollectorEdition`,
    facebook: `Bring Malayalam cinema heritage home. Presenting the ${movieName} Archival Fine Art Print — pressed on heavy 300 GSM matte paper for deep contrast and zero glare. Order yours today at polacraft-1.vercel.app`,
    twitter: `🔥 NEW DROP: ${movieName} Archival Print.\n\nPressed on 300 GSM Premium Matte. Free nationwide shipping on ₹499+.\n\nClaim your print: polacraft-1.vercel.app #MalayalamCinema #${movieName.replace(/\s+/g, "")}`
  };

  return {
    movie: movieName,
    year,
    director: director || null,
    cast,
    genre,
    language: "Malayalam",
    title: productTitle,
    shortDescription,
    longDescription,
    tagline,
    highlights,
    careInstructions,
    seoTitle,
    seoDescription,
    keywords,
    ogDescription,
    imageAltText,
    suggestedCollections,
    tags,
    socialCaptions,
    confidence: vision.confidence,
    reviewRequired: vision.reviewRequired,
    generatedAt: new Date().toISOString()
  };
}
