'use client';

import React, { useContext } from "react";
import { AppContext } from "@/features/cart/AppContext";
import { Product } from "@/types";

import HeroSection from "./HeroSection";
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
  serverSiteSettings?: any;
}

export default function HomeClient({ initialPosters, heroPosters, serverSiteSettings }: HomeClientProps) {
  const { addToCart, wishlist, toggleWishlist, openQuickView, siteSettings } = useContext(AppContext);

  const activeSettings = serverSiteSettings || siteSettings;
  const heroFanCards = heroPosters && heroPosters.length > 0 ? heroPosters : initialPosters.slice(0, 6);
  const bestSellers = initialPosters.slice(0, 6);

  return (
    <main style={{ backgroundColor: "#FAFAFA", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>
      {/* 1. HERO SECTION */}
      <HeroSection
        heroTitle={activeSettings?.heroTitle || siteSettings?.heroTitle || "Bring Cinema Home."}
        heroSubtitle={activeSettings?.heroSubtitle || siteSettings?.heroSubtitle || "Museum-Quality Malayalam Cinema Posters Crafted For Collectors."}
        heroFanCards={heroFanCards}
        isLoading={false}
      />

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
