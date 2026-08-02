import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export type PosterCategoryType = "CINEMA" | "SPORTS" | "ANIME" | "MUSIC" | "FINE_ART";

export interface PosterAnalysis {
  categoryType: PosterCategoryType;
  title: string;
  film: string;
  year?: number;
  director?: string;
  cast: string[];
  language: string;
  collectionName: string;
  suggestedSubCollectionName?: string;
  subCollectionId?: string;
  genre: string;
  tagline?: string;
  story: string;
  designNotes?: string;
  seoTitle: string;
  seoDescription: string;
  slug: string;
  keywords: string[];
  colors: {
    primary: string;
    accent: string;
    bg: string;
    text: string;
  };
  orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
  aspectRatio: number;
  quality: {
    width: number;
    height: number;
    isPrintSuitable: boolean;
    warnings: string[];
  };
  copyright: {
    type: "OFFICIAL" | "FAN_ART" | "AI_GENERATED" | "UNKNOWN";
    confidence: number;
  };
  confidenceScores: Record<string, number>;
  ocrText?: string;
  isDuplicate?: boolean;
  duplicateWarning?: string;
  existingProductId?: string;
}

export interface PosterAnalyzerProvider {
  name: string;
  analyze(imageBuffer: Buffer, mimeType: string, filename?: string): Promise<PosterAnalysis>;
}

// ----------------------------------------------------
// 1. Image Hashing & Duplicate Detection Engine
// ----------------------------------------------------
export function generateImageHash(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export async function checkPosterDuplicates(
  imageHash: string,
  title: string,
  film: string,
  cast: string[]
): Promise<{ isDuplicate: boolean; warning?: string; existingProductId?: string }> {
  try {
    // 1. Check exact image hash match
    const matchByHash = await prisma.product.findFirst({
      where: { imageHash },
      select: { id: true, title: true, film: true },
    });

    if (matchByHash) {
      return {
        isDuplicate: true,
        warning: `Likely Duplicate: Identical poster file already exists as "${matchByHash.title}".`,
        existingProductId: matchByHash.id,
      };
    }

    // 2. Check title & film combination match
    const matchByTitleFilm = await prisma.product.findFirst({
      where: {
        AND: [
          { title: { equals: title, mode: "insensitive" } },
          { film: { equals: film, mode: "insensitive" } },
        ],
      },
      select: { id: true, title: true },
    });

    if (matchByTitleFilm) {
      return {
        isDuplicate: true,
        warning: `Potential Duplicate: Poster with title "${matchByTitleFilm.title}" for movie "${film}" already exists.`,
        existingProductId: matchByTitleFilm.id,
      };
    }
  } catch (e) {
    console.warn("[Duplicate Detection Warning]:", e);
  }

  return { isDuplicate: false };
}

// ----------------------------------------------------
// 2. Collection & SubCollection Auto-Matcher
// ----------------------------------------------------
export async function matchCollectionAndSubCollection(
  language: string,
  cast: string[],
  film: string
): Promise<{ collectionName: string; subCollectionId?: string; suggestedSubCollectionName?: string }> {
  const langLower = language.toLowerCase();
  
  // Standard Collection Mapping
  let collectionName = "Classic Malayalam";
  if (langLower.includes("malayalam")) collectionName = "Classic Malayalam";
  else if (langLower.includes("tamil")) collectionName = "Kollywood Tamil";
  else if (langLower.includes("telugu")) collectionName = "Tollywood Telugu";
  else if (langLower.includes("hindi") || langLower.includes("bollywood")) collectionName = "Bollywood Classics";
  else if (langLower.includes("english") || langLower.includes("hollywood")) collectionName = "Hollywood Legends";
  else if (langLower.includes("anime") || langLower.includes("japanese")) collectionName = "Anime Fine Art";

  // Try to find matching parent collection in DB
  const dbCollection = await prisma.collection.findFirst({
    where: {
      OR: [
        { name: { equals: collectionName, mode: "insensitive" } },
        { name: { contains: language, mode: "insensitive" } },
      ],
    },
    include: { subCollections: true },
  });

  let matchedSubId: string | undefined = undefined;
  let suggestedSubName: string | undefined = undefined;

  // Primary subject/actor detection
  const primaryActor = cast[0];

  if (dbCollection && primaryActor) {
    const subMatch = dbCollection.subCollections.find(
      (s) =>
        s.name.toLowerCase().includes(primaryActor.toLowerCase()) ||
        primaryActor.toLowerCase().includes(s.name.toLowerCase())
    );

    if (subMatch) {
      matchedSubId = subMatch.id;
    } else {
      suggestedSubName = primaryActor;
    }
  } else if (primaryActor) {
    suggestedSubName = primaryActor;
  }

  return {
    collectionName: dbCollection ? dbCollection.name : collectionName,
    subCollectionId: matchedSubId,
    suggestedSubCollectionName: suggestedSubName,
  };
}

// ----------------------------------------------------
// 3. Gemini Multimodal Vision AI Provider
// ----------------------------------------------------
export class GeminiPosterAnalyzerProvider implements PosterAnalyzerProvider {
  name = "Google Gemini Vision AI";

  async analyze(imageBuffer: Buffer, mimeType: string, filename?: string): Promise<PosterAnalysis> {
    const imageHash = generateImageHash(imageBuffer);
    const base64Image = imageBuffer.toString("base64");

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

    let aiRawJson: any = null;

    if (apiKey) {
      try {
        const promptText = `
You are a senior archivist, OCR expert, and fine art poster analyzer for Polacraft Studio.
Analyze the attached poster image and extract accurate, structured JSON metadata.

IMPORTANT CATEGORY INSTRUCTIONS:
1. Classify categoryType as one of: "SPORTS", "ANIME", "MUSIC", "FINE_ART", or "CINEMA".
2. If the poster is related to SPORTS (Football, Soccer, Messi, Ronaldo, Neymar, Barcelona, Real Madrid, Premier League, World Cup, Basketball, F1, Cricket, etc.):
   - DO NOT fabricate movie names or film directors.
   - Set "film" to the Athlete or Team Name (e.g. "Lionel Messi - Argentina" or "Real Madrid").
   - Set "director" to the Tournament / League / Event (e.g. "FIFA World Cup Qatar" or "UEFA Champions League").
   - Set "year" to the Event/Season Year (e.g. 2022).
   - Set "genre" to the Sport / Style (e.g. "Football Fine Art" or "Sports Typography").
   - Set "cast" to [Primary Athlete / Player Name].
3. If the poster is related to FINE_ART or MINIMALIST:
   - Set "film" to the Art Movement or Subject (e.g. "Bauhaus Geometric Art").
   - Set "director" to the Studio / Artist (e.g. "Polacraft Fine Art").
   - Set "genre" to the Art Style (e.g. "Minimalist Vector").
4. If the poster is related to CINEMA / MOVIES / SERIES:
   - Identify the Movie/Series title, Primary Lead Actor, Filmmaker/Director, and Release Year.

Return ONLY a valid JSON object matching this schema:
{
  "categoryType": "SPORTS",
  "title": "Lionel Messi World Cup Victory Poster",
  "film": "Lionel Messi - Argentina",
  "year": 2022,
  "director": "FIFA World Cup Qatar",
  "cast": ["Lionel Messi"],
  "language": "English",
  "genre": "Football Fine Art",
  "tagline": "The Greatest of All Time",
  "story": "Iconic archival fine art poster print commemorating Lionel Messi's historic World Cup triumph.",
  "designNotes": "Archival Giclée print on 250 GSM cotton fine art paper.",
  "seoTitle": "Lionel Messi World Cup Poster | Polacraft",
  "seoDescription": "Handcrafted Lionel Messi World Cup victory art print on premium fine art paper.",
  "keywords": ["Lionel Messi", "Football Poster", "Argentina", "World Cup", "Polacraft"],
  "colors": {
    "primary": "#75AADB",
    "accent": "#F4C430",
    "bg": "#FAFAF8",
    "text": "#1A1A1A"
  },
  "orientation": "PORTRAIT",
  "aspectRatio": 1.4,
  "quality": {
    "width": 1200,
    "height": 1600,
    "isPrintSuitable": true,
    "warnings": []
  },
  "copyright": {
    "type": "OFFICIAL",
    "confidence": 0.95
  },
  "confidenceScores": {
    "title": 0.98,
    "film": 0.98,
    "language": 0.99,
    "cast": 0.95,
    "overall": 0.96
  },
  "ocrText": "MESSI ARGENTINA 10 WORLD CUP CHAMPIONS"
}
`;

        const modelsToTry = [
          "gemini-flash-latest",
          "gemini-3-flash-preview",
          "gemini-2.0-flash",
          "gemini-1.5-flash",
        ];

        for (const modelName of modelsToTry) {
          try {
            const res = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        { text: promptText },
                        {
                          inlineData: {
                            mimeType: mimeType || "image/jpeg",
                            data: base64Image,
                          },
                        },
                      ],
                    },
                  ],
                  generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.1,
                  },
                }),
              }
            );

            if (res.ok) {
              const resData = await res.json();
              let rawText = resData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawText) {
                rawText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
                aiRawJson = JSON.parse(rawText);
                if (aiRawJson) break;
              }
            }
          } catch (err) {
            console.warn(`[Gemini Model ${modelName} Warning]:`, err);
          }
        }
      } catch (err) {
        console.warn("[Gemini Vision AI Outer Warning]:", err);
      }
    }

    // Heuristic Fallback if Gemini unavailable or returned partial
    const cleanFilename = filename ? filename.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ") : "Cinema Poster";
    const filenameLower = (filename || "").toLowerCase();
    const isSports = aiRawJson?.categoryType === "SPORTS" || /football|soccer|messi|ronaldo|cricket|f1|nba|basketball|sports|stadium|maradona/i.test(filenameLower + " " + (aiRawJson?.genre || ""));
    const isFineArt = aiRawJson?.categoryType === "FINE_ART" || /bauhaus|japandi|minimalist|abstract|architecture|art/i.test(filenameLower);
    const categoryType: PosterCategoryType = aiRawJson?.categoryType || (isSports ? "SPORTS" : isFineArt ? "FINE_ART" : "CINEMA");

    const filmName = aiRawJson?.film || cleanFilename;
    const titleName = aiRawJson?.title || `${filmName} Poster`;
    const language = aiRawJson?.language || (isSports ? "English" : "Malayalam");
    const cast = Array.isArray(aiRawJson?.cast) && aiRawJson.cast.length > 0 ? aiRawJson.cast : [isSports ? "Athlete" : "Mohanlal"];

    const slug = (aiRawJson?.film || cleanFilename)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Collection & SubCollection Auto-Match
    const collectionMatch = await matchCollectionAndSubCollection(language, cast, filmName);
    const targetCollection = isSports ? "Sports & Fine Art" : collectionMatch.collectionName;

    // Duplicate Check
    const dupCheck = await checkPosterDuplicates(imageHash, titleName, filmName, cast);

    return {
      categoryType,
      title: titleName,
      film: filmName,
      year: aiRawJson?.year || 2024,
      director: aiRawJson?.director || (isSports ? "Sports Edition" : "Polacraft Studio"),
      cast: cast,
      language: language,
      collectionName: targetCollection,
      subCollectionId: collectionMatch.subCollectionId,
      suggestedSubCollectionName: collectionMatch.suggestedSubCollectionName,
      genre: aiRawJson?.genre || (isSports ? "Sports Fine Art" : "Drama"),
      tagline: aiRawJson?.tagline || (isSports ? "Iconic Sports Archival Print" : "Handcrafted Archival Cinema Print"),
      story:
        aiRawJson?.story ||
        `Museum-quality fine art print of ${filmName}, printed on 250 GSM ultra-matte cotton paper.`,
      designNotes: aiRawJson?.designNotes || "High contrast archival Giclée print.",
      seoTitle: aiRawJson?.seoTitle || `${filmName} ${isSports ? "Sports Poster" : "Movie Poster"} | Polacraft Studio`,
      seoDescription:
        aiRawJson?.seoDescription ||
        `Buy authentic museum-grade ${filmName} fine art poster print online at Polacraft.`,
      slug,
      keywords: aiRawJson?.keywords || [filmName, ...cast, language, "Poster", "Polacraft"],
      colors: aiRawJson?.colors || {
        primary: "#1E1E1E",
        accent: "#10B981",
        bg: "#FAFAF8",
        text: "#1A1A1A",
      },
      orientation: aiRawJson?.orientation || "PORTRAIT",
      aspectRatio: aiRawJson?.aspectRatio || 1.41,
      quality: {
        width: aiRawJson?.quality?.width || 1200,
        height: aiRawJson?.quality?.height || 1600,
        isPrintSuitable: aiRawJson?.quality?.isPrintSuitable ?? true,
        warnings: aiRawJson?.quality?.warnings || [],
      },
      copyright: {
        type: aiRawJson?.copyright?.type || "OFFICIAL",
        confidence: aiRawJson?.copyright?.confidence || 0.9,
      },
      confidenceScores: aiRawJson?.confidenceScores || {
        title: 0.95,
        film: 0.95,
        language: 0.95,
        cast: 0.95,
        overall: 0.95,
      },
      ocrText: aiRawJson?.ocrText || "",
      isDuplicate: dupCheck.isDuplicate,
      duplicateWarning: dupCheck.warning,
      existingProductId: dupCheck.existingProductId,
    };
  }
}

// Global Analyzer Instance (Easy Provider Swapping)
export const defaultPosterAnalyzer = new GeminiPosterAnalyzerProvider();
