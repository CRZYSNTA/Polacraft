/**
 * Polacraft v1.2.1 Phase 2 - Combined Vision + OCR Analysis Service
 */

import { getAIProvider } from "./factory";
import { VisionResult, AIProviderName } from "./types";
import { prisma } from "@/lib/prisma";

/**
 * Strips all Cloudinary and Unsplash transformations to return the original full-resolution master image asset.
 */
export function getOriginalFullResImageUrl(url: string): string {
  if (!url) return url;

  let cleaned = url.trim();

  // Cloudinary URL cleaning: Remove any transformation path segment between /image/upload/ and /v.../ or public_id
  if (cleaned.includes("res.cloudinary.com")) {
    cleaned = cleaned.replace(/\/image\/upload\/(?:[a-z]_[^/]+,)*[a-z]_[^/]+\/(v\d+\/)/i, "/image/upload/$1");
    cleaned = cleaned.replace(/\/image\/upload\/[a-z]_[^/]+\//gi, "/image/upload/");
  }

  // Unsplash URL cleaning: Strip sizing query parameters
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
  try {
    const headRes = await fetch(fullResUrl, { method: "HEAD" });
    const contentType = headRes.headers.get("content-type");
    const contentLength = headRes.headers.get("content-length");
    console.log(`VERIFIED ASSET METADATA — Content-Type: ${contentType}, Size: ${contentLength ? `${(parseInt(contentLength) / 1024).toFixed(1)} KB` : "Unknown"}`);
  } catch (e) {
    console.log("Asset metadata check skipped");
  }
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
