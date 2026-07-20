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
import { ArrowRight, Eye, Heart, ShoppingBag, Award, Sparkles, Box, ShieldCheck } from "lucide-react";

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
  const { addToCart, wishlist, toggleWishlist, openQuickView } = useContext(AppContext);
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
    // Premium loading sequence runs for 2.2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200);
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: any) => {
    const { clientX, clientY } = e;
    const x = (clientX - window.innerWidth / 2) / 30;
    const y = (clientY - window.innerHeight / 2) / 30;
    setMousePos({ x, y });
  };

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
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
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
            {/* Paper texture overlay inside loader */}
            <div className="paper-texture" style={{ opacity: 0.08 }} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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
            
            {/* Minimal paper sheet outline loading effect */}
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{
                width: "120px",
                height: "2px",
                backgroundColor: "var(--accent-charcoal)",
                originX: 0
              }}
            />
            <p style={{ fontSize: "0.8rem", letterSpacing: "0.15em", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Curating Film Heritage
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HERO SECTION */}
      <section 
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          paddingTop: "140px",
          paddingBottom: "80px",
          backgroundColor: "#FAFAFA",
          backgroundImage: "radial-gradient(circle at 50% 30%, rgba(235, 235, 235, 0.6) 0%, rgba(250, 250, 250, 0) 70%)",
          overflow: "hidden"
        }}
      >
        {/* Soft Ambient Background Lighting */}
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(71, 213, 198, 0.06) 0%, rgba(255, 255, 255, 0) 70%)", top: "10%", left: "10%", pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(224, 26, 34, 0.04) 0%, rgba(255, 255, 255, 0) 70%)", bottom: "10%", right: "10%", pointerEvents: "none" }} />

        <div className="container" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          {/* Centered Glassmorphic Container */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isLoading ? {} : { opacity: 1, y: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.2, delay: 0.1 }}
            style={{
              width: "100%",
              maxWidth: "1280px",
              backgroundColor: "rgba(255, 255, 255, 0.65)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              borderRadius: "32px",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              boxShadow: "0 30px 70px rgba(0, 0, 0, 0.02)",
              padding: "5rem 2rem 6rem 2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative"
            }}
          >


            {/* Bold Editorial Headline */}
            <h1 
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                fontWeight: "900",
                letterSpacing: "-0.04em",
                color: "#111111",
                lineHeight: "1.05",
                maxWidth: "850px",
                marginBottom: "1.5rem"
              }}
            >
              Malayalam Cinema.<br />Reimagined as Fine Art.
            </h1>

            {/* Supporting Paragraph */}
            <p 
              style={{
                fontSize: "clamp(1rem, 2vw, 1.15rem)",
                color: "#666666",
                lineHeight: "1.7",
                maxWidth: "540px",
                marginBottom: "2.5rem"
              }}
            >
              Original handcrafted archival prints celebrating the screenplays, visual geometry, and legends that shaped Kerala's movie culture.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "5rem" }}>
              <Link 
                href="/shop" 
                style={{
                  backgroundColor: "#111111",
                  color: "#FAFAFA",
                  padding: "1rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
                  cursor: "pointer"
                }}
                className="btn-magnetic"
              >
                Enter Exhibition <ArrowRight size={16} />
              </Link>
              <Link 
                href="/about" 
                style={{
                  backgroundColor: "transparent",
                  color: "#111111",
                  padding: "1rem 2.2rem",
                  borderRadius: "100px",
                  fontSize: "0.9rem",
                  fontWeight: "600",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  border: "1px solid rgba(0, 0, 0, 0.08)",
                  cursor: "pointer"
                }}
                className="hover-warm"
              >
                Our Philosophy
              </Link>
            </div>

            {/* Fan-Shaped Carousel of Live Database Poster Cards */}
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

      {/* 3. CURATED COLLECTIONS */}
      <section style={{ padding: "8rem 0", backgroundColor: "#F7F7F4" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
            <div>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)" }}>
                Curated Series
              </span>
              <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>Featured Collections</h2>
            </div>
            <Link 
              href="/shop"
              className="underline-hover" 
              style={{ fontWeight: "600", color: "var(--text-dark)", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}
            >
              Browse All Series <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-12" style={{ gap: "3rem" }}>
            {/* Classic */}
            <div 
              onClick={() => router.push("/shop?filter=Classic")}
              className="glass-card clickable hover-lift"
              style={{
                gridColumn: "span 7",
                height: "480px",
                padding: "3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.75)), url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1000') center/cover",
                color: "#FFFFFF",
                cursor: "pointer",
                borderRadius: "var(--radius-md)",
                overflow: "hidden"
              }}
            >
              <span style={{ fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>Series I</span>
              <div>
                <h3 style={{ fontSize: "2.75rem", fontFamily: "var(--font-serif)", fontWeight: "400", fontStyle: "italic", marginBottom: "0.75rem" }}>The Golden Era</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", maxWidth: "45ch", fontSize: "0.95rem" }}>
                  Vintage tributes to classic Padmarajan romance, Fazil drama, and Sreenivasan satire. Heavy nostalgia styled with fine serif elements.
                </p>
              </div>
            </div>

            {/* Modern */}
            <div 
              onClick={() => router.push("/shop?filter=Modern")}
              className="glass-card clickable hover-lift"
              style={{
                gridColumn: "span 5",
                height: "480px",
                padding: "3rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                background: "linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.85)), url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000') center/cover",
                color: "#FFFFFF",
                cursor: "pointer",
                borderRadius: "var(--radius-md)",
                overflow: "hidden"
              }}
            >
              <span style={{ fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", opacity: 0.8 }}>Series II</span>
              <div>
                <h3 style={{ fontSize: "2.75rem", fontFamily: "var(--font-serif)", fontWeight: "400", fontStyle: "italic", marginBottom: "0.75rem" }}>Modern Visionaries</h3>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem" }}>
                  Contemporary films showcasing bioluminescent lights, coastal drama, and modern Malayalam writing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BEST SELLERS CAROUSEL */}
      <section style={{ padding: "8rem 0" }}>
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
                          cursor: "pointer"
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
                          cursor: "pointer"
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
                          cursor: "pointer"
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
        <style>{`
          .carousel-viewport::-webkit-scrollbar {
            display: none;
          }
          .carousel-arrow:hover {
            border-color: var(--text-dark) !important;
            background-color: var(--accent-beige) !important;
          }
          .action-reveal-buttons {
            opacity: 0;
            transform: translate(-50%, 10px);
            transition: var(--transition-smooth);
          }
          .best-seller-art-wrapper:hover .action-reveal-buttons {
            opacity: 1;
            transform: translate(-50%, 0px);
          }
          .best-seller-art-wrapper:hover .art-container {
            transform: scale(1.04) translateY(-3px);
          }
        `}</style>
      </section>

      {/* 5. BRAND PACKAGING & UNBOXING */}
      <section style={{ padding: "8rem 0", backgroundColor: "var(--accent-beige)" }}>
        <div className="container">
          <div className="grid-12" style={{ alignItems: "center", gap: "4rem" }}>
            <div style={{ gridColumn: "span 6", position: "relative" }}>
              <div 
                style={{ 
                  position: "relative",
                  width: "100%",
                  height: "450px",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden"
                }}
              >
                <Image 
                  src="/assets/unboxing_packaging.png" 
                  alt="Polacraft premium unboxing tubes" 
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>
            <div style={{ gridColumn: "span 6", display: "flex", flexDirection: "column", gap: "1.75rem" }}>
              <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
                Unboxing Experience
              </span>
              <h2 style={{ fontSize: "3rem", fontWeight: "800", letterSpacing: "-0.03em", lineHeight: "1.1" }}>
                Crafted for safe arrival and premium feel.
              </h2>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
                Every art poster from our studio is treated with absolute care. We pack unframed prints inside heavy-duty, **3.5mm thick cardboard tubes** stamped with our custom brand seal.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--text-muted)", lineHeight: "1.7" }}>
                Inside, prints are wrapped in delicate, acid-free **glassine tissue sheets** to buffer humidity and eliminate surface friction. Unboxing Polacraft is designed to feel like unwrapping an archival artifact.
              </p>
              <div style={{ display: "flex", gap: "2rem", borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Textured paper</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>250 GSM cotton fiber</p>
                </div>
                <div>
                  <h4 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Zero Plastic</h4>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Fully recyclable tubes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE EXHIBITION WALL */}
      <section ref={galleryRef} style={{ padding: "10rem 0", position: "relative" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "6rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              The Exhibition
            </span>
            <h2 className="section-heading" style={{ margin: "0.5rem 0" }}>Interactive Gallery Wall</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "40ch", margin: "0 auto" }}>
              A simulated walkthrough of our posters displayed in different frames.
            </p>
          </div>

          <div 
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(3, 1fr)", 
              gap: "4rem", 
              alignItems: "center" 
            }}
            className="gallery-wall-grid"
          >
            {livePosters[0] && (
              <motion.div style={{ y: scrollY1, rotate: -4 }} className="hover-lift">
                <PosterRenderer poster={livePosters[0]} frame="wood" />
              </motion.div>
            )}

            {livePosters[1] && (
              <motion.div style={{ y: scrollY2, rotate: 2 }} className="hover-lift">
                <PosterRenderer poster={livePosters[1]} frame="black" />
              </motion.div>
            )}

            {livePosters[2] && (
              <motion.div style={{ y: scrollY3, rotate: -3 }} className="hover-lift">
                <PosterRenderer poster={livePosters[2]} frame="white" />
              </motion.div>
            )}
          </div>
        </div>
        <style>{`
          @media (max-width: 768px) {
            .gallery-wall-grid {
              grid-template-columns: 1fr !important;
              gap: 2.5rem !important;
            }
          }
        `}</style>
      </section>

      {/* 7. CUSTOMER GALLERY: "ON YOUR WALLS" */}
      <section style={{ padding: "8rem 0", backgroundColor: "#F7F7F4" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Customer Homes
            </span>
            <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>On Your Walls</h2>
            <p style={{ color: "var(--text-muted)", maxWidth: "50ch", margin: "0.5rem auto 0 auto" }}>
              See how collectors style their living spaces, studios, and offices with our archival Malayalam film prints.
            </p>
          </div>

          <div className="masonry-grid">
            <div 
              className="glass-card masonry-item-wide"
              style={{
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Image 
                src="/assets/living_room_mockup.png" 
                alt="Framed poster styled in living room" 
                fill 
                style={{ objectFit: "cover" }} 
              />
              <div className="insta-hover-overlay">@arjun_menon • Living Room Curation</div>
            </div>
            
            <div 
              className="glass-card masonry-item-tall"
              style={{
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Image 
                src="/assets/unboxing_packaging.png" 
                alt="Unwrapping safe tube print" 
                fill 
                style={{ objectFit: "cover" }} 
              />
              <div className="insta-hover-overlay">@ria_thomas • Safe Art Delivery</div>
            </div>

            <div 
              className="glass-card"
              style={{
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Image 
                src="/assets/posters/manichitrathazhu-original-polacraft.png" 
                alt="Manichitrathazhu print detail" 
                fill 
                style={{ objectFit: "cover" }} 
              />
              <div className="insta-hover-overlay">@rahul_s • Turmeric Yellow Accent</div>
            </div>

            <div 
              className="glass-card"
              style={{
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Image 
                src="/assets/posters/aavesham-original-polacraft.png" 
                alt="Aavesham screenprint styling" 
                fill 
                style={{ objectFit: "cover" }} 
              />
              <div className="insta-hover-overlay">@kiran_kp • Typographic Desk Curation</div>
            </div>
          </div>
        </div>
        <style>{`
          .insta-hover-overlay {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(17, 17, 17, 0.75);
            color: #FAFAF8;
            font-size: 0.9rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: var(--transition-fast);
          }
          .glass-card:hover .insta-hover-overlay {
            opacity: 1;
          }
        `}</style>
      </section>

      {/* 8. WHY POLACRAFT */}
      <section style={{ padding: "8rem 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--text-muted)", fontWeight: "600" }}>
              Craftsmanship Specs
            </span>
            <h2 className="section-heading" style={{ margin: "0.5rem 0 0 0" }}>Why Polacraft?</h2>
          </div>

          <div className="grid-12">
            {[
              {
                icon: <Award size={28} />,
                title: "Museum Quality Paper",
                desc: "Printed on heavy-weight 250 GSM acid-free matte cotton archival paper. It will not yellow or fade over generations."
              },
              {
                icon: <Sparkles size={28} />,
                title: "Fine Art Printing",
                desc: "Using high-density giclée inkjet printing, assuring ultra-crisp typographic kerning and rich, saturated deep gradients."
              },
              {
                icon: <Box size={28} />,
                title: "Made to Order & Safe",
                desc: "Every order is individually printed, inspected, and shipped in sturdy cardboard tubes wrapped in acid-free tissue paper."
              },
              {
                icon: <ShieldCheck size={28} />,
                title: "Ships across India",
                desc: "Tracked shipping across the country, fully insured in case of damage. Secure payments using UPI, cards, and netbanking."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="glass-card"
                style={{
                  gridColumn: "span 3",
                  padding: "2.5rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                  backgroundColor: "#FFFFFF"
                }}
              >
                <div 
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "16px",
                    backgroundColor: "var(--accent-beige)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--text-dark)"
                  }}
                >
                  {item.icon}
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>{item.title}</h3>
                <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: "1.6" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. TESTIMONIALS */}
      <section style={{ padding: "8rem 0", overflow: "hidden", backgroundColor: "#F7F7F4" }}>
        <div className="marquee-container">
          {[1, 2].map((loopIdx) => (
            <div key={loopIdx} className="marquee-content">
              {[
                {
                  quote: "The Aavesham poster is incredible. The paper texture makes it feel like it belongs in a museum, but the slang brings back pure cinema energy.",
                  author: "Siddharth K., Bangalore",
                  rating: "★★★★★"
                },
                {
                  quote: "Thoovanathumbikal print arrived today. The grey-green rain aesthetic is gorgeous. Truly a work of art, not just a poster.",
                  author: "Meera R., Ernakulam",
                  rating: "★★★★★"
                },
                {
                  quote: "I bought the Manichitrathazhu poster with the Oak Frame. The frame is heavy solid wood and the print quality is insanely sharp. 10/10.",
                  author: "Ananthu S., Thiruvananthapuram",
                  rating: "★★★★★"
                },
                {
                  quote: "Kumbalangi Nights was a gift for my flatmate. The bioluminescent detail is breathtaking. Safe packaging, prompt delivery.",
                  author: "Divya N., Mumbai",
                  rating: "★★★★★"
                }
              ].map((t, idx) => (
                <div 
                  key={idx}
                  className="glass-card"
                  style={{
                    width: "350px",
                    padding: "2rem",
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    backgroundColor: "#FFFFFF"
                  }}
                >
                  <span style={{ color: "#D4AF37", fontSize: "0.85rem" }}>{t.rating}</span>
                  <p style={{ fontSize: "0.9rem", fontStyle: "italic", color: "var(--text-muted)", lineHeight: "1.6" }}>
                    "{t.quote}"
                  </p>
                  <div style={{ width: "100%", height: "1px", backgroundColor: "rgba(17,17,17,0.05)" }} />
                  <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>{t.author}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* 10. NEWSLETTER */}
      <section style={{ padding: "10rem 0", position: "relative" }}>
        <div className="container" style={{ position: "relative", zIndex: 5 }}>
          <div 
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              gap: "2rem"
            }}
          >
            <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "var(--text-muted)", fontWeight: "600" }}>
              Join the Society
            </span>
            <h2 style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: "800", letterSpacing: "-0.04em", lineHeight: "1.1" }}>
              Subscribe to the Polacraft Club.
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "48ch", margin: "0 auto", lineHeight: "1.7" }}>
              Get early access to limited edition drops, behind-the-scenes design breakdown essays, and 10% off your first curation.
            </p>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you for joining the Polacraft Society!");
                (e.target as HTMLFormElement).reset();
              }}
              style={{
                display: "flex",
                gap: "0.5rem",
                maxWidth: "500px",
                width: "100%",
                margin: "1rem auto 0 auto"
              }}
              className="newsletter-form"
            >
              <input 
                type="email" 
                placeholder="YOUR EMAIL ADDRESS" 
                required
                style={{
                  flexGrow: 1,
                  padding: "1rem 1.5rem",
                  borderRadius: "var(--radius-md)",
                  border: "1.5px solid var(--border-color)",
                  backgroundColor: "#FFFFFF",
                  fontSize: "0.85rem"
                }}
              />
              <button 
                type="submit" 
                className="btn-magnetic btn-primary"
                style={{ padding: "1rem 2rem", fontSize: "0.85rem" }}
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
