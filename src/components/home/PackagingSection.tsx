'use client';

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Box, ShieldCheck, Check, Layers } from "lucide-react";

export default function PackagingSection() {
  const packagingItems = [
    { title: "300 GSM Premium Matte", desc: "Heavy-weight fine art print", icon: Sparkles },
    { title: "Protective Sleeve", desc: "Dust & moisture barrier", icon: Box },
    { title: "Rigid Backing Board", desc: "Zero-bend structural shield", icon: Layers },
    { title: "Durable Kraft Envelope", desc: "Eco-friendly heavy transit armor", icon: Box },
    { title: "Quality Checked", desc: "Studio inspection verified", icon: Check }
  ];

  return (
    <section style={{ padding: "8rem 0", backgroundColor: "#F7F7F4", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            backgroundColor: "#EFECE6",
            borderRadius: "32px",
            border: "1px solid rgba(17, 17, 17, 0.08)",
            padding: "4rem 3rem",
            boxShadow: "0 20px 60px rgba(0,0,0,0.03)"
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666" }}>
              Unboxing Experience
            </span>
            <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#111111", marginTop: "0.5rem", letterSpacing: "-0.03em" }}>
              What's Inside Your Package?
            </h2>
            <p style={{ color: "#666666", maxWidth: "50ch", margin: "0.5rem auto 0 auto", fontSize: "0.95rem" }}>
              Every print is individually inspected, protected in a clear sleeve, secured with a rigid backing board, and sealed inside a durable Kraft envelope.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.25rem" }} className="packaging-grid">
            {packagingItems.map((pkg, idx) => {
              const IconComp = pkg.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -4, scale: 1.03 }}
                  style={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid rgba(17, 17, 17, 0.08)",
                    padding: "1.5rem 1rem",
                    borderRadius: "20px",
                    textAlign: "center"
                  }}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "14px", backgroundColor: "#EFECE6", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto" }}>
                    <IconComp size={20} style={{ color: "#111111" }} />
                  </div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111111" }}>{pkg.title}</h4>
                  <p style={{ fontSize: "0.78rem", color: "#666666", marginTop: "4px" }}>{pkg.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .packaging-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .packaging-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
