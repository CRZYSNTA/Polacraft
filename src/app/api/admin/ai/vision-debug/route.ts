import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { OpenAIProvider } from "@/services/ai/openai";

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { imageUrl } = body;

    if (!imageUrl) {
      return NextResponse.json({ error: "imageUrl parameter is required for Vision Debugger" }, { status: 400 });
    }

    const provider = new OpenAIProvider();
    const debugTrace = await provider.debugAnalyzeImage({ imageUrl });

    return NextResponse.json({
      success: true,
      debugTrace,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to run Vision Debugger",
      },
      { status: 500 }
    );
  }
}
