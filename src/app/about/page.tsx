import React from "react";
import Image from "next/image";

export const metadata = {
  title: "Our Story & Craftsmanship Philosophy | Polacraft",
  description: "Polacraft transforms iconic Malayalam film milestones into premium archival wall posters. Learn about our paper specs and framing."
};

export default function AboutPage() {
  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container">
        
        {/* HERO HEADER */}
        <div style={{ textAlign: "center", marginBottom: "6rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", fontWeight: "600" }}>
            Our Philosophy
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "800", letterSpacing: "-0.04em", marginTop: "1rem", lineHeight: "1.1" }}>
            Reimagining the Classics.
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "55ch", margin: "1.5rem auto 0 auto", lineHeight: "1.7" }}>
            Polacraft is a creative studio bridging fine art and Kerala’s film culture, producing museum-grade prints that last a lifetime.
          </p>
        </div>

        {/* CORE STORY BLOCK */}
        <section 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1.2fr", 
            gap: "5rem", 
            alignItems: "center", 
            marginBottom: "8rem" 
          }}
          className="about-split"
        >
          <div style={{ position: "relative", width: "100%", height: "480px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <Image 
              src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000" 
              alt="Handcrafting illustration layouts" 
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              How We Began
            </span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
              Born from late nights and old movie dialogue scripts.
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              Polacraft was founded by a designer who felt that Malayalam cinema’s profound visual and emotional library was underrepresented on contemporary walls. While Hollywood and European classics have celebrated minimal posters worldwide, our legendary films were often left to cheap, commercial paper prints.
            </p>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              We started by sketching simple geometry around iconic characters: Aadu Thoma’s sunglasses, Clara’s dragonfly, Sethumadhavan’s broken crown. From those first vector lines, Polacraft has expanded into a studio distributing high-fidelity prints to film lovers and gallery curators across India.
            </p>
          </div>
        </section>

        {/* PRODUCTION SPECS */}
        <section 
          style={{ 
            backgroundColor: "var(--accent-beige)", 
            padding: "6rem 4rem", 
            borderRadius: "var(--radius-md)", 
            marginBottom: "8rem" 
          }}
          className="about-technical-box"
        >
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>
              The Production Standard
            </span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "800", letterSpacing: "-0.03em", marginTop: "0.5rem" }}>
              Zero compromise on physical craftsmanship.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "3rem" }} className="about-specs-grid">
            {[
              {
                title: "1. Archival Ink & Printing",
                desc: "We print using professional-grade, high-density pigment-based giclée inks on twelve-color plotters. This achieves gradients and micro-contrasts that standard commercial offset printing cannot duplicate."
              },
              {
                title: "2. Cotton Fiber Paper",
                desc: "All posters are pressed on heavy-weight 250 GSM textured cotton fiber paper. Unlike normal poster papers, this acid-free base preserves color saturation and prevents yellowing or fading for over 80 years."
              },
              {
                title: "3. Sustainable Framing",
                desc: "Our frames are handcrafted locally from sustainably harvested oak and high-density pinewood. Each frame features high-clarity plexiglass backing to safeguard the paper under diverse climate conditions."
              }
            ].map((spec, idx) => (
              <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>{spec.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.6" }}>{spec.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PACKAGING DETAIL */}
        <section 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "1.2fr 1fr", 
            gap: "5rem", 
            alignItems: "center" 
          }}
          className="about-split"
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <span style={{ fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Safety & Packaging
            </span>
            <h2 style={{ fontSize: "2.25rem", fontWeight: "800", letterSpacing: "-0.03em" }}>
              Rigid transit safeguards to protect your curation.
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              We understand the anxiety of ordering art online. A bent corner ruins the entire piece. That is why we pack all unframed prints inside custom, highly rigid 3.5mm thick cardboard tubes.
            </p>
            <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
              Each print is wrapped in acid-free glassine tissue paper to protect it from moisture and friction during transport, then sealed with heavy-duty caps. We use no plastic wrapping, ensuring all shipping containers are fully recyclable.
            </p>
          </div>
          <div style={{ position: "relative", width: "100%", height: "400px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
            <Image 
              src="/assets/unboxing_packaging.png" 
              alt="Art shipping tubes" 
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </section>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .about-split {
            grid-template-columns: 1fr !important;
            gap: 3rem !important;
          }
          .about-split div:first-child {
            order: 2 !important;
          }
          .about-split div:last-child {
            order: 1 !important;
          }
          .about-technical-box {
            padding: 4rem 2rem !important;
          }
          .about-specs-grid {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
        }
      `}</style>
    </div>
  );
}
