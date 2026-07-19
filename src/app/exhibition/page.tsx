'use client';

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Sun, User, ArrowRight, Sparkles, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PosterRenderer from "../../components/PosterRenderer";
import { posters } from "../../lib/cms/products";

interface CardSpec {
  id: string;
  rotate: number;
  yOffset: number;
  xOffset: number;
  frame: "wood" | "black" | "gold" | "unframed";
  floatDelay: number;
}

export default function PosterPlaceHero() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Parallax scroll effects
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Scale the fanned artwork container from 100% to 108% as we scroll down
  const artworkScale = useTransform(scrollYProgress, [0, 0.5], [1.0, 1.08]);
  // Soft parallax translation for the container
  const artworkY = useTransform(scrollYProgress, [0, 0.5], [0, 30]);

  // 7 cards fanned out at specific angles: -24°, -16°, -8°, 0°, +8°, +16°, +24°
  // Overlapping by about 25%, with the center card (id: 4) being largest and having the highest z-index
  const cards: CardSpec[] = [
    { id: "thoovanathumbikal", rotate: -24, yOffset: 70, xOffset: -320, frame: "wood", floatDelay: 1.2 },
    { id: "kumbalangi-nights", rotate: -16, yOffset: 40, xOffset: -210, frame: "black", floatDelay: 0.6 },
    { id: "spadikam", rotate: -8, yOffset: 15, xOffset: -100, frame: "gold", floatDelay: 0.2 },
    { id: "manichitrathazhu", rotate: 0, yOffset: 0, xOffset: 0, frame: "wood", floatDelay: 0.0 }, // Center
    { id: "aavesham", rotate: 8, yOffset: 15, xOffset: 100, frame: "unframed", floatDelay: 0.4 },
    { id: "premam", rotate: 16, yOffset: 40, xOffset: 210, frame: "unframed", floatDelay: 0.8 },
    { id: "kireedam", rotate: 24, yOffset: 70, xOffset: 320, frame: "gold", floatDelay: 1.4 }
  ];

  // Component-level animations configurations
  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.8 } 
    }
  };

  const badgeVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.8, delay: 0.2 } 
    }
  };

  const headlineVariants = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 1.0, delay: 0.3 } 
    }
  };

  const descVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 1.0, delay: 0.5 } 
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 1.0, delay: 0.6 } 
    }
  };

  return (
    <div 
      ref={heroRef}
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        backgroundImage: "radial-gradient(circle at 50% 35%, rgba(230, 230, 230, 0.5) 0%, rgba(250, 250, 250, 0) 75%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.5rem",
        fontFamily: "var(--font-inter), sans-serif",
        overflow: "hidden"
      }}
    >
      {/* Floating Glassmorphism Hero Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
        style={{
          width: "100%",
          maxWidth: "1320px",
          height: "auto",
          minHeight: "820px",
          backgroundColor: "rgba(255, 255, 255, 0.92)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: "30px",
          border: "1px solid rgba(0, 0, 0, 0.05)",
          boxShadow: "0 40px 80px rgba(0,0,0,.08), 0 8px 20px rgba(0,0,0,.03)",
          position: "relative",
          overflow: "hidden",
          paddingBottom: "6rem",
          display: "flex",
          flexDirection: "column"
        }}
      >
        
        {/* Soft Ambient Background Lighting (Blur Vignette) */}
        <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79, 125, 255, 0.05) 0%, rgba(255, 255, 255, 0) 70%)", top: "-50px", left: "20%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(67, 201, 123, 0.04) 0%, rgba(255, 255, 255, 0) 70%)", top: "10%", right: "20%", pointerEvents: "none" }} />

        {/* 1. TOP NAVBAR */}
        <motion.nav 
          variants={navbarVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "2rem 3.5rem",
            borderBottom: "1px solid rgba(0, 0, 0, 0.03)",
            zIndex: 10
          }}
          className="hero-nav"
        >
          {/* Left: Geometric Logo + Brand Name */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{ width: "26px", height: "26px", borderRadius: "6px", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Layers size={13} color="#FFFFFF" />
            </div>
            <strong style={{ fontSize: "1rem", fontWeight: "800", letterSpacing: "-0.03em", color: "#111111" }}>
              Poster Place
            </strong>
          </div>

          {/* Center: Navigation links */}
          <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="desktop-only">
            {["Explore", "Art Marketplace", "Pricing", "About", "Contact"].map((link) => (
              <Link 
                key={link} 
                href="/shop" 
                style={{ fontSize: "0.85rem", color: "#6B7280", fontWeight: "500", transition: "color 0.2s" }}
                className="hover-dark"
              >
                {link}
              </Link>
            ))}
          </div>

          {/* Right: Search, Theme, Profile */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <button aria-label="Search" style={{ cursor: "pointer", color: "#6B7280", background: "none", border: "none", padding: "4px" }} className="hover-dark-btn"><Search size={16} /></button>
            <button aria-label="Theme" style={{ cursor: "pointer", color: "#6B7280", background: "none", border: "none", padding: "4px" }} className="hover-dark-btn"><Sun size={16} /></button>
            <div style={{ width: "26px", height: "26px", borderRadius: "50%", overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", cursor: "pointer" }}>
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80" alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          </div>
        </motion.nav>

        {/* 2. MAIN HERO BODY */}
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "4.5rem 2rem 0 2rem",
            position: "relative",
            zIndex: 2,
            flexGrow: 1
          }}
        >
          {/* Top Announcement Badges */}
          <motion.div 
            variants={badgeVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}
          >
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", backgroundColor: "rgba(79, 125, 255, 0.08)", color: "#4F7DFF", padding: "0.45rem 1rem", borderRadius: "100px", fontSize: "0.78rem", fontWeight: "600", boxShadow: "0 2px 10px rgba(79, 125, 255, 0.05)" }}>
              <Sparkles size={11} /> Introducing AI Discovery
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", backgroundColor: "rgba(67, 201, 123, 0.08)", color: "#43C97B", padding: "0.45rem 0.8rem", borderRadius: "100px", fontSize: "0.75rem", fontWeight: "600", boxShadow: "0 2px 10px rgba(67, 201, 123, 0.05)" }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: "#43C97B", display: "inline-block" }} /> New
            </div>
          </motion.div>

          {/* Main Editorial Headline */}
          <motion.h1 
            variants={headlineVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "74px",
              fontWeight: 800,
              lineHeight: "82px",
              letterSpacing: "-0.03em",
              color: "#111111",
              maxWidth: "620px",
              marginBottom: "1.5rem"
            }}
            className="hero-main-title"
          >
            A place to display your masterpiece.
          </motion.h1>

          {/* Description */}
          <motion.p 
            variants={descVariants}
            initial="hidden"
            animate="visible"
            style={{
              fontSize: "18px",
              color: "#6E6E73",
              lineHeight: "30px",
              maxWidth: "520px",
              marginBottom: "2.25rem"
            }}
          >
            Discover, showcase and sell exceptional artwork through a beautifully designed marketplace built for modern creators.
          </motion.p>

          {/* CTAs Button Row */}
          <motion.div 
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            style={{ display: "flex", gap: "0.75rem", marginBottom: "6rem", zIndex: 12 }}
          >
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 15 }}>
              <Link 
                href="/shop" 
                style={{
                  backgroundColor: "#111111",
                  color: "#FFFFFF",
                  padding: "0 28px",
                  height: "48px",
                  borderRadius: "100px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.06)",
                  cursor: "pointer"
                }}
              >
                Get Started
              </Link>
            </motion.div>
            
            <Link 
              href="/about" 
              style={{
                backgroundColor: "transparent",
                color: "#111111",
                padding: "0 28px",
                height: "48px",
                borderRadius: "100px",
                fontSize: "0.9rem",
                fontWeight: "600",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(0, 0, 0, 0.08)",
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
              className="hover-warm"
            >
              Learn More
            </Link>
          </motion.div>

          {/* 3. FEATURED ARTWORK: 7 OVERLAPPING CARDS FAN (Center-out stagger) */}
          <motion.div 
            style={{
              position: "relative",
              width: "100%",
              height: "380px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              scale: artworkScale,
              y: artworkY
            }}
            className="carousel-container"
          >
            {/* Ambient artwork highlight glow */}
            <div style={{ position: "absolute", width: "500px", height: "150px", borderRadius: "50%", background: "radial-gradient(circle, rgba(79, 125, 255, 0.04) 0%, rgba(255, 255, 255, 0) 70%)", filter: "blur(20px)", bottom: "40px", zIndex: 1, pointerEvents: "none" }} />

            {cards.map((card, idx) => {
              const posterObj = posters.find(p => p.id === card.id);
              if (!posterObj) return null;

              const isHovered = hoveredCard === card.id;
              const isAnyHovered = hoveredCard !== null;

              // Angle & Position offset overrides
              const scale = card.rotate === 0 
                ? (isHovered ? 1.20 : isAnyHovered ? 1.0 : 1.12) // Center card (Largest)
                : (isHovered ? 1.08 : isAnyHovered ? 0.88 : 0.96); // Outer cards
                
              const zIndex = card.rotate === 0 
                ? (isHovered ? 60 : 30) // highest center index
                : (isHovered ? 50 : 10 + idx);

              const rotation = isHovered ? card.rotate * 0.35 : isAnyHovered ? card.rotate * 1.15 : card.rotate;
              const xPos = isHovered ? card.xOffset * 0.85 : isAnyHovered ? card.xOffset * 1.1 : card.xOffset;
              const yPos = isHovered ? card.yOffset - 35 : isAnyHovered ? card.yOffset + 12 : card.yOffset;

              // Center-out staggering delays calculation
              const distanceToCenter = Math.abs(idx - 3); // 3 is center index
              const staggerDelay = distanceToCenter * 0.15 + 0.55;

              return (
                <motion.div
                  key={card.id}
                  onMouseEnter={() => setHoveredCard(card.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  initial={{ opacity: 0, scale: 0.5, y: 150, rotate: card.rotate }}
                  animate={{
                    opacity: 1,
                    rotate: rotation,
                    x: xPos,
                    y: yPos,
                    scale: scale,
                    zIndex: zIndex
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 110,
                    damping: 18,
                    delay: staggerDelay
                  }}
                  onClick={() => router.push(`/product/${posterObj.slug}`)}
                  style={{
                    position: "absolute",
                    width: "180px",
                    cursor: "pointer",
                    boxShadow: isHovered 
                      ? "0 30px 70px rgba(0,0,0,0.18)" 
                      : "0 12px 30px rgba(0,0,0,0.06)",
                    borderRadius: "16px",
                    overflow: "hidden"
                  }}
                >
                  {/* Micro-interaction: Continuous floating loop */}
                  <motion.div
                    animate={{
                      y: [0, -6, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 8,
                      ease: "easeInOut",
                      delay: card.floatDelay
                    }}
                  >
                    <PosterRenderer poster={posterObj} frame={card.frame} />
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>

        </div>
      </motion.div>

      {/* Styled class hooks */}
      <style>{`
        .hover-dark:hover { color: #111111 !important; }
        .hover-dark-btn:hover { color: #111111 !important; }
        .hover-warm:hover { background-color: rgba(0, 0, 0, 0.02) !important; }
        @media (max-width: 1024px) {
          .hero-main-title {
            font-size: 56px !important;
            line-height: 62px !important;
            max-width: 500px !important;
          }
          .carousel-container {
            scale: 0.85 !important;
          }
        }
        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
          .hero-nav { padding: 1.5rem 2rem !important; }
        }
        @media (max-width: 768px) {
          .hero-main-title {
            font-size: 42px !important;
            line-height: 48px !important;
            max-width: 400px !important;
          }
          .carousel-container {
            scale: 0.65 !important;
            height: 300px !important;
          }
        }
        @media (max-width: 600px) {
          .carousel-container {
            display: none !important; /* Hide fan on extra small screens for readability */
          }
        }
      `}</style>
    </div>
  );
}
