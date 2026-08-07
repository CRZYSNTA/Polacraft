'use client';

import React, { useContext } from "react";
import { AppContext } from "@/features/cart/AppContext";
import { Product } from "@/types";

import HeroSection from "./HeroSection";
import BestSellersSection from "./BestSellersSection";
import DesignYourOwnSection from "./DesignYourOwnSection";
import CollectorWallsSection from "./CollectorWallsSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import HomeFaqSection from "./HomeFaqSection";
import CollectorRewardsSection from "./CollectorRewardsSection";
import CraftsmanshipSection from "./CraftsmanshipSection";
import PackagingSection from "./PackagingSection";
import LimitedEditionsSection from "./LimitedEditionsSection";
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
    <main style={{ backgroundColor: "#FFFFFF", color: "#111111", minHeight: "100vh", overflowX: "hidden" }}>
      {/* 1. HERO SECTION */}
      <HeroSection
        heroTitle={activeSettings?.heroTitle || siteSettings?.heroTitle || "Bring Cinema Home."}
        heroSubtitle={activeSettings?.heroSubtitle || siteSettings?.heroSubtitle || "Museum-Quality Malayalam Cinema Posters Crafted For Collectors."}
        heroFanCards={heroFanCards}
        isLoading={false}
      />

      {/* 2. BEST SELLING SECTION */}
      <BestSellersSection
        bestSellers={bestSellers}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        openQuickView={openQuickView}
        addToCart={addToCart}
      />

      {/* 3. DESIGN YOUR OWN PRINTS */}
      <DesignYourOwnSection />

      {/* 4. WALL SETUP PACKS */}
      <CollectorWallsSection />

      {/* 5. WHY CHOOSE US */}
      <WhyChooseUsSection />

      {/* 6. HOME FAQ SECTION */}
      <HomeFaqSection />

      {/* 7. CRAFTSMANSHIP & FINE ART PAPERS */}
      <CraftsmanshipSection />

      {/* 8. UNBOXING & PACKAGING EXPERIENCE */}
      <PackagingSection />

      {/* 9. LIMITED EDITIONS VAULT */}
      <LimitedEditionsSection posters={initialPosters} />

      {/* 10. TESTIMONIALS & PRESS REVIEWS */}
      <TestimonialsSection />

      {/* 11. NEWSLETTER & VIP CLUB */}
      <NewsletterSection />

    </main>
  );
}
