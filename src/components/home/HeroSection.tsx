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
  // Separate per-view admin-selected poster IDs
  heroSelectedPosterIdsMobile?: string[];
  heroSelectedPosterIdsDesktop?: string[];
  heroSpeedMobile?: number;
  heroSpeedDesktop?: number;
  // Mobile Image Group Circle geometry
  heroCircleInnerRadius?: number;
  heroCircleRingGap?: number;
  isLoading: boolean;
}

export default function HeroSection({
  heroTitle,
  heroSubtitle,
  heroFanCards = [],
  allPosters = [],
  heroSelectedPosterIdsMobile = [],
  heroSelectedPosterIdsDesktop = [],
  heroSpeedMobile = 4.0,
  heroSpeedDesktop = 2.7,
  heroCircleInnerRadius = 25,
  heroCircleRingGap = 95,
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
  const rawPosters = Array.isArray(allPosters) && allPosters.length > 0 ? allPosters : safeCards;

  // Mobile poster list — uses heroSelectedPosterIdsMobile if set, else full catalog
  const mobileCatalogPosters = useMemo(() => {
    if (Array.isArray(heroSelectedPosterIdsMobile) && heroSelectedPosterIdsMobile.length > 0) {
      const selected = rawPosters.filter(
        (p) => heroSelectedPosterIdsMobile.includes(p.id) || heroSelectedPosterIdsMobile.includes(p.slug)
      );
      return selected.length > 0 ? selected : rawPosters;
    }
    return rawPosters;
  }, [rawPosters, heroSelectedPosterIdsMobile]);

  // Desktop poster list — uses heroSelectedPosterIdsDesktop if set, else full catalog
  const desktopCatalogPosters = useMemo(() => {
    if (Array.isArray(heroSelectedPosterIdsDesktop) && heroSelectedPosterIdsDesktop.length > 0) {
      const selected = rawPosters.filter(
        (p) => heroSelectedPosterIdsDesktop.includes(p.id) || heroSelectedPosterIdsDesktop.includes(p.slug)
      );
      return selected.length > 0 ? selected : rawPosters;
    }
    return rawPosters;
  }, [rawPosters, heroSelectedPosterIdsDesktop]);

  // Formatted real cinema posters for mobile Originkit circle animation
  const mobileCircleImages = useMemo(() => {
    const items = mobileCatalogPosters.map((p) => {
      const rawImg = p.heroImage || p.galleryImages?.[0] || (p as any).images?.[0]?.url;
      const validSrc = (rawImg && typeof rawImg === "string" && rawImg.trim() !== "") ? rawImg : "/assets/custom_grid_poster.png";
      return {
        image: { src: validSrc, alt: p.title },
        slug: p.slug,
        focusY: 50
      };
    });
    return { items };
  }, [mobileCatalogPosters]);

  // Formatted real cinema posters for Desktop Originkit 3D RoundCarousel
  const desktopCarouselImages = useMemo(() => {
    return desktopCatalogPosters.map((p) => {
      const rawImg = p.heroImage || p.galleryImages?.[0] || (p as any).images?.[0]?.url;
      const validSrc = (rawImg && typeof rawImg === "string" && rawImg.trim() !== "") ? rawImg : "/assets/custom_grid_poster.png";
      return { src: validSrc };
    });
  }, [desktopCatalogPosters]);

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
      <style jsx>{`
        @media (max-width: 767px) {
          .hero-mobile-blended-banner {
            background-color: rgba(250, 250, 248, 0.96) !important;
            backdrop-filter: blur(24px) saturate(180%) !important;
            -webkit-backdrop-filter: blur(24px) saturate(180%) !important;
            border: 1px solid rgba(17, 17, 17, 0.08) !important;
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08) !important;
            border-radius: 36px !important;
            padding: 2.25rem 1.25rem !important;
          }
          .hero-mobile-badge {
            background-color: rgba(255, 255, 255, 0.92) !important;
            border: 1px solid rgba(17, 17, 17, 0.12) !important;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04) !important;
          }
          .hero-mobile-title {
            color: #0F0F0F !important;
            letter-spacing: 0.03em !important;
          }
          .hero-mobile-subtitle {
            color: #222222 !important;
          }
          .hero-mobile-secondary-btn {
            background-color: #FFFFFF !important;
            border: 1.5px solid rgba(17, 17, 17, 0.18) !important;
          }
        }
      `}</style>

      {/* MOBILE EXCLUSIVE FULL-BACKGROUND ROTATING CIRCULAR CANVASES */}
      {isMobile && (
        <div 
          style={{ 
            position: "absolute", 
            inset: 0, 
            width: "100%", 
            height: "100%", 
            zIndex: 1, 
            opacity: 0.95,
            pointerEvents: "auto"
          }}
        >
          <ImageGroup 
            images={mobileCircleImages}
            count={Math.max(mobileCircleImages.items.length, 12)}
            rings={mobileCircleImages.items.length > 16 ? 3 : 2}
            innerRadius={Math.max(250, heroCircleInnerRadius)}
            ringGap={heroCircleRingGap}
            cardWidth={78}
            cardHeight={102}
            speed={heroSpeedMobile}
            direction="alternate"
            rounded={8}
          />
        </div>
      )}

      {/* HERO CONTENT CARD (SEAMLESSLY BLENDED VIGNETTED RADIAL GLOW BANNER ON MOBILE) */}
      <div 
        className="container" 
        style={{ 
          width: "100%", 
          display: "flex", 
          justifyContent: "center", 
          position: "relative", 
          zIndex: 10,
          padding: isMobile ? "0 0.75rem" : "0 2rem"
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-mobile-blended-banner"
          style={{ 
            textAlign: "center", 
            maxWidth: "740px", 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center",
            pointerEvents: "auto"
          }}
        >
          {/* BADGE */}
          <div
            className="hero-mobile-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#FFFFFF",
              border: "1px solid rgba(17,17,17,0.12)",
              boxShadow: "0 4px 15px rgba(0,0,0,0.03)",
              padding: "0.35rem 0.9rem",
              borderRadius: "100px",
              marginBottom: "1.1rem"
            }}
          >
            <Sparkles size={13} style={{ color: "#D4AF37" }} />
            <span style={{ fontSize: "0.75rem", fontWeight: "800", letterSpacing: "0.1em", textTransform: "uppercase", color: "#111111", fontFamily: "var(--font-movault), 'Movault', var(--font-bebas-neue), 'Bebas Neue', sans-serif" }}>
              MALAYALAM CINEMA • FINE ART PRINTS
            </span>
          </div>

          {/* TITLE */}
          <h1
            className="hero-mobile-title"
            style={{
              fontSize: "clamp(2.5rem, 7.5vw, 4.75rem)",
              fontWeight: "900",
              color: "#111111",
              fontFamily: "var(--font-movault), 'Movault', var(--font-bebas-neue), 'Bebas Neue', sans-serif",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.02,
              textShadow: isMobile ? "0 0 25px rgba(255,255,255,1), 0 0 12px rgba(255,255,255,1), 0 2px 6px rgba(255,255,255,0.95)" : "none"
            }}
          >
            {heroTitle}
          </h1>

          {/* SUBTITLE */}
          <p
            className="hero-mobile-subtitle"
            style={{
              fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
              color: "#111111",
              marginTop: "0.75rem",
              maxWidth: "44ch",
              lineHeight: 1.45,
              fontWeight: "700",
              textShadow: isMobile ? "0 0 20px rgba(255,255,255,1), 0 0 10px rgba(255,255,255,1), 0 1px 4px rgba(255,255,255,0.95)" : "none"
            }}
          >
            {heroSubtitle === "Premium Malayalam Cinema Posters Crafted For Collectors." ? "The films you love. The art you keep." : heroSubtitle}
          </p>

          {/* CTA BUTTONS (REDUCED 15% SIZE + CLEAR PRIMARY/SECONDARY HIERARCHY) */}
          <div style={{ display: "flex", gap: "0.85rem", marginTop: "1.5rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <Link href="/shop" style={{ textDecoration: "none" }}>
              <button
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                  padding: "0.78rem 1.85rem",
                  borderRadius: "100px",
                  fontSize: "0.88rem",
                  fontWeight: "800",
                  border: "none",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                  transition: "transform 0.2s ease"
                }}
              >
                Explore Gallery <ArrowRight size={15} />
              </button>
            </Link>
            <Link href="/custom" style={{ textDecoration: "none" }}>
              <button
                className="hero-mobile-secondary-btn"
                style={{
                  backgroundColor: "#FAFAF8",
                  color: "#111111",
                  padding: "0.78rem 1.65rem",
                  borderRadius: "100px",
                  fontSize: "0.88rem",
                  fontWeight: "700",
                  border: "1.5px solid rgba(17,17,17,0.18)",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
                }}
              >
                Custom Studio
              </button>
            </Link>
          </div>

          {/* STOREFRONT MICRO-CUE */}
          <div style={{ fontSize: "0.74rem", fontWeight: "700", color: "#666666", marginTop: "1rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Shop the Collection • Museum Prints From ₹499
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
            speed={heroSpeedDesktop}
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
