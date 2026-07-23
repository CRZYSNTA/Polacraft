/**
 * Polacraft v1.2.1 Phase 4 - Real LLM Content Generation Service
 * Zero hardcoded fallback strings ("Malayalam Cinema", "Malayalam Film Print", etc.).
 */

import { getVerifiedMovieMetadata, VerifiedMovieMetadata } from "../movieMetadata/verifiedMetadataService";
import { VisionResult, AIProviderName } from "./types";
import { getAIProvider } from "./factory";
import { prisma } from "@/lib/prisma";
import { DESCRIPTION_GENERATION_PROMPT } from "@/prompts/descriptionPrompt";
import { SEO_GENERATION_PROMPT } from "@/prompts/seoPrompt";
import { SOCIAL_CAPTIONS_PROMPT } from "@/prompts/socialPrompt";

export interface AIProductDraftPayload {
  // Fact-checked metadata
  movie: string;
  year: number | null;
  director: string | null;
  cast: string[];
  genre: string | null;
  language: string;

  // Generated product content (LLM Creative Output)
  title: string;
  shortDescription: string;
  longDescription: string;
  tagline: string;
  highlights: string[];
  careInstructions: string[];

  // SEO & Metadata (LLM SEO Output)
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  ogDescription: string;
  imageAltText: string;

  // Collections & Tags
  suggestedCollections: string[];
  tags: string[];

  // Social Media Captions (LLM Social Output)
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
  // STAGE 3: Verified Metadata Lookup using vision.movie
  const movieQuery = vision.movie || "";
  let verifiedMeta: VerifiedMovieMetadata | null = movieQuery
    ? await getVerifiedMovieMetadata(movieQuery)
    : null;

  // OCR-First Verified Database Match Strategy:
  // If Vision didn't identify movie title directly, check OCR text strings against Verified Database
  if (!verifiedMeta && vision.visibleText && vision.visibleText.length > 0) {
    for (const text of vision.visibleText) {
      if (text && text.trim().length > 2) {
        const ocrMatch = await getVerifiedMovieMetadata(text.trim());
        if (ocrMatch) {
          verifiedMeta = ocrMatch;
          break;
        }
      }
    }
  }

  console.log("==========================================");
  console.log("STAGE 3: METADATA", verifiedMeta);
  console.log("==========================================");

  // Facts Layer (Zero hardcoded "Malayalam Cinema" or "Malayalam Film Print" strings)
  const movieName = verifiedMeta?.movie || vision.movie || null;
  const displayMovie = movieName || "Unknown Artwork";
  const year = verifiedMeta?.year || null;
  const director = verifiedMeta?.director || null;
  const cast = verifiedMeta?.cast || (vision.actor ? [vision.actor] : []);
  const genre = verifiedMeta?.genre || null;
  const actorName = cast[0] || vision.actor || null;
  const charName = vision.character || null;

  const factsPayload = {
    detectedMovie: displayMovie,
    isMovieIdentified: Boolean(movieName),
    releaseYear: year,
    director: director,
    cast: cast,
    genre: genre,
    actorName: actorName,
    characterName: charName,
    ocrVisibleText: vision.visibleText || [],
    posterStyle: vision.posterStyle || "Minimalist Poster",
    dominantColors: vision.dominantColors || ["#111111", "#D4AF37"],
    requestedTone: options?.tone || "Collector Focused",
    requestedLanguage: options?.language || "English",
    maxDescriptionWords: options?.maxLength || 120,
    paperSpecs: "300 GSM Heavyweight Premium Matte Paper, Archival Giclée Pigment Inks, Rigid Backing Protection"
  };

  // Resolve Active Provider
  let activeProviderName: AIProviderName = "openai";
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings?.aiProvider) {
      activeProviderName = settings.aiProvider.toLowerCase() as AIProviderName;
    }
  } catch (e) {
    // fallback to default
  }

  const provider = getAIProvider(activeProviderName);

  const systemPrompt = `
${DESCRIPTION_GENERATION_PROMPT}

${SEO_GENERATION_PROMPT}

${SOCIAL_CAPTIONS_PROMPT}

COMBINED INSTRUCTION:
You are an expert copywriter and SEO strategist for Polacraft archival cinema prints.
Based on the provided film facts and poster visual details below, write a unique, context-aware, creative product listing.
DO NOT use repetitive generic template phrases. Adapt your writing style specifically to the tone, themes, director, and cultural impact of the specific film.
If detectedMovie is "Unknown Artwork", create an intriguing fine art print description for the unidentified poster without inventing a fake movie title.

Return a SINGLE, valid JSON object matching this schema EXACTLY:
{
  "title": "Unique Product Title",
  "shortDescription": "Max 160 chars summary",
  "longDescription": "Max 120 words rich narrative description",
  "tagline": "Thematic dialogue or iconic tagline",
  "highlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "careInstructions": ["Care 1", "Care 2", "Care 3"],
  "seoTitle": "Unique SEO Title | Polacraft Studio",
  "seoDescription": "Action-oriented meta description",
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4"],
  "ogDescription": "Social sharing meta description",
  "imageAltText": "Descriptive accessibility image alt text",
  "suggestedCollections": ["Collection 1", "Collection 2"],
  "tags": ["Tag 1", "Tag 2", "Tag 3"],
  "socialCaptions": {
    "instagram": "Engaging Instagram post with hashtags",
    "facebook": "Detailed Facebook post",
    "twitter": "Punchy Twitter post"
  }
}
`;

  const userPrompt = `FILM & POSTER FACTS: ${JSON.stringify(factsPayload, null, 2)}`;

  // Fallback payload if provider is unavailable or fails (NEVER invents "Malayalam Cinema" / "Malayalam Film Print")
  const fallbackData: AIProductDraftPayload = {
    movie: displayMovie,
    year,
    director,
    cast,
    genre: genre || "Fine Art",
    language: options?.language || "English",
    title: movieName
      ? `${movieName}${charName ? ` – ${charName}` : ""} Premium Poster`
      : actorName
      ? `${actorName} Archival Portrait Print`
      : "Archival Fine Art Print",
    shortDescription: movieName
      ? `Handcrafted 300 GSM archival fine art print celebrating ${movieName}. Printed on heavyweight matte paper with rigid backing protection.`
      : `Handcrafted 300 GSM archival fine art print. Printed on heavyweight matte paper with rigid backing protection.`,
    longDescription: movieName
      ? `Immortalize the cinematic art of ${movieName}${year ? ` (${year})` : ""}. Designed for cinephiles and interior curators, this fine art print captures the visual tone of the film in a clean minimalist aesthetic. Printed on 300 GSM heavy-weight matte paper with archival pigment inks for deep contrast and zero glare.`
      : `Collectible 300 GSM archival fine art print. Designed for film enthusiasts and interior curators, this fine art print captures fine art detail in a clean minimalist aesthetic. Printed on 300 GSM heavy-weight matte paper with archival pigment inks for deep contrast and zero glare.`,
    tagline: movieName ? `Archival Fine Art Print celebrating ${movieName}.` : "Archival Fine Art Collectible Print.",
    highlights: [
      "Printed on 300 GSM Premium Matte Heavyweight Paper",
      "High-contrast fade-resistant archival pigment Giclée print",
      "Protected in clear sleeve with rigid backing board",
      "Individually quality-checked & shipped in durable Kraft envelope"
    ],
    careInstructions: [
      "Display away from direct sunlight to preserve pigment richness",
      "Handle with clean cotton gloves when framing to avoid surface oils",
      "Keep in dry, low-humidity indoor environments"
    ],
    seoTitle: movieName ? `${movieName} Poster | Polacraft Studio` : "Archival Fine Art Poster | Polacraft Studio",
    seoDescription: movieName
      ? `Archival 300 GSM fine art poster of ${movieName}. Premium matte print with protective sleeve & rigid backing board.`
      : "Archival 300 GSM fine art poster. Premium matte print with protective sleeve & rigid backing board.",
    keywords: [
      ...(movieName ? [`${movieName} poster`] : []),
      ...(actorName ? [`${actorName} poster`] : []),
      "300 GSM poster",
      "Polacraft print",
      "Archival wall art"
    ],
    ogDescription: movieName ? `Bring cinema heritage home with this 300 GSM fine art print of ${movieName}.` : "Bring wall art home with this 300 GSM fine art print.",
    imageAltText: movieName ? `Archival fine art poster print of ${movieName}` : "Archival fine art poster print",
    suggestedCollections: verifiedMeta?.collectionSuggestions || [
      ...(actorName ? [actorName] : []),
      ...(genre ? [genre] : ["Fine Art Collection"])
    ],
    tags: verifiedMeta?.tags || [
      ...(movieName ? [movieName] : []),
      ...(actorName ? [actorName] : []),
      "300 GSM",
      "Archival"
    ],
    socialCaptions: {
      instagram: movieName
        ? `✨ Celebrate ${movieName} with our 300 GSM Archival Poster 🖼️\n\nPrinted on heavy matte paper & packed with rigid backing protection. Free nationwide shipping on ₹499+ 🚚\n\nTap link in bio to shop.\n\n#Polacraft #${movieName.replace(/\s+/g, "")}`
        : `✨ Check out our newly pressed 300 GSM Archival Fine Art Poster 🖼️\n\nFree shipping on ₹499+ 🚚\n\n#Polacraft #WallArt #FineArtPrint`,
      facebook: movieName
        ? `Bring cinema heritage home with the ${movieName} Archival Fine Art Print — pressed on heavy 300 GSM matte paper. Order yours today at polacraft-1.vercel.app`
        : `Bring fine art home with this 300 GSM Archival Print — pressed on heavy matte paper. Order yours at polacraft-1.vercel.app`,
      twitter: movieName
        ? `🔥 NEW DROP: ${movieName} Archival Print. 300 GSM Premium Matte. Free shipping on ₹499+: polacraft-1.vercel.app`
        : `🔥 NEW DROP: 300 GSM Premium Matte Archival Print. Free shipping on ₹499+: polacraft-1.vercel.app`
    },
    confidence: vision.confidence,
    reviewRequired: vision.reviewRequired,
    generatedAt: new Date().toISOString()
  };

  if (provider.isAvailable()) {
    try {
      const llmResult = await provider.generateStructuredData<AIProductDraftPayload>({
        prompt: userPrompt,
        schemaDescription: systemPrompt,
        fallback: fallbackData
      });

      if (llmResult.success && llmResult.data) {
        // Return parsed LLM output WITHOUT overwriting fields with defaults!
        return {
          ...llmResult.data,
          movie: movieName || llmResult.data.movie || "Unknown Artwork",
          year: llmResult.data.year ?? year,
          director: llmResult.data.director ?? director,
          cast: (llmResult.data.cast && llmResult.data.cast.length > 0) ? llmResult.data.cast : cast,
          genre: llmResult.data.genre || genre || "Fine Art",
          confidence: vision.confidence,
          reviewRequired: vision.reviewRequired,
          generatedAt: new Date().toISOString()
        };
      }
    } catch (err) {
      console.warn("[Phase 4 LLM Generation Warning]: Provider execution failed, using structured fallback payload", err);
    }
  }

  return fallbackData;
}
