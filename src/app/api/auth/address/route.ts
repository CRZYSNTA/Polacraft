import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getCustomerSession } from "@/lib/session/customerSession";

export async function POST(req: Request) {
  try {
    const nextAuthSession = await auth();
    let userId = nextAuthSession?.user?.id;

    if (!userId) {
      const customSession = await getCustomerSession();
      userId = customSession?.userId;
    }

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, street, city, state, zip, phone, type, isDefault } = body;

    // Update WhatsApp phone number on User record if provided
    if (phone) {
      await prisma.user.update({
        where: { id: userId },
        data: { phone: phone.trim() },
      });
    }

    // Save Shipping Address if provided
    if (street && city && zip) {
      const existingAddresses = await prisma.address.count({ where: { userId } });
      const makeDefault = isDefault !== undefined ? Boolean(isDefault) : existingAddresses === 0;

      if (makeDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const newAddress = await prisma.address.create({
        data: {
          userId,
          name: (name || "Collector").trim(),
          street: street.trim(),
          city: city.trim(),
          state: state ? state.trim() : null,
          zip: zip.trim(),
          type: type || "Home",
          isDefault: makeDefault,
        },
      });

      return NextResponse.json({ success: true, address: newAddress });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Save Customer Details Error]:", error);
    return NextResponse.json({ error: "Failed to save profile details." }, { status: 500 });
  }
}
