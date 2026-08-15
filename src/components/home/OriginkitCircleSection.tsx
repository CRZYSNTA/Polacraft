'use client';

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import ImageGroupCustomStyle from "../originkit/ui/image-group-circle-custom-style";
import { Product } from "@/types";
import { getCloudinaryResponsiveUrl } from "@/lib/cloudinary-client";

interface OriginkitCircleSectionProps {
  posters: Product[];
}

export default function OriginkitCircleSection({ posters = [] }: OriginkitCircleSectionProps) {
  // Format real catalog posters for the Originkit custom-styled circular deck
  const circleItems = useMemo(() => {
    const safePosters = Array.isArray(posters) ? posters : [];
    const items = safePosters.map((p) => {
      const rawImg = p.heroImage || p.galleryImages?.[0] || (p as any).images?.[0]?.url;
      const validSrc = (rawImg && typeof rawImg === "string" && rawImg.trim() !== "") ? rawImg : "/assets/custom_grid_poster.png";
      const optimizedSrc = getCloudinaryResponsiveUrl(validSrc, { width: 300, quality: "auto" });
      return {
        image: {
          src: optimizedSrc,
          alt: p.title
        },
        slug: p.slug,
        focusY: 50
      };
    });
    return { items };
  }, [posters]);

  if (!Array.isArray(posters) || posters.length === 0) return null;

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
        <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", fontWeight: "900", color: "#111111", margin: 0, letterSpacing: "-0.02em" }}>
          360° Interactive Poster Vault
        </h2>
        <p style={{ fontSize: "0.95rem", color: "#666666", marginTop: "0.5rem", maxWidth: "54ch", margin: "0.5rem auto 0 auto" }}>
          Spin through our museum-quality 300 GSM cinema prints rotating live. Tap any poster to view details.
        </p>
      </div>

      {/* 360 CIRCULAR DECK CANVAS */}
      <div style={{ position: "relative", width: "100%", height: "500px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto", overflow: "hidden" }}>
        <ImageGroupCustomStyle 
          images={circleItems}
          count={16}
          rings={2}
          innerRadius={75}
          ringGap={90}
          cardWidth={76}
          cardHeight={102}
          speed={3.5}
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
