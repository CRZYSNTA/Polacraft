'use client';

import React, { useContext, useState } from "react";
import { AppContext } from "../features/cart/AppContext";
import { PosterRenderer } from "./PosterRenderer";
import { sizes, frames } from "../lib/cms/products";
import { X, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { trackCartEvent } from "../services/analytics";

export const QuickViewModal = () => {
  const {
    quickViewProduct,
    closeQuickView,
    addToCart,
    wishlist,
    toggleWishlist
  } = useContext(AppContext);

  const router = useRouter();

  const [selectedSize, setSelectedSize] = useState("A4");
  const [selectedFrame, setSelectedFrame] = useState("unframed");
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);

  // Price Calculation
  const sizeObj = sizes.find((s) => s.id === selectedSize);
  const frameObj = frames.find((f) => f.id === selectedFrame);
  const currentPrice = quickViewProduct.price + sizeObj.priceModifier + frameObj.priceModifier;

  const handleAddToCart = () => {
    addToCart(quickViewProduct, selectedSize, selectedFrame, quantity);
    
    // Track add to cart event (Point 6)
    try {
      trackCartEvent("add", {
        ...quickViewProduct,
        price: currentPrice,
        quantity
      });
    } catch (e) {
      console.error("Cart tracking error", e);
    }
    
    closeQuickView();
  };

  const handleFullDetails = () => {
    router.push(`/product/${quickViewProduct.slug}`);
    closeQuickView();
  };

  return (
    <AnimatePresence>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 3000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem"
        }}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={closeQuickView}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#000000",
            cursor: "pointer"
          }}
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "960px",
            height: "auto",
            maxHeight: "90vh",
            backgroundColor: "var(--bg-warm)",
            borderRadius: "var(--radius-md)",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "1.1fr 1fr",
            zIndex: 3001,
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            border: "1px solid var(--border-color)"
          }}
          className="quickview-modal-grid"
        >
          {/* Close button */}
          <button
            onClick={closeQuickView}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.5rem",
              zIndex: 10,
              cursor: "pointer",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--accent-beige)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "var(--transition-fast)"
            }}
            className="qv-close-btn"
          >
            <X size={18} />
          </button>

          {/* Left Column: Poster Canvas */}
          <div
            style={{
              backgroundColor: "var(--accent-beige)",
              padding: "4rem 3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative"
            }}
          >
            <div style={{ width: "100%", maxWidth: "300px" }} className="hover-lift">
              <PosterRenderer poster={quickViewProduct} frame={selectedFrame} size={selectedSize} />
            </div>
          </div>

          {/* Right Column: Poster Story & Specs */}
          <div style={{ padding: "4rem 3rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Header */}
            <div>
              <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>
                {quickViewProduct.collection}
              </span>
              <h2 style={{ fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.02em", marginTop: "4px" }}>
                {quickViewProduct.title}
              </h2>
              <p style={{ fontSize: "1rem", fontStyle: "italic", color: "var(--text-muted)" }}>
                {quickViewProduct.film}
              </p>
            </div>

            {/* Price */}
            <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>
              ₹{currentPrice.toLocaleString("en-IN")}
            </div>

            {/* Story excerpt */}
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: "1.6" }}>
              {quickViewProduct.story.substring(0, 180)}...
            </p>

            {/* Size selection */}
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                Choose Dimensions
              </span>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {sizes.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.id)}
                    style={{
                      padding: "0.5rem 1rem",
                      fontSize: "0.8rem",
                      borderRadius: "12px",
                      border: selectedSize === s.id ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                      backgroundColor: selectedSize === s.id ? "var(--text-dark)" : "transparent",
                      color: selectedSize === s.id ? "#FFFFFF" : "var(--text-dark)",
                      cursor: "pointer",
                      fontWeight: "500",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {s.id} (+₹{s.priceModifier})
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Selection */}
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)" }}>
                Select Gallery Frame
              </span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", marginTop: "0.5rem" }}>
                {frames.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFrame(f.id)}
                    style={{
                      padding: "0.5rem 0.8rem",
                      fontSize: "0.75rem",
                      borderRadius: "12px",
                      border: selectedFrame === f.id ? "1.5px solid var(--text-dark)" : "1.5px solid var(--border-color)",
                      backgroundColor: selectedFrame === f.id ? "var(--accent-charcoal)" : "transparent",
                      color: selectedFrame === f.id ? "#FFFFFF" : "var(--text-dark)",
                      cursor: "pointer",
                      textAlign: "left",
                      fontWeight: "500",
                      transition: "var(--transition-fast)"
                    }}
                  >
                    {f.label.split(" (")[0]} (+₹{f.priceModifier})
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
              <button
                onClick={handleAddToCart}
                className="btn-magnetic btn-primary"
                style={{ flexGrow: 1, padding: "0.9rem", fontSize: "0.9rem", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
              >
                <ShoppingBag size={16} /> Add to Bag
              </button>
              
              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                style={{
                  cursor: "pointer",
                  width: "48px",
                  height: "48px",
                  borderRadius: "15px",
                  border: "1.5px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isWishlisted ? "red" : "var(--text-dark)",
                  backgroundColor: isWishlisted ? "rgba(255, 0, 0, 0.05)" : "transparent",
                  transition: "var(--transition-fast)"
                }}
                className="qv-wishlist-btn"
                aria-label="Wishlist product"
              >
                <Heart size={18} fill={isWishlisted ? "red" : "none"} />
              </button>
            </div>

            {/* Full Details link */}
            <button
              onClick={handleFullDetails}
              style={{
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "0.85rem",
                fontWeight: "600",
                color: "var(--text-muted)",
                marginTop: "0.5rem",
                alignSelf: "flex-start"
              }}
              className="underline-hover"
            >
              Explore Full Story & Details <ArrowRight size={14} />
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .qv-close-btn:hover {
          background-color: var(--accent-muted) !important;
          transform: rotate(90deg);
        }
        .qv-wishlist-btn:hover {
          border-color: var(--text-dark) !important;
        }
        @media (max-width: 768px) {
          .quickview-modal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </AnimatePresence>
  );
};
export default QuickViewModal;
