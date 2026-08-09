import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || searchParams.get("orderId")?.trim() || "";

  if (!query) {
    return NextResponse.json(
      { error: "Order ID, Tracking Number (AWB), or Phone Number is required" },
      { status: 400 }
    );
  }

  const cleanQuery = query.toUpperCase().replace("#", "");

  // Simulated Live Tracking Database
  const trackingDatabase: Record<string, any> = {
    "POL-1082": {
      orderId: "#POL-1082",
      awbNumber: "SR94817293801",
      carrier: "Shiprocket Express (BlueDart)",
      customerName: "Gowtham S",
      destination: "Bengaluru, Karnataka - 560001",
      estimatedDelivery: "August 11, 2026 (Tomorrow by 7 PM)",
      currentStatus: "IN_TRANSIT",
      statusLabel: "In Transit",
      statusDescription: "Shipment is in transit to the destination delivery center.",
      items: [
        { title: "Lionel Messi Argentina 2022 World Cup Print", size: "A4", frame: "Matte Black Frame", qty: 1, image: "/assets/custom_grid_poster.png" },
        { title: "Interstellar Gargantua Hole Frame", size: "A3", frame: "Print Only", qty: 1, image: "/assets/custom_grid_split_3.png" }
      ],
      paymentStatus: "PAID",
      paymentMethod: "Prepaid (UPI)",
      subtotal: 1249,
      timeline: [
        { title: "Order Placed & Confirmed", location: "Kochi, Kerala", timestamp: "Aug 08, 2026 • 10:15 AM", completed: true },
        { title: "Archival Printing & QC Passed", location: "Polacraft Studio, Kochi", timestamp: "Aug 08, 2026 • 02:30 PM", completed: true },
        { title: "Hand-Packed in Eco Tube & Dispatched", location: "Kochi Logistics Hub", timestamp: "Aug 09, 2026 • 09:00 AM", completed: true },
        { title: "Arrived at Regional Sort Center", location: "Bengaluru South Hub", timestamp: "Aug 09, 2026 • 04:45 PM", completed: true, active: true },
        { title: "Out for Delivery", location: "Bengaluru Local Hub", timestamp: "Expected Aug 11 • Morning", completed: false },
        { title: "Delivered to Customer", location: "Destination Address", timestamp: "Expected Aug 11 • By 7 PM", completed: false }
      ]
    },
    "POL-1090": {
      orderId: "#POL-1090",
      awbNumber: "DEL8392019482",
      carrier: "Delhivery Surface",
      customerName: "Rahul V",
      destination: "Chennai, Tamil Nadu - 600028",
      estimatedDelivery: "August 10, 2026 (Today)",
      currentStatus: "OUT_FOR_DELIVERY",
      statusLabel: "Out for Delivery",
      statusDescription: "Courier executive is out for delivery in your area.",
      items: [
        { title: "Custom 3-Panel Split Poster", size: "A3", frame: "Teak Wood Frame", qty: 1, image: "/assets/custom_grid_split_3.png" }
      ],
      paymentStatus: "PAID",
      paymentMethod: "Prepaid (Credit Card)",
      subtotal: 899,
      timeline: [
        { title: "Order Placed & Confirmed", location: "Kochi, Kerala", timestamp: "Aug 07, 2026 • 11:00 AM", completed: true },
        { title: "Printed & Framed", location: "Polacraft Studio, Kochi", timestamp: "Aug 07, 2026 • 04:00 PM", completed: true },
        { title: "Handed over to Delhivery", location: "Kochi Hub", timestamp: "Aug 08, 2026 • 08:30 AM", completed: true },
        { title: "Arrived at Destination Hub", location: "Chennai Central Hub", timestamp: "Aug 09, 2026 • 02:15 AM", completed: true },
        { title: "Out for Delivery", location: "Chennai Delivery Center", timestamp: "Aug 09, 2026 • 09:30 AM", completed: true, active: true },
        { title: "Delivered", location: "Chennai, Tamil Nadu", timestamp: "Expected Today by 6 PM", completed: false }
      ]
    },
    "POL-1075": {
      orderId: "#POL-1075",
      awbNumber: "BD3849201849",
      carrier: "BlueDart Air Express",
      customerName: "Ananya M",
      destination: "Mumbai, Maharashtra - 400001",
      estimatedDelivery: "August 08, 2026 (Delivered)",
      currentStatus: "DELIVERED",
      statusLabel: "Delivered",
      statusDescription: "Package handed over to recipient at front desk.",
      items: [
        { title: "Manichitrathazhu Nagavalli Classic Poster", size: "A4", frame: "Matte Black Frame", qty: 2, image: "/assets/custom_grid_poster.png" }
      ],
      paymentStatus: "PAID",
      paymentMethod: "Prepaid (Razorpay UPI)",
      subtotal: 699,
      timeline: [
        { title: "Order Placed & Confirmed", location: "Kochi, Kerala", timestamp: "Aug 05, 2026 • 09:00 AM", completed: true },
        { title: "Printed & Quality Inspected", location: "Polacraft Studio", timestamp: "Aug 05, 2026 • 01:30 PM", completed: true },
        { title: "Dispatched via BlueDart", location: "Kochi Airport Air Hub", timestamp: "Aug 06, 2026 • 07:00 AM", completed: true },
        { title: "Arrived at Mumbai Airport", location: "Mumbai Air Cargo Terminal", timestamp: "Aug 07, 2026 • 02:00 PM", completed: true },
        { title: "Out for Delivery", location: "South Mumbai Delivery Hub", timestamp: "Aug 08, 2026 • 08:30 AM", completed: true },
        { title: "Delivered & Signed", location: "Mumbai, Maharashtra", timestamp: "Aug 08, 2026 • 01:45 PM", completed: true, active: true }
      ]
    }
  };

  // Check matching query in database or build dynamic realistic entry
  const result = trackingDatabase[cleanQuery] || trackingDatabase[`POL-${cleanQuery}`] || {
    orderId: cleanQuery.startsWith("POL-") ? cleanQuery : `POL-${cleanQuery}`,
    awbNumber: `SR${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    carrier: "Shiprocket Express Courier Partner",
    customerName: "Valued Collector",
    destination: "India Post Direct Delivery Zone",
    estimatedDelivery: "Within 2 - 4 Business Days",
    currentStatus: "DISPATCHED",
    statusLabel: "Dispatched & In Transit",
    statusDescription: "Your order has been custom-printed, inspected, and handed over to courier partner.",
    items: [
      { title: "Polacraft Archival Cinema Print", size: "A4", frame: "Matte Black Frame", qty: 1, image: "/assets/custom_grid_poster.png" }
    ],
    paymentStatus: "PAID",
    paymentMethod: "Prepaid",
    subtotal: 499,
    timeline: [
      { title: "Order Placed & Confirmed", location: "Polacraft Store", timestamp: "Recent", completed: true },
      { title: "Custom Artwork Printed & Inspected", location: "Polacraft Studio", timestamp: "Completed", completed: true },
      { title: "Dispatched via Express Courier", location: "Logistics Center", timestamp: "In Transit", completed: true, active: true },
      { title: "Out for Delivery", location: "Destination Delivery Hub", timestamp: "Expected Soon", completed: false },
      { title: "Delivered to Doorstep", location: "Destination Address", timestamp: "Pending", completed: false }
    ]
  };

  return NextResponse.json({ success: true, tracking: result });
}
