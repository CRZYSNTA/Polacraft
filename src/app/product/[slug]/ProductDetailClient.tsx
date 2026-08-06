'use client';

import React, { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../../../features/cart/AppContext";
import PosterRenderer from "../../../components/PosterRenderer";
import { sizes, frames, posters, calculateProductPrice, FRAME_COST_BY_SIZE } from "../../../lib/cms/products";
import { Heart, ShoppingBag, Calendar, ShieldCheck, RefreshCw, ZoomIn, AlertTriangle, Ruler, Box, Sparkles, Truck, Check, Zap } from "lucide-react";
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "center" });

  useEffect(() => {
    if (poster && poster.id) {
      addRecentlyViewed(poster);
    }
  }, [poster, addRecentlyViewed]);

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

  const handleBuyNow = () => {
    addToCart(poster, selectedSize, selectedFrame, quantity);
    try {
      trackCartEvent("add", {
        ...poster,
        price: currentPrice,
        quantity
      });
    } catch (e) {
      console.error("Buy now track error", e);
    }
    router.push("/checkout");
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
    <div style={{ paddingTop: isMobile ? "1rem" : "2.5rem", paddingBottom: "80px" }}>
      <div className="container">
        
        {/* TOP LAYOUT: GALLERY + STICKY INFO (HIGH CONVERSION ABOVE THE FOLD) */}
        <div 
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1.15fr",
            gap: isMobile ? "1.5rem" : "3.5rem",
            alignItems: "start",
            marginBottom: "3.5rem"
          }}
          className="product-split"
        >
          {/* LEFT: IMMERSIVE PREVIEW CARD WITH HOVER ZOOM */}
          <div 
            style={{
              position: isMobile ? "relative" : "sticky",
              top: isMobile ? "0px" : "110px",
              backgroundColor: "var(--accent-beige)",
              padding: isMobile ? "1.25rem 0.75rem" : "3.5rem 2.5rem",
              borderRadius: "var(--radius-md)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border-color)",
              boxShadow: "var(--shadow-soft)",
              overflow: "hidden",
              maxHeight: isMobile ? "360px" : "auto",
            }}
            className="product-gallery-box"
          >
            {/* Hover Zoom wrapper */}
            <div 
              style={{ 
                width: "100%", 
                maxWidth: isMobile ? "240px" : "340px",
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
                bottom: "0.75rem",
                left: "50%",
                transform: "translateX(-50%)",
                fontSize: "0.7rem",
                color: "var(--text-muted)",
                backgroundColor: "#FFFFFF",
                padding: "0.3rem 0.75rem",
                borderRadius: "15px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "0.35rem"
              }}
            >
              <ZoomIn size={12} /> {isMobile ? "Tap to inspect" : "Hover to zoom details"}
            </span>
          </div>

          {/* RIGHT: STICKY PANEL DETAILS (PURCHASE INFORMATION ABOVE THE FOLD!) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <JsonLd
              type="Product"
              data={{
                name: poster.title,
                image: poster.galleryImages?.[0] || poster.heroImage,
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

            {/* 1. TITLE & COLLECTION BADGES */}
            <div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap", marginBottom: "0.35rem" }}>
                <span 
                  style={{
                    fontSize: "0.72rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.15em",
                    color: "var(--text-muted)",
                    fontWeight: "800"
                  }}
                >
                  {poster.collection}
                </span>

                <span style={{ fontSize: "0.68rem", fontWeight: "800", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.2rem 0.6rem", borderRadius: "100px", textTransform: "uppercase" }}>
                  {poster.badge ? poster.badge.replace("_", " ") : "COLLECTOR PICK"}
                </span>

                {(poster.isLimitedEdition || poster.limitedEditionCount) && (
                  <span style={{ fontSize: "0.68rem", fontWeight: "800", backgroundColor: "#D97706", color: "#FFFFFF", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                    LIMITED EDITION: {editionSold} / {editionTotal}
                  </span>
                )}
              </div>
              
              <h1 
                style={{
                  fontSize: isMobile ? "1.75rem" : "2.75rem",
                  fontWeight: "900",
                  letterSpacing: "-0.03em",
                  marginTop: "0.15rem",
                  lineHeight: "1.1",
                  color: "#111111"
                }}
              >
                {poster.title}
              </h1>
              
              <p style={{ fontSize: isMobile ? "0.95rem" : "1.1rem", fontStyle: "italic", color: "#666666", marginTop: "0.15rem" }}>
                {poster.film} ({poster.year}) • Dir. {poster.director}
              </p>
            </div>

            {/* 2. PRICE & SHIPPING ESTIMATE (ABOVE THE FOLD!) */}
            <div style={{ display: "flex", alignItems: "baseline", gap: "1.25rem", backgroundColor: "#F7F7F4", padding: "0.85rem 1.25rem", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
              <div style={{ fontSize: isMobile ? "2rem" : "2.4rem", fontWeight: "900", color: "#111111", letterSpacing: "-0.02em" }}>
                ₹{currentPrice.toLocaleString("en-IN")}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.82rem", color: "#16A34A", fontWeight: "700" }}>
                <Truck size={16} /> Ships in 2–3 Days (Est. Delivery: {deliveryDates})
              </div>
            </div>

            {/* 3. SIZE SELECTOR (ABOVE THE FOLD!) */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", color: "#111111" }}>
                  Select Print Size *
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "var(--text-dark)",
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  <Ruler size={13} /> Size Guide
                </button>
              </div>

              <SizeGuideModal
                isOpen={isSizeGuideOpen}
                onClose={() => setIsSizeGuideOpen(false)}
                selectedSize={selectedSize}
                onSelectSize={(sz) => {
                  setSelectedSize(sz);
                  setQuantity(1);
                  setIsSizeGuideOpen(false);
                }}
              />

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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
                      onClick={() => {
                        setSelectedSize(s.id);
                        setQuantity(1);
                      }}
                      style={{
                        padding: isMobile ? "0.6rem 0.9rem" : "0.7rem 1.1rem",
                        fontSize: isMobile ? "0.8rem" : "0.85rem",
                        borderRadius: "12px",
                        border: selectedSize === s.id ? "2.5px solid #111111" : "1.5px solid var(--border-color)",
                        backgroundColor: selectedSize === s.id ? "#111111" : "#FFFFFF",
                        color: selectedSize === s.id ? "#FFFFFF" : "#111111",
                        cursor: "pointer",
                        fontWeight: "800",
                        transition: "all 0.15s ease"
                      }}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. BUY BUTTONS (BUY NOW + ADD TO CART IMMEDIATELY VISIBLE ABOVE THE FOLD!) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.25rem" }}>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                {/* Instant Checkout Buy Now */}
                <button
                  onClick={handleBuyNow}
                  disabled={poster.inventory === 0 && !poster.isPreorder}
                  style={{
                    flex: 1,
                    padding: "1rem 1.25rem",
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: "#10B981",
                    color: "#FFFFFF",
                    fontSize: "0.95rem",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.28)",
                  }}
                >
                  <Zap size={18} fill="#FFFFFF" /> Buy Now (Instant Checkout)
                </button>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={poster.inventory === 0 && !poster.isPreorder}
                  style={{
                    flex: 1,
                    padding: "1rem 1.25rem",
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: "#111111",
                    color: "#FFFFFF",
                    fontSize: "0.95rem",
                    fontWeight: "900",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  }}
                >
                  <ShoppingBag size={18} /> Add to Cart
                </button>

                {/* Wishlist */}
                <button
                  onClick={() => toggleWishlist(poster.id)}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "16px",
                    border: "1.5px solid var(--border-color)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: isWish ? "red" : "var(--text-dark)",
                    backgroundColor: isWish ? "rgba(255,0,0,0.05)" : "#FFFFFF"
                  }}
                >
                  <Heart size={20} fill={isWish ? "red" : "none"} />
                </button>
              </div>

              {/* Quantity Selector Inline Bar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundColor: "#FFFFFF", border: "1px solid var(--border-color)", borderRadius: "12px", padding: "0.4rem 1rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#555" }}>Quantity:</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button 
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ cursor: "pointer", padding: "2px 8px", fontWeight: "bold", border: "1px solid #CBD5E1", background: "#FFF", borderRadius: "6px" }}
                  >
                    -
                  </button>
                  <span style={{ width: "24px", textAlign: "center", fontWeight: "800" }}>{quantity}</span>
                  <button 
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ cursor: "pointer", padding: "2px 8px", fontWeight: "bold", border: "1px solid #CBD5E1", background: "#FFF", borderRadius: "6px" }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 5. QUOTE TAGLINE */}
            {poster.tagline && (
              <blockquote 
                style={{
                  borderLeft: "2.5px solid var(--text-dark)",
                  paddingLeft: "1rem",
                  fontSize: "0.95rem",
                  fontStyle: "italic",
                  color: "var(--text-dark)",
                  margin: "0.25rem 0"
                }}
              >
                "{poster.tagline}"
              </blockquote>
            )}

            {/* 6. QUALITY CHECKLIST BADGES */}
            <div style={{ backgroundColor: "#FFFFFF", padding: "1rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.12)", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "0.6rem" }}>
              {[
                "✔ 300 GSM Archival Cotton Paper",
                "✔ Protective Moisture Sleeve",
                "✔ Zero-Bend Backing Board",
                "✔ Durable Kraft Armor Packaging",
              ].map((badgeText, idx) => (
                <span key={idx} style={{ fontSize: "0.78rem", fontWeight: "700", color: "#111111", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  {badgeText}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* PACKAGING SECTION: "WHAT'S INSIDE THE BOX" */}
        <section style={{ backgroundColor: "#EFECE6", padding: isMobile ? "2rem 1.25rem" : "4rem 3rem", borderRadius: "28px", marginBottom: "5rem", border: "1px solid rgba(17,17,17,0.12)" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.15em", color: "#666666" }}>
              Unboxing Experience
            </span>
            <h3 style={{ fontSize: isMobile ? "1.5rem" : "2rem", fontWeight: "900", marginTop: "0.25rem" }}>What's Inside Your Package?</h3>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)", gap: "1.25rem" }} className="packaging-grid">
            {[
              { title: "300 GSM Premium Matte", desc: "Heavy-weight archival paper print", icon: Sparkles },
              { title: "Protective Sleeve", desc: "Dust & moisture shield", icon: Box },
              { title: "Rigid Backing Board", desc: "Zero-bend structural protection", icon: ShieldCheck },
              { title: "Durable Kraft Envelope", desc: "Eco-friendly heavy transit armor", icon: Box },
              { title: "Quality Checked", desc: "Inspected before dispatch", icon: Check }
            ].map((pkg, idx) => {
              const IconComp = pkg.icon;
              return (
                <div key={idx} style={{ backgroundColor: "#FFFFFF", padding: "1.5rem 1rem", borderRadius: "20px", textAlign: "center", border: "1px solid rgba(17,17,17,0.08)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "42px", height: "42px", borderRadius: "50%", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", color: "#111111" }}>
                    <IconComp size={20} />
                  </div>
                  <strong style={{ fontSize: "0.9rem", fontWeight: "800", marginTop: "0.25rem" }}>{pkg.title}</strong>
                  <span style={{ fontSize: "0.75rem", color: "#666666" }}>{pkg.desc}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* STORY & SPECIFICATIONS TABS */}
        {poster.story && (
          <section style={{ backgroundColor: "#FFFFFF", padding: isMobile ? "2rem 1.25rem" : "3.5rem 3rem", borderRadius: "28px", border: "1px solid var(--border-color)", marginBottom: "5rem" }}>
            <div style={{ display: "flex", gap: "1.5rem", borderBottom: "1.5px solid #E5E7EB", paddingBottom: "1rem", marginBottom: "2rem" }}>
              <button
                onClick={() => setActiveTab("story")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  color: activeTab === "story" ? "#111111" : "#888888",
                  borderBottom: activeTab === "story" ? "3px solid #111111" : "none",
                  paddingBottom: "0.5rem",
                  cursor: "pointer"
                }}
              >
                Artwork Story
              </button>
              <button
                onClick={() => setActiveTab("quality")}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  color: activeTab === "quality" ? "#111111" : "#888888",
                  borderBottom: activeTab === "quality" ? "3px solid #111111" : "none",
                  paddingBottom: "0.5rem",
                  cursor: "pointer"
                }}
              >
                Archival Paper Specs
              </button>
            </div>

            {activeTab === "story" ? (
              <div style={{ fontSize: "1.05rem", lineHeight: "1.8", color: "#333333", maxWidth: "800px" }}>
                <p style={{ margin: 0 }}>{poster.story}</p>
                {poster.designNotes && (
                  <p style={{ marginTop: "1.5rem", fontStyle: "italic", color: "#666666" }}>
                    <strong>Design Notes:</strong> {poster.designNotes}
                  </p>
                )}
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1.5rem" }}>
                <div style={{ backgroundColor: "#F9FAFB", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "800" }}>300 GSM Archival Cotton</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>Museum-grade cotton rag paper designed to resist fading for over 100+ years.</p>
                </div>
                <div style={{ backgroundColor: "#F9FAFB", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "800" }}>Ultra-Matte Giclée Print</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>12-color pigment printing delivering rich black levels and film colors.</p>
                </div>
                <div style={{ backgroundColor: "#F9FAFB", padding: "1.5rem", borderRadius: "16px", border: "1px solid #E5E7EB" }}>
                  <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem", fontWeight: "800" }}>Solid Teak & Black Wood</h4>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>Real wood moulding with shatterproof acrylic glass protection.</p>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        selectedSize={selectedSize}
        onSelectSize={(sz) => {
          setSelectedSize(sz);
          setQuantity(1);
          setIsSizeGuideOpen(false);
        }}
      />
    </div>
  );
}
