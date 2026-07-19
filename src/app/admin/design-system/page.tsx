'use client';

import React, { useState } from "react";
import { Sparkles, Heart, ShoppingBag, Eye, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DesignSystem() {
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);

  const colors = [
    { name: "Turmeric Yellow", hex: "#E6C15C", cssVar: "--color-beige-accent" },
    { name: "Saffron Red", hex: "#802720", cssVar: "--color-charcoal-accent" },
    { name: "Warm Off-White", hex: "#FAFAF8", cssVar: "--bg-warm" },
    { name: "Muted Charcoal", hex: "#1A1A1A", cssVar: "--accent-charcoal" },
    { name: "Forest Green", hex: "#4B7A47", cssVar: "custom-green" },
    { name: "Lagoon Cyan", hex: "#47D5C6", cssVar: "custom-cyan" }
  ];

  const animations = [
    {
      id: "fadeIn",
      label: "Fade In",
      variants: { initial: { opacity: 0 }, animate: { opacity: 1 } }
    },
    {
      id: "fadeUp",
      label: "Fade Up",
      variants: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } }
    },
    {
      id: "scaleIn",
      label: "Scale In",
      variants: { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 } }
    },
    {
      id: "heroReveal",
      label: "Hero Reveal",
      variants: { initial: { clipPath: "inset(100% 0% 0% 0%)" }, animate: { clipPath: "inset(0% 0% 0% 0%)" } }
    }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4rem", paddingBottom: "100px" }}>
      
      {/* Header */}
      <div>
        <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
          Polacraft Brand Core
        </span>
        <h1 style={{ fontSize: "3rem", fontWeight: "800", letterSpacing: "-0.04em", marginTop: "0.25rem" }}>
          Design System & Visual Language
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", marginTop: "0.5rem" }}>
          A documentation pool mapping typography scales, color schemes, framing classes, and animation primitives.
        </p>
      </div>

      {/* 1. TYPOGRAPHY */}
      <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2rem" }}>1. Typography Scales</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Display Serif (Instrument Serif Italic - 3.5rem)
            </span>
            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "3.5rem", fontStyle: "italic", fontWeight: "400", letterSpacing: "-0.03em" }}>
              Malayalam Cinema. Reimagined as Wall Art.
            </h1>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Heading Sans (Inter Bold - 2.25rem)
            </span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
              Fine Art Exhibition Catalog
            </h2>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Plaque Serif (Instrument Serif Regular - 1.25rem)
            </span>
            <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem" }}>
              Fazil's psychological thriller masterpiece Manichitrathazhu redefined split personality.
            </p>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>
              Body Copy (Inter - 0.9rem, line-height 1.7)
            </span>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.7", maxWidth: "60ch" }}>
              Every print is pressed on archival fine art cotton paper using ultra-matte giclée inks. Designed for interior design enthusiasts, film history collectors, and lovers of slab typography.
            </p>
          </div>
        </div>
      </section>

      {/* 2. COLORS */}
      <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2rem" }}>2. Color Palette Swatches</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "1.5rem" }} className="design-colors-grid">
          {colors.map((color, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <div 
                style={{ 
                  height: "100px", 
                  backgroundColor: color.hex, 
                  borderRadius: "12px", 
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "var(--shadow-soft)"
                }} 
              />
              <div>
                <strong style={{ fontSize: "0.9rem", display: "block" }}>{color.name}</strong>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{color.hex}</span>
                <code style={{ fontSize: "0.7rem", display: "block", marginTop: "2px", color: "brown" }}>{color.cssVar}</code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. INTERACTIVE PRESETS */}
      <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2rem" }}>3. Interactive Buttons</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>Primary Button</span>
            <button className="btn-primary" style={{ padding: "0.8rem 2rem", fontSize: "0.85rem", borderRadius: "12px" }}>
              Add to Bag
            </button>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>Secondary Button</span>
            <button className="btn-secondary" style={{ padding: "0.8rem 2rem", fontSize: "0.85rem", borderRadius: "12px" }}>
              View Details
            </button>
          </div>
          <div>
            <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginBottom: "0.5rem" }}>Magnetic Icon Button</span>
            <button 
              className="btn-magnetic" 
              style={{ 
                width: "44px", 
                height: "44px", 
                borderRadius: "50%", 
                backgroundColor: "var(--accent-charcoal)", 
                color: "#FFFFFF", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Heart size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* 4. SOLID WOOD GALLERY FRAMING */}
      <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "2rem" }}>4. Gallery Framing Presets</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2.5rem" }} className="design-frames-grid">
          {[
            { label: "Classic Oak Wood", border: "16px solid #D2B48C", shadow: "0 10px 25px rgba(210,180,140,0.2)" },
            { label: "Sleek Matte Black", border: "16px solid #1C1C1C", shadow: "0 10px 25px rgba(0,0,0,0.15)" },
            { label: "Ornate Gallery Gold", border: "16px solid #D4AF37", shadow: "0 10px 25px rgba(212,175,55,0.2)" },
            { label: "Unframed Fine Art", border: "1px dashed var(--border-color)", shadow: "none" }
          ].map((item, idx) => (
            <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
              <div 
                style={{
                  width: "160px",
                  height: "220px",
                  backgroundColor: "#EFECE6",
                  border: item.border,
                  boxShadow: item.shadow,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px",
                  borderRadius: "2px"
                }}
              >
                <div style={{ width: "100%", height: "100%", backgroundColor: "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: "bold", color: "var(--text-muted)" }}>
                  ART PRINT
                </div>
              </div>
              <strong style={{ fontSize: "0.85rem" }}>{item.label}</strong>
            </div>
          ))}
        </div>
      </section>

      {/* 5. MOTION SYSTEM PLAYGROUND */}
      <section style={{ borderTop: "1px solid var(--border-color)", paddingTop: "2.5rem" }}>
        <h2 style={{ fontSize: "1.75rem", fontWeight: "700", marginBottom: "1rem" }}>5. Motion System Playground</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>
          Click any button below to trigger and test the entry ease-out curve presets.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: "3.5rem" }} className="design-motion-split">
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {animations.map((anim) => (
              <button
                key={anim.id}
                onClick={() => {
                  setActiveAnimation(null);
                  setTimeout(() => setActiveAnimation(anim.id), 50);
                }}
                style={{
                  padding: "0.8rem 1rem",
                  fontSize: "0.85rem",
                  textAlign: "left",
                  borderRadius: "10px",
                  border: "1.5px solid var(--border-color)",
                  backgroundColor: activeAnimation === anim.id ? "var(--text-dark)" : "transparent",
                  color: activeAnimation === anim.id ? "#FFFFFF" : "var(--text-dark)",
                  cursor: "pointer",
                  fontWeight: "600",
                  transition: "var(--transition-fast)"
                }}
              >
                {anim.label}
              </button>
            ))}
          </div>

          <div 
            style={{ 
              backgroundColor: "var(--accent-beige)", 
              height: "260px", 
              borderRadius: "16px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              overflow: "hidden",
              border: "1px solid var(--border-color)"
            }}
          >
            <AnimatePresence mode="wait">
              {activeAnimation && (
                <motion.div
                  key={activeAnimation}
                  initial={animations.find(a => a.id === activeAnimation)?.variants.initial}
                  animate={animations.find(a => a.id === activeAnimation)?.variants.animate}
                  transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                  style={{
                    width: "120px",
                    height: "160px",
                    backgroundColor: "#FAFAF8",
                    boxShadow: "var(--shadow-soft)",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "12px",
                    border: "1px solid var(--border-color)"
                  }}
                >
                  <Sparkles size={16} style={{ color: "var(--color-beige-accent)" }} />
                  <div style={{ width: "100%", height: "4px", backgroundColor: "rgba(0,0,0,0.06)", borderRadius: "2px" }} />
                  <div style={{ width: "80%", height: "4px", backgroundColor: "rgba(0,0,0,0.06)", borderRadius: "2px" }} />
                  <div style={{ width: "50%", height: "4px", backgroundColor: "rgba(0,0,0,0.06)", borderRadius: "2px" }} />
                </motion.div>
              )}
              {!activeAnimation && (
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                  Select an animation on the left to preview.
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .design-colors-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .design-frames-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .design-motion-split { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
        @media (max-width: 500px) {
          .design-colors-grid { grid-template-columns: 1fr 1fr !important; }
          .design-frames-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
