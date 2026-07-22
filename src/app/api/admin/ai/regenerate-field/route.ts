import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { regenerateSpecificField } from "@/services/ai/fieldRegenerationService";
import { recordFieldRegenerationEvent } from "@/services/ai/aiAnalyticsService";

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { field, movie, actor, genre, tone } = body;

    if (!field || !movie) {
      return NextResponse.json({ error: "Field and Movie title are required for regeneration" }, { status: 400 });
    }

    const result = await regenerateSpecificField({ field, movie, actor, genre, tone });
    recordFieldRegenerationEvent();

    return NextResponse.json({
      success: true,
      field,
      data: result
    });
  } catch (error: any) {
    console.error("[AI Field Regeneration Error]:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
