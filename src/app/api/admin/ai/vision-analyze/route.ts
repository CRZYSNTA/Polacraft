import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { analyzePosterVision } from "@/services/ai/visionAnalysisService";

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl is required for Vision + OCR analysis" }, { status: 400 });
    }

    // Execute Phase 2 Vision + OCR extraction
    const visionFacts = await analyzePosterVision(imageUrl);

    return NextResponse.json({
      success: true,
      vision: visionFacts,
    });
  } catch (error: any) {
    console.error("[Phase 2 Vision API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Vision + OCR extraction failed",
      },
      { status: 500 }
    );
  }
}
