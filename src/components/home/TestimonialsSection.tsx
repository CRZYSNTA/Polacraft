'use client';

import React from "react";
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "The Aavesham print is incredible. The paper texture and 300 GSM weight make it feel like a gallery original.",
      author: "Siddharth K., Bangalore",
      rating: "★★★★★"
    },
    {
      quote: "Thoovanathumbikal print arrived today. The rain aesthetic is breathtaking. Packed safely with rigid backing board.",
      author: "Meera R., Ernakulam",
      rating: "★★★★★"
    },
    {
      quote: "Manichitrathazhu print quality is insanely sharp. 10/10 craftsmanship.",
      author: "Ananthu S., Thiruvananthapuram",
      rating: "★★★★★"
    },
    {
      quote: "Kumbalangi Nights was a gift for my flatmate. Cyan bioluminescent detail is breathtaking. Instant WhatsApp checkout was seamless.",
      author: "Divya N., Mumbai",
      rating: "★★★★★"
    }
  ];

  return (
    <section style={{ padding: "8rem 0", backgroundColor: "#FAFAFA", overflow: "hidden", position: "relative" }}>
      <div className="container" style={{ marginBottom: "3rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ textAlign: "center" }}
        >
          <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", fontWeight: "700" }}>
            Verified Collector Words
          </span>
          <h2 style={{ fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: "900", color: "#111111", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
            What Collectors Say
          </h2>
        </motion.div>
      </div>

      <div className="marquee-container" style={{ display: "flex", overflow: "hidden" }}>
        {[1, 2].map((loopIdx) => (
          <div key={loopIdx} className="marquee-content" style={{ display: "flex", gap: "1.5rem" }}>
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                style={{
                  width: "360px",
                  padding: "2rem",
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid rgba(17, 17, 17, 0.08)",
                  borderRadius: "24px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
                }}
              >
                <span style={{ color: "#D4AF37", fontSize: "0.9rem" }}>{t.rating}</span>
                <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: "#666666", lineHeight: "1.7" }}>
                  "{t.quote}"
                </p>
                <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.08)" }} />
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111111" }}>{t.author}</span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
