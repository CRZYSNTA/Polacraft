import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { getAIAnalyticsSummary } from "@/services/ai/aiAnalyticsService";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const summary = await getAIAnalyticsSummary();
    return NextResponse.json({ success: true, analytics: summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
