'use client';

import React from "react";
import { X, Ruler, Check, Monitor, ShieldCheck, Sparkles } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSize?: string;
  onSelectSize?: (size: "A5" | "A4" | "A3") => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  selectedSize = "A4",
  onSelectSize
}) => {
  if (!isOpen) return null;

  const sizesData = [
    {
      id: "A5",
      name: "A5 Print",
      dimensionsCm: "14.8 × 21 cm",
      dimensionsInches: "5.8 × 8.3 in",
      bestFor: "Desk frames, shelf alcoves, or gallery wall grids.",
      relativeWidth: 70,  // Scale relative width
      relativeHeight: 99
    },
    {
      id: "A4",
      name: "A4 Standard",
      dimensionsCm: "21 × 29.7 cm",
      dimensionsInches: "8.3 × 11.7 in",
      bestFor: "Most popular. Ideal above study desks, bookshelves & bedroom walls.",
      relativeWidth: 99,
      relativeHeight: 140
    },
    {
      id: "A3",
      name: "A3 Statement",
      dimensionsCm: "29.7 × 42 cm",
      dimensionsInches: "11.7 × 16.5 in",
      bestFor: "Living rooms, focal walls, & high-impact studio displays.",
      relativeWidth: 140,
      relativeHeight: 198
    }
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem"
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FAFAF8",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "860px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2.5rem",
          position: "relative",
          boxShadow: "0 30px 80px rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.4)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1.5rem",
            right: "1.5rem",
            backgroundColor: "var(--accent-beige)",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "var(--transition-fast)"
          }}
          aria-label="Close Size Guide"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
            <Ruler size={14} /> Size Guide & Scale Comparison
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            How Big Is Each Poster?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.5rem", maxWidth: "48ch", marginLeft: "auto", marginRight: "auto" }}>
            Visualized to scale on a studio wall above a desk with a standard 15-inch laptop (36 cm wide) for real-life scale comparison.
          </p>
        </div>

        {/* VISUAL DESK SCALE COMPARISON GRAPHIC */}
        <div
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "24px",
            padding: "3rem 1.5rem 1.5rem 1.5rem",
            position: "relative",
            marginBottom: "2.5rem",
            border: "1px solid var(--border-color)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)"
          }}
        >
          {/* POSTERS TO SCALE ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "flex-end",
              height: "220px",
              marginBottom: "1rem",
              paddingBottom: "10px"
            }}
          >
            {sizesData.map((item) => {
              const isSelected = selectedSize === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectSize && onSelectSize(item.id as any)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: onSelectSize ? "pointer" : "default"
                  }}
                >
                  {/* Label above poster */}
                  <span style={{ fontSize: "0.75rem", fontWeight: "800", color: isSelected ? "var(--text-dark)" : "var(--text-muted)", marginBottom: "6px" }}>
                    {item.id}
                  </span>
                  
                  {/* Poster Outline Box */}
                  <div
                    style={{
                      width: `${item.relativeWidth}px`,
                      height: `${item.relativeHeight}px`,
                      backgroundColor: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                      border: isSelected ? "2.5px solid var(--text-dark)" : "1.5px dashed rgba(0,0,0,0.3)",
                      borderRadius: "4px",
                      boxShadow: isSelected ? "0 12px 25px rgba(0,0,0,0.15)" : "0 4px 10px rgba(0,0,0,0.05)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      textAlign: "center",
                      transition: "var(--transition-smooth)",
                      position: "relative"
                    }}
                  >
                    {/* Inner Margin Line */}
                    <div style={{ border: "1px solid rgba(0,0,0,0.08)", width: "100%", height: "100%", borderRadius: "2px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-dark)" }}>
                        {item.dimensionsCm.split(" ")[0]} × {item.dimensionsCm.split(" ")[2]}
                      </span>
                      <span style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>
                        {item.dimensionsInches}
                      </span>
                    </div>

                    {isSelected && (
                      <span style={{ position: "absolute", top: "-10px", right: "-10px", backgroundColor: "var(--text-dark)", color: "#FFFFFF", borderRadius: "50%", padding: "2px" }}>
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* LAPTOPS & DESK ILLUSTRATION ROW */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              borderTop: "2px solid rgba(0,0,0,0.12)",
              paddingTop: "1rem"
            }}
          >
            {sizesData.map((item) => (
              <div key={`laptop-${item.id}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "120px" }}>
                {/* Minimal Laptop Illustration */}
                <div style={{ width: "80px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "64px", height: "40px", backgroundColor: "#2C2C2A", borderRadius: "4px 4px 0 0", border: "1px solid #111", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: "56px", height: "34px", backgroundColor: "#3A3A38", borderRadius: "2px" }} />
                  </div>
                  <div style={{ width: "84px", height: "5px", backgroundColor: "#888", borderRadius: "0 0 4px 4px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                </div>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "6px", fontWeight: "500" }}>
                  15-inch Laptop (36cm)
                </span>
              </div>
            ))}
          </div>

          {/* Desk Surface Baseline */}
          <div style={{ width: "100%", height: "8px", backgroundColor: "var(--text-muted)", opacity: 0.15, borderRadius: "4px", marginTop: "1rem" }} />
        </div>

        {/* DETAILED SIZE COMPARISON CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {sizesData.map((item) => {
            const isSelected = selectedSize === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectSize && onSelectSize(item.id as any)}
                style={{
                  backgroundColor: isSelected ? "#FFFFFF" : "#FAFAF8",
                  padding: "1.25rem",
                  borderRadius: "18px",
                  border: isSelected ? "2px solid var(--text-dark)" : "1px solid var(--border-color)",
                  cursor: onSelectSize ? "pointer" : "default",
                  boxShadow: isSelected ? "0 10px 25px rgba(0,0,0,0.08)" : "none",
                  transition: "var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{item.name}</h4>
                  {isSelected && <span style={{ fontSize: "0.65rem", fontWeight: "700", backgroundColor: "var(--text-dark)", color: "#FFFFFF", padding: "0.2rem 0.5rem", borderRadius: "100px" }}>Selected</span>}
                </div>
                <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-dark)" }}>
                  {item.dimensionsCm} <span style={{ color: "var(--text-muted)", fontWeight: "400" }}>({item.dimensionsInches})</span>
                </p>
                <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "0.5rem", lineHeight: "1.4" }}>
                  {item.bestFor}
                </p>
              </div>
            );
          })}
        </div>

        {/* PRINT QUALITY SPECIFICATIONS */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem 1.5rem", borderRadius: "16px", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ShieldCheck size={20} style={{ color: "var(--text-dark)" }} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: "600" }}>
              250 GSM Acid-Free Archival Cotton • Ultra-Matte Giclée Print
            </span>
          </div>
          {onSelectSize && (
            <button
              onClick={onClose}
              style={{
                backgroundColor: "var(--text-dark)",
                color: "#FFFFFF",
                padding: "0.6rem 1.4rem",
                borderRadius: "100px",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: "pointer",
                border: "none"
              }}
            >
              Done & Select Size
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default SizeGuideModal;
