'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import PosterRenderer from "../PosterRenderer";
import { Product } from "@/types";

interface LimitedEditionsProps {
  posters: Product[];
}

export default function LimitedEditionsSection({ posters }: LimitedEditionsProps) {
  const router = useRouter();
  const limitedPosters = posters.slice(0, 3);

  return (
    <section style={{ padding: "8rem 0", backgroundColor: "#0D0D0F", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#F59E0B", fontWeight: "800", backgroundColor: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.25)", padding: "0.35rem 1rem", borderRadius: "100px" }}>
            🔥 Scarcity Curation
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: "900", color: "#FAFAFA", letterSpacing: "-0.03em", marginTop: "1rem" }}>
            Limited Edition Prints
          </h2>
          <p style={{ color: "#A1A1AA", maxWidth: "52ch", margin: "0.5rem auto 0 auto", fontSize: "0.95rem" }}>
            Numbered collectibles pressed in small batches. Once sold out, the print matrix is permanently archived.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }} className="limited-grid">
          {limitedPosters.map((poster, idx) => {
            const editionTotal = poster.limitedEditionCount || 100;
            const editionSold = Math.max(1, editionTotal - (poster.inventory ?? 25));

            return (
              <motion.div
                key={poster.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => router.push(`/product/${poster.slug}`)}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  borderRadius: "28px",
                  padding: "2rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  position: "relative"
                }}
              >
                <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 10, backgroundColor: "#D97706", color: "#FFFFFF", fontSize: "0.7rem", fontWeight: "800", padding: "0.3rem 0.75rem", borderRadius: "100px" }}>
                  PRINT NO. {editionSold} / {editionTotal}
                </div>

                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <PosterRenderer poster={poster} frame="unframed" />
                </div>

                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#FAFAFA" }}>{poster.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#A1A1AA", marginTop: "4px" }}>{poster.collection}</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#D4AF37" }}>₹{poster.price}</span>
                  <span style={{ fontSize: "0.8rem", color: "#FAFAFA", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: "700" }}>
                    Claim Print <ArrowRight size={14} style={{ color: "#D4AF37" }} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .limited-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
