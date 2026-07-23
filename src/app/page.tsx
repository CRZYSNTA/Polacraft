'use client';

import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../features/cart/AppContext";
import { posters as staticPosters } from "../lib/cms/products";
import { Product } from "../types";
import { motion, AnimatePresence } from "framer-motion";

import HeroSection from "../components/home/HeroSection";
import FeaturedCollectionsSection from "../components/home/FeaturedCollectionsSection";
import BestSellersSection from "../components/home/BestSellersSection";
import CollectorRewardsSection from "../components/home/CollectorRewardsSection";
import CraftsmanshipSection from "../components/home/CraftsmanshipSection";
import PackagingSection from "../components/home/PackagingSection";
import LimitedEditionsSection from "../components/home/LimitedEditionsSection";
import CollectorWallsSection from "../components/home/CollectorWallsSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import NewsletterSection from "../components/home/NewsletterSection";

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
    frameOptions: ["unframed"],
    paperType: p.paperType || "300 GSM Premium Matte Paper",
    gsm: p.gsm || 300,
    finish: p.finish || "Ultra-Matte Giclée",
    price: p.price || 49,
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

  // Live Posters State initialized with static fallback
  const [livePosters, setLivePosters] = useState<Product[]>(staticPosters);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch actual DB products on load
  useEffect(() => {
    async function fetchLiveCatalog() {
      try {
        const res = await fetch(`/api/search?t=${Date.now()}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data.products && Array.isArray(data.products)) {
            setLivePosters(data.products.map(mapDbProductToPoster));
          }
        }
      } catch (e) {
        console.warn("[Home Live Catalog Load Error]:", e);
      }
    }
    fetchLiveCatalog();
  }, []);

  // Loading intro sequence (800ms fade sequence)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const heroFanCards = livePosters.slice(0, 6);
  const bestSellers = livePosters.slice(0, 6);

  return (
    <div style={{ position: "relative", backgroundColor: "#FAFAFA", color: "#111111", overflow: "hidden" }}>
      
      {/* 1. PAGE LOAD INTRO ANIMATION (800ms sequence) */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "#FAFAF8",
              zIndex: 99999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem"
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: "800",
                letterSpacing: "-0.04em",
                color: "#111111",
                display: "flex",
                alignItems: "center",
                gap: "0.3rem"
              }}
            >
              <span>POLA</span>
              <span style={{ fontWeight: "300", opacity: 0.6 }}>CRAFT</span>
            </motion.div>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{
                width: "140px",
                height: "2px",
                backgroundColor: "#111111",
                originX: 0
              }}
            />
            <p style={{ fontSize: "0.75rem", letterSpacing: "0.2em", color: "#666666", textTransform: "uppercase" }}>
              Curating Malayalam Cinema Heritage
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC STOREWIDE OFFER BANNER */}
      <div
        style={{
          backgroundColor: "#111111",
          color: "#FAFAFA",
          padding: "0.65rem 1rem",
          fontSize: "0.82rem",
          fontWeight: "600",
          textAlign: "center",
          letterSpacing: "0.02em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          flexWrap: "wrap",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "relative",
          zIndex: 40
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          🚚 <strong>FREE Shipping</strong> on ₹{siteSettings.freeShippingThreshold}+
        </span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          🎁 <strong>Collector Reward</strong> on ₹{siteSettings.collectorRewardThreshold}+
        </span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
          🏆 <strong>Premium Status</strong> on ₹{siteSettings.premiumRewardThreshold}+
        </span>
        <span style={{ opacity: 0.3 }}>|</span>
        <span style={{ color: "#F59E0B", fontWeight: "700" }}>Mix Any Movie. Mix Any Size.</span>
      </div>

      {/* 3. HERO SECTION */}
      <HeroSection
        heroTitle={siteSettings.heroTitle}
        heroSubtitle={siteSettings.heroSubtitle}
        heroFanCards={heroFanCards}
        isLoading={isLoading}
      />

      {/* 4. COLLECTOR REWARDS PROGRAM */}
      <CollectorRewardsSection
        freeShippingThreshold={siteSettings.freeShippingThreshold}
        collectorRewardThreshold={siteSettings.collectorRewardThreshold}
        premiumRewardThreshold={siteSettings.premiumRewardThreshold}
      />

      {/* 5. BEST SELLERS CAROUSEL */}
      <BestSellersSection
        bestSellers={bestSellers}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        openQuickView={openQuickView}
        addToCart={addToCart}
      />

      {/* 7. WHY POLACRAFT (CRAFTSMANSHIP) */}
      <CraftsmanshipSection />

      {/* 8. PREMIUM PACKAGING BREAKDOWN */}
      <PackagingSection />

      {/* 9. LIMITED EDITIONS SCARCITY */}
      <LimitedEditionsSection posters={livePosters} />

      {/* 10. COLLECTOR WALLS (CUSTOMER HOMES & SHOWCASE) */}
      <CollectorWallsSection />

      {/* 11. TESTIMONIALS */}
      <TestimonialsSection />

      {/* 12. CTA / NEWSLETTER */}
      <NewsletterSection />

    </div>
  );
}
