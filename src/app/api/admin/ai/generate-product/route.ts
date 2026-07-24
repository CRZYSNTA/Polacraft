import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { analyzePosterVision } from "@/services/ai/visionAnalysisService";
import { generateFullAIProductDraft } from "@/services/ai/contentGenerationService";
import { recordAIGenerationEvent } from "@/services/ai/aiAnalyticsService";

export async function POST(req: Request) {
  // Validate Admin Authentication & Authorization
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  const startTime = Date.now();

  try {
    const body = await req.json();
    const { imageUrl, originalFilename, options } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "Poster image URL is required" }, { status: 400 });
    }

    console.log("==========================================");
    console.log("STAGE 1: IMAGE UPLOAD");
    console.log("RAW IMAGE URL:", imageUrl);
    console.log("ORIGINAL FILENAME:", originalFilename || options?.originalFilename || "N/A");
    console.log("==========================================");

    const combinedOptions = {
      ...options,
      originalFilename: originalFilename || options?.originalFilename,
      imageUrl,
    };

    // Step 1: Vision AI Analysis
    const vision = await analyzePosterVision(imageUrl);

    // Step 2: Verified Metadata Lookup & Content Generation
    const draftPayload = await generateFullAIProductDraft(vision, combinedOptions);

    console.log("==========================================");
    console.log("STAGE 7: API ROUTE OUTPUT");
    console.log(JSON.stringify(draftPayload, null, 2));
    console.log("==========================================");

    const durationMs = Date.now() - startTime;
    recordAIGenerationEvent(durationMs);

    return NextResponse.json({
      success: true,
      draft: draftPayload,
      executionTimeMs: durationMs
    });
  } catch (error: any) {
    console.error("[AI Generate Product API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "AI Generation Failed. Please review manually.",
        fallback: true
      },
      { status: 500 }
    );
  }
}
