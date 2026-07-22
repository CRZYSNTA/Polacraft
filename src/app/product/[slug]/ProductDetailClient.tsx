'use client';

import React, { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../../../features/cart/AppContext";
import PosterRenderer from "../../../components/PosterRenderer";
import { sizes, frames, posters, calculateProductPrice, FRAME_COST_BY_SIZE } from "../../../lib/cms/products";
import { Heart, ShoppingBag, Calendar, ShieldCheck, RefreshCw, ZoomIn, AlertTriangle, Ruler, Box, Sparkles, Truck, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackCartEvent } from "../../../services/analytics";
import JsonLd from "../../../components/JsonLd";
import SizeGuideModal from "../../../components/SizeGuideModal";

export default function ProductDetailClient({ poster }: { poster: any }) {
  const { addToCart, wishlist, toggleWishlist, recentlyViewed, addRecentlyViewed } = useContext(AppContext);
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState("A4");
  const [selectedFrame, setSelectedFrame] = useState("unframed");
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"story" | "quality" | "care">("story");

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "center" });

  useEffect(() => {
    if (poster) {
      addRecentlyViewed(poster);
    }
  }, [poster]);

  // Reset quantity to 1 when size changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedSize]);

  const isWish = wishlist.includes(poster.id);

  // Price calculations
  const currentPrice = calculateProductPrice(poster.price, selectedSize, selectedFrame);

  // Dynamic Estimated Delivery Calculation (Ships 2-3 days, Delivers in 6-8 days)
  const deliveryDates = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 6);
    const end = new Date(today);
    end.setDate(today.getDate() + 8);

    const startStr = start.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const endStr = end.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    return `${startStr} – ${endStr}`;
  }, []);

  // Limited edition counter numbers
  const editionTotal = poster.editionTotal || poster.limitedEditionCount || 100;
  const editionSold = poster.editionSold || Math.max(1, editionTotal - (poster.inventory ?? 25));

  // Related posters (same collection)
  const relatedPosters = useMemo(() => {
    return posters
      .filter((p) => p.collection === poster.collection && p.id !== poster.id)
      .slice(0, 3);
  }, [poster]);

  const handleAddToCart = () => {
    addToCart(poster, selectedSize, selectedFrame, quantity);
    try {
      trackCartEvent("add", {
        ...poster,
        price: currentPrice,
        quantity
      });
    } catch (e) {
      console.error("Cart track error", e);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(2.2)",
      transformOrigin: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transform: "scale(1)",
      transformOrigin: "center"
    });
  };

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container">
        
        {/* TOP LAYOUT: GALLERY + STICKY INFO */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            gap: "4rem",
            alignItems: "start",
            marginBottom: "5rem"
          }}
          className="product-split"
        >
          {/* LEFT: IMMERSIVE PREVIEW CARD WITH HOVER ZOOM */}
          <div 
            style={{
              position: "sticky",
              top: "120px",
              backgroundColor: "var(--accent-beige)",
              padding: "5rem 4rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden"
            }}
            className="product-gallery-box"
          >
            {/* Hover Zoom wrapper */}
            <div 
              style={{ 
                width: "100%", 
                maxWidth: "360px",
                cursor: "zoom-in",
                overflow: "hidden",
                borderRadius: "8px"
              }} 
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="hover-lift"
            >
              <div style={{ ...zoomStyle, transition: "transform 0.1s ease-out" }}>
                <PosterRenderer poster={poster} frame={selectedFrame} size={selectedSize} />
              </div>
            </div>

            <span 
              style={{
                position: "absolute",
                bottom: "1.5rem",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                backgroundColor: "#FFFFFF",
                padding: "0.5rem 1rem",
                borderRadius: "15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              <ZoomIn size={12} /> Hover to zoom details
            </span>
          </div>

          {/* RIGHT: STICKY PANEL DETAILS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
            <JsonLd
              type="Product"
              data={{
                name: poster.title,
                image: poster.galleryImages?.[0],
                description: poster.seoDescription,
                offers: {
                  "@type": "Offer",
                  price: currentPrice,
                  priceCurrency: "INR",
                  availability: (poster.isSoldOut || (poster.inventory === 0 && !poster.isPreorder))
                    ? "https://schema.org/OutOfStock"
                    : "https://schema.org/InStock"
                }
              }}
            />

            <div>
              {/* Badges Bar */}
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <span 
                  style={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                    fontWeight: "700"
                  }}
                >
                  {poster.collection}
                </span>

                {/* Product Badge Pill */}
                <span style={{ fontSize: "0.7rem", fontWeight: "800", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.2rem 0.65rem", borderRadius: "100px", textTransform: "uppercase" }}>
                  {poster.badge ? poster.badge.replace("_", " ") : "COLLECTOR PICK"}
                </span>

                {/* Limited Edition Count Badge */}
                {(poster.isLimitedEdition || poster.limitedEditionCount) && (
                  <span style={{ fontSize: "0.7rem", fontWeight: "800", backgroundColor: "#D97706", color: "#FFFFFF", padding: "0.2rem 0.65rem", borderRadius: "100px" }}>
                    LIMITED EDITION: {editionSold} / {editionTotal}
                  </span>
                )}
              </div>
              
              <h1 
                style={{
                  fontSize: "3.25rem",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  marginTop: "0.25rem",
                  lineHeight: "1.1"
                }}
              >
                {poster.title}
              </h1>
              
              <p style={{ fontSize: "1.2rem", fontStyle: "italic", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                {poster.film}
              </p>
            </div>

            {/* Quote Tagline */}
            <blockquote 
              style={{
                borderLeft: "2.5px solid var(--text-dark)",
                paddingLeft: "1.25rem",
                fontSize: "1.05rem",
                fontStyle: "italic",
                color: "var(--text-dark)",
                margin: "0.25rem 0"
              }}
            >
              "{poster.tagline}"
            </blockquote>

            {/* Price & Shipping Estimate Badge */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.5rem" }}>
              <div style={{ fontSize: "2.25rem", fontWeight: "900", color: "#111111" }}>
                ₹{currentPrice.toLocaleString("en-IN")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", color: "#16A34A", fontWeight: "700" }}>
                <Truck size={16} /> Ships in 2–3 Days (Est. Delivery: {deliveryDates})
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  Choose Size
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "var(--text-dark)",
                    fontSize: "0.8rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  <Ruler size={14} /> Size Guide & Scale
                </button>
              </div>
              
              <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                selectedSize={selectedSize}
                onSelectSize={(sz) => {
                  setSelectedSize(sz);
                  setIsSizeGuideOpen(false);
                }}
              />
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {sizes.map((s) => {
                  const selectedSizeObj = sizes.find((sz) => sz.id === selectedSize);
                  const selectedMod = selectedSizeObj ? selectedSizeObj.priceModifier : 0;
                  const diff = s.priceModifier - selectedMod;

                  let displayLabel = "";
                  if (s.id === selectedSize) {
                    displayLabel = `${s.id} (₹${poster.price + s.priceModifier})`;
                  } else if (diff > 0) {
                    displayLabel = `${s.id} (+₹${diff})`;
                  } else {
                    displayLabel = `${s.id} (-₹${Math.abs(diff)})`;
                  }

                  return (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSize(s.id)}
                      style={{
                        padding: "0.75rem 1.25rem",
                        fontSize: "0.85rem",
                        borderRadius: "15px",
                        border: selectedSize === s.id ? "2px solid #111111" : "1.5px solid var(--border-color)",
                        backgroundColor: selectedSize === s.id ? "#111111" : "transparent",
                        color: selectedSize === s.id ? "#FFFFFF" : "#111111",
                        cursor: "pointer",
                        fontWeight: "700",
                        transition: "var(--transition-fast)"
                      }}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Format: Unframed Poster Print Only */}
            <div style={{ backgroundColor: "#F7F7F4", padding: "0.85rem 1.25rem", borderRadius: "15px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111" }}>
                🖼️ Format: <strong>Unframed Fine Art Poster Print</strong>
              </span>
            </div>

            {/* Qty & Add to Bag */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "var(--accent-beige)",
                  borderRadius: "18px",
                  padding: "0.4rem 1rem"
                }}
              >
                <button 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ cursor: "pointer", padding: "4px", fontWeight: "bold", border: "none", background: "none" }}
                >
                  -
                </button>
                <span style={{ width: "36px", textAlign: "center", fontWeight: "700" }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ cursor: "pointer", padding: "4px", fontWeight: "bold", border: "none", background: "none" }}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={poster.inventory === 0 && !poster.isPreorder}
                className="btn-magnetic btn-primary"
                style={{
                  flexGrow: 1,
                  padding: "1.1rem",
                  borderRadius: "20px",
                  fontSize: "0.95rem",
                  fontWeight: "700",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer"
                }}
              >
                <ShoppingBag size={18} /> Add to Gallery Bag
              </button>

              <button
                onClick={() => toggleWishlist(poster.id)}
                style={{
                  width: "56px",
                  height: "56px",
                  borderRadius: "20px",
                  border: "1.5px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: isWish ? "red" : "var(--text-dark)",
                  backgroundColor: isWish ? "rgba(255,0,0,0.05)" : "transparent"
                }}
              >
                <Heart size={20} fill={isWish ? "red" : "none"} />
              </button>
            </div>

            {/* TRUST BADGES SECTION (FEATURE 8) */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "18px", border: "1px solid rgba(17,17,17,0.12)", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.75rem" }}>
              {[
                "✔ Printed on 300 GSM Premium Matte Paper",
                "✔ Packed in a Protective Sleeve",
                "✔ Secured with a Rigid Backing Board",
                "✔ Shipped in a Durable Kraft Envelope",
                "✔ Carefully Quality Checked Before Dispatch"
              ].map((badgeText, idx) => (
                <span key={idx} style={{ fontSize: "0.8rem", fontWeight: "700", color: "#111111", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  {badgeText}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* PACKAGING SECTION: "WHAT'S INSIDE THE BOX" (FEATURE 15) */}
        <section style={{ backgroundColor: "#EFECE6", padding: "4rem 3rem", borderRadius: "28px", marginBottom: "5rem", border: "1px solid rgba(17,17,17,0.12)" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "#666666" }}>
              Unboxing Experience
            </span>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", marginTop: "0.25rem" }}>What's Inside Your Package?</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem" }} className="packaging-grid">
            {[
              { title: "300 GSM Premium Matte", desc: "Heavy-weight archival paper print", icon: Sparkles },
              { title: "Protective Sleeve", desc: "Dust & moisture moisture shield", icon: Box },
              { title: "Rigid Backing Board", desc: "Zero-bend structural protection", icon: ShieldCheck },
              { title: "Durable Kraft Envelope", desc: "Eco-friendly heavy transit armor", icon: Box },
              { title: "Quality Checked", desc: "Inspected before dispatch", icon: Check }
            ].map((pkg, idx) => {
              const IconComp = pkg.icon;
              return (
                <div key={idx} style={{ backgroundColor: "#FFFFFF", padding: "1.25rem 1rem", borderRadius: "20px", border: "1px solid rgba(17,17,17,0.1)", textAlign: "center" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "12px", backgroundColor: "#EFECE6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem auto" }}>
                    <IconComp size={18} style={{ color: "#111111" }} />
                  </div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "800" }}>{pkg.title}</h4>
                  <p style={{ fontSize: "0.75rem", color: "#666666", marginTop: "4px" }}>{pkg.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* FULL PRODUCT DESCRIPTION TABS TEMPLATE (FEATURE 14) */}
        <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "4rem", marginBottom: "5rem" }}>
          <div style={{ display: "flex", gap: "1rem", borderBottom: "1.5px solid rgba(17,17,17,0.1)", paddingBottom: "1rem", marginBottom: "2.5rem" }}>
            {[
              { id: "story", label: "The Film Story & Design" },
              { id: "quality", label: "Print & Paper Specifications" },
              { id: "care", label: "Shipping & Care Instructions" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  fontSize: "1rem",
                  fontWeight: "800",
                  padding: "0.5rem 1rem",
                  borderRadius: "100px",
                  border: "none",
                  backgroundColor: activeTab === tab.id ? "#111111" : "transparent",
                  color: activeTab === tab.id ? "#FFFFFF" : "#666666",
                  cursor: "pointer"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "story" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
              <div>
                <h4 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>The Film Narrative</h4>
                <p style={{ fontSize: "0.95rem", color: "#666666", lineHeight: "1.7" }}>{poster.story}</p>
              </div>
              <div>
                <h4 style={{ fontSize: "1.35rem", fontWeight: "800", marginBottom: "1rem" }}>Vector Design & Artistry</h4>
                <p style={{ fontSize: "0.95rem", color: "#666666", lineHeight: "1.7" }}>{poster.designNotes}</p>
              </div>
            </div>
          )}

          {activeTab === "quality" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
              <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(17,17,17,0.1)" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Paper Stock</h4>
                <p style={{ fontSize: "0.85rem", color: "#666666", marginTop: "6px" }}>250 GSM heavy-weight 100% cotton fiber archival fine art paper.</p>
              </div>
              <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(17,17,17,0.1)" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Inks & Finish</h4>
                <p style={{ fontSize: "0.85rem", color: "#666666", marginTop: "6px" }}>Ultra-Matte Giclée pigment inks with high fade-resistance.</p>
              </div>
              <div style={{ backgroundColor: "#FFFFFF", padding: "1.5rem", borderRadius: "18px", border: "1px solid rgba(17,17,17,0.1)" }}>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800" }}>Framing System</h4>
                <p style={{ fontSize: "0.85rem", color: "#666666", marginTop: "6px" }}>16-20mm solid wood moldings with off-white cotton matboard margin.</p>
              </div>
            </div>
          )}

          {activeTab === "care" && (
            <div style={{ backgroundColor: "#FFFFFF", padding: "2rem", borderRadius: "20px", border: "1px solid rgba(17,17,17,0.1)", lineHeight: "1.7", color: "#666666", fontSize: "0.9rem" }}>
              <p>• <strong>Handling:</strong> Unroll unframed prints gently on a clean flat surface using cotton gloves or clean hands.</p>
              <p>• <strong>Framing:</strong> Place under anti-glare glass or acrylic UV-blocking glass away from direct continuous sunlight.</p>
              <p>• <strong>Transit Insurance:</strong> All packages are 100% insured against loss or damage during transit.</p>
            </div>
          )}
        </section>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .product-split { grid-template-columns: 1fr !important; }
          .packaging-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .packaging-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
