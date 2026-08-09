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
    <section style={{ padding: "6rem 0", backgroundColor: "#F7F7F4", position: "relative" }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <span style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Real Collector Spaces
          </span>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.03em", marginTop: "0.4rem" }}>
            Collector Walls
          </h2>
          <p style={{ color: "#666666", maxWidth: "54ch", margin: "0.5rem auto 0 auto", fontSize: "0.9rem" }}>
            See how film enthusiasts and interior curators style their focal walls, desk setups, and studio corners.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="collector-walls-grid">
          {walls.map((wall, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: idx * 0.15 }}
              whileHover={{ scale: 1.02 }}
              style={{
                position: "relative",
                height: "380px",
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
                border: "1px solid rgba(17,17,17,0.08)",
                cursor: "pointer"
              }}
              className="collector-wall-card"
            >
              <Image src={wall.src} alt={wall.title} fill style={{ objectFit: "cover" }} />
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  inset: "auto 0 0 0",
                  padding: "1.25rem",
                  background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
                  color: "#FFFFFF"
                }}
              >
                <h4 style={{ fontSize: "0.95rem", fontWeight: "800", margin: 0 }}>{wall.title}</h4>
                <p style={{ fontSize: "0.75rem", opacity: 0.85, marginTop: "2px", margin: "2px 0 0 0" }}>{wall.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .collector-walls-grid { 
            grid-template-columns: repeat(2, 1fr) !important; 
            gap: 0.85rem !important;
          }
          .collector-wall-card {
            height: 240px !important;
            border-radius: 16px !important;
          }
        }
      `}</style>
    </section>
  );
}
