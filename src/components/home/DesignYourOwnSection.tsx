'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function DesignYourOwnSection() {
  const customItems = [
    {
      title: "POSTER",
      subtitle: "Custom",
      image: "/assets/custom_single.jpg",
      text: "UPLOAD YOUR IMAGE HERE",
      link: "/custom"
    },
    {
      title: "SPLIT POSTER",
      subtitle: "Custom",
      image: "/assets/custom_split_3.jpg",
      text: "UPLOAD YOUR IMAGE HERE",
      link: "/custom"
    },
    {
      title: "SPLIT POSTER",
      subtitle: "Custom",
      badge: "2X2",
      image: "/assets/custom_split_2x2.jpg",
      text: "UPLOAD YOUR IMAGE HERE 2X2",
      link: "/custom"
    },
    {
      title: "RETRO PRINTS",
      subtitle: "Custom",
      image: "/assets/custom_single.jpg",
      text: "POLAROID MEMORIES",
      link: "/custom"
    },
    {
      title: "MINI POCKET PHOTO",
      subtitle: "Custom",
      image: "/assets/custom_single.jpg",
      text: "PHONE CASE PHOTO",
      link: "/custom"
    },
    {
      title: "PHOTOBOOTH STRIP",
      subtitle: "Custom",
      image: "/assets/custom_single.jpg",
      text: "PHOTOBOOTH STRIP",
      link: "/custom"
    }
  ];

  return (
    <section style={{ padding: "4rem 1rem", backgroundColor: "#FFFFFF" }}>
      <div className="container" style={{ maxWidth: "900px", margin: "0 auto" }}>
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111", margin: 0 }}>
            DESIGN YOUR OWN
          </h2>
          <div style={{ fontSize: "0.82rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#666666", fontWeight: "700", marginTop: "0.25rem" }}>
            P R I N T S
          </div>
        </div>

        {/* 2-COLUMN MOBILE GRID */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "1.25rem 1rem" 
          }}
        >
          {customItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.link}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div 
                style={{ 
                  backgroundColor: "#FAFAF8", 
                  borderRadius: "16px", 
                  border: "1px solid rgba(17,17,17,0.08)", 
                  overflow: "hidden", 
                  boxShadow: "0 4px 15px rgba(0,0,0,0.02)",
                  transition: "transform 0.2s ease"
                }}
              >
                <div style={{ textAlign: "center", padding: "1.25rem 0.75rem 0.85rem 0.75rem", backgroundColor: "#F4F3EF" }}>
                  <span style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "0.95rem", color: "#666666", display: "block" }}>
                    {item.subtitle}
                  </span>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#111111", margin: "0 0 0.5rem 0", letterSpacing: "0.02em", lineHeight: "1.2" }}>
                    {item.title}
                  </h3>
                  {item.badge && (
                    <div style={{ fontSize: "0.8rem", fontWeight: "900", color: "#111111", marginBottom: "0.5rem" }}>
                      {item.badge}
                    </div>
                  )}
                  <span style={{ padding: "0.4rem 1rem", borderRadius: "100px", backgroundColor: "#2C2C2A", color: "#FFFFFF", fontWeight: "700", fontSize: "0.72rem", display: "inline-block" }}>
                    Get Yours ➔
                  </span>
                </div>

                <div style={{ position: "relative", width: "100%", height: "220px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "relative", zIndex: 2, backgroundColor: "rgba(255,255,255,0.92)", backdropFilter: "blur(4px)", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #111", textAlign: "center" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "#111", display: "block", lineHeight: "1.2" }}>
                      {item.text}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
