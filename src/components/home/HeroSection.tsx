'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
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
  isLoading
}: HeroSectionProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  const fanRotations = [-15, -8, -2, 6, 12, 18];
  const fanYPositions = [40, 15, 0, 10, 30, 50];
  const fanXPositions = [-160, -80, 0, 80, 160, 240];

  return (
    <section
      style={{
        minHeight: "92vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        paddingTop: "60px",
        paddingBottom: "80px",
        backgroundColor: "#0A0A0C",
        backgroundImage: "radial-gradient(circle at 50% 25%, rgba(212, 175, 55, 0.12) 0%, rgba(10, 10, 12, 0) 65%)",
        overflow: "hidden"
      }}
    >
      {/* Background Soft Noise Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          pointerEvents: "none",
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")"
        }}
      />

      <div className="container" style={{ width: "100%", display: "flex", justifyContent: "center", position: "relative", zIndex: 10 }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            width: "100%",
            maxWidth: "1280px",
            backgroundColor: "rgba(255, 255, 255, 0.02)",
            backdropFilter: "blur(30px)",
            WebkitBackdropFilter: "blur(30px)",
            borderRadius: "36px",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 30px 90px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.1)",
            padding: "4rem 2rem 5rem 2rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            position: "relative"
          }}
        >
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              fontSize: "0.75rem",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#D4AF37",
              marginBottom: "1.25rem",
              backgroundColor: "rgba(212, 175, 55, 0.1)",
              border: "1px solid rgba(212, 175, 55, 0.25)",
              padding: "0.4rem 1.2rem",
              borderRadius: "100px",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem"
            }}
          >
            <Sparkles size={14} /> Premium Malayalam Cinema Collectibles
          </motion.span>

          {/* Headline (Opacity 0->1, TranslateY 40px->0, 900ms) */}
          <motion.h1
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const, delay: 0.2 }}
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)",
              fontWeight: "900",
              letterSpacing: "-0.04em",
              color: "#FAFAFA",
              lineHeight: "1.05",
              maxWidth: "880px",
              marginBottom: "1.25rem",
              textShadow: "0 10px 30px rgba(0,0,0,0.5)"
            }}
          >
            {heroTitle}
          </motion.h1>

          {/* Subtitle (150ms delay) */}
          <motion.p
            initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay: 0.35 }}
            style={{
              fontSize: "clamp(1rem, 2vw, 1.2rem)",
              color: "#A1A1AA",
              lineHeight: "1.7",
              maxWidth: "600px",
              marginBottom: "2.5rem"
            }}
          >
            {heroSubtitle}
          </motion.p>

          {/* CTA Buttons (Scale 0.96->1, Opacity 0->1, 500ms) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
            animate={isLoading ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            style={{ display: "flex", gap: "1rem", marginBottom: "4.5rem", flexWrap: "wrap", justifyContent: "center" }}
          >
            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
              <Link
                href="/shop"
                style={{
                  backgroundColor: "#D4AF37",
                  color: "#0A0A0C",
                  padding: "1rem 2.4rem",
                  borderRadius: "100px",
                  fontSize: "0.92rem",
                  fontWeight: "800",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  boxShadow: "0 10px 30px rgba(212, 175, 55, 0.25)",
                  cursor: "pointer",
                  textDecoration: "none"
                }}
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ duration: 0.25 }}>
              <a
                href="#best-sellers"
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  color: "#FAFAFA",
                  padding: "1rem 2.4rem",
                  borderRadius: "100px",
                  fontSize: "0.92rem",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  cursor: "pointer",
                  backdropFilter: "blur(10px)",
                  textDecoration: "none"
                }}
              >
                Browse Best Sellers
              </a>
            </motion.div>
          </motion.div>

          {/* Floating Poster Showcase with Loop Floating Motion (y: 0 -> -10px -> 0 every 5s easeInOut) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.65 }}
            style={{
              position: "relative",
              width: "100%",
              height: "380px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {/* Ambient Floating Container */}
            <motion.div
              animate={shouldReduceMotion ? {} : { y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "relative", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
            >
              {heroFanCards.map((posterObj, idx) => {
                const baseRotate = fanRotations[idx % fanRotations.length];
                const baseY = fanYPositions[idx % fanYPositions.length];
                const baseX = fanXPositions[idx % fanXPositions.length];

                const isHovered = hoveredCardId === posterObj.id;
                const isAnyHovered = hoveredCardId !== null;

                const rotation = isHovered ? baseRotate * 0.3 : isAnyHovered ? baseRotate * 1.15 : baseRotate;
                const scale = isHovered ? 1.15 : isAnyHovered ? 0.92 : 1.0;
                const zIndex = isHovered ? 50 : 10 + idx;
                const xPos = isHovered ? baseX * 0.8 : isAnyHovered ? baseX * 1.1 : baseX;
                const yPos = isHovered ? baseY - 30 : isAnyHovered ? baseY + 10 : baseY;

                return (
                  <motion.div
                    key={posterObj.id}
                    onMouseEnter={() => setHoveredCardId(posterObj.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    animate={{
                      rotate: rotation,
                      x: xPos,
                      y: yPos,
                      scale: scale,
                      zIndex: zIndex
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 130,
                      damping: 18
                    }}
                    onClick={() => router.push(`/product/${posterObj.slug}`)}
                    style={{
                      position: "absolute",
                      width: "195px",
                      cursor: "pointer",
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: isHovered
                        ? "0 30px 60px rgba(0,0,0,0.8), 0 0 30px rgba(212,175,55,0.3)"
                        : "0 15px 35px rgba(0,0,0,0.5)"
                    }}
                  >
                    <PosterRenderer poster={posterObj} frame="unframed" />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  );
}
