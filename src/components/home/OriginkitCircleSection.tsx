'use client';

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ImageGroupCustomStyle from "../originkit/ui/image-group-circle-custom-style";
import { Product } from "@/types";

interface OriginkitCircleSectionProps {
  posters: Product[];
}

export default function OriginkitCircleSection({ posters = [] }: OriginkitCircleSectionProps) {
  const safePosters = Array.isArray(posters) ? posters : [];

  // Format real catalog posters for the Originkit custom-styled circular deck
  const circleItems = useMemo(() => {
    const items = safePosters.map((p) => {
      const rawImg = p.heroImage || p.galleryImages?.[0] || (p as any).images?.[0]?.url;
      const validSrc = (rawImg && typeof rawImg === "string" && rawImg.trim() !== "") ? rawImg : "/assets/custom_grid_poster.png";
      return {
        image: {
          src: validSrc,
          alt: p.title
        },
        slug: p.slug,
        focusY: 50
      };
    });
    return { items };
  }, [safePosters]);

  if (safePosters.length === 0) return null;

  return (
    <section 
      style={{ 
        padding: "5rem 0 6rem 0", 
        backgroundColor: "#FAFAF8", 
        borderTop: "1px solid rgba(17,17,17,0.06)", 
        borderBottom: "1px solid rgba(17,17,17,0.06)",
        position: "relative",
        overflow: "hidden"
      }}
    >
      <div className="container" style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 10 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", backgroundColor: "#FFFFFF", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: "800", color: "#111111", border: "1px solid rgba(17,17,17,0.08)", marginBottom: "1rem" }}>
          <Sparkles size={14} style={{ color: "#D4AF37" }} /> ARCHIVAL CINEMA ART DECK
        </div>
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
          360° Interactive Poster Vault
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#666666", marginTop: "0.5rem", maxWidth: "54ch", margin: "0.5rem auto 0 auto" }}>
          Spin through our museum-quality 300 GSM Malayalam cinema prints rotating live. Tap any poster to view details.
        </p>
      </div>

      {/* 360 CIRCULAR DECK CANVAS */}
      <div style={{ position: "relative", width: "100%", height: "420px", margin: "0 auto" }}>
        <ImageGroupCustomStyle 
          images={circleItems}
          count={55}
          rings={4}
          innerRadius={90}
          ringGap={130}
          cardWidth={85}
          cardHeight={115}
          speed={6}
          direction="alternate"
          rounded={8}
        />
      </div>

      <div style={{ textAlign: "center", marginTop: "2.5rem", position: "relative", zIndex: 10 }}>
        <Link href="/shop" style={{ textDecoration: "none" }}>
          <button style={{
            backgroundColor: "#111111",
            color: "#FFFFFF",
            padding: "0.85rem 2.25rem",
            borderRadius: "100px",
            fontSize: "0.92rem",
            fontWeight: "800",
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 8px 25px rgba(0,0,0,0.12)"
          }}>
            Browse All Prints <ArrowRight size={16} />
          </button>
        </Link>
      </div>
    </section>
  );
}
