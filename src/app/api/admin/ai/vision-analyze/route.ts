import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { defaultPosterAnalyzer } from "@/lib/ai/posterAnalyzer";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const contentType = req.headers.get("content-type") || "";

    let imageBuffer: Buffer | null = null;
    let mimeType = "image/jpeg";
    let filename = "poster.jpg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return NextResponse.json({ error: "No image file provided in form data." }, { status: 400 });
      }

      mimeType = file.type || "image/jpeg";
      filename = file.name || "poster.jpg";
      const bytes = await file.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    } else {
      const body = await req.json();
      const imageUrl = body.imageUrl || body.url;

      if (!imageUrl) {
        return NextResponse.json({ error: "Image URL or file is required for AI analysis." }, { status: 400 });
      }

      // Fetch image from URL
      const imgRes = await fetch(imageUrl);
      if (!imgRes.ok) {
        return NextResponse.json({ error: `Failed to fetch image from URL: ${imgRes.statusText}` }, { status: 400 });
      }

      mimeType = imgRes.headers.get("content-type") || "image/jpeg";
      const bytes = await imgRes.arrayBuffer();
      imageBuffer = Buffer.from(bytes);
    }

    if (!imageBuffer || imageBuffer.length === 0) {
      return NextResponse.json({ error: "Invalid or empty image data." }, { status: 400 });
    }

    // Security check: File size limit 20MB
    if (imageBuffer.length > 20 * 1024 * 1024) {
      return NextResponse.json({ error: "File size exceeds maximum allowed 20MB limit." }, { status: 400 });
    }

    // Execute Vision AI Analysis
    const analysis = await defaultPosterAnalyzer.analyze(imageBuffer, mimeType, filename);

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    console.error("[Vision AI API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze poster image with AI" },
      { status: 500 }
    );
  }
}
