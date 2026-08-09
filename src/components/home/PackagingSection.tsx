'use client';

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Box, Layers, Check, ShieldCheck } from "lucide-react";

export default function PackagingSection() {
  const packagingItems = [
    { title: "300 GSM Matte", desc: "Archival fine art print", icon: Sparkles },
    { title: "Protective Sleeve", desc: "Dust & moisture barrier", icon: Box },
    { title: "Rigid Backing", desc: "Zero-bend shield", icon: Layers },
    { title: "Kraft Envelope", desc: "Heavy transit armor", icon: ShieldCheck },
    { title: "Studio Inspected", desc: "Quality verified", icon: Check }
  ];

  return (
    <section className="packaging-section" style={{ padding: "6rem 0", backgroundColor: "#F7F7F4", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="packaging-card-outer"
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "32px",
            border: "1px solid rgba(17, 17, 17, 0.08)",
            padding: "4rem 3rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.03)"
          }}
        >
          {/* HEADER */}
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666" }}>
              Unboxing Experience
            </span>
            <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)", fontWeight: "900", color: "#111111", marginTop: "0.4rem", letterSpacing: "-0.03em" }}>
              What's Inside Your Package?
            </h2>
            <p style={{ color: "#666666", maxWidth: "48ch", margin: "0.5rem auto 0 auto", fontSize: "0.9rem", lineHeight: "1.5" }}>
              Every print is individually inspected, protected in a clear sleeve, secured with a rigid backing board, and sealed inside a durable Kraft envelope.
            </p>
          </div>

          {/* 5-ITEM RESPONSIVE GRID (DESKTOP 5-COL / TABLET 3-COL / MOBILE 2-COL) */}
          <div className="packaging-grid" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem" }}>
            {packagingItems.map((pkg, idx) => {
              const IconComp = pkg.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className="packaging-item-card"
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(17, 17, 17, 0.08)",
                    padding: "1.5rem 1rem",
                    borderRadius: "20px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div style={{ width: "42px", height: "42px", borderRadius: "14px", backgroundColor: "#EFECE6", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.85rem" }}>
                    <IconComp size={20} style={{ color: "#111111" }} />
                  </div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111111", margin: 0 }}>{pkg.title}</h4>
                  <p style={{ fontSize: "0.75rem", color: "#666666", marginTop: "4px", margin: "4px 0 0 0" }}>{pkg.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        @media (max-width: 992px) {
          .packaging-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 1rem !important;
          }
          .packaging-card-outer {
            padding: 3rem 2rem !important;
          }
        }
        @media (max-width: 640px) {
          .packaging-section {
            padding: 3.5rem 0 !important;
          }
          .packaging-card-outer {
            padding: 2.25rem 1.25rem !important;
            border-radius: 24px !important;
          }
          .packaging-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.85rem !important;
          }
          .packaging-item-card {
            padding: 1.15rem 0.75rem !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
