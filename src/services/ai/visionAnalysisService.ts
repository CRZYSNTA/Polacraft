/**
 * Polacraft v1.2.1 Phase 2 - Combined Vision + OCR Analysis Service
 */

import { getAIProvider } from "./factory";
import { VisionResult, AIProviderName } from "./types";
import { prisma } from "@/lib/prisma";

export async function analyzePosterVision(imageUrl: string): Promise<VisionResult> {
  if (!imageUrl) {
    throw new Error("Poster image URL is required for Vision AI analysis.");
  }

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
  const result = await provider.analyzeImage({ imageUrl });

  console.log("==========================================");
  console.log("STAGE 2: VISION RESULT", result.data);
  console.log("==========================================");

  return result.data;
}
