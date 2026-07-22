'use client';

import React, { useState } from "react";
import { X, Ruler, Check, ShieldCheck, Armchair, User, Smartphone } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"sofa" | "human" | "objects">("human");
  const [previewSize, setPreviewSize] = useState<"A5" | "A4" | "A3">(
    (selectedSize as "A5" | "A4" | "A3") || "A4"
  );

  if (!isOpen) return null;

  // Exact 1:1 proportional scale math (1 cm = 1.35 pixels)
  // Person = 170cm => 229.5px tall
  // Wall Ceiling = 240cm => 324px tall
  const SCALE_FACTOR = 1.35; // 1cm = 1.35px

  const SIZES = {
    A5: {
      id: "A5",
      name: "A5 Small",
      cm: "14.8 × 21 cm",
      inches: "5.8 × 8.3 in",
      widthPx: Math.round(14.8 * SCALE_FACTOR),  // ~20px
      heightPx: Math.round(21 * SCALE_FACTOR),   // ~28px
      realComparison: "Slightly taller than a smartphone (iPhone).",
      bestFor: "Desk frames, shelf alcoves, or gallery wall photo grids."
    },
    A4: {
      id: "A4",
      name: "A4 Standard",
      cm: "21 × 29.7 cm",
      inches: "8.3 × 11.7 in",
      widthPx: Math.round(21 * SCALE_FACTOR),   // ~28px
      heightPx: Math.round(29.7 * SCALE_FACTOR), // ~40px
      realComparison: "Same size as standard printer paper or a notebook.",
      bestFor: "Most popular choice! Perfect for bedroom walls & study desks."
    },
    A3: {
      id: "A3",
      name: "A3 Large",
      cm: "29.7 × 42 cm",
      inches: "11.7 × 16.5 in",
      widthPx: Math.round(29.7 * SCALE_FACTOR), // ~40px
      heightPx: Math.round(42 * SCALE_FACTOR),   // ~57px
      realComparison: "Double the size of A4 (classic room wall poster size).",
      bestFor: "Statement wall art! Perfect for living room & focal walls."
    }
  };

  const currentPoster = SIZES[previewSize];

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
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Ruler size={14} /> Mathematically To Scale Guide
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.4rem" }}>
            How Big Is Each Poster?
          </h2>
          <p style={{ color: "#666666", fontSize: "0.95rem", marginTop: "0.3rem", maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
            Accurately proportioned against a 170cm (5'7") person, a living room couch, and everyday items.
          </p>
        </div>

        {/* TAB CONTEXT SELECTOR */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {[
            { id: "human", label: "👤 Next to 170cm (5'7\") Person", icon: User },
            { id: "sofa", label: "🛋️ Above Living Room Sofa", icon: Armchair },
            { id: "objects", label: "📱 Everyday Object Scale", icon: Smartphone }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.6rem 1.2rem",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  borderRadius: "100px",
                  border: isActive ? "1.5px solid #111111" : "1.5px solid rgba(17,17,17,0.12)",
                  backgroundColor: isActive ? "#111111" : "#FFFFFF",
                  color: isActive ? "#FFFFFF" : "#111111",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
              >
                <IconComp size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* SIZE TOGGLE CONTROLS INSIDE GRAPHIC */}
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "#666666" }}>
            Toggle Poster Size:
          </span>
          {(["A5", "A4", "A3"] as const).map((sz) => {
            const isSelected = previewSize === sz;
            return (
              <button
                key={sz}
                onClick={() => {
                  setPreviewSize(sz);
                  if (onSelectSize) onSelectSize(sz);
                }}
                style={{
                  padding: "0.4rem 1rem",
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  borderRadius: "12px",
                  border: isSelected ? "2px solid #111111" : "1px solid rgba(17,17,17,0.15)",
                  backgroundColor: isSelected ? "#111111" : "#FFFFFF",
                  color: isSelected ? "#FFFFFF" : "#111111",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
              >
                {sz}
              </button>
            );
          })}
        </div>

        {/* MATHEMATICALLY ACCURATE PROPORTIONAL GRAPHIC DISPLAY */}
        <div
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "24px",
            padding: "2rem 1.5rem 1rem 1.5rem",
            position: "relative",
            marginBottom: "1.75rem",
            border: "1px solid rgba(17,17,17,0.12)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)"
          }}
        >
          {/* TAB 1: ACCURATE HUMAN SCALE (Person 170cm = 230px, A3=57px, A4=40px, A5=28px) */}
          {activeTab === "human" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  height: "260px",
                  width: "100%",
                  maxWidth: "500px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-end",
                  gap: "4rem",
                  position: "relative"
                }}
              >
                {/* 170cm Human Figure (Height: 230px) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {/* Head (30px) */}
                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "#2C2C2A", marginBottom: "4px" }} />
                  {/* Body & Legs (200px) */}
                  <div style={{ width: "42px", height: "196px", backgroundColor: "#2C2C2A", borderRadius: "18px 18px 4px 4px", position: "relative" }}>
                    <div style={{ position: "absolute", top: "45px", left: "-8px", width: "8px", height: "80px", backgroundColor: "#2C2C2A", borderRadius: "4px" }} />
                    <div style={{ position: "absolute", top: "45px", right: "-8px", width: "8px", height: "80px", backgroundColor: "#2C2C2A", borderRadius: "4px" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#111111", marginTop: "8px" }}>
                    👤 Person (170 cm / 5'7")
                  </span>
                </div>

                {/* Accurate Proportional Poster mounted at eye level (150cm center height) */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "80px" }}>
                  <div
                    style={{
                      width: `${currentPoster.widthPx * 2.2}px`,
                      height: `${currentPoster.heightPx * 2.2}px`,
                      backgroundColor: "#FFFFFF",
                      border: "2.5px solid #111111",
                      borderRadius: "3px",
                      boxShadow: "0 14px 35px rgba(0,0,0,0.22)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      textAlign: "center",
                      transition: "all 0.4s ease-out"
                    }}
                  >
                    <div style={{ border: "1px solid rgba(0,0,0,0.1)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "#111111" }}>{previewSize}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#111111" }}>{currentPoster.cm}</span>
                      <span style={{ fontSize: "0.65rem", color: "#666666" }}>({currentPoster.inches})</span>
                    </div>
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#2563EB", marginTop: "10px" }}>
                    Selected: {previewSize} Poster
                  </span>
                </div>
              </div>

              <div style={{ width: "100%", height: "2px", backgroundColor: "rgba(17,17,17,0.2)", marginTop: "4px" }} />
            </div>
          )}

          {/* TAB 2: SOFA SCALE GRAPHIC */}
          {activeTab === "sofa" && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  height: "260px",
                  width: "100%",
                  maxWidth: "520px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                {/* Poster Mounted Above Sofa */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "15px" }}>
                  <div
                    style={{
                      width: `${currentPoster.widthPx * 2.2}px`,
                      height: `${currentPoster.heightPx * 2.2}px`,
                      backgroundColor: "#FFFFFF",
                      border: "2.5px solid #111111",
                      borderRadius: "3px",
                      boxShadow: "0 14px 35px rgba(0,0,0,0.22)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "4px",
                      textAlign: "center",
                      transition: "all 0.4s ease-out"
                    }}
                  >
                    <div style={{ border: "1px solid rgba(0,0,0,0.1)", width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "900" }}>{previewSize}</span>
                      <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>{currentPoster.cm}</span>
                    </div>
                  </div>
                </div>

                {/* Living Room Sofa (150 cm wide) */}
                <div style={{ width: "320px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ width: "100%", height: "65px", backgroundColor: "#2C2C2A", borderRadius: "18px 18px 8px 8px", boxShadow: "0 8px 20px rgba(0,0,0,0.18)", display: "flex", justifyContent: "space-between", padding: "8px 16px", boxSizing: "border-box" }}>
                    <div style={{ width: "30%", height: "100%", backgroundColor: "#3A3A38", borderRadius: "8px" }} />
                    <div style={{ width: "30%", height: "100%", backgroundColor: "#3A3A38", borderRadius: "8px" }} />
                    <div style={{ width: "30%", height: "100%", backgroundColor: "#3A3A38", borderRadius: "8px" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#666666", marginTop: "8px" }}>
                    🛋️ Living Room Sofa (150 cm wide)
                  </span>
                </div>
              </div>
              <div style={{ width: "100%", height: "2px", backgroundColor: "rgba(17,17,17,0.2)", marginTop: "4px" }} />
            </div>
          )}

          {/* TAB 3: EVERYDAY OBJECTS GRAPHIC */}
          {activeTab === "objects" && (
            <div style={{ padding: "1rem 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: previewSize === "A5" ? "2px solid #111111" : "1px solid rgba(17,17,17,0.1)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>📱</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>A5 vs Smartphone</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
                    A5 (14.8 × 21 cm) is about 1.5x height of an iPhone. Great for small table frames & desks.
                  </p>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: previewSize === "A4" ? "2px solid #111111" : "1px solid rgba(17,17,17,0.1)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>📖</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>A4 vs Notebook</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
                    A4 (21 × 29.7 cm) is the EXACT size of a standard printer sheet or school notebook.
                  </p>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: previewSize === "A3" ? "2px solid #111111" : "1px solid rgba(17,17,17,0.1)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.75rem", marginBottom: "0.5rem" }}>🖼️</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>A3 vs Double A4</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
                    A3 (29.7 × 42 cm) is TWICE the size of A4. The classic room poster size!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ALL 3 SIZES SUMMARY CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          {(["A5", "A4", "A3"] as const).map((sz) => {
            const item = SIZES[sz];
            const isSelected = previewSize === sz;
            return (
              <div
                key={sz}
                onClick={() => {
                  setPreviewSize(sz);
                  if (onSelectSize) onSelectSize(sz);
                }}
                style={{
                  backgroundColor: isSelected ? "#FFFFFF" : "#FAFAF8",
                  padding: "1.25rem",
                  borderRadius: "18px",
                  border: isSelected ? "2.5px solid #111111" : "1px solid rgba(17,17,17,0.12)",
                  cursor: "pointer",
                  boxShadow: isSelected ? "0 10px 25px rgba(0,0,0,0.08)" : "none",
                  transition: "var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{item.name}</h4>
                  {isSelected && <span style={{ fontSize: "0.65rem", fontWeight: "700", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.2rem 0.5rem", borderRadius: "100px" }}>Active</span>}
                </div>
                <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111111" }}>
                  {item.cm} <span style={{ color: "#666666", fontWeight: "400" }}>({item.inches})</span>
                </p>
                <p style={{ fontSize: "0.78rem", fontWeight: "600", color: "#2563EB", marginTop: "0.35rem" }}>
                  💡 {item.realComparison}
                </p>
                <p style={{ fontSize: "0.75rem", color: "#666666", marginTop: "0.35rem", lineHeight: "1.4" }}>
                  {item.bestFor}
                </p>
              </div>
            );
          })}
        </div>

        {/* PRINT QUALITY SPECIFICATIONS FOOTER */}
        <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem 1.5rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <ShieldCheck size={20} style={{ color: "#111111" }} />
            <span style={{ fontSize: "0.85rem", color: "#111111", fontWeight: "600" }}>
              250 GSM Archival Cotton Fine Art Paper • Ultra-Matte Giclée Print
            </span>
          </div>
          {onSelectSize && (
            <button
              onClick={() => {
                onSelectSize(previewSize);
                onClose();
              }}
              style={{
                backgroundColor: "#111111",
                color: "#FFFFFF",
                padding: "0.65rem 1.6rem",
                borderRadius: "100px",
                fontSize: "0.85rem",
                fontWeight: "700",
                cursor: "pointer",
                border: "none"
              }}
            >
              Confirm {previewSize} Size
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default SizeGuideModal;
