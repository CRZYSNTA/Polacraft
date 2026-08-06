'use client';

import React, { useContext } from "react";
import { AppContext } from "@/features/cart/AppContext";
import { Product } from "@/types";

import HeroSection from "./HeroSection";
import FeaturedCollectionsSection from "./FeaturedCollectionsSection";
import BestSellersSection from "./BestSellersSection";
import CollectorRewardsSection from "./CollectorRewardsSection";
import CraftsmanshipSection from "./CraftsmanshipSection";
import PackagingSection from "./PackagingSection";
import LimitedEditionsSection from "./LimitedEditionsSection";
import CollectorWallsSection from "./CollectorWallsSection";
import TestimonialsSection from "./TestimonialsSection";
import NewsletterSection from "./NewsletterSection";

interface HomeClientProps {
  initialPosters: Product[];
  heroPosters?: Product[];
}

export default function HomeClient({ initialPosters, heroPosters }: HomeClientProps) {
  const { addToCart, wishlist, toggleWishlist, openQuickView, siteSettings } = useContext(AppContext);

  const heroFanCards = heroPosters && heroPosters.length > 0 ? heroPosters : initialPosters.slice(0, 6);
  const bestSellers = initialPosters.slice(0, 6);

  return (
    <main style={{ backgroundColor: "#FAFAFA", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 1. DYNAMIC STOREWIDE OFFER BANNER */}
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

      {/* 2. HERO SECTION */}
      <HeroSection
        heroTitle={siteSettings.heroTitle}
        heroSubtitle={siteSettings.heroSubtitle}
        heroFanCards={heroFanCards}
        isLoading={false}
      />

      {/* 3. FEATURED CURATED COLLECTIONS */}
      <FeaturedCollectionsSection />

      {/* 4. BEST SELLERS CAROUSEL */}
      <BestSellersSection
        bestSellers={bestSellers}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        openQuickView={openQuickView}
        addToCart={addToCart}
      />

      {/* 5. COLLECTOR REWARDS PROGRAM */}
      <CollectorRewardsSection
        freeShippingThreshold={siteSettings.freeShippingThreshold}
        collectorRewardThreshold={siteSettings.collectorRewardThreshold}
        premiumRewardThreshold={siteSettings.premiumRewardThreshold}
      />

      {/* 6. CRAFTSMANSHIP & FINE ART PAPERS */}
      <CraftsmanshipSection />

      {/* 7. UNBOXING & PACKAGING EXPERIENCE */}
      <PackagingSection />

      {/* 8. LIMITED EDITIONS VAULT */}
      <LimitedEditionsSection posters={initialPosters} />

      {/* 9. COLLECTOR WALL SHOWCASE */}
      <CollectorWallsSection />

      {/* 10. TESTIMONIALS & PRESS REVIEWS */}
      <TestimonialsSection />

      {/* 11. NEWSLETTER & VIP CLUB */}
      <NewsletterSection />

    </main>
  );
}
