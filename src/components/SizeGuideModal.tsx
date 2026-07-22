'use client';

import React, { useState } from "react";
import { X, Ruler, Check, ShieldCheck, BookOpen, Monitor, Frame, Sparkles, Laptop, Smartphone } from "lucide-react";

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
      name: "A5 (Small)",
      badge: "Desk & Shelf",
      cm: "14.8 × 21 cm",
      inches: "5.8 × 8.3 in",
      relatable: "About the size of a paperback book or small notebook 📚",
      device: "≈ 2 smartphones stacked vertically 📱",
      bestFor: "Perfect for desks, shelves & bedside tables 📚",
      scaleWidth: 60,
      scaleHeight: 85
    },
    A4: {
      id: "A4",
      name: "A4 (Medium)",
      badge: "Most Popular",
      cm: "21 × 29.7 cm",
      inches: "8.3 × 11.7 in",
      relatable: "Same size as a standard printer sheet 📄",
      device: "≈ A 14–15\" laptop footprint 💻",
      bestFor: "The classic wall poster size 🖼️",
      scaleWidth: 85,
      scaleHeight: 120
    },
    A3: {
      id: "A3",
      name: "A3 (Large)",
      badge: "Statement Art",
      cm: "29.7 × 42 cm",
      inches: "11.7 × 16.5 in",
      relatable: "Two A4 sheets side by side (2 × A4) 📑",
      device: "≈ A 24–27\" monitor screen 🖥️",
      bestFor: "Statement piece for bedrooms & living rooms ✨",
      scaleWidth: 120,
      scaleHeight: 170
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
            <Ruler size={14} /> Relatable Size Guide
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.4rem" }}>
            How Big Is Each Poster?
          </h2>
          <p style={{ color: "#666666", fontSize: "0.95rem", marginTop: "0.3rem", maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
            Simple, relatable comparisons to help you choose the right size for your wall.
          </p>
        </div>

        {/* OPTION 2: ROOM WALL VISUAL COMPARISON (ALL 3 FRAMES ON SAME WALL) */}
        <div
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "24px",
            padding: "2.5rem 1.5rem 1.5rem 1.5rem",
            position: "relative",
            marginBottom: "2rem",
            border: "1px solid rgba(17,17,17,0.12)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666666" }}>
              🖼️ Room Wall View (Side-by-Side Scale)
            </span>
          </div>

          {/* Wall Hanging Frames Row */}
          <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "200px", paddingBottom: "10px" }}>
            {(["A5", "A4", "A3"] as const).map((sz) => {
              const item = SIZES[sz];
              const isSelected = activeSize === sz;
              return (
                <div
                  key={sz}
                  onClick={() => {
                    setActiveSize(sz);
                    if (onSelectSize) onSelectSize(sz);
                  }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer" }}
                >
                  <span style={{ fontSize: "0.8rem", fontWeight: "800", color: isSelected ? "#111111" : "#666666", marginBottom: "6px" }}>
                    {item.name}
                  </span>
                  
                  {/* Framed Canvas Box */}
                  <div
                    style={{
                      width: `${item.scaleWidth}px`,
                      height: `${item.scaleHeight}px`,
                      backgroundColor: "#FFFFFF",
                      border: isSelected ? "3px solid #111111" : "2px solid #2C2C2A",
                      borderRadius: "3px",
                      boxShadow: isSelected ? "0 15px 35px rgba(0,0,0,0.25)" : "0 6px 15px rgba(0,0,0,0.08)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      textAlign: "center",
                      position: "relative",
                      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                    }}
                  >
                    <div style={{ border: "1px solid rgba(0,0,0,0.08)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "900" }}>{item.id}</span>
                      <span style={{ fontSize: "0.65rem", color: "#666666" }}>{item.cm}</span>
                    </div>

                    {isSelected && (
                      <span style={{ position: "absolute", top: "-10px", right: "-10px", backgroundColor: "#111111", color: "#FFFFFF", borderRadius: "50%", padding: "2px" }}>
                        <Check size={12} />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ borderTop: "2px solid rgba(17,17,17,0.15)", paddingTop: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "#666666" }}>Wall Baseline (Hanging at Eye Level)</span>
          </div>
        </div>

        {/* OPTIONS 1 & 3: RELATABLE COMPARISONS CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}>
          {(["A5", "A4", "A3"] as const).map((sz) => {
            const item = SIZES[sz];
            const isSelected = activeSize === sz;
            return (
              <div
                key={sz}
                onClick={() => {
                  setActiveSize(sz);
                  if (onSelectSize) onSelectSize(sz);
                }}
                style={{
                  backgroundColor: isSelected ? "#FFFFFF" : "#FAFAF8",
                  padding: "1.35rem",
                  borderRadius: "20px",
                  border: isSelected ? "2.5px solid #111111" : "1.5px solid rgba(17,17,17,0.12)",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 10px 25px rgba(0,0,0,0.08)" : "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                  transition: "var(--transition-fast)"
                }}
              >
                {/* Card Title & Badge */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4 style={{ fontSize: "1.15rem", fontWeight: "900" }}>{item.id}</h4>
                    <span style={{ fontSize: "0.75rem", color: "#666666", fontWeight: "600" }}>{item.cm} ({item.inches})</span>
                  </div>
                  <span style={{ fontSize: "0.65rem", fontWeight: "700", backgroundColor: isSelected ? "#111111" : "#EFECE6", color: isSelected ? "#FFFFFF" : "#111111", padding: "0.2rem 0.6rem", borderRadius: "100px" }}>
                    {item.badge}
                  </span>
                </div>

                <div style={{ height: "1px", backgroundColor: "rgba(17,17,17,0.08)" }} />

                {/* Relatable Object Comparison */}
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#666666" }}>
                    Relatable Comparison:
                  </span>
                  <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111", marginTop: "2px", lineHeight: "1.35" }}>
                    {item.relatable}
                  </p>
                </div>

                {/* Device Footprint Comparison */}
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "#666666" }}>
                    Device Footprint:
                  </span>
                  <p style={{ fontSize: "0.82rem", fontWeight: "600", color: "#2563EB", marginTop: "2px" }}>
                    {item.device}
                  </p>
                </div>

                {/* Best Usage Recommendation */}
                <div style={{ backgroundColor: "#F7F7F4", padding: "0.75rem", borderRadius: "12px", marginTop: "auto" }}>
                  <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#111111", margin: 0, lineHeight: "1.35" }}>
                    {item.bestFor}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER CONFIRMATION ACTION */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px solid rgba(17,17,17,0.1)", paddingTop: "1.5rem" }}>
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
              Select {activeSize} ({current.cm})
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default SizeGuideModal;
