'use client';

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function NewsletterSection() {
  return (
    <section style={{ padding: "9rem 0", backgroundColor: "#FAFAFA", position: "relative" }}>
      <div className="container" style={{ position: "relative", zIndex: 5 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
          style={{
            maxWidth: "850px",
            margin: "0 auto",
            backgroundColor: "#EFECE6",
            borderRadius: "36px",
            border: "1px solid rgba(17, 17, 17, 0.08)",
            padding: "5rem 3rem",
            textAlign: "center",
            boxShadow: "0 25px 70px rgba(0,0,0,0.04)"
          }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Join the Society
          </span>
          <h2 style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.04em", lineHeight: "1.1", marginTop: "0.5rem" }}>
            Subscribe to the Polacraft Club.
          </h2>
          <p style={{ color: "#666666", fontSize: "1.05rem", maxWidth: "48ch", margin: "1rem auto 2.5rem auto", lineHeight: "1.7" }}>
            Get early access to limited edition drops, behind-the-scenes design breakdowns, and exclusive collector rewards.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for joining the Polacraft Society!");
              (e.target as HTMLFormElement).reset();
            }}
            style={{
              display: "flex",
              gap: "0.75rem",
              maxWidth: "480px",
              width: "100%",
              margin: "0 auto"
            }}
          >
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              required
              style={{
                flexGrow: 1,
                padding: "1rem 1.5rem",
                borderRadius: "100px",
                border: "1.5px solid rgba(17, 17, 17, 0.15)",
                backgroundColor: "#FFFFFF",
                color: "#111111",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              style={{
                padding: "1rem 2.2rem",
                borderRadius: "100px",
                backgroundColor: "#111111",
                color: "#FFFFFF",
                fontWeight: "800",
                fontSize: "0.85rem",
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem"
              }}
            >
              Join <ArrowRight size={16} />
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
