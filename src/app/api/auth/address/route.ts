import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerSession } from "@/lib/session/customerSession";

export async function POST(req: Request) {
  try {
    const session = await getCustomerSession();
    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, street, city, state, zip, type, isDefault } = body;

    if (!name || !street || !city || !zip) {
      return NextResponse.json({ error: "All required fields must be provided." }, { status: 400 });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.userId,
        name: name.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state ? state.trim() : null,
        zip: zip.trim(),
        type: type || "Home",
        isDefault: Boolean(isDefault),
      },
    });

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    console.error("[Create Address Error]:", error);
    return NextResponse.json({ error: "Failed to save address." }, { status: 500 });
  }
}
