import { NextResponse } from "next/server";
import { protectAdminApiRoute } from "@/lib/auth/guards";
import { getAIProvider, getAllAIHealthChecks } from "@/services/ai";

export async function GET(req: Request) {
  const authError = await protectAdminApiRoute(req);
  if (authError) return authError;

  try {
    const currentProvider = getAIProvider();
    const currentHealth = await currentProvider.healthCheck();
    const allHealthChecks = await getAllAIHealthChecks();

    return NextResponse.json({
      success: true,
      currentProvider: {
        name: currentProvider.name,
        available: currentProvider.isAvailable(),
        capabilities: currentProvider.capabilities,
      },
      healthCheck: currentHealth,
      allProviders: allHealthChecks,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Failed to retrieve AI status";
    return NextResponse.json(
      {
        success: false,
        reason: errMessage,
      },
      { status: 500 }
    );
  }
}
