/**
 * Polacraft v1.2.1 Phase 2 - Combined Vision + OCR Analysis Service
 */

import { getAIProvider } from "./factory";
import { VisionResult, AIProviderName } from "./types";
import { prisma } from "@/lib/prisma";

/**
 * Strips thumbnail transformations from Cloudinary and Unsplash image URLs to deliver full-resolution images to Vision AI.
 */
export function getOriginalFullResImageUrl(url: string): string {
  if (!url) return url;

  let cleaned = url.trim();

  // Strip Cloudinary resize/crop transformations like /c_thumb,w_80,h_80/ or /w_120,h_120,c_fill/
  if (cleaned.includes("res.cloudinary.com")) {
    cleaned = cleaned.replace(/\/image\/upload\/(?:c_[^/]+,)?(?:w_\d+,)?(?:h_\d+,)?[^/]+\/(v\d+\/)/i, "/image/upload/$1");
    cleaned = cleaned.replace(/\/image\/upload\/w_\d+,\w+[^/]*\//i, "/image/upload/");
  }

  // Strip Unsplash sizing query parameters like ?w=600 or ?w=120
  if (cleaned.includes("images.unsplash.com") && cleaned.includes("?")) {
    cleaned = cleaned.split("?")[0];
  }

  return cleaned;
}

export async function analyzePosterVision(imageUrl: string): Promise<VisionResult> {
  if (!imageUrl) {
    throw new Error("Poster image URL is required for Vision AI analysis.");
  }

  const fullResUrl = getOriginalFullResImageUrl(imageUrl);

  console.log("==========================================");
  console.log("VISION FULL RES IMAGE URL:", fullResUrl);
  console.log("==========================================");

  // Load configured AI provider from SiteSettings or environment
  let activeProviderName: AIProviderName = "openai";
  try {
    const settings = await prisma.siteSettings.findFirst();
    if (settings?.aiProvider) {
      activeProviderName = settings.aiProvider.toLowerCase() as AIProviderName;
    }
  } catch (err) {
    // Fallback to default
  }

  const provider = getAIProvider(activeProviderName);
  const result = await provider.analyzeImage({ imageUrl: fullResUrl });

  console.log("==========================================");
  console.log("STAGE 2: VISION RESULT", result.data);
  console.log("==========================================");

  return result.data;
}
