import { NextResponse } from "next/server";
import { uploadImageBuffer } from "@/lib/cloudinary";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No design artwork file provided." }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File size exceeds maximum limit of 10 MB." },
        { status: 400 }
      );
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid image format (${file.type}). Supported formats: JPEG, PNG, WEBP, AVIF.` },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload customer custom design artwork to Cloudinary
    try {
      const uploadResult = await uploadImageBuffer(buffer, file.name, "CUSTOM_DESIGN");
      return NextResponse.json({
        success: true,
        secure_url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
      });
    } catch (cloudErr: any) {
      console.warn("[Cloudinary Direct Upload Skipped/Fallback]:", cloudErr);
      // Fallback: convert file to data URL for seamless customer checkout
      const base64Data = buffer.toString("base64");
      const dataUrl = `data:${file.type};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        secure_url: dataUrl,
        isLocalFallback: true,
      });
    }
  } catch (error: any) {
    console.error("[Customer Upload API Error]:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process image upload." },
      { status: 500 }
    );
  }
}
