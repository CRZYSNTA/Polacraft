'use client';

import React, { useContext, useState, useEffect, useMemo } from "react";
import { AppContext } from "../../../features/cart/AppContext";
import PosterRenderer from "../../../components/PosterRenderer";
import { sizes, frames, posters, calculateProductPrice, FRAME_COST_BY_SIZE } from "../../../lib/cms/products";
import { Heart, ShoppingBag, Calendar, ShieldCheck, RefreshCw, ZoomIn, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { trackCartEvent } from "../../../services/analytics";
import JsonLd from "../../../components/JsonLd";

export default function ProductDetailClient({ poster }) {
  const { addToCart, wishlist, toggleWishlist, recentlyViewed, addRecentlyViewed } = useContext(AppContext);
  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState("A4");
  const [selectedFrame, setSelectedFrame] = useState("unframed");
  const [quantity, setQuantity] = useState(1);

  // Zoom magnifier states
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "center" });

  useEffect(() => {
    // Add to recently viewed on mount
    if (poster) {
      addRecentlyViewed(poster);
    }
  }, [poster]);

  const isWish = wishlist.includes(poster.id);

  // Price calculations
  const currentPrice = calculateProductPrice(poster.price, selectedSize, selectedFrame);

  // Shipping estimate date (5 days ahead)
  const shippingEstimate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-IN", { weekday: 'long', day: 'numeric', month: 'short' });
  }, []);

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

  // Hover zoom coordinate calculations (Point 2)
  const handleMouseMove = (e) => {
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
            marginBottom: "6rem"
          }}
          className="product-split"
        >
          {/* LEFT: IMMERSIVE PREVIEW CARD WITH HOVER ZOOM (Point 2) */}
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
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {/* Dynamic Product Schema */}
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
                    : (poster.inventory === 0 && poster.isPreorder)
                    ? "https://schema.org/PreOrder"
                    : "https://schema.org/InStock"
                }
              }}
            />

            <div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <span 
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                    color: "var(--text-muted)",
                    fontWeight: "600"
                  }}
                >
                  {poster.collection}
                </span>
                {poster.limitedEditionCount && (
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", backgroundColor: "var(--color-charcoal-accent)", color: "#FFFFFF", padding: "0.2rem 0.6rem", borderRadius: "10px" }}>
                    Limited Curation
                  </span>
                )}
              </div>
              
              <h1 
                style={{
                  fontSize: "3.25rem",
                  fontWeight: "800",
                  letterSpacing: "-0.03em",
                  marginTop: "0.5rem",
                  lineHeight: "1.1"
                }}
              >
                {poster.title}
              </h1>
              
              <p style={{ fontSize: "1.25rem", fontStyle: "italic", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                {poster.film}
              </p>
            </div>

            {/* Limited Edition Serialization (Point 4) */}
            {poster.limitedEditionCount && (
              <p style={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: "600", marginTop: "-10px" }}>
                ✨ Limited Series: Print No. <strong>{poster.limitedEditionCount - poster.inventory + 1}</strong> of <strong>{poster.limitedEditionCount}</strong> ever pressed.
              </p>
            )}

            {/* Stock status alerts */}
            {poster.inventory > 0 && poster.inventory <= poster.lowStockThreshold && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#E65100", fontSize: "0.85rem", fontWeight: "600", backgroundColor: "#FFF3E0", padding: "0.5rem 1rem", borderRadius: "10px" }}>
                <AlertTriangle size={16} /> Attention: Only {poster.inventory} original prints left in stock!
              </div>
            )}
            {poster.inventory === 0 && poster.isPreorder && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#1565C0", fontSize: "0.85rem", fontWeight: "600", backgroundColor: "#E3F2FD", padding: "0.5rem 1rem", borderRadius: "10px" }}>
                <AlertTriangle size={16} /> Pre-order: Next batch in press. Expected shipment in 10 days.
              </div>
            )}
            {poster.inventory === 0 && !poster.isPreorder && (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "red", fontSize: "0.85rem", fontWeight: "600", backgroundColor: "#FFEBF0", padding: "0.5rem 1rem", borderRadius: "10px" }}>
                <AlertTriangle size={16} /> Sold Out: All signed copies of this curation have been archived.
              </div>
            )}

            <blockquote 
              style={{
                borderLeft: "2px solid var(--text-dark)",
                paddingLeft: "1.5rem",
                fontSize: "1.05rem",
                fontStyle: "italic",
                color: "var(--text-dark)",
                margin: "0.5rem 0"
              }}
            >
              "{poster.tagline}"
            </blockquote>

            <div style={{ fontSize: "2rem", fontWeight: "700", color: (poster.inventory === 0 && !poster.isPreorder) ? "var(--text-muted)" : "var(--text-dark)" }}>
              ₹{currentPrice.toLocaleString("en-IN")}
            </div>

            {/* Sizes */}
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Choose Size
              </span>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
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
                        border: selectedSize === s.id ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                        backgroundColor: selectedSize === s.id ? "var(--text-dark)" : "transparent",
                        color: selectedSize === s.id ? "#FFFFFF" : "var(--text-dark)",
                        cursor: "pointer",
                        fontWeight: "600",
                        transition: "var(--transition-fast)"
                      }}
                    >
                      {displayLabel}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frames */}
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Select Gallery Frame
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginTop: "0.5rem" }}>
                {frames.map((f) => {
                  const frameAddon = f.id === "unframed" ? 0 : (FRAME_COST_BY_SIZE[selectedSize] ?? 155);
                  const labelText = f.id === "unframed" 
                    ? "Unframed (Print Only)" 
                    : `${f.label.split(" (")[0]} (+₹${frameAddon})`;

                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFrame(f.id)}
                      style={{
                        padding: "0.8rem 1rem",
                        fontSize: "0.8rem",
                        borderRadius: "15px",
                        border: selectedFrame === f.id ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                        backgroundColor: selectedFrame === f.id ? "var(--accent-charcoal)" : "transparent",
                        color: selectedFrame === f.id ? "#FFFFFF" : "var(--text-dark)",
                        cursor: "pointer",
                        textAlign: "left",
                        fontWeight: "600",
                        transition: "var(--transition-fast)"
                      }}
                    >
                      {labelText}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Qty */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                Qty
              </span>
              <div 
                style={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "var(--accent-beige)",
                  borderRadius: "15px",
                  padding: "0.4rem 1rem"
                }}
              >
                <button 
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{ cursor: "pointer", padding: "4px", fontWeight: "bold" }}
                >
                  -
                </button>
                <span style={{ width: "36px", textAlign: "center", fontWeight: "600" }}>{quantity}</span>
                <button 
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{ cursor: "pointer", padding: "4px", fontWeight: "bold" }}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                onClick={handleAddToCart}
                disabled={poster.inventory === 0 && !poster.isPreorder}
                className="btn-magnetic btn-primary"
                style={{
                  flexGrow: 1,
                  padding: "1.1rem",
                  borderRadius: "20px",
                  fontSize: "0.95rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  opacity: (poster.inventory === 0 && !poster.isPreorder) ? 0.5 : 1,
                  cursor: (poster.inventory === 0 && !poster.isPreorder) ? "not-allowed" : "pointer"
                }}
              >
                <ShoppingBag size={18} /> 
                {poster.inventory === 0 && !poster.isPreorder 
                  ? "Sold Out (Prints Exhausted)" 
                  : poster.inventory === 0 && poster.isPreorder 
                  ? "Pre-order Print" 
                  : "Add to Gallery Bag"}
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
                  backgroundColor: isWish ? "rgba(255,0,0,0.05)" : "transparent",
                  transition: "var(--transition-fast)"
                }}
              >
                <Heart size={20} fill={isWish ? "red" : "none"} />
              </button>
            </div>

            {/* Specifications */}
            <div 
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
                borderTop: "1px solid var(--border-color)",
                paddingTop: "1.5rem",
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                marginTop: "1rem"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Calendar size={16} />
                <span>Estimated arrival by <strong>{shippingEstimate}</strong></span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <ShieldCheck size={16} />
                <span>Museum-grade packaging (rigid cardboard tubes, tissue wraps)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <RefreshCw size={16} />
                <span>Print specification: {poster.gsm} GSM {poster.finish}</span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS SECTION: NARRATIVE */}
        <section 
          style={{ 
            borderTop: "1px solid var(--border-color)", 
            paddingTop: "5rem", 
            marginBottom: "6rem",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "5rem"
          }}
          className="editorial-story-grid"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              The Cinematic Core
            </span>
            <h3 style={{ fontSize: "1.75rem", fontWeight: "700" }}>The Film Story</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              {poster.story}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Craftsmanship Notes
            </span>
            <h3 style={{ fontSize: "1.75rem", fontWeight: "700" }}>Design Breakdown</h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              {poster.designNotes}
            </p>
            <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              <strong>Aesthetic Finish:</strong> {poster.finish}<br />
              <strong>Paper Type:</strong> {poster.paperType} ({poster.gsm} GSM)<br />
              <strong>Frame borders:</strong> 14-16mm thickness, plexiglass backing protection.
            </p>
          </div>
        </section>

        {/* RELATED ARTWORKS */}
        {relatedPosters.length > 0 && (
          <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "5rem", marginBottom: "5rem" }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2.5rem" }}>Related Artworks</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="related-posters-grid">
              {relatedPosters.map((p) => (
                <div 
                  key={p.id}
                  onClick={() => {
                    router.push(`/product/${p.slug}`);
                  }}
                  style={{ display: "flex", flexDirection: "column", gap: "1rem", cursor: "pointer" }}
                  className="related-item-card"
                >
                  <div style={{ backgroundColor: "var(--accent-beige)", padding: "2.5rem 2rem", borderRadius: "20px" }} className="hover-lift">
                    <PosterRenderer poster={p} frame="unframed" />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "0 0.5rem" }}>
                    <h4 style={{ fontSize: "1rem", fontWeight: "600" }}>{p.title}</h4>
                    <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>₹{p.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECENTLY VIEWED */}
        {recentlyViewed.length > 1 && (
          <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "5rem" }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2.5rem" }}>Recently Viewed</h3>
            <div style={{ display: "flex", gap: "2rem", overflowX: "auto", paddingBottom: "1rem" }} className="recent-carousel-viewport">
              {recentlyViewed
                .filter((p) => p.id !== poster.id)
                .map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => router.push(`/product/${p.slug}`)}
                    style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", gap: "0.75rem", cursor: "pointer" }}
                    className="recent-item-card"
                  >
                    <div style={{ backgroundColor: "var(--accent-beige)", padding: "1.5rem", borderRadius: "16px" }} className="hover-lift">
                      <PosterRenderer poster={p} />
                    </div>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600", padding: "0 0.25rem" }}>{p.title}</span>
                  </div>
                ))}
            </div>
          </section>
        )}
      </div>

      <style>{`
        .recent-carousel-viewport::-webkit-scrollbar {
          height: 4px;
        }
        @media (max-width: 900px) {
          .product-split {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .product-gallery-box {
            position: static !important;
            padding: 4rem 2rem !important;
          }
          .editorial-story-grid {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
        }
        @media (max-width: 768px) {
          .related-posters-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 500px) {
          .related-posters-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
