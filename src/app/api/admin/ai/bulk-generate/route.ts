import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { generateBulkCollectionDrafts } from "@/services/ai/contentGenerationService";

export async function POST(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const body = await req.json();
    const { query, count, collectionName } = body;

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json({ error: "Movie or actor query string is required." }, { status: 400 });
    }

    const itemCount = Math.min(Math.max(Number(count) || 5, 1), 15);
    const drafts = await generateBulkCollectionDrafts(
      query.trim(),
      itemCount,
      collectionName || "Classic Malayalam"
    );

    return NextResponse.json({
      success: true,
      query: query.trim(),
      count: drafts.length,
      drafts,
    });
  } catch (error: any) {
    console.error("[Bulk AI Generate Route Error]:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Bulk AI concept generation failed" },
      { status: 500 }
    );
  }
}
