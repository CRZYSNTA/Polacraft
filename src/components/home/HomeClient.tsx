'use client';

import React, { useContext } from "react";
import { AppContext } from "@/features/cart/AppContext";
import { Product } from "@/types";

import HeroSection from "./HeroSection";
import BestSellersSection from "./BestSellersSection";
import DesignYourOwnSection from "./DesignYourOwnSection";
import OriginkitCircleSection from "./OriginkitCircleSection";
import WhyChooseUsSection from "./WhyChooseUsSection";
import HomeFaqSection from "./HomeFaqSection";
import PackagingSection from "./PackagingSection";
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
      {/* 1. HERO SECTION (WITH MOBILE EXCLUSIVE ORIGINKIT CIRCLE FEATURING REAL POSTERS) */}
      <HeroSection
        heroTitle={activeSettings?.heroTitle || siteSettings?.heroTitle || "Bring Cinema Home."}
        heroSubtitle={activeSettings?.heroSubtitle || siteSettings?.heroSubtitle || "Museum-Quality Malayalam Cinema Posters Crafted For Collectors."}
        heroFanCards={heroFanCards}
        allPosters={initialPosters}
        heroSelectedPosterIds={activeSettings?.heroSelectedPosterIds}
        heroSpeedMobile={activeSettings?.heroSpeedMobile ?? 4.0}
        heroSpeedDesktop={activeSettings?.heroSpeedDesktop ?? 2.7}
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

      {/* 4. ORIGINKIT 360 INTERACTIVE POSTER VAULT */}
      <OriginkitCircleSection posters={initialPosters} />

      {/* 5. WHY CHOOSE US */}
      <WhyChooseUsSection />

      {/* 6. HOME FAQ SECTION */}
      <HomeFaqSection />

      {/* 7. UNBOXING & PACKAGING EXPERIENCE */}
      <PackagingSection />

      {/* 8. TESTIMONIALS & PRESS REVIEWS */}
      <TestimonialsSection />

      {/* 9. NEWSLETTER & VIP CLUB */}
      <NewsletterSection />

    </main>
  );
}
