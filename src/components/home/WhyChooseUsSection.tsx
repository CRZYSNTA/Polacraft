'use client';

import React from "react";
import { Award, ImagePlus, Tag, Star } from "lucide-react";

export default function WhyChooseUsSection() {
  return (
    <section style={{ padding: "4rem 1rem", backgroundColor: "#FFFFFF", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* SECTION HEADER WITH TAPE ACCENTS */}
        <div style={{ marginBottom: "3rem", position: "relative", display: "inline-block" }}>
          <span style={{ position: "absolute", top: "-10px", left: "-15px", width: "35px", height: "10px", backgroundColor: "#FF6B6B", opacity: 0.8, transform: "rotate(-12deg)", display: "inline-block" }} />
          <span style={{ position: "absolute", bottom: "-5px", right: "-15px", width: "35px", height: "10px", backgroundColor: "#FF6B6B", opacity: 0.8, transform: "rotate(8deg)", display: "inline-block" }} />
          <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: "900", letterSpacing: "0.04em", color: "#111111", margin: 0, textTransform: "uppercase" }}>
            WHY CHOOSE US?
          </h2>
        </div>

        {/* 2X2 MOBILE GRID */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "2.5rem 1.5rem", 
            textAlign: "center" 
          }}
        >
          {/* FEATURE 1 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#F9FAFB", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Award size={26} style={{ color: "#111111" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111111", margin: "0 0 0.4rem 0" }}>
              Quality Guaranteed
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#555555", lineHeight: "1.45", margin: 0, maxWidth: "26ch" }}>
              quality is our top priority. Each poster is meticulously crafted using premium materials.
            </p>
          </div>

          {/* FEATURE 2 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#F9FAFB", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <ImagePlus size={26} style={{ color: "#111111" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111111", margin: "0 0 0.4rem 0" }}>
              Custom Creations
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#555555", lineHeight: "1.45", margin: 0, maxWidth: "26ch" }}>
              Upload your own images or designs and create personalized posters that reflect your personality.
            </p>
          </div>

          {/* FEATURE 3 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#F9FAFB", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Tag size={26} style={{ color: "#111111" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111111", margin: "0 0 0.4rem 0" }}>
              Exclusive Offers
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#555555", lineHeight: "1.45", margin: 0, maxWidth: "26ch" }}>
              we're constantly rolling out exciting offers to help you save big on your favorite designs.
            </p>
          </div>

          {/* FEATURE 4 */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "#F9FAFB", border: "1.5px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
              <Star size={26} style={{ color: "#111111" }} />
            </div>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111111", margin: "0 0 0.4rem 0" }}>
              Free Shipping
            </h3>
            <p style={{ fontSize: "0.82rem", color: "#555555", lineHeight: "1.45", margin: 0, maxWidth: "26ch" }}>
              Enjoy free delivery on prepaid orders—no shipping fees mean more savings and convenience for you!
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
