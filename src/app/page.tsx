'use client';

import React, { useContext, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppContext } from "../features/cart/AppContext";
import PosterRenderer from "../components/PosterRenderer";
import { posters as staticPosters } from "../lib/cms/products";
import { Product } from "../types";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Eye, Heart, ShoppingBag, Award, Sparkles, Box, ShieldCheck, Gift, Truck, Trophy } from "lucide-react";

const STATIC_POSTER_MAP: Record<string, string> = {
  manichitrathazhu: "/assets/posters/manichitrathazhu-original-polacraft.png",
  "kumbalangi-nights": "/assets/posters/kumbalangi-original-polacraft.png",
  aavesham: "/assets/posters/aavesham-original-polacraft.png",
  thoovanathumbikal: "/assets/posters/thoovanathumbikal-original-polacraft.png",
  spadikam: "/assets/posters/spadikam-original-polacraft.png",
  premam: "/assets/posters/premam-original-polacraft.png",
  sandesham: "/assets/posters/sandesham-original-polacraft.png",
  mathilukal: "/assets/posters/mathilukal-original-polacraft.png",
  kireedam: "/assets/posters/kireedam-original-polacraft.png",
};

function mapDbProductToPoster(p: any): Product {
  const staticFallback = STATIC_POSTER_MAP[p.slug] || STATIC_POSTER_MAP[p.slug?.toLowerCase()];

  const heroImage =
    p.images?.find((img: any) => img.type === "HERO")?.url ||
    p.images?.[0]?.url ||
    staticFallback ||
    null;

  const galleryImages = p.images?.length
    ? p.images.map((img: any) => img.url)
    : heroImage
    ? [heroImage]
    : [];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    film: p.film || p.title,
    tagline: p.tagline || "Handcrafted Archival Cinema Print",
    year: p.year || 1993,
    director: p.director || "Polacraft Studio",
    cast: Array.isArray(p.cast) && p.cast.length > 0 ? p.cast : ["Mohanlal"],
    collection: p.collectionName || p.collection?.name || "Classic Malayalam",
    genre: p.genre || "Drama",
    palette: {
      primary: p.primaryColor || "#E6C15C",
      accent: p.accentColor || "#802720",
      bg: p.bgColor || "#FAFAF8",
      text: p.textColor || "#1A1A1A",
    },
    story: p.story || "Museum-quality archival fine art poster print.",
    designNotes: p.designNotes || "High contrast archival cotton paper print.",
    availableSizes: ["A5", "A4", "A3"],
    frameOptions: ["unframed", "black", "white"],
    paperType: p.paperType || "Fine Art Cotton Archival",
    gsm: p.gsm || 250,
    finish: p.finish || "Ultra-Matte Giclée",
    price: p.price || 45,
    inventory: p.inventory ?? 25,
    lowStockThreshold: p.lowStockThreshold || 5,
    isPreorder: Boolean(p.isPreorder),
    limitedEditionCount: p.limitedEditionCount || 150,
    isSoldOut: p.inventory === 0 && !p.isPreorder,
    seoTitle: `${p.title} Poster | Polacraft Studio`,
    seoDescription: p.story || `Fine art poster of ${p.title}`,
    galleryImages: galleryImages,
    wallMockups: ["/assets/living_room_mockup.png"],
  };
}

export default function Home() {
  const { addToCart, wishlist, toggleWishlist, openQuickView, siteSettings } = useContext(AppContext);
  const router = useRouter();

  // Live Posters State initialized with static fallback
  const [livePosters, setLivePosters] = useState<Product[]>(staticPosters);

  // Fetch actual DB products on load
  useEffect(() => {
    async function fetchLiveCatalog() {
      try {
        const res = await fetch(`/api/search?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.products && data.products.length > 0) {
            const mapped = data.products.map(mapDbProductToPoster);
            const dbSlugs = new Set(mapped.map((p: Product) => p.slug));
            const merged = [
              ...mapped,
              ...staticPosters.filter((sp) => !dbSlugs.has(sp.slug))
            ];
            setLivePosters(merged);
          }
        }
      } catch (e) {
        console.warn("[Home Live Catalog Load Error]:", e);
      }
    }
    fetchLiveCatalog();
  }, []);

  // Loading sequence state
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredHeroCard, setHoveredHeroCard] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Parallax Scrolling calculations for gallery wall
  const galleryRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: galleryRef,
    offset: ["start end", "end start"]
  });

  const scrollY1 = useTransform(scrollYProgress, [0, 1], [-30, 60]);
  const scrollY2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const scrollY3 = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  // Hero Mouse movement tracking
  const handleMouseMove = (e: any) => {};

  const carouselRef = useRef<HTMLDivElement>(null);
  const bestSellers = livePosters.slice(0, 6);

  const scrollCarousel = (direction: string) => {
    if (carouselRef.current) {
      const scrollAmount = 360;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Hero Fan Card Placement Calculations
  const heroFanCards = livePosters.slice(0, 6);
  const fanRotations = [-15, -8, -2, 6, 12, 18];
  const fanYPositions = [40, 15, 0, 10, 30, 50];
  const fanXPositions = [-160, -80, 0, 80, 160, 240];
  const fanFrames = ["wood", "black", "unframed", "wood", "white", "black"];

  return (
    <div onMouseMove={handleMouseMove} style={{ position: "relative", overflow: "hidden" }}>
      
      {/* 1. PREMIUM INTRO LOADING EXPERIENCE */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "#FAFAF8",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem"
            }}
          >
            <div className="paper-texture" style={{ opacity: 0.08 }} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: "800",
                letterSpacing: "-0.04em",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}
            >
              <span>POLA</span>
              <span style={{ fontWeight: "300", opacity: 0.6 }}>CRAFT</span>
            </motion.div>
            
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              style={{
                width: "120px",
                height: "2px",
                backgroundColor: "var(--accent-charcoal)",
                originX: 0
              }}
            />
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Curating Malayalam Cinema Heritage
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC STOREWIDE OFFER BANNER */}
      <div
        style={{
          backgroundColor: "#111111",
          color: "#FFFFFF",
          padding: "0.6rem 1rem",
          fontSize: "0.82rem",
          fontWeight: "600",
          textAlign: "center",
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 40
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          🚚 <strong>FREE Shipping</strong> on ₹{siteSettings.freeShippingThreshold}+
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          🎁 <strong>Collector Reward</strong> on ₹{siteSettings.collectorRewardThreshold}+
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          🏆 <strong>Premium Status</strong> on ₹{siteSettings.premiumRewardThreshold}+
        </span>
        <span style={{ opacity: 0.4 }}>|</span>
        <span style={{ color: "#F59E0B", fontWeight: "700" }}>Mix Any Movie. Mix Any Size.</span>
      </div>

      {/* 3. HERO SECTION */}
      <section 
        style={{
          minHeight: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingTop: "60px",
          paddingBottom: "80px",
          backgroundColor: "#FAFAFA",
          backgroundImage: "radial-gradient(circle at 50% 30%, rgba(235, 235, 235, 0.6) 0%, rgba(250, 250, 250, 0) 70%)",
          overflow: "hidden"
        }}
      >
        <div className="container" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 1, delay: 0.1 }}
            style={{
              width: "100%",
              maxWidth: "1280px",
              backgroundColor: "rgba(255, 255, 255, 0.75)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              borderRadius: "32px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.03)",
              padding: "4rem 2rem 5rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative"
            }}
          >
            {/* Badge */}
            <span style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.2em", color: "#666666", marginBottom: "1rem", backgroundColor: "#EFECE6", padding: "0.35rem 1rem", borderRadius: "100px" }}>
              🎬 Premium Collectible Prints
            </span>

            {/* CMS Dynamic Editorial Headline */}
            <h1 
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: "900",
                letterSpacing: "-0.04em",
                color: "#111111",
                lineHeight: "1.05",
                maxWidth: "850px",
                marginBottom: "1.25rem"
              }}
            >
              {siteSettings.heroTitle}
            </h1>

            {/* CMS Dynamic Subheadline */}
            <p 
              style={{
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                color: "#666666",
                lineHeight: "1.7",
                maxWidth: "580px",
                marginBottom: "2.25rem"
              }}
            >
              {siteSettings.heroSubtitle}
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "4.5rem" }}>
              <Link 
                href="/shop" 
                style={{
                  backgroundColor: "#111111",
                  color: "#FAFAFA",
                  padding: "1rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: "0.9rem",
                  fontWeight: "700",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                  cursor: "pointer"
                }}
                className="btn-magnetic"
              >
                Explore Collection <ArrowRight size={16} />
              </Link>
              <a 
                href="#best-sellers" 
                style={{
                  backgroundColor: "#FFFFFF",
                  color: "#111111",
                  padding: "1rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "1.5px solid rgba(17, 17, 17, 0.15)",
                  cursor: "pointer"
                }}
              >
                Browse Best Sellers
              </a>
            </div>

            {/* Fan Carousel */}
            <div 
              style={{
                position: "relative",
                width: "100%",
                height: "360px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              className="carousel-container"
            >
              {heroFanCards.map((posterObj, idx) => {
                const baseRotate = fanRotations[idx % fanRotations.length];
                const baseY = fanYPositions[idx % fanYPositions.length];
                const baseX = fanXPositions[idx % fanXPositions.length];
                const frameStyle = fanFrames[idx % fanFrames.length];

                const isHovered = hoveredHeroCard === posterObj.id;
                const isAnyHovered = hoveredHeroCard !== null;
                
                const rotation = isHovered ? baseRotate * 0.4 : isAnyHovered ? baseRotate * 1.15 : baseRotate;
                const scale = isHovered ? 1.12 : isAnyHovered ? 0.92 : 1.0;
                const zIndex = isHovered ? 50 : 10 + idx;
                const xPos = isHovered ? baseX * 0.8 : isAnyHovered ? baseX * 1.1 : baseX;
                const yPos = isHovered ? baseY - 30 : isAnyHovered ? baseY + 10 : baseY;

                return (
                  <motion.div
                    key={posterObj.id}
                    onMouseEnter={() => setHoveredHeroCard(posterObj.id)}
                    onMouseLeave={() => setHoveredHeroCard(null)}
                    animate={{
                      rotate: rotation,
                      x: xPos,
                      y: yPos,
                      scale: scale,
                      zIndex: zIndex
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                      damping: 18
                    }}
                    onClick={() => router.push(`/product/${posterObj.slug}`)}
                    style={{
                      position: "absolute",
                      width: "190px",
                      cursor: "pointer",
                      boxShadow: isHovered 
                        ? "0 30px 60px rgba(0,0,0,0.18)" 
                        : "0 12px 30px rgba(0,0,0,0.06)"
                    }}
                  >
                    <PosterRenderer poster={posterObj} frame={frameStyle as any} />
                  </motion.div>
                );
              })}
            </div>

          </motion.div>
        </div>
      </section>

      {/* 4. PREMIUM FEATURED COLLECTIONS */}
      <section style={{ padding: "7rem 0", backgroundColor: "#F7F7F4" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Curated Collectible Series
            </span>
            <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>Featured Collections</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }} className="collections-grid">
            {[
              { title: "Mohanlal Collectibles", count: "12 Posters", href: "/shop?filter=Mohanlal", bg: "#422616", text: "#FFFFFF" },
              { title: "Mammootty Classics", count: "10 Posters", href: "/shop?filter=Mammootty", bg: "#111111", text: "#FFFFFF" },
              { title: "Fahadh Faasil Series", count: "8 Posters", href: "/shop?filter=Fahadh", bg: "#E01A22", text: "#FFFFFF" },
              { title: "Cult & Retro Malayalam", count: "15 Posters", href: "/shop?filter=Classic", bg: "#E6C15C", text: "#111111" }
            ].map((col, i) => (
              <Link
                key={i}
                href={col.href}
                className="hover-lift"
                style={{
                  backgroundColor: col.bg,
                  color: col.text,
                  padding: "2.25rem 1.75rem",
                  borderRadius: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "220px",
                  textDecoration: "none",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
                  transition: "var(--transition-fast)"
                }}
              >
                <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.15em", opacity: 0.8, fontWeight: "700" }}>
                  {col.count}
                </span>
                <div>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: "800", lineHeight: "1.2" }}>{col.title}</h3>
                  <span style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "6px", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}>
                    Explore Series <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <style>{`
          @media (max-width: 900px) {
            .collections-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          @media (max-width: 600px) {
            .collections-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* 5. BEST SELLERS CAROUSEL */}
      <section id="best-sellers" style={{ padding: "8rem 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
            <div>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>
                Most Coveted Art
              </span>
              <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>Best Sellers</h2>
            </div>
            
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button 
                onClick={() => scrollCarousel("left")}
                className="carousel-arrow"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
              >
                ←
              </button>
              <button 
                onClick={() => scrollCarousel("right")}
                className="carousel-arrow"
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  border: "1.5px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "var(--transition-fast)"
                }}
              >
                →
              </button>
            </div>
          </div>

          <div 
            ref={carouselRef}
            style={{
              display: "flex",
              gap: "2.5rem",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              paddingBottom: "2rem",
              scrollbarWidth: "none"
            }}
            className="carousel-viewport"
          >
            {bestSellers.map((poster) => {
              const isWish = wishlist.includes(poster.id);
              return (
                <div 
                  key={poster.id}
                  style={{
                    flex: "0 0 300px",
                    scrollSnapAlign: "start",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.25rem"
                  }}
                  className="carousel-item-card"
                >
                  <div 
                    style={{
                      position: "relative",
                      borderRadius: "16px",
                      overflow: "hidden",
                      backgroundColor: "var(--accent-beige)",
                      padding: "2rem 1.5rem",
                      cursor: "pointer"
                    }}
                    className="best-seller-art-wrapper"
                  >
                    <div 
                      onClick={() => router.push(`/product/${poster.slug}`)}
                      style={{ transition: "transform 0.5s ease-out" }}
                      className="art-container"
                    >
                      <PosterRenderer poster={poster} frame="unframed" />
                    </div>

                    <div 
                      style={{
                        position: "absolute",
                        bottom: "1.5rem",
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        gap: "0.5rem",
                        zIndex: 10
                      }}
                      className="action-reveal-buttons"
                    >
                      <button
                        onClick={() => openQuickView(poster)}
                        style={{
                          backgroundColor: "#FAFAF8",
                          color: "var(--text-dark)",
                          padding: "0.75rem",
                          borderRadius: "50%",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => addToCart(poster, "A4", "unframed", 1)}
                        style={{
                          backgroundColor: "var(--accent-charcoal)",
                          color: "#FAFAF8",
                          padding: "0.75rem",
                          borderRadius: "50%",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        <ShoppingBag size={16} />
                      </button>
                      <button
                        onClick={() => toggleWishlist(poster.id)}
                        style={{
                          backgroundColor: isWish ? "#FFF5F5" : "#FAFAF8",
                          color: isWish ? "red" : "var(--text-dark)",
                          padding: "0.75rem",
                          borderRadius: "50%",
                          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                          cursor: "pointer",
                          border: "none"
                        }}
                      >
                        <Heart size={16} fill={isWish ? "red" : "none"} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{poster.title}</h4>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{poster.collection}</p>
                    </div>
                    <span style={{ fontSize: "1.05rem", fontWeight: "700" }}>₹{poster.price.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. COLLECTOR WALLS (CUSTOMER HOMES & SHOWCASE) */}
      <section style={{ padding: "8rem 0", backgroundColor: "#F7F7F4" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Real Collector Spaces
            </span>
            <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>Collector Walls</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "52ch", margin: "0.5rem auto 0 auto" }}>
              See how movie buffs and interior enthusiasts style their study rooms, living room focal walls, and studio spaces.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }} className="collector-walls-grid">
            <div style={{ position: "relative", height: "380px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
              <Image src="/assets/living_room_mockup.png" alt="Living Room Wall Setup" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, inset: "auto 0 0 0", padding: "1.5rem", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "#FFFFFF" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "800" }}>@arjun_menon • Living Room Curation</h4>
                <p style={{ fontSize: "0.78rem", opacity: 0.8 }}>Featured: Manichitrathazhu A3 Teak Frame</p>
              </div>
            </div>

            <div style={{ position: "relative", height: "380px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
              <Image src="/assets/unboxing_packaging.png" alt="Unboxing packaging" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, inset: "auto 0 0 0", padding: "1.5rem", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "#FFFFFF" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "800" }}>@ria_thomas • Unboxing Experience</h4>
                <p style={{ fontSize: "0.78rem", opacity: 0.8 }}>Archival Heavy Duty Cardboard Tube Packaging</p>
              </div>
            </div>

            <div style={{ position: "relative", height: "380px", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.06)" }}>
              <Image src="/assets/posters/aavesham-original-polacraft.png" alt="Desk setup poster" fill style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", bottom: 0, inset: "auto 0 0 0", padding: "1.5rem", background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)", color: "#FFFFFF" }}>
                <h4 style={{ fontSize: "1rem", fontWeight: "800" }}>@kiran_kp • Typographic Studio Desk</h4>
                <p style={{ fontSize: "0.78rem", opacity: 0.8 }}>Featured: Aavesham A4 Minimal Frame</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY POLACRAFT (CRAFTSMANSHIP) */}
      <section style={{ padding: "8rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "4.5rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Craftsmanship Specs
            </span>
            <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>Why Polacraft?</h2>
          </div>

          <div className="grid-12" style={{ gap: "1.5rem" }}>
            {[
              {
                icon: <Award size={26} />,
                title: "250 GSM Museum Cotton",
                desc: "Heavy-weight acid-free archival cotton paper. Will not yellow or fade over generations."
              },
              {
                icon: <Sparkles size={26} />,
                title: "Ultra-Matte Giclée Print",
                desc: "High-density pigment inkjet printing delivering crisp typographic kerning and rich gradients."
              },
              {
                icon: <Box size={26} />,
                title: "Archival Tube Packaging",
                desc: "Packed inside heavy 3.5mm thick tubes wrapped in delicate, acid-free glassine tissue paper."
              },
              {
                icon: <ShieldCheck size={26} />,
                title: "Tracked Express Shipping",
                desc: "Insured shipping across India. Instant WhatsApp order updates and secure payment verification."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  gridColumn: "span 3",
                  padding: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  backgroundColor: "#FFFFFF",
                  borderRadius: "20px"
                }}
              >
                <div 
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "14px",
                    backgroundColor: "var(--accent-beige)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-dark)"
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "800" }}>{item.title}</h3>
                <p style={{ fontSize: "0.88rem", color: "var(--text-muted)", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
