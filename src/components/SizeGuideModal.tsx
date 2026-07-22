'use client';

import React, { useState } from "react";
import { X, Ruler, Check, ShieldCheck, Armchair, User, Smartphone, Sparkles } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"sofa" | "human" | "objects">("sofa");

  if (!isOpen) return null;

  const sizesData = [
    {
      id: "A5",
      name: "A5 Small Print",
      dimensionsCm: "14.8 × 21 cm",
      dimensionsInches: "5.8 × 8.3 in",
      realComparison: "Slightly bigger than a smartphone (iPhone).",
      bestFor: "Desk stand frames, small shelf corners, or gallery wall photo grids.",
      widthPx: 64,
      heightPx: 91
    },
    {
      id: "A4",
      name: "A4 Standard Poster",
      dimensionsCm: "21 × 29.7 cm",
      dimensionsInches: "8.3 × 11.7 in",
      realComparison: "Same size as standard printer paper or a notebook.",
      bestFor: "Most popular! Perfect for bedroom walls, study desks, & college rooms.",
      widthPx: 91,
      heightPx: 128
    },
    {
      id: "A3",
      name: "A3 Large Poster",
      dimensionsCm: "29.7 × 42 cm",
      dimensionsInches: "11.7 × 16.5 in",
      realComparison: "Double the size of A4 (looks like a true cinema poster).",
      bestFor: "Statement wall art! Perfect for living room walls & main studio displays.",
      widthPx: 128,
      heightPx: 181
    }
  ];

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
          <span style={{ fontSize: "0.75rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <Ruler size={14} /> Poster Size & Real-Life Scale Guide
          </span>
          <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            How Big Is Each Poster?
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.4rem", maxWidth: "52ch", marginLeft: "auto", marginRight: "auto" }}>
            Compare sizes in real-life rooms, next to a person, or against everyday objects to pick the perfect size for your wall.
          </p>
        </div>

        {/* REAL-LIFE SCALE CONTEXT SWITCHER TABS */}
        <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          {[
            { id: "sofa", label: "Above Living Room Sofa", icon: Armchair },
            { id: "human", label: "Next to Person (170cm)", icon: User },
            { id: "objects", label: "Everyday Objects (Phone / Notebook)", icon: Smartphone }
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
                  padding: "0.65rem 1.25rem",
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

        {/* VISUAL REAL-LIFE GRAPHIC DISPLAY */}
        <div
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "24px",
            padding: "2.5rem 1.5rem 1rem 1.5rem",
            position: "relative",
            marginBottom: "2rem",
            border: "1px solid rgba(17,17,17,0.12)",
            boxShadow: "inset 0 0 20px rgba(0,0,0,0.03)"
          }}
        >
          {/* TAB 1: SOFA SCALE GRAPHIC */}
          {activeTab === "sofa" && (
            <div>
              {/* Poster Hanging Wall Row */}
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "210px", paddingBottom: "15px" }}>
                {sizesData.map((item) => {
                  const isSelected = selectedSize === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectSize && onSelectSize(item.id as any)}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: onSelectSize ? "pointer" : "default" }}
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: "800", color: isSelected ? "#111111" : "#666666", marginBottom: "6px" }}>
                        {item.id}
                      </span>
                      <div
                        style={{
                          width: `${item.widthPx}px`,
                          height: `${item.heightPx}px`,
                          backgroundColor: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.75)",
                          border: isSelected ? "2.5px solid #111111" : "1.5px dashed rgba(17,17,17,0.35)",
                          borderRadius: "4px",
                          boxShadow: isSelected ? "0 14px 30px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.05)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative",
                          transition: "var(--transition-smooth)"
                        }}
                      >
                        <div style={{ border: "1px solid rgba(0,0,0,0.08)", width: "90%", height: "90%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: "800" }}>{item.dimensionsCm}</span>
                          <span style={{ fontSize: "0.55rem", color: "#666666" }}>{item.dimensionsInches}</span>
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

              {/* Modern Sofa Vector Illustration */}
              <div style={{ borderTop: "2px solid rgba(17,17,17,0.15)", paddingTop: "1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ width: "80%", maxWidth: "480px", height: "55px", backgroundColor: "#2C2C2A", borderRadius: "16px 16px 8px 8px", position: "relative", boxShadow: "0 6px 15px rgba(0,0,0,0.15)", display: "flex", justifyContent: "space-between", padding: "8px 16px", boxSizing: "border-box" }}>
                  <div style={{ width: "30%", height: "100%", backgroundColor: "#3A3A38", borderRadius: "8px" }} />
                  <div style={{ width: "30%", height: "100%", backgroundColor: "#3A3A38", borderRadius: "8px" }} />
                  <div style={{ width: "30%", height: "100%", backgroundColor: "#3A3A38", borderRadius: "8px" }} />
                </div>
                <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#666666", marginTop: "8px" }}>
                  🛋️ Standard 2-Seater Living Room Sofa (150 cm wide)
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: HUMAN SCALE GRAPHIC */}
          {activeTab === "human" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "230px", paddingBottom: "10px" }}>
                {/* Person Silhouette Illustration */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#2C2C2A", marginBottom: "4px" }} />
                  <div style={{ width: "44px", height: "120px", backgroundColor: "#2C2C2A", borderRadius: "16px 16px 4px 4px" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#111111", marginTop: "8px" }}>
                    👤 Person (170 cm / 5'7")
                  </span>
                </div>

                {/* Posters next to Person */}
                {sizesData.map((item) => {
                  const isSelected = selectedSize === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectSize && onSelectSize(item.id as any)}
                      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: onSelectSize ? "pointer" : "default" }}
                    >
                      <span style={{ fontSize: "0.75rem", fontWeight: "800", color: isSelected ? "#111111" : "#666666", marginBottom: "6px" }}>
                        {item.id}
                      </span>
                      <div
                        style={{
                          width: `${item.widthPx}px`,
                          height: `${item.heightPx}px`,
                          backgroundColor: isSelected ? "#FFFFFF" : "rgba(255,255,255,0.75)",
                          border: isSelected ? "2.5px solid #111111" : "1.5px dashed rgba(17,17,17,0.35)",
                          borderRadius: "4px",
                          boxShadow: isSelected ? "0 14px 30px rgba(0,0,0,0.2)" : "0 4px 10px rgba(0,0,0,0.05)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          position: "relative"
                        }}
                      >
                        <div style={{ border: "1px solid rgba(0,0,0,0.08)", width: "90%", height: "90%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: "800" }}>{item.dimensionsCm}</span>
                          <span style={{ fontSize: "0.55rem", color: "#666666" }}>{item.dimensionsInches}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ borderTop: "2px solid rgba(17,17,17,0.15)", paddingTop: "8px", textAlign: "center" }}>
                <span style={{ fontSize: "0.75rem", color: "#666666" }}>Floor Baseline</span>
              </div>
            </div>
          )}

          {/* TAB 3: EVERYDAY OBJECTS GRAPHIC */}
          {activeTab === "objects" && (
            <div style={{ padding: "1rem 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.1)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📱</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>A5 vs Smartphone</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
                    A5 (14.8 × 21 cm) is about 1.5x height of an iPhone. Great for small table frames & desks.
                  </p>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1.5px solid #111111", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>📖</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>A4 vs Notebook</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
                    A4 (21 × 29.7 cm) is the EXACT size of a standard printer sheet or school notebook.
                  </p>
                </div>

                <div style={{ backgroundColor: "#FFFFFF", padding: "1.25rem", borderRadius: "16px", border: "1px solid rgba(17,17,17,0.1)", textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>🖼️</div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800" }}>A3 vs Double A4</h4>
                  <p style={{ fontSize: "0.8rem", color: "#666666", marginTop: "4px" }}>
                    A3 (29.7 × 42 cm) is TWICE the size of A4. The classic room poster size!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* DETAILED SIZE CARDS FOR EASY SELECTION */}
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
                  border: isSelected ? "2.5px solid #111111" : "1px solid rgba(17,17,17,0.12)",
                  cursor: onSelectSize ? "pointer" : "default",
                  boxShadow: isSelected ? "0 10px 25px rgba(0,0,0,0.08)" : "none",
                  transition: "var(--transition-fast)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "800" }}>{item.name}</h4>
                  {isSelected && <span style={{ fontSize: "0.65rem", fontWeight: "700", backgroundColor: "#111111", color: "#FFFFFF", padding: "0.2rem 0.5rem", borderRadius: "100px" }}>Selected</span>}
                </div>
                <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111111" }}>
                  {item.dimensionsCm} <span style={{ color: "#666666", fontWeight: "400" }}>({item.dimensionsInches})</span>
                </p>
                <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#2563EB", marginTop: "0.4rem" }}>
                  💡 {item.realComparison}
                </p>
                <p style={{ fontSize: "0.78rem", color: "#666666", marginTop: "0.4rem", lineHeight: "1.4" }}>
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
              onClick={onClose}
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
              Done & Select Size
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
export default SizeGuideModal;
