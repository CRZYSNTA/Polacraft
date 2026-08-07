'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function DesignYourOwnSection() {
  const customItems = [
    {
      id: "poster",
      title: "Custom POSTER",
      image: "/assets/custom_grid_poster.png",
      link: "/custom"
    },
    {
      id: "split",
      title: "Custom SPLIT POSTER",
      image: "/assets/custom_grid_split_3.png",
      link: "/custom"
    },
    {
      id: "split2x2",
      title: "Custom SPLIT POSTER 2X2",
      image: "/assets/custom_grid_split_2x2.png",
      link: "/custom"
    },
    {
      id: "retro",
      title: "Custom RETRO PRINTS",
      image: "/assets/custom_grid_retro.png",
      link: "/custom"
    },
    {
      id: "pocket",
      title: "Custom MINI POCKET PHOTO",
      image: "/assets/custom_grid_pocket.png",
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

        {/* 2-COLUMN MOBILE GRID DISPLAYING EXACT UPLOADED IMAGES */}
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
                  borderRadius: "18px", 
                  border: "1px solid rgba(17,17,17,0.08)", 
                  overflow: "hidden", 
                  boxShadow: "0 6px 20px rgba(0,0,0,0.03)",
                  position: "relative",
                  aspectRatio: "3 / 4",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease"
                }}
                className="hover-card"
              >
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 50vw, 350px"
                  style={{ objectFit: "cover" }} 
                />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
