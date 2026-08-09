'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, 
  Truck, 
  Package, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageSquare, 
  ShieldCheck, 
  HelpCircle,
  ArrowRight
} from "lucide-react";

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Default initial load: track sample order POL-1082
  useEffect(() => {
    fetchTracking("POL-1082");
  }, []);

  const fetchTracking = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch(`/api/track?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTrackingData(data.tracking);
      } else {
        setErrorMsg(data.error || "Shipment record not found. Please verify your Order ID.");
        setTrackingData(null);
      }
    } catch (err) {
      setErrorMsg("Unable to connect to logistics server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTracking(searchQuery);
  };

  const handleCopyAWB = () => {
    if (trackingData?.awbNumber) {
      navigator.clipboard.writeText(trackingData.awbNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Status color helper
  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return { bg: "#DCFCE7", text: "#166534", border: "#86EFAC" };
      case "OUT_FOR_DELIVERY":
        return { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" };
      case "IN_TRANSIT":
      default:
        return { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" };
    }
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* 1. TOP HEADER & TITLE */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#F4F3EF", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.8rem", fontWeight: "700", color: "#111111", marginBottom: "1rem" }}>
            <Truck size={15} style={{ color: "#111111" }} /> LIVE SHIPMENT TRACKING
          </div>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
            Track Your Polacraft Package
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#666666", marginTop: "0.5rem" }}>
            Enter your Order ID (e.g. #POL-1082) or AWB Tracking Number to view real-time delivery status.
          </p>
        </div>

        {/* 2. TRACKING SEARCH BAR & DEMO CHIPS */}
        <div style={{ backgroundColor: "#FAFAF8", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", marginBottom: "3rem" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexGrow: 1, minWidth: "260px" }}>
              <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. POL-1082 or SR94817293801)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "1rem 1rem 1rem 3rem",
                  borderRadius: "14px",
                  border: "1.5px solid rgba(17,17,17,0.12)",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  outline: "none",
                  backgroundColor: "#FFFFFF"
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "1rem 2rem",
                borderRadius: "14px",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem"
              }}
            >
              {loading ? "Searching..." : "Track Package ➔"}
            </button>
          </form>

          {/* Quick Demo Chips */}
          <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.8rem", color: "#666666", fontWeight: "600" }}>Try Sample Demo Orders:</span>
            {[
              { id: "POL-1082", label: "#POL-1082 (In Transit)" },
              { id: "POL-1090", label: "#POL-1090 (Out for Delivery)" },
              { id: "POL-1075", label: "#POL-1075 (Delivered)" }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => {
                  setSearchQuery(chip.id);
                  fetchTracking(chip.id);
                }}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "100px",
                  padding: "0.35rem 0.85rem",
                  fontSize: "0.78rem",
                  fontWeight: "700",
                  color: "#111111",
                  cursor: "pointer",
                  transition: "all 0.2s ease"
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {errorMsg && (
            <p style={{ color: "#DC2626", fontSize: "0.85rem", fontWeight: "600", marginTop: "1rem", margin: "1rem 0 0 0" }}>
              ⚠️ {errorMsg}
            </p>
          )}
        </div>

        {/* 3. TRACKING RESULT DISPLAY */}
        {trackingData && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* STATUS SUMMARY CARD */}
            <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "24px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Order Number
                  </span>
                  <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#111111", margin: "0.2rem 0 0 0" }}>
                    {trackingData.orderId}
                  </h2>
                </div>

                {/* Status Badge */}
                {(() => {
                  const badgeStyle = getStatusBadgeStyle(trackingData.currentStatus);
                  return (
                    <div style={{ backgroundColor: badgeStyle.bg, border: `1px solid ${badgeStyle.border}`, color: badgeStyle.text, padding: "0.5rem 1.25rem", borderRadius: "100px", fontSize: "0.9rem", fontWeight: "800", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: badgeStyle.text }} />
                      {trackingData.statusLabel}
                    </div>
                  );
                })()}
              </div>

              {/* ESTIMATED DELIVERY PROMISE BANNER */}
              <div style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "16px", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#FEF08A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Clock size={22} style={{ color: "#D97706" }} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#666666", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      Estimated Delivery Date
                    </span>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: "900", color: "#111111", margin: "0.1rem 0 0 0" }}>
                      {trackingData.estimatedDelivery}
                    </h3>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "#666666", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Destination
                  </span>
                  <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#111111", margin: "0.1rem 0 0 0" }}>
                    {trackingData.destination}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. SHIPMENT TIMELINE & CARRIER DETAILS GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }} className="tracking-grid-responsive">
              
              {/* LEFT: STEP-BY-STEP SHIPMENT TIMELINE */}
              <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "24px", padding: "2rem", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#111111", marginBottom: "1.75rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
                  <Package size={20} /> Shipment History & Milestones
                </h3>

                <div style={{ position: "relative", paddingLeft: "1.75rem" }}>
                  
                  {/* Vertical Line */}
                  <div style={{ position: "absolute", left: "9px", top: "8px", bottom: "8px", width: "2px", backgroundColor: "#E5E7EB" }} />

                  {trackingData.timeline.map((item: any, index: number) => (
                    <div key={index} style={{ position: "relative", marginBottom: index === trackingData.timeline.length - 1 ? 0 : "2rem" }}>
                      
                      {/* Node Dot */}
                      <div 
                        style={{ 
                          position: "absolute", 
                          left: "-1.75rem", 
                          top: "2px", 
                          width: "20px", 
                          height: "20px", 
                          borderRadius: "50%", 
                          backgroundColor: item.active ? "#111111" : item.completed ? "#16A34A" : "#FFFFFF", 
                          border: item.completed || item.active ? "none" : "2px solid #D1D5DB", 
                          display: "flex", 
                          alignItems: "center", 
                          justifyContent: "center",
                          color: "#FFFFFF",
                          zIndex: 2,
                          boxShadow: item.active ? "0 0 0 4px rgba(17,17,17,0.15)" : "none"
                        }}
                      >
                        {item.completed && !item.active ? (
                          <Check size={12} strokeWidth={3} />
                        ) : item.active ? (
                          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#FFFFFF" }} />
                        ) : null}
                      </div>

                      {/* Content */}
                      <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h4 style={{ fontSize: "0.95rem", fontWeight: item.active || item.completed ? "800" : "600", color: item.active ? "#111111" : item.completed ? "#1F2937" : "#9CA3AF", margin: 0 }}>
                            {item.title}
                          </h4>
                          <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#666666" }}>
                            {item.timestamp}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "0.25rem", margin: "0.25rem 0 0 0", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                          <MapPin size={12} /> {item.location}
                        </p>
                      </div>

                    </div>
                  ))}
                </div>
              </div>

              {/* RIGHT: CARRIER INFO & ITEM BREAKDOWN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                
                {/* CARRIER & AWB CARD */}
                <div style={{ backgroundColor: "#FAFAF8", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "20px", padding: "1.5rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#666666", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Logistics Partner
                  </span>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: "800", color: "#111111", margin: "0.2rem 0 1rem 0" }}>
                    {trackingData.carrier}
                  </h4>

                  <div style={{ backgroundColor: "#FFFFFF", padding: "0.85rem 1rem", borderRadius: "12px", border: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "#666666", display: "block" }}>AWB Tracking Number</span>
                      <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{trackingData.awbNumber}</strong>
                    </div>
                    <button
                      onClick={handleCopyAWB}
                      style={{
                        padding: "0.4rem 0.75rem",
                        borderRadius: "8px",
                        backgroundColor: "#F3F4F6",
                        border: "none",
                        fontSize: "0.75rem",
                        fontWeight: "700",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem"
                      }}
                    >
                      {copied ? <Check size={12} style={{ color: "green" }} /> : <Copy size={12} />}
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <a
                    href={`https://shiprocket.co/tracking/${trackingData.awbNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "12px",
                      backgroundColor: "#111111",
                      color: "#FFFFFF",
                      fontSize: "0.85rem",
                      fontWeight: "700",
                      textAlign: "center",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.4rem",
                      textDecoration: "none"
                    }}
                  >
                    Open Live Courier Portal <ExternalLink size={14} />
                  </a>
                </div>

                {/* ITEMS IN PACKAGE */}
                <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "20px", padding: "1.5rem" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111111", margin: "0 0 1rem 0" }}>
                    Items in Package ({trackingData.items.length})
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {trackingData.items.map((item: any, idx: number) => (
                      <div key={idx} style={{ display: "flex", gap: "0.85rem", alignItems: "center" }}>
                        <div style={{ width: "50px", height: "68px", borderRadius: "6px", overflow: "hidden", position: "relative", backgroundColor: "#F4F3EF", flexShrink: 0, border: "1px solid rgba(17,17,17,0.08)" }}>
                          <Image src={item.image || "/assets/custom_grid_poster.png"} alt={item.title} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <h5 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", margin: 0, lineHeight: "1.3" }}>
                            {item.title}
                          </h5>
                          <p style={{ fontSize: "0.75rem", color: "#666666", margin: "0.2rem 0 0 0" }}>
                            Size: {item.size} • {item.frame} • Qty: {item.qty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HELP & WHATSAPP SUPPORT CTA */}
                <div style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: "20px", padding: "1.25rem", textAlign: "center" }}>
                  <h5 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#166534", margin: 0 }}>
                    Need Delivery Assistance?
                  </h5>
                  <p style={{ fontSize: "0.78rem", color: "#15803D", marginTop: "0.25rem", margin: "0.25rem 0 0.85rem 0" }}>
                    Our customer care team is available on WhatsApp to assist with live updates.
                  </p>
                  <a
                    href={`https://wa.me/919496682919?text=${encodeURIComponent(`Hi Polacraft! I need assistance tracking my order ${trackingData.orderId}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.6rem 1.25rem",
                      borderRadius: "100px",
                      backgroundColor: "#25D366",
                      color: "#FFFFFF",
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      textDecoration: "none",
                      boxShadow: "0 4px 10px rgba(37, 211, 102, 0.2)"
                    }}
                  >
                    <MessageSquare size={16} /> Chat on WhatsApp
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        @media (max-width: 820px) {
          .tracking-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
