import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawQuery = searchParams.get("query")?.trim() || searchParams.get("orderId")?.trim() || "";

  if (!rawQuery) {
    return NextResponse.json(
      { error: "Order ID, Consignment Number (AWB), or Phone Number is required" },
      { status: 400 }
    );
  }

  const cleanQuery = rawQuery.toUpperCase().replace("#", "").trim();

  try {
    // 1. Query Real Database for Order matching orderNumber, AWB number, or Phone number
    const realOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: cleanQuery, mode: "insensitive" } },
          { orderNumber: { equals: `POL-${cleanQuery}`, mode: "insensitive" } },
          { awbNumber: { equals: cleanQuery, mode: "insensitive" } },
          { phone: { equals: rawQuery } }
        ]
      },
      include: {
        items: true
      }
    });

    if (!realOrder) {
      return NextResponse.json(
        { error: `No package shipment record found matching "${rawQuery}". Please check your Order ID or AWB Consignment code.` },
        { status: 404 }
      );
    }

    // 2. Format Real Logistics Status & Milestone Timeline
    const carrierName = realOrder.courierPartner || "The Professional Couriers (TPC India)";
    const carrierUrl = carrierName.toLowerCase().includes("professional")
      ? "https://www.tpcindia.com/tracking.aspx"
      : "https://www.tpcindia.com/";

    const status = realOrder.shippingStatus;
    let statusLabel = "Order Processing";
    let statusDescription = "Your cinema art has been confirmed and queued for printing & inspection.";
    let estDelivery = "2 - 4 Business Days";

    if (status === "DELIVERED") {
      statusLabel = "Delivered";
      statusDescription = "Package delivered and signed by consignee.";
      estDelivery = "Delivered";
    } else if (status === "SHIPPED" || status === "OUT_FOR_DELIVERY") {
      statusLabel = status === "OUT_FOR_DELIVERY" ? "Out for Delivery" : "In Transit via Professional Couriers";
      statusDescription = status === "OUT_FOR_DELIVERY" ? "Executive is out for delivery." : "Package handed over to courier and in transit to local delivery hub.";
      estDelivery = "1 - 2 Days";
    } else if (status === "PRINTED" || status === "PACKED") {
      statusLabel = "Printed & Inspected";
      statusDescription = "300 GSM matte print completed, passed quality check, sealed in protective Kraft armor.";
    }

    const itemsFormatted = realOrder.items.map((item: any) => ({
      title: item.title,
      size: item.size || "A4",
      frame: item.frame || "Matte Black Frame",
      qty: item.quantity,
      image: item.image || "/assets/custom_grid_poster.png"
    }));

    const isConfirmed = true;
    const isPrinted = status === "PRINTED" || status === "PACKED" || status === "SHIPPED" || status === "OUT_FOR_DELIVERY" || status === "DELIVERED";
    const isDispatched = status === "SHIPPED" || status === "OUT_FOR_DELIVERY" || status === "DELIVERED";
    const isDelivered = status === "DELIVERED";

    const formattedResult = {
      orderId: `#${realOrder.orderNumber}`,
      awbNumber: realOrder.awbNumber || `TPC-${realOrder.orderNumber}`,
      carrier: carrierName,
      carrierWebsite: "https://www.tpcindia.com/",
      carrierTrackingUrl: carrierUrl,
      customerName: realOrder.shippingName,
      destination: `${realOrder.shippingCity}${realOrder.shippingState ? `, ${realOrder.shippingState}` : ""} - ${realOrder.shippingZip}`,
      estimatedDelivery: estDelivery,
      currentStatus: status,
      statusLabel: statusLabel,
      statusDescription: statusDescription,
      items: itemsFormatted,
      paymentStatus: realOrder.paymentStatus,
      paymentMethod: realOrder.paymentMethod,
      subtotal: realOrder.total,
      timeline: [
        { 
          title: "Order Placed & Payment Verified", 
          location: "Polacraft Studio, Kochi", 
          timestamp: new Date(realOrder.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }), 
          completed: isConfirmed,
          active: !isPrinted 
        },
        { 
          title: "Printed, Quality Checked & Sealed", 
          location: "Studio Quality Inspection", 
          timestamp: isPrinted ? "Completed" : "In Queue", 
          completed: isPrinted,
          active: isPrinted && !isDispatched 
        },
        { 
          title: "Dispatched via Professional Couriers", 
          location: "TPC Branch, Kochi", 
          timestamp: isDispatched ? "Handed over to Courier" : "Scheduled", 
          completed: isDispatched,
          active: isDispatched && !isDelivered 
        },
        { 
          title: "Out for Delivery with Courier Executive", 
          location: "Destination Branch", 
          timestamp: isDelivered ? "Completed" : "Pending", 
          completed: isDelivered 
        },
        { 
          title: "Delivered to Consignee Doorstep", 
          location: realOrder.shippingCity, 
          timestamp: isDelivered ? "Delivered & Signed" : "Pending", 
          completed: isDelivered,
          active: isDelivered 
        }
      ]
    };

    return NextResponse.json({ success: true, tracking: formattedResult });
  } catch (error: any) {
    console.error("[Tracking API Error]:", error);
    return NextResponse.json({ error: "Failed to fetch order status. Please try again." }, { status: 500 });
  }
}
