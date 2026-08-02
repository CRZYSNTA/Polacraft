import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export interface PosterAnalysis {
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
You are a senior cinema archivist, OCR expert, and fine art poster analyzer for Polacraft Studio.
Analyze the attached movie poster image and extract accurate, structured JSON metadata.

INSTRUCTIONS:
1. Extract visible OCR text on the poster (Title, Tagline, Actor names, Director, Release Year).
2. Identify the Movie/Series title, Primary Lead Actor, Filmmaker/Director, Release Year, and Language (Malayalam, Tamil, Telugu, Hindi, English, Anime, etc.).
3. If language or subject is uncertain, set confidence score lower and do NOT hallucinate fictional facts.
4. Extract 4 harmonious hex colors: primary, accent, bg, text.
5. Generate an SEO title (under 60 chars) and an SEO description (under 150 chars).
6. Infer orientation ("PORTRAIT", "LANDSCAPE", or "SQUARE") and quality/print suitability.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Clean Poster Title (e.g. Lucifer Poster)",
  "film": "Lucifer",
  "year": 2019,
  "director": "Prithviraj Sukumaran",
  "cast": ["Mohanlal", "Manju Warrier", "Vivek Oberoi"],
  "language": "Malayalam",
  "genre": "Action Drama",
  "tagline": "Empirror of Malayalam Cinema",
  "story": "Cinematic art print celebrating the legendary film Lucifer.",
  "designNotes": "Archival Giclée print on 250 GSM cotton fine art paper.",
  "seoTitle": "Lucifer Movie Poster | Polacraft",
  "seoDescription": "Handcrafted Lucifer movie poster starring Mohanlal printed on fine art paper.",
  "keywords": ["Lucifer", "Mohanlal", "Malayalam Cinema", "Polacraft", "Movie Poster"],
  "colors": {
    "primary": "#802720",
    "accent": "#E6C15C",
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
  "ocrText": "LUCIFER MOHANLAL PRITHVIRAJ SUKUMARAN"
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
    const filmName = aiRawJson?.film || cleanFilename;
    const titleName = aiRawJson?.title || `${filmName} Poster`;
    const language = aiRawJson?.language || "Malayalam";
    const cast = Array.isArray(aiRawJson?.cast) && aiRawJson.cast.length > 0 ? aiRawJson.cast : ["Mohanlal"];

    const slug = (aiRawJson?.film || cleanFilename)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Collection & SubCollection Auto-Match
    const collectionMatch = await matchCollectionAndSubCollection(language, cast, filmName);

    // Duplicate Check
    const dupCheck = await checkPosterDuplicates(imageHash, titleName, filmName, cast);

    return {
      title: titleName,
      film: filmName,
      year: aiRawJson?.year || 2024,
      director: aiRawJson?.director || "Polacraft Studio",
      cast: cast,
      language: language,
      collectionName: collectionMatch.collectionName,
      subCollectionId: collectionMatch.subCollectionId,
      suggestedSubCollectionName: collectionMatch.suggestedSubCollectionName,
      genre: aiRawJson?.genre || "Drama",
      tagline: aiRawJson?.tagline || "Handcrafted Archival Cinema Print",
      story:
        aiRawJson?.story ||
        `Museum-quality fine art print of ${filmName}, printed on 250 GSM ultra-matte cotton paper.`,
      designNotes: aiRawJson?.designNotes || "High contrast archival Giclée print.",
      seoTitle: aiRawJson?.seoTitle || `${filmName} Movie Poster | Polacraft Studio`,
      seoDescription:
        aiRawJson?.seoDescription ||
        `Buy authentic museum-grade ${filmName} fine art movie poster print online at Polacraft.`,
      slug,
      keywords: aiRawJson?.keywords || [filmName, ...cast, language, "Movie Poster", "Polacraft"],
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
        language: 0.9,
        cast: 0.9,
        overall: 0.92,
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
