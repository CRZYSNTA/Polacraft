'use client';

import React, { useState } from "react";
import { X, Ruler, Check, ShieldCheck, ArrowLeftRight, ArrowUpDown, FileText, Frame, Layers } from "lucide-react";

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
  const [activeSize, setActiveSize] = useState<"A5" | "A4" | "A3">(
    (selectedSize as "A5" | "A4" | "A3") || "A4"
  );

  if (!isOpen) return null;

  const SIZES = {
    A5: {
      id: "A5",
      name: "A5 Mini Print",
      widthCm: 14.8,
      heightCm: 21.0,
      widthInches: "5.8 in",
      heightInches: "8.3 in",
      ratio: "1 : 1.414",
      paperEquivalent: "Half of an A4 sheet",
      frameFit: "Fits standard 6 × 8 inch or A5 photo frames",
      bestFor: "Study desks, shelf alcoves, small nooks, or photo collage grids."
    },
    A4: {
      id: "A4",
      name: "A4 Standard Poster",
      widthCm: 21.0,
      heightCm: 29.7,
      widthInches: "8.3 in",
      heightInches: "11.7 in",
      ratio: "1 : 1.414",
      paperEquivalent: "Exact size of standard A4 printer paper & notebooks",
      frameFit: "Fits standard 8 × 12 inch or A4 photo frames",
      bestFor: "Most Popular! Bedroom walls, study desks, & college room decor."
    },
    A3: {
      id: "A3",
      name: "A3 Statement Poster",
      widthCm: 29.7,
      heightCm: 42.0,
      widthInches: "11.7 in",
      heightInches: "16.5 in",
      ratio: "1 : 1.414",
      paperEquivalent: "Double the size of A4 paper (2 × A4)",
      frameFit: "Fits standard 12 × 16.5 inch or A3 gallery frames",
      bestFor: "Statement room decor! Living rooms, main walls, & studio displays."
    }
  };

  const current = SIZES[activeSize];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
          color: "#111111",
          borderRadius: "28px",
          width: "100%",
          maxWidth: "880px",
          maxHeight: "92vh",
          overflowY: "auto",
          padding: "2.5rem",
          position: "relative",
          boxShadow: "0 30px 90px rgba(0,0,0,0.4)",
          border: "1px solid rgba(17,17,17,0.12)"
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
            backgroundColor: "#EFECE6",
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
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Ruler size={14} /> Precise Poster Width & Height Measurement
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.4rem" }}>
            Poster Dimensions & Measurements
          </h2>
          <p style={{ color: "#666666", fontSize: "0.95rem", marginTop: "0.3rem", maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
            Exact width, height, paper comparisons, and frame fitting details for each size.
          </p>
        </div>

        {/* SIZE SELECTOR CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}>
          {(["A5", "A4", "A3"] as const).map((sz) => {
            const item = SIZES[sz];
            const isSelected = activeSize === sz;
            return (
              <button
                key={sz}
                onClick={() => {
                  setActiveSize(sz);
                  if (onSelectSize) onSelectSize(sz);
                }}
                style={{
                  backgroundColor: isSelected ? "#111111" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#111111",
                  padding: "1.25rem 1rem",
                  borderRadius: "18px",
                  border: isSelected ? "2.5px solid #111111" : "1.5px solid rgba(17,17,17,0.12)",
                  cursor: "pointer",
                  textAlign: "center",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.4rem",
                  transition: "var(--transition-fast)"
                }}
              >
                <span style={{ fontSize: "1.2rem", fontWeight: "900" }}>{item.id}</span>
                <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>{item.widthCm} × {item.heightCm} cm</span>
                <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>({item.widthInches} × {item.heightInches})</span>
              </button>
            );
          })}
        </div>

        {/* BLUEPRINT DIMENSIONAL DIAGRAM FOR ACTIVE SIZE */}
        <div
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "24px",
            padding: "2.5rem 2rem",
            position: "relative",
            marginBottom: "2rem",
            border: "1px solid rgba(17,17,17,0.12)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)",
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "2.5rem",
            alignItems: "center"
          }}
          className="dimension-diagram-grid"
        >
          {/* LEFT: 2D MEASUREMENT BOX WITH ARROWS */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            
            {/* Top Width Arrow Indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", width: "200px", justifyContent: "center", marginBottom: "8px" }}>
              <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#111111" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: "800", backgroundColor: "#FFFFFF", padding: "2px 8px", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)" }}>
                Width: {current.widthCm} cm ({current.widthInches})
              </span>
              <div style={{ flexGrow: 1, height: "1.5px", backgroundColor: "#111111" }} />
            </div>

            {/* Middle Container with Left Height Arrow & Poster Box */}
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              
              {/* Left Height Arrow Indicator */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "220px", justifyContent: "center" }}>
                <div style={{ flexGrow: 1, width: "1.5px", backgroundColor: "#111111" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: "800", backgroundColor: "#FFFFFF", padding: "4px 6px", borderRadius: "6px", border: "1px solid rgba(17,17,17,0.15)", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                  Height: {current.heightCm} cm ({current.heightInches})
                </span>
                <div style={{ flexGrow: 1, width: "1.5px", backgroundColor: "#111111" }} />
              </div>

              {/* The Poster Box Box */}
              <div
                style={{
                  width: "200px",
                  height: "283px", // Aspect 1:1.414
                  backgroundColor: "#FFFFFF",
                  border: "2.5px solid #111111",
                  borderRadius: "4px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "1.5rem",
                  textAlign: "center",
                  position: "relative"
                }}
              >
                <div style={{ border: "1px dashed rgba(17,17,17,0.2)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                  <span style={{ fontSize: "1.75rem", fontWeight: "900" }}>{current.id}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#111111" }}>
                    {current.widthCm} × {current.heightCm} cm
                  </span>
                  <span style={{ fontSize: "0.75rem", color: "#666666" }}>
                    ({current.widthInches} × {current.heightInches})
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT: REAL-WORLD EQUIVALENTS & FRAME FIT DETAILS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <FileText size={18} style={{ color: "#2563EB" }} />
                <h4 style={{ fontSize: "0.9rem", fontWeight: "800" }}>Paper Equivalent</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#111111", fontWeight: "600" }}>
                {current.paperEquivalent}
              </p>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <Frame size={18} style={{ color: "#16A34A" }} />
                <h4 style={{ fontSize: "0.9rem", fontWeight: "800" }}>Frame Size Compatibility</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#111111", fontWeight: "600" }}>
                {current.frameFit}
              </p>
            </div>

            <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.1)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem" }}>
                <Layers size={18} style={{ color: "#9333EA" }} />
                <h4 style={{ fontSize: "0.9rem", fontWeight: "800" }}>Best Placement</h4>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#666666", lineHeight: "1.4" }}>
                {current.bestFor}
              </p>
            </div>
          </div>

        </div>

        {/* EASY A3 vs A4 vs A5 RELATIVE SIZE RATIO EXPLANATION */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem 1.5rem", borderRadius: "18px", border: "1px solid rgba(17,17,17,0.12)", marginBottom: "1.5rem" }}>
          <h4 style={{ fontSize: "0.95rem", fontWeight: "800", marginBottom: "0.5rem" }}>
            💡 Quick Relative Size Rule:
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", fontSize: "0.82rem", color: "#666666" }}>
            <div>
              <strong style={{ color: "#111111" }}>A5:</strong> 14.8 cm W × 21.0 cm H<br />(Half size of A4)
            </div>
            <div>
              <strong style={{ color: "#111111" }}>A4:</strong> 21.0 cm W × 29.7 cm H<br />(Standard notebook sheet)
            </div>
            <div>
              <strong style={{ color: "#111111" }}>A3:</strong> 29.7 cm W × 42.0 cm H<br />(Twice size of A4 sheet)
            </div>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ShieldCheck size={20} style={{ color: "#111111" }} />
            <span style={{ fontSize: "0.85rem", color: "#111111", fontWeight: "600" }}>
              250 GSM Archival Cotton Fine Art Paper • Ultra-Matte Giclée Print
            </span>
          </div>
          {onSelectSize && (
            <button
              onClick={() => {
                onSelectSize(activeSize);
                onClose();
              }}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                padding: "0.75rem 1.8rem",
                borderRadius: "100px",
                fontSize: "0.9rem",
                fontWeight: "700",
                cursor: "pointer",
                border: "none"
              }}
            >
              Select {activeSize} ({current.widthCm} × {current.heightCm} cm)
            </button>
          )}
        </div>

      </div>

      <style>{`
        @media (max-width: 768px) {
          .dimension-diagram-grid {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
        }
      `}</style>
    </div>
  );
};
export default SizeGuideModal;
