'use client';

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import PosterRenderer from "../PosterRenderer";
import ImageGroup from "../originkit/ui/image-group-circle-custom-style";
import RoundCarousel from "../originkit/ui/roundcarousel";
import { Product } from "@/types";

interface HeroSectionProps {
  heroTitle: string;
  heroSubtitle: string;
  heroFanCards: Product[];
  allPosters?: Product[];
  isLoading: boolean;
}

export default function HeroSection({
  heroTitle,
  heroSubtitle,
  heroFanCards = [],
  allPosters = [],
  isLoading,
}: HeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const safeCards = Array.isArray(heroFanCards) ? heroFanCards : [];
  const catalogPosters = Array.isArray(allPosters) && allPosters.length > 0 ? allPosters : safeCards;

  // Formatted real cinema posters for mobile Originkit circle animation
  const mobileCircleImages = useMemo(() => {
    const items = catalogPosters.map((p) => {
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
  }, [catalogPosters]);

  // Formatted real cinema posters for Desktop Originkit 3D RoundCarousel
  const desktopCarouselImages = useMemo(() => {
    return catalogPosters.map((p) => {
      const rawImg = p.heroImage || p.galleryImages?.[0] || (p as any).images?.[0]?.url;
      const validSrc = (rawImg && typeof rawImg === "string" && rawImg.trim() !== "") ? rawImg : "/assets/custom_grid_poster.png";
      return { src: validSrc };
    });
  }, [catalogPosters]);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        minHeight: isMobile ? "85vh" : "auto",
        paddingTop: isMobile ? "2rem" : "3.5rem",
        paddingBottom: isMobile ? "3rem" : "4.5rem",
        backgroundColor: "#FAFAFA",
        backgroundImage: "radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.12) 0%, rgba(250, 250, 250, 0) 70%)",
        overflow: "hidden",
      }}
    >
      {/* MOBILE EXCLUSIVE FULL-BACKGROUND ROTATING CIRCULAR CANVASES */}
      {isMobile && (
        <div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            width: "100%", 
            height: "100%", 
            zIndex: 1, 
            opacity: 0.98,
            pointerEvents: "auto"
          }}
        >
          <ImageGroup 
            images={mobileCircleImages}
            count={56}
            rings={4}
            innerRadius={25}
            ringGap={95}
            cardWidth={78}
            cardHeight={102}
            speed={4}
            direction="alternate"
            rounded={8}
          />
        </div>
      )}

      {/* HERO CONTENT CARD (SEAMLESSLY BLENDED SOFT RADIAL GLOW BANNER ON MOBILE) */}
      <div 
        className="container" 
        style={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "center", 
          position: "relative", 
          zIndex: 10,
          padding: isMobile ? "0 1rem" : "0 2rem"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ 
            textAlign: "center", 
            maxWidth: "800px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            backgroundColor: isMobile ? "transparent" : "transparent",
            backgroundImage: isMobile ? "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.45) 55%, rgba(255, 255, 255, 0) 82%)" : "none",
            backdropFilter: isMobile ? "blur(3px)" : "none",
            WebkitBackdropFilter: isMobile ? "blur(3px)" : "none",
            padding: isMobile ? "2.25rem 1.25rem" : "0",
            borderRadius: isMobile ? "36px" : "0",
            border: isMobile ? "1px solid rgba(255, 255, 255, 0.3)" : "none",
            boxShadow: "none",
            pointerEvents: "auto"
          }}
        >
          {/* BADGE */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: isMobile ? "rgba(255, 255, 255, 0.65)" : "#FFFFFF",
              backdropFilter: isMobile ? "blur(4px)" : "none",
              WebkitBackdropFilter: isMobile ? "blur(4px)" : "none",
              border: "1px solid rgba(17,17,17,0.12)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              padding: "0.4rem 1rem",
              borderRadius: "100px",
              marginBottom: "1.25rem"
            }}
          >
            <Sparkles size={14} style={{ color: "#D4AF37" }} />
            <span style={{ fontSize: "0.78rem", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#111111" }}>
              FINE ART MALAYALAM CINEMA PRINT STUDIO
            </span>
          </div>

          {/* TITLE */}
          <h1
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 4rem)",
              fontWeight: "900",
              color: "#111111",
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.1,
              textShadow: isMobile ? "0 2px 16px rgba(255,255,255,1), 0 1px 4px rgba(255,255,255,0.9)" : "none"
            }}
          >
            {heroTitle}
          </h1>

          {/* SUBTITLE */}
          <p
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              color: "#111111",
              marginTop: "0.85rem",
              maxWidth: "52ch",
              lineHeight: 1.5,
              fontWeight: "800",
              textShadow: isMobile ? "0 2px 12px rgba(255,255,255,1), 0 1px 3px rgba(255,255,255,0.9)" : "none"
            }}
          >
            {heroSubtitle}
          </p>

          {/* CTA BUTTONS */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1.75rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                  padding: "0.9rem 2.25rem",
                  borderRadius: "100px",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  boxShadow: "0 8px 25px rgba(0,0,0,0.22)",
                  transition: "transform 0.2s ease"
                }}
              >
                Explore Gallery <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/custom" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: isMobile ? "rgba(255, 255, 255, 0.75)" : "#FFFFFF",
                  backdropFilter: isMobile ? "blur(4px)" : "none",
                  WebkitBackdropFilter: isMobile ? "blur(4px)" : "none",
                  color: "#111111",
                  padding: "0.9rem 2rem",
                  borderRadius: "100px",
                  fontSize: "0.95rem",
                  fontWeight: "800",
                  border: "1.5px solid rgba(17,17,17,0.2)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.06)"
                }}
              >
                Custom Studio
              </button>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* DESKTOP EXCLUSIVE: ORIGINKIT 3D ROUND CAROUSEL */}
      {!isMobile && (
        <div style={{ position: "relative", width: "100%", height: "420px", marginTop: "2.5rem" }}>
          <RoundCarousel 
            images={desktopCarouselImages}
            imageWidth={210}
            imageHeight={290}
            spacing={4}
            speed={4.5}
            direction="right"
            drag={true}
            sensitivity={4}
            tilt={-6}
            perspective={2200}
            cornerRadius={16}
            background="transparent"
          />
        </div>
      )}
    </section>
  );
}
