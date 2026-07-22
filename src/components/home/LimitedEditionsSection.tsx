'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import PosterRenderer from "../PosterRenderer";
import { Product } from "@/types";

interface LimitedEditionsProps {
  posters: Product[];
}

export default function LimitedEditionsSection({ posters }: LimitedEditionsProps) {
  const router = useRouter();
  const limitedPosters = posters.slice(0, 3);

  return (
    <section style={{ padding: "8rem 0", backgroundColor: "#FAFAFA", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#D97706", fontWeight: "800", backgroundColor: "#FEF3C7", border: "1px solid #FDE68A", padding: "0.35rem 1rem", borderRadius: "100px" }}>
            🔥 Scarcity Curation
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.03em", marginTop: "1rem" }}>
            Limited Edition Prints
          </h2>
          <p style={{ color: "#666666", maxWidth: "52ch", margin: "0.5rem auto 0 auto", fontSize: "0.95rem" }}>
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
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(17, 17, 17, 0.1)",
                  borderRadius: "28px",
                  padding: "2rem",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  position: "relative",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.04)"
                }}
              >
                <div style={{ position: "absolute", top: "1.25rem", right: "1.25rem", zIndex: 10, backgroundColor: "#D97706", color: "#FFFFFF", fontSize: "0.7rem", fontWeight: "800", padding: "0.3rem 0.75rem", borderRadius: "100px" }}>
                  PRINT NO. {editionSold} / {editionTotal}
                </div>

                <div style={{ borderRadius: "16px", overflow: "hidden" }}>
                  <PosterRenderer poster={poster} frame="unframed" />
                </div>

                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#111111" }}>{poster.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "#666666", marginTop: "4px" }}>{poster.collection}</p>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(17,17,17,0.08)", paddingTop: "1rem" }}>
                  <span style={{ fontSize: "1.2rem", fontWeight: "900", color: "#111111" }}>₹{poster.price}</span>
                  <span style={{ fontSize: "0.8rem", color: "#111111", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontWeight: "700" }}>
                    Claim Print <ArrowRight size={14} />
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
