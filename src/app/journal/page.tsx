import React from "react";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "The Editorial Journal | Polacraft",
  description: "Read about the color theory, making-of timelines, and typography styling of Polacraft's Malayalam movie posters."
};

export default function JournalPage() {
  const articles = [
    {
      slug: "color-theory-manichitrathazhu",
      title: "Color Theory & Splitting: The Shadows of Madampally Mansion",
      category: "Color Studies",
      date: "July 12, 2026",
      readTime: "6 min read",
      img: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1000",
      excerpt: "Analyzing the turmeric yellow and royal crimson palette used in the Manichitrathazhu artwork, representing Ganga's split-personality descent into folklore."
    },
    {
      slug: "crafting-cyan-kumbalangi",
      title: "Atmosphere & Bioluminescence: Crafting the Lagoon Lights of Kumbalangi",
      category: "Behind The Design",
      date: "June 28, 2026",
      readTime: "5 min read",
      img: "https://images.unsplash.com/photo-1518156677180-95a2893f3e9f?q=80&w=1000",
      excerpt: "A deep dive into representing hope and dread through neon-cyan wavelengths and the symmetric design structure of Shammi's household dynamics."
    },
    {
      slug: "slab-serifs-eda-mone",
      title: "Typographic Shockwaves: The Slab Serif Distresses of 'Eda Mone!'",
      category: "Typography",
      date: "May 19, 2026",
      readTime: "4 min read",
      img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000",
      excerpt: "Explaining the typography spacing and unhinged gold AVI sunglasses alignment that brings Fahadh Faasil's gangster Ranga to graphic posters."
    }
  ];

  return (
    <div style={{ paddingTop: "140px", paddingBottom: "100px" }}>
      <div className="container">
        
        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "6.5rem" }}>
          <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", fontWeight: "600" }}>
            Editorial Archive
          </span>
          <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: "800", letterSpacing: "-0.04em", marginTop: "1rem", lineHeight: "1.1" }}>
            The Journal.
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.2rem", maxWidth: "55ch", margin: "1.5rem auto 0 auto", lineHeight: "1.7" }}>
            Behind-the-scenes timelines, color analyses, making-of videos, and layout examinations detailing how iconic frames transition to paper.
          </p>
        </div>

        {/* ARTICLES GRID */}
        <div style={{ display: "flex", flexDirection: "column", gap: "5rem" }}>
          {articles.map((article, idx) => (
            <article 
              key={article.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.3fr",
                gap: "4rem",
                alignItems: "center"
              }}
              className="journal-row"
            >
              {/* Image Frame */}
              <div 
                style={{
                  position: "relative",
                  width: "100%",
                  height: "360px",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  boxShadow: "var(--shadow-soft)",
                  order: idx % 2 === 0 ? 0 : 1
                }}
                className="hover-lift"
              >
                <Image 
                  src={article.img} 
                  alt={article.title} 
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Contents */}
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.8rem", fontWeight: "600", textTransform: "uppercase", color: "var(--text-muted)" }}>
                  <span>{article.category}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <h2 
                  style={{ 
                    fontSize: "2.15rem", 
                    fontWeight: "800", 
                    letterSpacing: "-0.03em",
                    lineHeight: "1.15" 
                  }}
                >
                  {article.title}
                </h2>
                
                <p style={{ fontSize: "0.95rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
                  {article.excerpt}
                </p>

                <Link 
                  href="#"
                  style={{
                    alignSelf: "flex-start",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    cursor: "pointer",
                    color: "var(--text-dark)",
                    padding: "0.25rem 0"
                  }}
                  className="underline-hover"
                >
                  Read Full Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .journal-row {
            grid-template-columns: 1fr !important;
            gap: 2.5rem !important;
          }
          .journal-row div {
            order: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
