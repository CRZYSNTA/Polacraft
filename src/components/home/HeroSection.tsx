'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Star, Award, CheckCircle2 } from "lucide-react";
import PosterRenderer from "../PosterRenderer";
import { Product } from "@/types";

interface HeroSectionProps {
  heroTitle: string;
  heroSubtitle: string;
  heroFanCards: Product[];
  isLoading: boolean;
}

export default function HeroSection({
  heroTitle,
  heroSubtitle,
  heroFanCards,
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

  const fanRotations = isMobile ? [-12, -4, 4, 12] : [-15, -8, -2, 6, 12, 18];
  const fanYPositions = isMobile ? [20, 5, 5, 20] : [40, 15, 0, 10, 30, 50];
  const fanXPositions = isMobile ? [-65, -22, 22, 65] : [-160, -80, 0, 80, 160, 240];

  const cardsToRender = isMobile ? heroFanCards.slice(0, 4) : heroFanCards.slice(0, 6);

  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingTop: isMobile ? "1.5rem" : "3rem",
        paddingBottom: isMobile ? "2.5rem" : "5rem",
        backgroundColor: "#FAFAFA",
        backgroundImage: "radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.12) 0%, rgba(250, 250, 250, 0) 70%)",
        overflow: "hidden",
      }}
    >
      <div className="container" style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={isLoading ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            width: "100%",
            maxWidth: "1240px",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderRadius: isMobile ? "24px" : "36px",
            border: "1px solid rgba(17, 17, 17, 0.08)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(212, 175, 55, 0.18)",
            padding: isMobile ? "2.25rem 1.25rem 2.5rem 1.25rem" : "3.75rem 2.5rem 4.5rem 2.5rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* 1. Sleek Compact Badge */}
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              fontSize: isMobile ? "0.68rem" : "0.75rem",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#92400E",
              marginBottom: isMobile ? "0.85rem" : "1.25rem",
              backgroundColor: "#FEF3C7",
              border: "1px solid #FDE68A",
              padding: isMobile ? "0.3rem 0.85rem" : "0.4rem 1.2rem",
              borderRadius: "100px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              boxShadow: "0 2px 6px rgba(245, 158, 11, 0.12)",
            }}
          >
            <Sparkles size={13} style={{ color: "#D97706" }} /> Museum-Quality Cinema Collectibles
          </motion.span>

          {/* 2. Emotional Headline */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] as const, delay: 0.18 }}
            style={{
              fontSize: isMobile ? "2.1rem" : "clamp(2.75rem, 5.5vw, 4.5rem)",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              color: "#111111",
              lineHeight: "1.08",
              maxWidth: "860px",
              marginBottom: isMobile ? "0.85rem" : "1.25rem",
            }}
          >
            Relive the Films That Defined Your Life.
          </motion.h1>

          {/* 3. Emotional Subtitle */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] as const, delay: 0.3 }}
            style={{
              fontSize: isMobile ? "0.92rem" : "clamp(1.05rem, 2vw, 1.2rem)",
              color: "#4B5563",
              lineHeight: "1.65",
              maxWidth: "640px",
              marginBottom: isMobile ? "1.75rem" : "2.5rem",
            }}
          >
            Own iconic Malayalam cinema as museum-quality archival wall art. Printed on 300 GSM cotton archival paper with solid teak wood frames.
          </motion.p>

          {/* 4. Action Buttons */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            animate={isLoading ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{
              display: "flex",
              gap: isMobile ? "0.75rem" : "1rem",
              marginBottom: isMobile ? "2rem" : "3.5rem",
              flexWrap: isMobile ? "nowrap" : "wrap",
              justifyContent: "center",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: isMobile ? "50%" : "auto" }}>
              <Link
                href="/shop"
                style={{
                  backgroundColor: "#111111",
                  color: "#FAFAFA",
                  padding: isMobile ? "0.85rem 1rem" : "1rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: isMobile ? "0.85rem" : "0.92rem",
                  fontWeight: "800",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.18)",
                  cursor: "pointer",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                Shop Collections <ArrowRight size={15} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ width: isMobile ? "50%" : "auto" }}>
              <a
                href="#best-sellers"
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#111111",
                  padding: isMobile ? "0.85rem 1rem" : "1rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: isMobile ? "0.85rem" : "0.92rem",
                  fontWeight: "800",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.4rem",
                  border: "1.5px solid #E5E7EB",
                  cursor: "pointer",
                  textDecoration: "none",
                  width: "100%",
                }}
              >
                View Best Sellers
              </a>
            </motion.div>
          </motion.div>

          {/* 5. VISUAL ART SHOWCASE (Right above the fold on mobile!) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            style={{
              position: "relative",
              width: "100%",
              height: isMobile ? "300px" : "380px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: isMobile ? "0.5rem" : "1rem",
            }}
          >
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {cardsToRender.map((posterObj, idx) => {
                const baseRotate = fanRotations[idx % fanRotations.length];
                const baseY = fanYPositions[idx % fanYPositions.length];
                const baseX = fanXPositions[idx % fanXPositions.length];

                const isHovered = hoveredCardId === posterObj.id;
                const isAnyHovered = hoveredCardId !== null;

                const rotation = isHovered ? baseRotate * 0.2 : isAnyHovered ? baseRotate * 1.1 : baseRotate;
                const scale = isHovered ? (isMobile ? 1.1 : 1.15) : isAnyHovered ? 0.94 : 1.0;
                const zIndex = isHovered ? 50 : 10 + idx;
                const xPos = isHovered ? baseX * 0.8 : isAnyHovered ? baseX * 1.1 : baseX;
                const yPos = isHovered ? baseY - 20 : isAnyHovered ? baseY + 5 : baseY;

                return (
                  <motion.div
                    key={posterObj.id}
                    onMouseEnter={() => setHoveredCardId(posterObj.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    onClick={() => setHoveredCardId(hoveredCardId === posterObj.id ? null : posterObj.id)}
                    animate={{
                      rotate: rotation,
                      x: xPos,
                      y: yPos,
                      scale: scale,
                      zIndex: zIndex,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 18,
                    }}
                    style={{
                      position: "absolute",
                      width: isMobile ? "135px" : "190px",
                      height: isMobile ? "190px" : "265px",
                      borderRadius: isMobile ? "12px" : "16px",
                      backgroundColor: posterObj.palette?.bg || "#FAFAF8",
                      boxShadow: isHovered
                        ? "0 25px 50px rgba(0, 0, 0, 0.25), 0 0 0 2px #D4AF37"
                        : "0 12px 35px rgba(0, 0, 0, 0.12)",
                      cursor: "pointer",
                      padding: isMobile ? "7px" : "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      border: "1px solid rgba(0,0,0,0.08)",
                      transformOrigin: "bottom center",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    <div style={{ width: "100%", height: "82%", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                      <PosterRenderer poster={posterObj} size="A5" interactive={false} />
                    </div>

                    <div style={{ height: "16%", display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: isMobile ? "0.62rem" : "0.74rem",
                          fontWeight: "900",
                          color: "#111111",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {posterObj.title}
                      </span>
                      <span style={{ fontSize: isMobile ? "0.55rem" : "0.65rem", color: "#666666" }}>
                        {posterObj.film} ({posterObj.year})
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* 6. TRUST & SOCIAL PROOF RIBBON */}
      <div
        style={{
          width: "100%",
          maxWidth: "1100px",
          marginTop: isMobile ? "1.5rem" : "2.5rem",
          padding: "0 1.25rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: isMobile ? "1rem" : "2.5rem",
          flexWrap: "wrap",
          fontSize: isMobile ? "0.75rem" : "0.85rem",
          fontWeight: "700",
          color: "#475569",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <Star size={15} style={{ color: "#F59E0B", fill: "#F59E0B" }} /> <strong>4.9/5</strong> Rating (1,200+ Collectors)
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <Award size={15} style={{ color: "#D4AF37" }} /> 100% Archival Cotton Paper
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          <ShieldCheck size={15} style={{ color: "#10B981" }} /> Real Teak & Black Wood Frames
        </span>
      </div>
    </section>
  );
}
