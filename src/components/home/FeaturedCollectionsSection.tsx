'use client';

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FeaturedCollectionsSection() {
  const shouldReduceMotion = useReducedMotion();

  const collections = [
    { title: "Mohanlal Collectibles", count: "12 Posters", href: "/shop?filter=Mohanlal", accent: "#E6C15C", bg: "rgba(66, 38, 22, 0.6)" },
    { title: "Mammootty Classics", count: "10 Posters", href: "/shop?filter=Mammootty", accent: "#D4AF37", bg: "rgba(20, 20, 25, 0.8)" },
    { title: "Fahadh Faasil Series", count: "8 Posters", href: "/shop?filter=Fahadh", accent: "#F87171", bg: "rgba(224, 26, 34, 0.4)" },
    { title: "Cult & Retro Malayalam", count: "15 Posters", href: "/shop?filter=Classic", accent: "#F59E0B", bg: "rgba(230, 193, 92, 0.2)" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    }
  };

  return (
    <section style={{ padding: "7rem 0", backgroundColor: "#0A0A0C", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#D4AF37", fontWeight: "700" }}>
            Curated Collectible Series
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#FAFAFA", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            Featured Collections
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}
          className="collections-grid"
        >
          {collections.map((col, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                href={col.href}
                style={{
                  backgroundColor: col.bg,
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  padding: "2.25rem 1.75rem",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "230px",
                  textDecoration: "none",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.4)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: `radial-gradient(circle, ${col.accent}22 0%, transparent 70%)`, pointerEvents: "none" }} />
                
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", color: col.accent, fontWeight: "800" }}>
                  {col.count}
                </span>

                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "#FAFAFA", lineHeight: "1.2", marginBottom: "0.5rem" }}>
                    {col.title}
                  </h3>
                  <span style={{ fontSize: "0.8rem", color: "#A1A1AA", display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: "600" }}>
                    Explore Series <ArrowRight size={14} style={{ color: col.accent }} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .collections-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .collections-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
