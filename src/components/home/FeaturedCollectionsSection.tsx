'use client';

import React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FeaturedCollectionsSection() {
  const shouldReduceMotion = useReducedMotion();

  const collections = [
    { title: "Mohanlal Collectibles", count: "12 Posters", href: "/shop?filter=Mohanlal", bg: "#422616", text: "#FFFFFF" },
    { title: "Mammootty Classics", count: "10 Posters", href: "/shop?filter=Mammootty", bg: "#111111", text: "#FFFFFF" },
    { title: "Fahadh Faasil Series", count: "8 Posters", href: "/shop?filter=Fahadh", bg: "#E01A22", text: "#FFFFFF" },
    { title: "Cult & Retro Malayalam", count: "15 Posters", href: "/shop?filter=Classic", bg: "#E6C15C", text: "#111111" }
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
    <section style={{ padding: "7rem 0", backgroundColor: "#F7F7F4", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Curated Collectible Series
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
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
                  color: col.text,
                  padding: "2.25rem 1.75rem",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "230px",
                  textDecoration: "none",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.85, fontWeight: "800" }}>
                  {col.count}
                </span>

                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: "800", lineHeight: "1.2", marginBottom: "0.5rem" }}>
                    {col.title}
                  </h3>
                  <span style={{ fontSize: "0.8rem", opacity: 0.85, display: "inline-flex", alignItems: "center", gap: "0.4rem", fontWeight: "600" }}>
                    Explore Series <ArrowRight size={14} />
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
