import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim() || searchParams.get("orderId")?.trim() || "";

  if (!query) {
    return NextResponse.json(
      { error: "Order ID, Consignment Number (AWB), or Mobile Number is required" },
      { status: 400 }
    );
  }

  const cleanQuery = query.toUpperCase().replace("#", "");

  // Simulated Live Logistics Database with Professional Couriers Integration
  const trackingDatabase: Record<string, any> = {
    "POL-1082": {
      orderId: "#POL-1082",
      awbNumber: "COK948172938",
      carrier: "The Professional Couriers (TPC India)",
      carrierWebsite: "https://www.tpcindia.com/",
      carrierTrackingUrl: "https://www.tpcindia.com/tracking.aspx",
      customerName: "Gowtham S",
      destination: "Bengaluru, Karnataka - 560001",
      estimatedDelivery: "August 11, 2026 (Tomorrow by 7 PM)",
      currentStatus: "IN_TRANSIT",
      statusLabel: "In Transit via Professional Couriers",
      statusDescription: "Consignment dispatched from Ernakulam Main Hub to Destination Branch.",
      items: [
        { title: "Lionel Messi Argentina 2022 World Cup Print", size: "A4", frame: "Matte Black Frame", qty: 1, image: "/assets/custom_grid_poster.png" },
        { title: "Interstellar Gargantua Hole Frame", size: "A3", frame: "Print Only", qty: 1, image: "/assets/custom_grid_split_3.png" }
      ],
      paymentStatus: "PAID",
      paymentMethod: "Prepaid (UPI)",
      subtotal: 1249,
      timeline: [
        { title: "Consignment Booked & Picked Up", location: "TPC Branch, Kochi", timestamp: "Aug 08, 2026 • 11:30 AM", completed: true },
        { title: "Received at Main Sorting Hub", location: "Ernakulam Hub, Kerala", timestamp: "Aug 08, 2026 • 04:15 PM", completed: true },
        { title: "Dispatched to Destination State Hub", location: "In Transit (Inter-state Surface Air)", timestamp: "Aug 09, 2026 • 08:30 AM", completed: true, active: true },
        { title: "Arrived at Destination Branch", location: "TPC Bengaluru Central Office", timestamp: "Expected Aug 10 • Evening", completed: false },
        { title: "Out for Delivery with Delivery Executive", location: "Local Area Delivery", timestamp: "Expected Aug 11 • Morning", completed: false },
        { title: "Delivered & Signed by Consignee", location: "Destination Address", timestamp: "Expected Aug 11 • By 7 PM", completed: false }
      ]
    },
    "POL-1090": {
      orderId: "#POL-1090",
      awbNumber: "KCH83920194",
      carrier: "The Professional Couriers (TPC India)",
      carrierWebsite: "https://www.tpcindia.com/",
      carrierTrackingUrl: "https://www.tpcindia.com/tracking.aspx",
      customerName: "Rahul V",
      destination: "Chennai, Tamil Nadu - 600028",
      estimatedDelivery: "August 10, 2026 (Today)",
      currentStatus: "OUT_FOR_DELIVERY",
      statusLabel: "Out for Delivery",
      statusDescription: "Professional Couriers delivery executive is out for delivery.",
      items: [
        { title: "Custom 3-Panel Split Poster", size: "A3", frame: "Teak Wood Frame", qty: 1, image: "/assets/custom_grid_split_3.png" }
      ],
      paymentStatus: "PAID",
      paymentMethod: "Prepaid (Credit Card)",
      subtotal: 899,
      timeline: [
        { title: "Consignment Booked", location: "TPC Kochi Branch", timestamp: "Aug 07, 2026 • 10:00 AM", completed: true },
        { title: "Dispatched to Chennai", location: "TPC South India Line", timestamp: "Aug 07, 2026 • 06:00 PM", completed: true },
        { title: "Received at Chennai Delivery Office", location: "TPC Chennai Central Branch", timestamp: "Aug 09, 2026 • 04:30 AM", completed: true },
        { title: "Out for Delivery with Executive", location: "Chennai Area Delivery", timestamp: "Aug 09, 2026 • 09:15 AM", completed: true, active: true },
        { title: "Delivered", location: "Chennai, Tamil Nadu", timestamp: "Expected Today by 6 PM", completed: false }
      ]
    },
    "POL-1075": {
      orderId: "#POL-1075",
      awbNumber: "COK38492018",
      carrier: "The Professional Couriers (TPC India)",
      carrierWebsite: "https://www.tpcindia.com/",
      carrierTrackingUrl: "https://www.tpcindia.com/tracking.aspx",
      customerName: "Ananya M",
      destination: "Mumbai, Maharashtra - 400001",
      estimatedDelivery: "August 08, 2026 (Delivered)",
      currentStatus: "DELIVERED",
      statusLabel: "Delivered",
      statusDescription: "Consignment delivered and signature captured at destination.",
      items: [
        { title: "Manichitrathazhu Nagavalli Classic Poster", size: "A4", frame: "Matte Black Frame", qty: 2, image: "/assets/custom_grid_poster.png" }
      ],
      paymentStatus: "PAID",
      paymentMethod: "Prepaid (Razorpay UPI)",
      subtotal: 699,
      timeline: [
        { title: "Consignment Booked", location: "TPC Kochi Branch", timestamp: "Aug 05, 2026 • 09:00 AM", completed: true },
        { title: "In Transit via Air Cargo", location: "Mumbai Air Hub", timestamp: "Aug 06, 2026 • 02:00 PM", completed: true },
        { title: "Received at Destination Branch", location: "TPC Mumbai Central", timestamp: "Aug 07, 2026 • 08:30 AM", completed: true },
        { title: "Out for Delivery", location: "Mumbai Local Delivery", timestamp: "Aug 08, 2026 • 09:00 AM", completed: true },
        { title: "Delivered & Signed", location: "Mumbai, Maharashtra", timestamp: "Aug 08, 2026 • 01:45 PM", completed: true, active: true }
      ]
    }
  };

  // Check matching query or generate realistic entry for Professional Couriers AWB
  const result = trackingDatabase[cleanQuery] || trackingDatabase[`POL-${cleanQuery}`] || {
    orderId: cleanQuery.startsWith("POL-") ? cleanQuery : `POL-${cleanQuery}`,
    awbNumber: cleanQuery.length >= 6 ? cleanQuery : `TPC${Math.floor(100000000 + Math.random() * 900000000)}`,
    carrier: "The Professional Couriers (TPC India)",
    carrierWebsite: "https://www.tpcindia.com/",
    carrierTrackingUrl: "https://www.tpcindia.com/tracking.aspx",
    customerName: "Valued Collector",
    destination: "Kerala & Pan-India Express Zone",
    estimatedDelivery: "Within 2 - 4 Business Days",
    currentStatus: "IN_TRANSIT",
    statusLabel: "In Transit via Professional Couriers",
    statusDescription: "Consignment booked at Polacraft Kochi Branch and in transit to delivery office.",
    items: [
      { title: "Polacraft Archival Cinema Print", size: "A4", frame: "Matte Black Frame", qty: 1, image: "/assets/custom_grid_poster.png" }
    ],
    paymentStatus: "PAID",
    paymentMethod: "Prepaid",
    subtotal: 499,
    timeline: [
      { title: "Consignment Booked & Picked Up", location: "TPC Kochi Branch", timestamp: "Recent", completed: true },
      { title: "Dispatched to Regional Hub", location: "Ernakulam Hub, Kerala", timestamp: "Completed", completed: true },
      { title: "In Transit to Destination Office", location: "TPC Line Route", timestamp: "In Transit", completed: true, active: true },
      { title: "Out for Delivery with Courier Executive", location: "Destination Branch", timestamp: "Expected Soon", completed: false },
      { title: "Delivered to Consignee Doorstep", location: "Destination Address", timestamp: "Pending", completed: false }
    ]
  };

  return NextResponse.json({ success: true, tracking: result });
}
