'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CollectorWallsSection() {
  const walls = [
    {
      title: "@arjun_menon • Living Room Curation",
      subtitle: "Featured: Manichitrathazhu A3 Print",
      src: "/assets/living_room_mockup.png"
    },
    {
      title: "@ria_thomas • Unboxing Experience",
      subtitle: "300 GSM Premium Matte & Kraft Packaging",
      src: "/assets/unboxing_packaging.png"
    },
    {
      title: "@kiran_kp • Typographic Studio Desk",
      subtitle: "Featured: Aavesham A4 Minimal Print",
      src: "/assets/posters/aavesham-original-polacraft.png"
    }
  ];

  return (
    <section style={{ padding: "8rem 0", backgroundColor: "#F7F7F4", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "4.5rem" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Real Collector Spaces
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            Collector Walls
          </h2>
          <p style={{ color: "#666666", maxWidth: "54ch", margin: "0.5rem auto 0 auto", fontSize: "0.95rem" }}>
            See how film enthusiasts and interior curators style their focal walls, desk setups, and studio corners.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.75rem" }} className="collector-walls-grid">
          {walls.map((wall, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              whileHover={{ scale: 1.03 }}
              style={{
                position: "relative",
                height: "400px",
                borderRadius: "28px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                border: "1px solid rgba(17,17,17,0.08)",
                cursor: "pointer"
              }}
            >
              <Image src={wall.src} alt={wall.title} fill style={{ objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  inset: "auto 0 0 0",
                  padding: "1.75rem",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                  color: "#FFFFFF"
                }}
              >
                <h4 style={{ fontSize: "1.05rem", fontWeight: "800" }}>{wall.title}</h4>
                <p style={{ fontSize: "0.8rem", opacity: 0.85, marginTop: "4px" }}>{wall.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .collector-walls-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
