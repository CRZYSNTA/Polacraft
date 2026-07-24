import { NextResponse } from "next/server";
import { destroyCustomerSession } from "@/lib/session/customerSession";

export async function POST() {
  try {
    await destroyCustomerSession();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Customer Logout Error]:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
