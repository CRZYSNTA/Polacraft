import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { parseWhatsAppChatWithAI } from "@/lib/ai/whatsappParser";

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text prompt is required" }, { status: 400 });
    }

    const parsed = await parseWhatsAppChatWithAI(text);
    return NextResponse.json({ success: true, parsed });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to parse WhatsApp chat text." }, { status: 500 });
  }
}
