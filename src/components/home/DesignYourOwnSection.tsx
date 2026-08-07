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
    },
    {
      id: "photobooth",
      title: "Custom PHOTOBOOTH STRIP",
      image: "/assets/custom_grid_photobooth.png",
      link: "/custom"
    }
  ];

  return (
    <section style={{ padding: "4rem 1rem", backgroundColor: "#FFFFFF" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1rem" }}>
        
        {/* SECTION HEADER */}
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "clamp(1.8rem, 5vw, 2.5rem)", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", color: "#111111", margin: 0 }}>
            DESIGN YOUR OWN
          </h2>
          <div style={{ fontSize: "0.82rem", letterSpacing: "0.45em", textTransform: "uppercase", color: "#666666", fontWeight: "700", marginTop: "0.25rem" }}>
            P R I N T S
          </div>
        </div>

        {/* 6-COLUMN DESKTOP GRID / 2-COLUMN MOBILE GRID */}
        <div className="design-your-own-grid">
          {customItems.map((item, index) => (
            <Link 
              key={index} 
              href={item.link}
              style={{ textDecoration: "none", color: "inherit", display: "block" }}
            >
              <div 
                style={{ 
                  backgroundColor: "#FAFAF8", 
                  borderRadius: "14px", 
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
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  style={{ objectFit: "cover" }} 
                />
              </div>
            </Link>
          ))}
        </div>

      </div>

      <style>{`
        .design-your-own-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1rem;
        }

        @media (max-width: 1023px) {
          .design-your-own-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 639px) {
          .design-your-own-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 0.85rem;
          }
        }
      `}</style>
    </section>
  );
}
