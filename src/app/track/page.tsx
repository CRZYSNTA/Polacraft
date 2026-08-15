'use client';

import React, { useState } from "react";
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
        setErrorMsg(data.error || "No package shipment record found matching your input. Please verify your Order ID.");
        setTrackingData(null);
      }
    } catch (err) {
      setErrorMsg("Unable to connect to logistics server. Please try again.");
      setTrackingData(null);
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
      case "DISPATCHED":
        return { bg: "#DBEAFE", text: "#1E40AF", border: "#93C5FD" };
      case "IN_TRANSIT":
      case "PRINTING":
      default:
        return { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" };
    }
  };

  return (
    <div style={{ paddingTop: "120px", paddingBottom: "100px", minHeight: "100vh", backgroundColor: "#FFFFFF" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        
        {/* 1. TOP HEADER & TITLE */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
            Track Your Package
          </h1>
          <p style={{ fontSize: "0.95rem", color: "#666666", marginTop: "0.5rem" }}>
            Enter your Order ID or AWB Tracking Number to view real-time Professional Couriers delivery status.
          </p>
        </div>

        {/* 2. TRACKING SEARCH BAR */}
        <div style={{ backgroundColor: "#FAFAF8", padding: "2rem", borderRadius: "24px", border: "1px solid rgba(17,17,17,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", marginBottom: "3rem" }}>
          <form onSubmit={handleSearchSubmit} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flexGrow: 1, minWidth: "260px" }}>
              <Search size={18} style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
              <input
                type="text"
                placeholder="Enter Order ID or AWB Tracking Number..."
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

          {errorMsg && (
            <p style={{ color: "#DC2626", fontSize: "0.85rem", fontWeight: "600", marginTop: "1rem", margin: "1rem 0 0 0" }}>
              ⚠️ {errorMsg}
            </p>
          )}
        </div>

        {/* 3. INITIAL EMPTY PROMPT OR RESULT DISPLAY */}
        {!trackingData && !errorMsg && (
          <div style={{ textAlign: "center", padding: "4rem 1rem", backgroundColor: "#FAFAF8", borderRadius: "24px", border: "1px solid rgba(17,17,17,0.06)" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#EFECE6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto" }}>
              <Package size={28} style={{ color: "#111111" }} />
            </div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#111111", margin: "0 0 0.5rem 0" }}>
              Enter Order Details Above
            </h3>
            <p style={{ fontSize: "0.88rem", color: "#666666", maxWidth: "42ch", margin: "0 auto" }}>
              Your Order ID and tracking consignment details are sent via SMS & WhatsApp upon dispatch.
            </p>
          </div>
        )}

        {/* 4. TRACKING RESULT DISPLAY */}
        {trackingData && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* STATUS BANNER CARD */}
            {(() => {
              const badge = getStatusBadgeStyle(trackingData.currentStatus);
              return (
                <div style={{ backgroundColor: "#FAFAF8", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "24px", padding: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#666666", letterSpacing: "0.05em" }}>
                        ORDER NUMBER: <strong style={{ color: "#111111" }}>{trackingData.orderId}</strong>
                      </span>
                      <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#111111", margin: "0.25rem 0 0 0" }}>
                        {trackingData.statusLabel}
                      </h2>
                    </div>

                    <span 
                      style={{ 
                        backgroundColor: badge.bg, 
                        color: badge.text, 
                        border: `1px solid ${badge.border}`,
                        fontSize: "0.8rem",
                        fontWeight: "800",
                        padding: "0.4rem 1rem",
                        borderRadius: "100px",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}
                    >
                      ● {trackingData.currentStatus.replace(/_/g, " ")}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.95rem", color: "#4B5563", margin: "0 0 1.5rem 0" }}>
                    {trackingData.statusDescription}
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#666666", display: "block" }}>Recipient</span>
                      <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{trackingData.customerName}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#666666", display: "block" }}>Destination</span>
                      <strong style={{ fontSize: "0.9rem", color: "#111111" }}>{trackingData.destination}</strong>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "#666666", display: "block" }}>Estimated Delivery</span>
                      <strong style={{ fontSize: "0.9rem", color: "#16A34A" }}>{trackingData.estimatedDelivery}</strong>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* TWO COLUMN LOGISTICS DETAILS */}
            <div className="tracking-grid-responsive" style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "2rem" }}>
              
              {/* LEFT: INTERACTIVE TIMELINE */}
              <div style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(17,17,17,0.08)", borderRadius: "20px", padding: "1.75rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#111111", margin: "0 0 1.75rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapPin size={18} style={{ color: "#111111" }} /> Shipment Progress History
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

                      <h4 style={{ fontSize: "0.92rem", fontWeight: item.active || item.completed ? "800" : "600", color: item.active || item.completed ? "#111111" : "#9CA3AF", margin: 0 }}>
                        {item.title}
                      </h4>
                      <p style={{ fontSize: "0.8rem", color: "#666666", margin: "0.2rem 0 0 0" }}>
                        {item.location} • <span style={{ fontWeight: "600" }}>{item.timestamp}</span>
                      </p>

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
                    href={trackingData.carrierTrackingUrl || "https://www.tpcindia.com/"}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      width: "100%",
                      padding: "0.75rem",
                      borderRadius: "12px",
                      backgroundColor: "#C4161C",
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
                    Open Official Portal on TPC India <ExternalLink size={14} />
                  </a>
                </div>

                {/* ITEMS IN PACKAGE (MOBILE & DESKTOP ADJUSTED VIEW) */}
                <div 
                  className="package-items-card"
                  style={{ 
                    backgroundColor: "#FFFFFF", 
                    border: "1px solid rgba(17,17,17,0.08)", 
                    borderRadius: "20px", 
                    padding: "1.25rem" 
                  }}
                >
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111111", margin: "0 0 1rem 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>What's Inside Your Package</span>
                    <span style={{ fontSize: "0.75rem", backgroundColor: "#F3F4F6", color: "#4B5563", padding: "0.2rem 0.6rem", borderRadius: "100px", fontWeight: "700" }}>
                      {trackingData.items.length} {trackingData.items.length === 1 ? "Item" : "Items"}
                    </span>
                  </h4>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                    {trackingData.items.map((item: any, idx: number) => (
                      <div 
                        key={idx} 
                        style={{ 
                          display: "flex", 
                          gap: "0.85rem", 
                          alignItems: "center", 
                          backgroundColor: "#FAFAF8",
                          padding: "0.75rem",
                          borderRadius: "14px",
                          border: "1px solid #F3F4F6"
                        }}
                      >
                        <div style={{ width: "52px", height: "70px", borderRadius: "8px", overflow: "hidden", position: "relative", backgroundColor: "#F4F3EF", flexShrink: 0, border: "1px solid rgba(17,17,17,0.08)" }}>
                          <Image src={item.image || "/assets/custom_grid_poster.png"} alt={item.title} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div style={{ flexGrow: 1, minWidth: 0 }}>
                          <h5 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", margin: 0, lineHeight: "1.3", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                            {item.title}
                          </h5>
                          <p style={{ fontSize: "0.75rem", color: "#666666", margin: "0.25rem 0 0 0" }}>
                            Size: <strong>{item.size}</strong> • <strong>{item.frame}</strong>
                          </p>
                          <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#111111", display: "inline-block", marginTop: "2px" }}>
                            Qty: {item.qty}
                          </span>
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
                  <p style={{ fontSize: "0.78rem", color: "#15803D", margin: "0.25rem 0 1rem 0" }}>
                    Our logistics care desk is active 10 AM – 8 PM IST.
                  </p>
                  <a
                    href="https://wa.me/919876543210?text=Hi%20Polacraft,%20I%20need%20help%20tracking%20my%20shipment."
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      backgroundColor: "#16A34A",
                      color: "#FFFFFF",
                      fontSize: "0.8rem",
                      fontWeight: "800",
                      padding: "0.6rem 1.25rem",
                      borderRadius: "100px",
                      textDecoration: "none"
                    }}
                  >
                    <MessageSquare size={14} /> Contact Support Desk
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .tracking-grid-responsive {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
