'use client';

import React from "react";
import { motion } from "framer-motion";
import { Award, Sparkles, Box, ShieldCheck } from "lucide-react";

export default function CraftsmanshipSection() {
  const specs = [
    {
      icon: Award,
      title: "300 GSM Premium Matte",
      desc: "Heavy-weight 300 GSM paper delivering crisp typographic contrast and deep pigment gradients."
    },
    {
      icon: Sparkles,
      title: "Sleeve & Backing Board",
      desc: "Encased in a protective moisture sleeve and bound with a rigid backing board for zero bends."
    },
    {
      icon: Box,
      title: "Durable Kraft Envelope",
      desc: "Shipped in a heavy-duty Kraft envelope built for transit protection and unboxing feel."
    },
    {
      icon: ShieldCheck,
      title: "Quality Checked Dispatch",
      desc: "Inspected before dispatch. Fully tracked express shipping with instant WhatsApp updates."
    }
  ];

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
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Craftsmanship Specs
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            Why Polacraft?
          </h2>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="craftsmanship-grid">
          {specs.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  borderRadius: "24px",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                {/* Icon Pop Animation (Scale 0.8 -> 1, 350ms) */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.1 + 0.2 }}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    backgroundColor: "#EFECE6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#111111"
                  }}
                >
                  <IconComp size={24} />
                </motion.div>

                <h3 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#111111" }}>{item.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "#666666", lineHeight: "1.6" }}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .craftsmanship-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .craftsmanship-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
